-- ============================================================================
-- LEGEND MULTIBIZ — Supabase Database Schema
-- ----------------------------------------------------------------------------
-- HOW TO USE:
--   1. Go to your Supabase Dashboard → SQL Editor → New Query
--   2. Paste this ENTIRE file
--   3. Click "Run"
--   4. It will create tables, sample data, and security rules
--
-- SAFE TO RE-RUN: Uses "IF NOT EXISTS" so running it twice won't error.
-- ============================================================================

-- 1. CATEGORIES TABLE
create table if not exists categories (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  created_at  timestamptz not null default now()
);
comment on table categories is 'Product categories shown as filter pills on the home page';

-- 2. PRODUCTS TABLE
create table if not exists products (
  id              bigint generated always as identity primary key,
  name            text not null,
  description     text,
  price_cfa       integer not null check (price_cfa >= 0),
  stock_quantity  integer not null default 0 check (stock_quantity >= 0),
  image_url       text,
  category_id     bigint references categories(id) on delete set null,
  is_best_seller  boolean not null default false,
  is_cruelty_free boolean not null default true,
  rating          numeric(2,1) default 4.5 check (rating between 0 and 5),
  review_count    integer default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table products is 'Main product catalogue for the storefront';

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_created   on products(created_at desc);

-- 3. AUTO-UPDATE "updated_at"
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

-- 4. ROW LEVEL SECURITY (RLS)
-- Public can READ everything (needed for the storefront). You'll add/edit
-- products yourself via the Supabase Table Editor (no public write access).
alter table categories enable row level security;
alter table products   enable row level security;

drop policy if exists "Public read categories" on categories;
create policy "Public read categories"
  on categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read products" on products;
create policy "Public read products"
  on products for select
  to anon, authenticated
  using (true);

-- 5. SEED DATA — Categories
insert into categories (name) values
  ('Skincare'), ('Makeup'), ('Body Care'), ('Hair Care'), ('Fragrance'), ('Wellness')
on conflict (name) do nothing;

-- 6. SEED DATA — Sample Products (placeholder Unsplash images)
-- Replace image_url with real Supabase Storage URLs once you upload photos
-- (see storage_setup.sql for how).
insert into products (name, description, price_cfa, stock_quantity, image_url, category_id, is_best_seller, rating, review_count)
select v.name, v.description, v.price_cfa, v.stock_quantity, v.image_url,
       (select id from categories where name = v.category_name),
       v.is_best_seller, v.rating, v.review_count
from (values
  ('Glycolic Acid 7% Exfoliating Toner', 'Evens texture and tone while gently exfoliating dead skin cells for brighter, smoother skin.', 24500, 18, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', 'Skincare', true, 4.5, 1155),
  ('Niacinamide 10% + Zinc 1%', 'Reduces the appearance of blemishes and congestion for clearer-looking skin.', 18500, 24, 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=800&q=80', 'Skincare', true, 4.6, 2153),
  ('Hyaluronic Acid 2% + B5', 'Multi-depth hydration for smoother, plumper looking skin.', 16000, 15, 'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=800&q=80', 'Skincare', false, 4.4, 987),
  ('Retinol 0.5% in Squalane', 'A moderate-strength, water-free retinol treatment for visible signs of ageing.', 22000, 9, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80', 'Skincare', false, 4.3, 654),
  ('Matte Liquid Lipstick — Rosewood', 'Long-lasting, transfer-proof matte finish in a rich rosewood shade.', 12500, 30, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80', 'Makeup', true, 4.7, 1802),
  ('Radiant Skin Tint SPF 30', 'Sheer, buildable coverage with broad-spectrum sun protection.', 19500, 20, 'https://images.unsplash.com/photo-1631214524115-4c619dad8dd0?w=800&q=80', 'Makeup', false, 4.5, 743),
  ('Shea Butter Body Cream', 'Rich, whipped body cream with organic shea butter for 48-hour hydration.', 14000, 40, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80', 'Body Care', false, 4.6, 921),
  ('Argan Oil Hair Serum', 'Lightweight serum that tames frizz and adds brilliant shine.', 17500, 12, 'https://images.unsplash.com/photo-1626015365107-9407e8c58c31?w=800&q=80', 'Hair Care', false, 4.4, 512),
  ('Vanilla Orchid Eau de Parfum', 'A warm, sensual fragrance with notes of vanilla, orchid and sandalwood.', 32000, 7, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80', 'Fragrance', true, 4.8, 1340),
  ('Collagen Beauty Gummies', 'Daily supplement to support skin elasticity and hair strength from within.', 21000, 0, 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=800&q=80', 'Wellness', false, 4.2, 289)
) as v(name, description, price_cfa, stock_quantity, image_url, category_name, is_best_seller, rating, review_count)
where not exists (select 1 from products p where p.name = v.name);

-- DONE ✅  Next: run storage_setup.sql, then upload real product photos.
