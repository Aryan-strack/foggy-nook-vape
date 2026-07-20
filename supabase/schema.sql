-- =========================================================
-- SMOKE & VAPE LUXURY STORE — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)
-- =========================================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- =========================================================
-- ENUMS
-- =========================================================
create type user_role as enum ('admin', 'staff', 'customer');
create type order_status as enum ('pending','confirmed','processing','shipped','delivered','cancelled');
create type stock_movement_type as enum ('purchase','sale','adjustment','return');

-- =========================================================
-- USERS  (extends Supabase auth.users)
-- =========================================================
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique not null,
  phone text,
  avatar_url text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- CUSTOMERS (profile/shipping info, 1:1 with users for customer role)
-- =========================================================
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  city text,
  address text,
  postal_code text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- BRANDS
-- =========================================================
create table public.brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- CATEGORIES (supports nested categories via parent_id)
-- =========================================================
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete set null,
  image_url text,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- PRODUCTS
-- =========================================================
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  sku text unique not null,
  barcode text,
  brand_id uuid references public.brands(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  description text,
  specifications jsonb default '{}'::jsonb,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  purchase_price numeric(10,2),
  stock_quantity int not null default 0,
  low_stock_threshold int not null default 5,
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  is_best_seller boolean not null default false,
  is_flash_sale boolean not null default false,
  flash_sale_ends_at timestamptz,
  status text not null default 'active', -- active | draft | archived
  meta_title text,
  meta_description text,
  avg_rating numeric(3,2) not null default 0,
  review_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category on public.products(category_id);
create index idx_products_brand on public.products(brand_id);
create index idx_products_slug on public.products(slug);
create index idx_products_status on public.products(status);

-- =========================================================
-- PRODUCT IMAGES
-- =========================================================
create table public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_product_images_product on public.product_images(product_id);

-- =========================================================
-- INVENTORY / STOCK HISTORY
-- =========================================================
create table public.inventory (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  movement_type stock_movement_type not null,
  quantity_change int not null, -- positive = stock in, negative = stock out
  quantity_after int not null,
  purchase_price numeric(10,2),
  selling_price numeric(10,2),
  note text,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create index idx_inventory_product on public.inventory(product_id);

-- =========================================================
-- ORDERS
-- =========================================================
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  customer_id uuid references public.customers(id),
  user_id uuid references public.users(id),
  customer_name text not null,
  phone text not null,
  email text,
  city text not null,
  address text not null,
  postal_code text,
  order_notes text,
  payment_method text not null default 'cod',
  status order_status not null default 'pending',
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  coupon_code text,
  shipping_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_status on public.orders(status);
create index idx_orders_customer on public.orders(customer_id);

-- =========================================================
-- ORDER ITEMS
-- =========================================================
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  product_image text,
  unit_price numeric(10,2) not null,
  quantity int not null,
  line_total numeric(10,2) not null
);

create index idx_order_items_order on public.order_items(order_id);

-- =========================================================
-- ORDER STATUS TIMELINE
-- =========================================================
create table public.order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status order_status not null,
  note text,
  changed_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

-- =========================================================
-- REVIEWS
-- =========================================================
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_id uuid references public.customers(id),
  user_id uuid references public.users(id),
  rating int not null check (rating between 1 and 5),
  title text,
  comment text,
  is_approved boolean not null default false,
  admin_reply text,
  created_at timestamptz not null default now()
);

create index idx_reviews_product on public.reviews(product_id);

-- =========================================================
-- COUPONS
-- =========================================================
create table public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount_type text not null default 'percentage', -- percentage | fixed
  discount_value numeric(10,2) not null,
  min_order_amount numeric(10,2) default 0,
  usage_limit int,
  used_count int not null default 0,
  is_active boolean not null default true,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- =========================================================
-- WISHLIST
-- =========================================================
create table public.wishlist_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- =========================================================
-- SETTINGS (single-row config table, editable from Admin)
-- =========================================================
create table public.settings (
  id int primary key default 1,
  store_name text not null default 'Foggy Nook',
  store_email text,
  store_phone text,
  whatsapp_number text,
  whatsapp_label text default 'Sales',
  whatsapp_number_2 text,
  whatsapp_label_2 text default 'Support',
  store_address text,
  google_map_embed_url text,
  logo_url text,
  favicon_url text,
  social_links jsonb default '{}'::jsonb, -- {instagram, facebook, tiktok, twitter}
  meta_title text,
  meta_description text,
  analytics_id text,
  hero_slides jsonb default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);

insert into public.settings (id, store_name) values (1, 'Foggy Nook')
  on conflict (id) do nothing;

-- =========================================================
-- NOTIFICATIONS (admin-facing, e.g. new order / low stock)
-- =========================================================
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  type text not null, -- new_order | low_stock | new_review | new_customer
  title text not null,
  message text,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- =========================================================
