/**
 * PRODUCT GRID — Legend Multibiz
 * ─────────────────────────────────────────────────────────────────────────
 * Fetches products from Supabase and renders CategoryFilter + a 2-column
 * grid of ProductCards. Now selects EVERY real column we created in the
 * schema — image_url, is_best_seller, is_cruelty_free, rating, review_count —
 * so the UI reflects your actual database, not mock numbers.
 */

"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./productCard";
import { CategoryFilter } from "./categoryFilter";
import { supabase } from "@/lib/supabase/client";

interface Product {
  id: number;
  name: string;
  price_cfa: number;
  stock_quantity: number;
  image_url: string;
  category_name: string;
  is_best_seller: boolean;
  is_cruelty_free: boolean;
  rating: number;
  review_count: number;
}

interface Category {
  id: number;
  name: string;
}

const SKELETON_COUNT = 6;

export function ProductGrid() {
  const [products, setProducts]                 = useState<Product[]>([]);
  const [categories, setCategories]             = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading]                   = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("[ProductGrid] fetchCategories error:", error.message);
      return;
    }
    if (data) setCategories(data);
  }

  async function fetchProducts() {
    setLoading(true);

    /*
     * Select every real column from the products table + the joined
     * category name. This matches exactly what schema.sql created.
     */
    let query = supabase.from("products").select(`
      id,
      name,
      price_cfa,
      stock_quantity,
      image_url,
      is_best_seller,
      is_cruelty_free,
      rating,
      review_count,
      categories (name)
    `).order("created_at", { ascending: false });

    if (selectedCategory !== "All") {
      query = query.eq("categories.name", selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[ProductGrid] fetchProducts error:", error.message);
      setLoading(false);
      return;
    }

    const formatted: Product[] = (data ?? []).map((item: any) => ({
      id:              item.id,
      name:            item.name,
      price_cfa:       item.price_cfa,
      stock_quantity:  item.stock_quantity,
      image_url:       item.image_url ?? "",
      category_name:   item.categories?.name ?? "Uncategorised",
      is_best_seller:  item.is_best_seller ?? false,
      is_cruelty_free: item.is_cruelty_free ?? false,
      rating:          item.rating ?? 4.5,
      review_count:    item.review_count ?? 0,
    }));

    setProducts(formatted);
    setLoading(false);
  }

  return (
    <div>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product, i) => (
            <div key={product.id} className={`stagger-${Math.min(i + 1, 8)}`}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: "var(--brand-100)" }}
          >
            <span className="text-2xl">🔍</span>
          </div>
          <p className="font-semibold text-gray-700 mb-1" style={{ fontFamily: "var(--font-display)" }}>
            No products found
          </p>
          <p className="text-sm text-gray-400">
            Try a different category or check back soon
          </p>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-50 shadow-sm">
      <div className="skeleton w-full" style={{ aspectRatio: "1" }} />
      <div className="p-2.5 space-y-2">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-2 w-20 rounded" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton w-8 h-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
