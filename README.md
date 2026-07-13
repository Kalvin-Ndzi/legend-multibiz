# Legend Multibiz — Mobile Cosmetics App

Built with Next.js 16, Tailwind CSS v4, Supabase.

## Quick Start (Windows)

```cmd
cd legend-multibiz-final
npm install
npm run dev
```
Open http://localhost:3000

---

## Connect to Supabase (do this first!)

### Step 1 — Get your project keys
Supabase Dashboard → your project → **Settings** → **API**. Copy:
- **Project URL**
- **anon / public key**

### Step 2 — Fill in `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```
Restart `npm run dev` after saving this file.

### Step 3 — Create the database tables
Supabase Dashboard → **SQL Editor** → New Query → paste the entire contents
of `supabase/schema.sql` → **Run**.

This creates:
- `categories` table (Skincare, Makeup, Body Care, Hair Care, Fragrance, Wellness)
- `products` table (name, price_cfa, stock_quantity, image_url, is_best_seller,
  is_cruelty_free, rating, review_count, description)
- 10 sample products with placeholder Unsplash images, so your app looks
  populated immediately
- Row Level Security so the app can read data publicly and safely

### Step 4 — Set up image storage
Paste `supabase/storage_setup.sql` into the SQL Editor and run it. This
creates a public `product-images` bucket for your real product photos.

### Step 5 — Add your real product photos
1. Supabase Dashboard → **Storage** → `product-images` bucket → **Upload file**
2. Click the uploaded photo → **Copy URL**
3. Supabase Dashboard → **Table Editor** → `products` table
4. Paste the copied URL into the `image_url` column for the matching product row
5. Refresh your app — the real photo now shows instead of the placeholder

Repeat for every product. You can also add brand-new products directly
in the Table Editor (Insert row) — no code changes needed.

---

## Project Structure

```
app/
  layout.tsx          ← Root shell (fonts, max-width, BottomNav)
  globals.css         ← Design tokens + animations (change --brand-* to reskin)
  page.tsx            ← Home: hero card + similar row + product grid (all live from Supabase)
  onboarding/         ← 3-screen welcome flow
  product/[id]/       ← Product detail, live from Supabase
  favourites/, search/, account/, cart/  ← Coming Soon stubs

components/
  layout/BottomNav
  products/ProductGrid, productCard, categoryFilter
  ui/FloatingWhatsApp, RoundWhatsAppButton, ImagePlaceholder

lib/supabase/client.ts  ← Supabase client (reads .env.local)
supabase/schema.sql     ← Run this in Supabase SQL Editor
supabase/storage_setup.sql ← Run this second, for image uploads
```

---

## Managing Your Store Day-to-Day

Once connected, you don't need to touch code to manage products:

- **Add a product** → Table Editor → products → Insert row
- **Change a price** → edit `price_cfa` directly in Table Editor
- **Mark as Best Seller** → toggle `is_best_seller` to `true`
- **Update stock** → edit `stock_quantity` (0 = shows "Out of Stock")
- **Add a real photo** → upload to Storage, paste URL into `image_url`
- **Add a new category** → Table Editor → categories → Insert row

---

## Reskinning for a Laptop Store

1. Open `app/globals.css` → change `--brand-*` variables to blue/slate tones
2. `components/ui/ImagePlaceholder.tsx` → already has Laptop/Monitor/Accessories categories ready
3. Update copy in `app/onboarding/page.tsx` and `app/layout.tsx` metadata
4. Run a new `schema.sql` with laptop categories & products

---

## WhatsApp Number

Replace `"237600000000"` with your real number in:
- `components/ui/FloatingWhatsApp.tsx`
- `components/ui/RoundWhatsAppButton.tsx`
