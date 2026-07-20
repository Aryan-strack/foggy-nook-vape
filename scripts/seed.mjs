/**
 * Seed script — creates a ready-to-use Admin account, a Customer account,
 * and a small set of sample categories/brands/products so the storefront
 * and admin dashboard aren't empty on first run.
 *
 * Usage:
 *   1. Make sure `supabase/schema.sql` has already been run in your Supabase project.
 *   2. Fill in .env.local with your real Supabase URL + service role key.
 *   3. npm run seed
 *
 * This uses the SERVICE ROLE key (bypasses RLS) — never run this against
 * production with placeholder passwords. Change ADMIN_PASSWORD / CUSTOMER_PASSWORD
 * below (or via env vars) before running.
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Support both .env.local and plain .env (Next.js reads both; this script does too)
config({ path: ".env.local" });
config({ path: ".env" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "\n❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local\n"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@foggynook.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
const CUSTOMER_EMAIL = process.env.SEED_CUSTOMER_EMAIL || "customer@foggynook.com";
const CUSTOMER_PASSWORD = process.env.SEED_CUSTOMER_PASSWORD || "Customer@12345";

async function upsertAuthUser(email, password, fullName) {
  // Check if a user with this email already exists (re-running the seed is safe)
  const { data: existingList } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const existing = existingList?.users?.find((u) => u.email === email);

  if (existing) {
    console.log(`↺  ${email} already exists — reusing (id: ${existing.id})`);
    return existing;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) throw new Error(`Failed to create ${email}: ${error.message}`);
  console.log(`✔  Created auth user ${email} (id: ${data.user.id})`);
  return data.user;
}

async function seedAdmin() {
  const user = await upsertAuthUser(ADMIN_EMAIL, ADMIN_PASSWORD, "Store Admin");

  // The DB trigger `handle_new_user` already inserted a row into public.users
  // with role='customer' — promote it to 'admin'.
  const { error } = await supabase
    .from("users")
    .upsert({ id: user.id, email: ADMIN_EMAIL, full_name: "Store Admin", role: "admin" }, { onConflict: "id" });

  if (error) throw new Error(`Failed to set admin role: ${error.message}`);
  console.log(`✔  ${ADMIN_EMAIL} is now role='admin'\n`);
}

async function seedCustomer() {
  const user = await upsertAuthUser(CUSTOMER_EMAIL, CUSTOMER_PASSWORD, "Sample Customer");

  await supabase
    .from("users")
    .upsert({ id: user.id, email: CUSTOMER_EMAIL, full_name: "Sample Customer", role: "customer" }, { onConflict: "id" });

  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingCustomer) {
    const { error } = await supabase.from("customers").insert({
      user_id: user.id,
      full_name: "Sample Customer",
      phone: "+923001112222",
      email: CUSTOMER_EMAIL,
      city: "Karachi",
      address: "Shop 12, Zamzama Boulevard, Karachi",
      postal_code: "75500",
    });
    if (error) throw new Error(`Failed to create customer profile: ${error.message}`);
    console.log(`✔  Created customer profile for ${CUSTOMER_EMAIL}\n`);
  } else {
    console.log(`↺  Customer profile for ${CUSTOMER_EMAIL} already exists\n`);
  }
}

async function seedCatalog() {
  console.log("Seeding sample catalog (categories, brands, products)...");

  const categories = [
    { name: "Vape Kits", slug: "vape-kits", image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800", sort_order: 1 },
    { name: "E-Liquids", slug: "e-liquids", image_url: "https://images.unsplash.com/photo-1527061011665-3f7c8b1f1a1e?w=800", sort_order: 2 },
    { name: "Accessories", slug: "accessories", image_url: "https://images.unsplash.com/photo-1517705600644-1a53a1503b0f?w=800", sort_order: 3 },
  ];

  for (const cat of categories) {
    await supabase.from("categories").upsert(cat, { onConflict: "slug" });
  }
  console.log(`✔  Seeded ${categories.length} categories`);

  const brands = [
    { name: "Aurum Vapor", slug: "aurum-vapor", is_active: true },
    { name: "Cloud Nine Labs", slug: "cloud-nine-labs", is_active: true },
  ];

  for (const brand of brands) {
    await supabase.from("brands").upsert(brand, { onConflict: "slug" });
  }
  console.log(`✔  Seeded ${brands.length} brands`);

  const { data: cats } = await supabase.from("categories").select("id, slug");
  const { data: brds } = await supabase.from("brands").select("id, slug");
  const catId = (slug) => cats?.find((c) => c.slug === slug)?.id;
  const brandId = (slug) => brds?.find((b) => b.slug === slug)?.id;

  const products = [
    {
      name: "Aurum Gold Edition Vape Kit",
      slug: "aurum-gold-edition-vape-kit",
      sku: "AGE-001",
      category_id: catId("vape-kits"),
      brand_id: brandId("aurum-vapor"),
      description: "A premium gold-finished vape kit with adjustable wattage and long battery life.",
      price: 12500,
      compare_at_price: 15000,
      stock_quantity: 25,
      is_featured: true,
      is_new_arrival: true,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1000",
    },
    {
      name: "Foggy Midnight E-Liquid 60ml",
      slug: "foggy-midnight-e-liquid-60ml",
      sku: "NML-060",
      category_id: catId("e-liquids"),
      brand_id: brandId("cloud-nine-labs"),
      description: "Smooth, rich flavor profile with notes of dark berries and vanilla.",
      price: 2800,
      stock_quantity: 60,
      is_best_seller: true,
      image: "https://images.unsplash.com/photo-1527061011665-3f7c8b1f1a1e?w=1000",
    },
    {
      name: "Premium Coil Pack (5-Pack)",
      slug: "premium-coil-pack-5-pack",
      sku: "PCP-005",
      category_id: catId("accessories"),
      brand_id: brandId("aurum-vapor"),
      description: "Mesh 0.4Ω replacement coils compatible with most premium vape kits.",
      price: 1800,
      stock_quantity: 100,
      image: "https://images.unsplash.com/photo-1517705600644-1a53a1503b0f?w=1000",
    },
    {
      name: "Aurum Flash Sale Starter Kit",
      slug: "aurum-flash-sale-starter-kit",
      sku: "AFS-002",
      category_id: catId("vape-kits"),
      brand_id: brandId("aurum-vapor"),
      description: "Entry-level starter kit, now on flash sale for a limited time.",
      price: 6500,
      compare_at_price: 9000,
      stock_quantity: 15,
      is_flash_sale: true,
      flash_sale_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1000",
    },
  ];

  for (const p of products) {
    const { image, ...productData } = p;
    const { data: product, error } = await supabase
      .from("products")
      .upsert(productData, { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      console.warn(`  ⚠ Skipped ${p.name}: ${error.message}`);
      continue;
    }

    const { data: existingImages } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", product.id);

    if (!existingImages?.length) {
      await supabase.from("product_images").insert({
        product_id: product.id,
        image_url: image,
        sort_order: 0,
        is_primary: true,
      });
    }
  }
  console.log(`✔  Seeded ${products.length} sample products\n`);
}

async function main() {
  console.log("\n🌱 Seeding Foggy Nook database...\n");

  await seedAdmin();
  await seedCustomer();
  await seedCatalog();

  console.log("✅ Done!\n");
  console.log("──────────────────────────────────────────");
  console.log("  Admin login:");
  console.log(`    URL:      /login  (then visit /admin)`);
  console.log(`    Email:    ${ADMIN_EMAIL}`);
  console.log(`    Password: ${ADMIN_PASSWORD}`);
  console.log("");
  console.log("  Customer login:");
  console.log(`    Email:    ${CUSTOMER_EMAIL}`);
  console.log(`    Password: ${CUSTOMER_PASSWORD}`);
  console.log("──────────────────────────────────────────");
  console.log("⚠️  Change these passwords before going live.\n");
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});