-- TRIGGERS: updated_at maintenance
-- =========================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger trg_orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
create trigger trg_users_updated_at before update on public.users
  for each row execute function public.set_updated_at();

-- =========================================================
-- TRIGGER: auto-create public.users row on signup
-- =========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- TRIGGER: low stock notification
-- =========================================================
create or replace function public.check_low_stock()
returns trigger as $$
begin
  if new.stock_quantity <= new.low_stock_threshold then
    insert into public.notifications (type, title, message, link)
    values ('low_stock', 'Low stock alert', new.name || ' has only ' || new.stock_quantity || ' units left', '/admin/inventory');
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_products_low_stock after update of stock_quantity on public.products
  for each row execute function public.check_low_stock();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.users enable row level security;
alter table public.customers enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.settings enable row level security;
alter table public.notifications enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role in ('admin','staff')
  );
$$ language sql security definer stable;

-- Public read access (storefront)
create policy "public read brands" on public.brands for select using (is_active = true or is_admin());
create policy "public read categories" on public.categories for select using (is_active = true or is_admin());
create policy "public read products" on public.products for select using (status = 'active' or is_admin());
create policy "public read product images" on public.product_images for select using (true);
create policy "public read approved reviews" on public.reviews for select using (is_approved = true or is_admin());
create policy "public read settings" on public.settings for select using (true);

-- Admin full access (all tables)
create policy "admin all brands" on public.brands for all using (is_admin()) with check (is_admin());
create policy "admin all categories" on public.categories for all using (is_admin()) with check (is_admin());
create policy "admin all products" on public.products for all using (is_admin()) with check (is_admin());
create policy "admin all product images" on public.product_images for all using (is_admin()) with check (is_admin());
create policy "admin all inventory" on public.inventory for all using (is_admin()) with check (is_admin());
create policy "admin all orders" on public.orders for all using (is_admin()) with check (is_admin());
create policy "admin all order items" on public.order_items for all using (is_admin()) with check (is_admin());
create policy "admin all order history" on public.order_status_history for all using (is_admin()) with check (is_admin());
create policy "admin all reviews" on public.reviews for all using (is_admin()) with check (is_admin());
create policy "admin all coupons" on public.coupons for all using (is_admin()) with check (is_admin());
create policy "admin all settings" on public.settings for all using (is_admin()) with check (is_admin());
create policy "admin all notifications" on public.notifications for all using (is_admin()) with check (is_admin());
create policy "admin all users" on public.users for all using (is_admin()) with check (is_admin());
create policy "admin all customers" on public.customers for all using (is_admin()) with check (is_admin());

-- Customer/user-scoped policies
create policy "user reads own profile" on public.users for select using (auth.uid() = id);
create policy "user updates own profile" on public.users for update using (auth.uid() = id);

create policy "user reads own customer row" on public.customers for select using (auth.uid() = user_id);
create policy "user upserts own customer row" on public.customers for insert with check (auth.uid() = user_id);
create policy "user updates own customer row" on public.customers for update using (auth.uid() = user_id);

create policy "user reads own orders" on public.orders for select using (auth.uid() = user_id);
create policy "anyone can place an order" on public.orders for insert with check (true);

create policy "user reads own order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "order items insert with order" on public.order_items for insert with check (true);

create policy "user creates review" on public.reviews for insert with check (auth.uid() = user_id);

create policy "user manages own wishlist" on public.wishlist_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Coupons: allow public read of active coupons only for validation lookups
create policy "public reads active coupons" on public.coupons for select using (is_active = true);

-- =========================================================
-- STORAGE BUCKETS (run once — safe if already exists)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

create policy "public read product-images" on storage.objects for select using (bucket_id = 'product-images');
create policy "admin write product-images" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "admin update product-images" on storage.objects for update using (bucket_id = 'product-images' and public.is_admin());
create policy "admin delete product-images" on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());

create policy "public read site-assets" on storage.objects for select using (bucket_id = 'site-assets');
create policy "admin write site-assets" on storage.objects for insert with check (bucket_id = 'site-assets' and public.is_admin());
create policy "admin update site-assets" on storage.objects for update using (bucket_id = 'site-assets' and public.is_admin());
create policy "admin delete site-assets" on storage.objects for delete using (bucket_id = 'site-assets' and public.is_admin());

-- =========================================================
-- SEED: make the first signed-up user an admin manually, e.g.:
-- update public.users set role = 'admin' where email = 'you@example.com';
-- =========================================================

-- =========================================================
-- MIGRATION (safe to re-run): adds the second WhatsApp number
-- if you already ran this schema before this column existed.
-- =========================================================
alter table public.settings add column if not exists whatsapp_label text default 'Sales';
alter table public.settings add column if not exists whatsapp_number_2 text;
alter table public.settings add column if not exists whatsapp_label_2 text default 'Support';
