-- ============================================================================
-- LEGEND MULTIBIZ — Supabase Storage Setup (for real product images)
-- Run this AFTER schema.sql.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');

drop policy if exists "Authenticated upload product images" on storage.objects;
create policy "Authenticated upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

-- HOW TO UPLOAD REAL PRODUCT PHOTOS:
--   1. Supabase Dashboard → Storage → product-images bucket
--   2. Click "Upload file" → choose your real product photo
--      (recommended: square, 800x800px, under 500KB, .jpg or .webp)
--   3. Click the uploaded file → "Copy URL" — this is your image_url
--   4. Table Editor → products table → paste URL into image_url for that row
