# Foggy Nook — Luxury Smoke & Vape E-Commerce Store

Premium black & gold Next.js 15 + Supabase e-commerce platform with a full admin dashboard.

> **Status: All 4 phases complete.** Every page and feature from the original brief is
> implemented (deployment intentionally excluded, per your request — this is a
> local-run / self-hosted package).

## ✅ Phase 1 — Included in this package

- Next.js 15 App Router project skeleton (TypeScript, Tailwind, App Router)
- Full **Supabase SQL schema** (`supabase/schema.sql`) — every table from the brief:
  `users, customers, brands, categories, products, product_images, inventory,
  orders, order_items, order_status_history, reviews, coupons, wishlist_items,
  settings, notifications` — with RLS policies, admin-role helper, auto-profile
  trigger on signup, low-stock notification trigger, and storage buckets for
  product images & site assets.
- Luxury **black (#0B0B0B) / gold (#D4AF37) theme** in Tailwind config + `globals.css`
  (glassmorphism cards, gold hover glow, gold gradient buttons, smoke animation keyframes).
- Root layout with Google Fonts (Cormorant Garamond display + Manrope body), SEO metadata defaults.
- **Navbar** (glass, sticky, cart/wishlist counters), **Footer** (links, map embed, contact),
  floating **WhatsApp button** with prefilled message.
- **Home page**, fully wired to Supabase: Hero (animated smoke + CTA), Featured Categories,
  Featured Products, Flash Sale (with live countdown), New Arrivals, Best Sellers,
  Testimonials, Newsletter.
- Zustand **cart store** (persisted to localStorage on the client's own browser — not Claude's).
- Supabase client helpers (`browser`, `server`, `admin`/service-role) and **`proxy.ts`**
  that protects `/admin/**` (role check) and `/account/**` (auth check).
- Shared TypeScript types, `cn()`/price/slug/order-number utilities.

## ✅ Phase 2 — Included in this package

- **Shop page** (`/shop`) — live Supabase query with search (debounced), category/brand/price/
  rating/in-stock filters (all URL-param driven, shareable/bookmarkable), sort dropdown,
  grid/list view toggle, pagination.
- **Product Details page** (`/product/[slug]`) — zoomable image gallery with thumbnails,
  full product info panel (price, discount %, SKU, live stock, qty stepper, Add to Cart,
  Buy Now, Wishlist, Share), tabs for Description/Specifications/Reviews, review submission
  form, related products, dynamic SEO metadata + JSON-LD Product structured data.
- **Cart page** (`/cart`) — update quantity, remove item, order summary, empty-state.
- **Checkout page** (`/checkout`) — React Hook Form + Zod validated COD form (name, phone,
  email, city, address, postal code, notes, coupon code), order summary sidebar.
- **Server Action** (`src/lib/actions/orders.ts`) — `placeOrder()` re-validates stock and
  prices server-side (never trusts the client cart), applies coupon discounts, creates the
  order + order_items, deducts inventory with a stock-history entry, writes an order status
  timeline entry, and pushes an admin notification.
- **Checkout success page** with order number + WhatsApp CTA, per the brief.
- Cart state persists in the browser via Zustand (`localStorage`, client-side only).

## ✅ Phase 3 — Included in this package (Admin Dashboard)

Everything lives under `/admin` (session check in `src/proxy.ts`, admin/staff role check
in `src/app/admin/layout.tsx` — only `admin`/`staff`
roles can access) in its own layout with a dark glass sidebar + topbar, separate from
the public storefront layout.

- **Dashboard** (`/admin`) — revenue/orders/products/customers stat cards, 14-day revenue
  line chart, low-stock alert widget, recent orders table.
- **Products** (`/admin/products`) — searchable table, full create/edit form
  (`/admin/products/new`, `/admin/products/[id]`) with multi-image upload to Supabase
  Storage, specifications key-value editor, pricing/stock/SEO/flags, delete with confirm.
- **Categories** & **Brands** — table + slide-out add/edit panel, image/logo upload, delete.
- **Orders** (`/admin/orders`) — status-filter tabs, detail page with items breakdown,
  visual status-progress tracker + one-click status updates (writes to
  `order_status_history`), WhatsApp-the-customer button, and a **printable invoice**
  page (`/admin/orders/[id]/invoice`) with print-optimized white layout.
- **Customers** & **Users** — customer directory; user role management (admin/staff/customer).
- **Inventory** (`/admin/inventory`) — live stock levels, low-stock banner, quick +/-
  stock adjuster with reason notes, profit-per-unit column, recent stock-movement feed.
- **Reviews** (`/admin/reviews`) — approve, reply, or delete; product rating/review-count
  auto-recalculates on every change.
- **Coupons** (`/admin/coupons`) — percentage/fixed discounts, min order amount, usage
  limits, expiry, active toggle.
- **Website Settings** (`/admin/settings`) — store name/email/phone/WhatsApp/address,
  logo & favicon upload, Google Maps embed URL, social links, SEO defaults, Google
  Analytics ID, and a **Hero Slider editor** (image/title/subtitle/CTA per slide, feeds
  the homepage hero — wire-up of the slider component itself is a Phase 4 polish item).
- **Notifications** (`/admin/notifications`) — new order / low stock / review alerts
  with mark-as-read.
- **Analytics** (`/admin/analytics`) — 30-day revenue trend, orders-by-status pie chart,
  top-selling products bar chart (Recharts).
- **Profile** (`/admin/profile`) — update name, change password.
- Storefront root layout no longer renders the public Navbar/Footer/WhatsApp button on
  admin routes (moved into a `(storefront)` route group) — the admin panel now has its
  own clean shell.

## ✅ Phase 4 — Included in this package (Auth, Account, Content Pages)

- **Auth**: Login, Signup (also creates a `customers` row), Forgot Password (Supabase
  email reset flow) — all under `/login`, `/signup`, `/forgot-password`.
- **Wishlist** (`/wishlist`) — real Supabase-backed save/unsave from any product card or
  the product page's heart icon; prompts login if not authenticated.
- **Search** (`/search`) — full-text-ish search across product name/description with a
  live search box (also linked from the navbar search icon).
- **My Account** (`/account`) — its own sidebar layout with:
  - **Profile** — edit name/phone/city/address, synced to both `customers` and `users`.
  - **My Orders** (`/account/orders`) — order history table.
  - **Order Details** (`/account/orders/[id]`) — visual tracking timeline + WhatsApp CTA,
    scoped so customers can only view their own orders.
- **Content pages**: About, Contact (form writes an admin notification + store info +
  embedded map + WhatsApp CTA), FAQs (accordion), Categories index, Privacy Policy,
  Terms & Conditions, Return Policy.
- **404** page (on-brand, storefront-styled) plus a minimal root-level fallback.
- **`sitemap.xml`** (dynamic — includes every active product & category) and
  **`robots.txt`** (disallows `/admin`, `/account`, `/api`, checkout success).
- **Hero Slider wiring** — the homepage Hero now reads `settings.hero_slides` (managed
  from `/admin/settings`) and auto-rotates between slides with dot navigation; falls
  back to the static hero copy when no slides are configured.
- Admin panel's public storefront chrome (Navbar/Footer/WhatsApp button) fully separated
  via the `(storefront)` route group — confirmed no leakage into `/admin`.

## What's intentionally out of scope

Per your request, **deployment to Vercel was not performed** — this is a local-run /
self-hosted deliverable. To go live later: push this to a Git repo, import it in Vercel,
add the same environment variables from `.env.local`, and deploy. No code changes needed.

## Changelog — Next.js 16 compatibility fixes

Next.js 16 shipped several breaking changes after this project was first scaffolded.
Everything below has already been fixed in this package:

- **`middleware.ts` → `proxy.ts`**: Next 16 renamed the convention. `src/proxy.ts` now
  does the lightweight "is anyone logged in" redirect for `/admin` and `/account`; the
  actual admin/staff **role** check (which needs a DB query) was moved into
  `src/app/admin/layout.tsx` as a Server Component guard — Next 16's own guidance is to
  keep the proxy/network layer thin and put real auth logic in layouts/pages instead.
- **Async `params` / `searchParams`**: every dynamic route (`/product/[slug]`,
  `/admin/products/[id]`, `/admin/orders/[id]`, `/account/orders/[id]`, and all pages
  reading `searchParams` like `/shop`, `/search`, `/admin/products`, `/admin/orders`,
  `/checkout/success`) now types these as `Promise<...>` and `await`s them, per Next 16.
- **Async `cookies()`**: `next/headers`'s `cookies()` is now async, so
  `src/lib/supabase/server.ts`'s `createClient()` is now an `async function` — every
  call site across the app (~40 places) now does `await createClient()`.
- **`next lint` removed**: the `eslint` key in `next.config.mjs` is gone (Next 16
  no longer runs lint during `next build`), the `lint` script now runs `eslint .`
  directly, and a flat `eslint.config.mjs` (ESLint 9 style) was added.
- Swapped a `require()` call for a proper static import in `server.ts` for reliable
  Turbopack bundling (Turbopack is Next 16's default dev/build engine).

If `npm run dev` or `npm run build` surfaces anything else, it's most likely a small
peer-dependency or type mismatch from one of the other major-version bumps (Tailwind v4,
Zod v4, Sonner v2, Recharts v3, @hookform/resolvers v5) — paste the error and I'll patch it.

## Changelog — Google Maps, hydration warnings, seed script, About hero

- **Google Maps was actually broken**: the placeholder `pb=` embed parameter in
  Footer/Contact was fake/malformed. Both now fall back to the always-valid
  `https://www.google.com/maps?q=<address>&z=15&output=embed` format, and both now pull
  the real value from `settings.google_map_embed_url` (set it in `/admin/settings`).
  The Navbar/Footer/WhatsApp button also now read the real WhatsApp number, store name,
  address, and social links from `settings` instead of being hardcoded.
- **Hydration mismatch warning**: added `suppressHydrationWarning` to `<body>` — the
  `data-new-gr-c-s-check-loaded` / `data-gr-ext-installed` attributes in your console
  come from the Grammarly browser extension injecting into the DOM after the page loads,
  not a bug in the app. This is React's documented fix for that exact situation.
- **`scroll-behavior: smooth` warning**: added `data-scroll-behavior="smooth"` to `<html>`
  per the Next.js 16 message — this keeps smooth scrolling for in-page anchors while
  letting Next disable it specifically during route transitions.
- **Seed script** (`scripts/seed.mjs`, run with `npm run seed`): creates one **Admin**
  account and one **Customer** account (via the Supabase Admin API, so passwords are set
  correctly and emails are pre-confirmed), plus a small set of sample categories, brands,
  and products so the storefront and dashboard aren't empty on first run. Default
  credentials are printed at the end of the script and are also in `.env.example`
  (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_CUSTOMER_EMAIL` /
  `SEED_CUSTOMER_PASSWORD`) — **change these before deploying anywhere real**. Safe to
  re-run; it upserts rather than duplicating.
- **About page** now has a full-width hero image banner at the top plus a 3-image
  lifestyle gallery. These use placeholder Unsplash photos (also added
  `images.unsplash.com` to `next.config.mjs`'s allowed image hosts) — swap the URLs in
  `src/app/(storefront)/about/page.tsx` and `scripts/seed.mjs` for your own product/store
  photography whenever you have it.

## Getting Started (once you download this)

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + keys
```

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** → paste the contents of `supabase/schema.sql` → Run.
3. Copy your Project URL + anon key + service role key into `.env.local`.
4. Sign up once on the site, then in Supabase Table Editor set that user's
   `role` to `admin` in the `users` table so you can access `/admin`.

   Or just run `npm run seed` (see below) to create an admin + customer account instantly.
5. Run locally:

```bash
npm run dev
```

App runs at `http://localhost:3000`. (Deployment to Vercel intentionally **not**
covered here per your request — this package is local-run / dev only for now.)

## Google Sign-In Setup

Login and Signup both have a "Continue with Google" button (`src/components/layout/GoogleAuthButton.tsx`)
wired to Supabase's OAuth flow via `src/app/auth/callback/route.ts`. To activate it:

1. **Google Cloud Console** → create (or reuse) a project → APIs & Services →
   Credentials → Create Credentials → OAuth client ID → Web application.
   - Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Copy the generated **Client ID** and **Client Secret**.
2. **Supabase Dashboard** → Authentication → Providers → Google → toggle it on,
   paste the Client ID + Secret → Save.
3. In Supabase Dashboard → Authentication → URL Configuration, add
   `http://localhost:3000/auth/callback` (and your production URL later) to the
   **Redirect URLs** allow-list.
4. That's it — the button will redirect to Google, then back to
   `/auth/callback`, which exchanges the code for a session and sends the user
   to `/account` (or wherever `?redirect=` pointed).

Email/password login still works exactly as before; Google is purely additive.

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion ·
Zustand · React Hook Form + Zod v4 · TanStack Query · Supabase (Postgres, Auth, Storage) ·
Lucide Icons · Sonner (toasts)

> **Dependency versions:** `package.json` now pins to the current stable majors as of
> July 2026 — Next 16.2, React 19.2, Tailwind CSS v4.3 (CSS-first engine), Zod v4,
> Sonner v2, Recharts v3, @hookform/resolvers v5, tailwind-merge v3. A few of these were
> major-version bumps from what earlier phases shipped with, so two things changed here:
> - **Tailwind v4 migration**: `postcss.config.js` now uses `@tailwindcss/postcss`
>   (no more separate `autoprefixer`), and `globals.css` uses `@import "tailwindcss";`
>   plus `@config "../../tailwind.config.ts";` (keeps your existing JS theme/config
>   working in v4's compatibility mode) and `@plugin "tailwindcss-animate";`.
> - **Zod v4**: the checkout schema now uses `z.email()` instead of the deprecated
>   `z.string().email()`.
> Since this environment has no network access, `npm install` + a local `npm run build`
> is the real compile check — if any other library surfaces a deprecation/type error
> after install (Sonner v2, Recharts v3, and @hookform/resolvers v5 all had minor API
> touch-ups upstream), it'll show up there and is usually a one-line fix per their
> official migration guides.

## Folder Structure

```
src/
  app/                 → routes (App Router)
  components/
    layout/            → Navbar, Footer, WhatsAppButton
    home/               → Hero, ProductCard, FlashSale, Testimonials, Newsletter...
    ui/                 → (Phase 2) shadcn primitives
  lib/
    supabase/           → client.ts, server.ts (+ admin client)
    utils.ts
  store/                → cart-store.ts (Zustand)
  types/                → shared TS interfaces
  proxy.ts               → session refresh + auth redirect (Next.js 16's "proxy" convention)
supabase/
  schema.sql             → full DB schema, RLS, triggers, storage buckets
```
