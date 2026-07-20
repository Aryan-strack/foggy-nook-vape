export type UserRole = "admin" | "staff" | "customer";
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  image_url: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode: string | null;
  brand_id: string | null;
  category_id: string | null;
  brand?: Brand;
  category?: Category;
  images?: ProductImage[];
  description: string | null;
  specifications: Record<string, string>;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_flash_sale: boolean;
  flash_sale_ends_at: string | null;
  status: "active" | "draft" | "archived";
  avg_rating: number;
  review_count: number;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  city: string;
  address: string;
  postal_code: string | null;
  order_notes: string | null;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_approved: boolean;
  admin_reply: string | null;
  created_at: string;
}

export interface SiteSettings {
  store_name: string;
  store_email: string | null;
  store_phone: string | null;
  whatsapp_number: string | null;
  whatsapp_label: string | null;
  whatsapp_number_2: string | null;
  whatsapp_label_2: string | null;
  store_address: string | null;
  google_map_embed_url: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  social_links: Record<string, string>;
  meta_title: string | null;
  meta_description: string | null;
  hero_slides: { image: string; title: string; subtitle: string; cta_label: string; cta_link: string }[];
}
