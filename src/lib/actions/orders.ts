"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { generateOrderNumber } from "@/lib/utils";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validations/checkout";
import type { CartItem } from "@/types";

interface PlaceOrderResult {
  success: boolean;
  orderNumber?: string;
  error?: string;
}

export async function placeOrder(formValues: CheckoutFormValues, cartItems: CartItem[]): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(formValues);
  if (!parsed.success) {
    const fieldErrors = parsed.error.issues;
    return { success: false, error: fieldErrors[0]?.message || "Invalid order details" };
  }

  if (!cartItems.length) {
    return { success: false, error: "Your cart is empty" };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Re-validate stock server-side (never trust the client cart for pricing/stock)
  const productIds = cartItems.map((i) => i.productId);
  const { data: products, error: productsError } = await admin
    .from("products")
    .select("id, name, price, stock_quantity")
    .in("id", productIds);

  if (productsError || !products) {
    return { success: false, error: "Could not verify product availability. Please try again." };
  }

  for (const item of cartItems) {
    const product = products.find((p: any) => p.id === item.productId);
    if (!product) return { success: false, error: `Product ${item.name} is no longer available.` };
    if (product.stock_quantity < item.quantity) {
      return { success: false, error: `Only ${product.stock_quantity} units of ${item.name} left in stock.` };
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find((p: any) => p.id === item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  // Coupon validation
  let discount = 0;
  if (parsed.data.coupon_code) {
    const { data: coupon } = await admin
      .from("coupons")
      .select("*")
      .eq("code", parsed.data.coupon_code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (coupon && (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) && subtotal >= (coupon.min_order_amount || 0)) {
      discount = coupon.discount_type === "percentage" ? (subtotal * coupon.discount_value) / 100 : coupon.discount_value;
    }
  }

  const shippingFee = 200;
  const total = Math.max(0, subtotal - discount) + shippingFee;
  const orderNumber = generateOrderNumber();

  // 1. Create the order
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user?.id ?? null,
      customer_name: parsed.data.customer_name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      city: parsed.data.city,
      address: parsed.data.address,
      postal_code: parsed.data.postal_code || null,
      order_notes: parsed.data.order_notes || null,
      payment_method: "cod",
      status: "pending",
      subtotal,
      discount,
      coupon_code: parsed.data.coupon_code || null,
      shipping_fee: shippingFee,
      total,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { success: false, error: "Failed to place order. Please try again." };
  }

  // 2. Insert order items
  const orderItems = cartItems.map((item) => {
    const product = products.find((p: any) => p.id === item.productId)!;
    return {
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image,
      unit_price: product.price,
      quantity: item.quantity,
      line_total: product.price * item.quantity,
    };
  });
  await admin.from("order_items").insert(orderItems);

  // 3. Deduct stock + write inventory history
  for (const item of cartItems) {
    const product = products.find((p: any) => p.id === item.productId)!;
    const newStock = product.stock_quantity - item.quantity;
    await admin.from("products").update({ stock_quantity: newStock }).eq("id", item.productId);
    await admin.from("inventory").insert({
      product_id: item.productId,
      movement_type: "sale",
      quantity_change: -item.quantity,
      quantity_after: newStock,
      note: `Order ${orderNumber}`,
    });
  }

  // 4. Order status history entry
  await admin.from("order_status_history").insert({ order_id: order.id, status: "pending", note: "Order placed by customer" });

  // 5. Admin notification
  await admin.from("notifications").insert({
    type: "new_order",
    title: "New order received",
    message: `${orderNumber} — ${parsed.data.customer_name} — Rs. ${total}`,
    link: `/admin/orders/${order.id}`,
  });

  // 6. Bump coupon usage
  if (discount > 0 && parsed.data.coupon_code) {
    const { data: couponRow } = await admin
      .from("coupons")
      .select("used_count")
      .eq("code", parsed.data.coupon_code.toUpperCase())
      .single();
    if (couponRow) {
      await admin
        .from("coupons")
        .update({ used_count: couponRow.used_count + 1 })
        .eq("code", parsed.data.coupon_code.toUpperCase());
    }
  }

  return { success: true, orderNumber };
}
