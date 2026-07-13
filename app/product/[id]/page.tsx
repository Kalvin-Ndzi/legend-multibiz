/**
 * PRODUCT DETAIL PAGE — Legend Multibiz
 * ─────────────────────────────────────────────────────────────────────────
 * Full product info, now pulling image_url, is_best_seller, is_cruelty_free,
 * rating and review_count straight from Supabase — nothing mocked.
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Heart, Leaf, ShoppingBag, Share2 } from "lucide-react";
import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { RoundWhatsAppButton } from "@/components/ui/RoundWhatsAppButton";
import { supabase } from "@/lib/supabase/client";

interface Product {
  id: number;
  name: string;
  price_cfa: number;
  stock_quantity: number;
  description: string;
  image_url: string | null;
  is_best_seller: boolean;
  is_cruelty_free: boolean;
  rating: number;
  review_count: number;
  category_name: string; // flattened from the joined categories table below
}

export default function ProductDetailPage() {
  const { id }  = useParams();
  const router  = useRouter();

  const [product, setProduct]       = useState<Product | null>(null);
  const [loading, setLoading]       = useState(true);
  const [favourited, setFavourited] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, price_cfa, stock_quantity, description, image_url, is_best_seller, is_cruelty_free, rating, review_count, categories(name)"
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("[ProductDetail] fetchProduct error:", error.message);
      setProduct(null);
      setLoading(false);
      return;
    }

    /*
     * Supabase's generated types treat every joined table as a possible
     * array (it can't know at compile time that category_id is unique
     * per product), so `data.categories` comes back typed as an array
     * even though there's only ever one row here. We flatten it into a
     * plain string the same way ProductGrid does, sidestepping the
     * mismatch entirely instead of fighting the generated types.
     */
    const raw = data as any;
    const formatted: Product = {
      id:              raw.id,
      name:            raw.name,
      price_cfa:       raw.price_cfa,
      stock_quantity:  raw.stock_quantity,
      description:     raw.description,
      image_url:       raw.image_url,
      is_best_seller:  raw.is_best_seller,
      is_cruelty_free: raw.is_cruelty_free,
      rating:          raw.rating,
      review_count:    raw.review_count,
      category_name:   Array.isArray(raw.categories)
        ? (raw.categories[0]?.name ?? "Uncategorised")
        : (raw.categories?.name ?? "Uncategorised"),
    };

    setProduct(formatted);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#fafafa]">
        <div className="flex gap-1.5 dot-loader">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-8 text-center bg-[#fafafa]">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ background: "var(--brand-100)" }}
        >
          <span className="text-3xl">🔍</span>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Product not found
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          This item may have been removed or is no longer available.
        </p>
        <button
          onClick={() => router.back()}
          className="tap-scale flex items-center gap-2 bg-[#1a1a2e] text-white px-6 py-3 rounded-full text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock   = product.stock_quantity > 0 && product.stock_quantity <= 3;

  const stockLabel = isOutOfStock
    ? "Out of Stock"
    : isLowStock
    ? `Only ${product.stock_quantity} left — hurry!`
    : "In Stock";

  const stockBg = isOutOfStock
    ? "bg-red-50 text-red-600 border-red-100"
    : isLowStock
    ? "bg-orange-50 text-orange-600 border-orange-100"
    : "bg-green-50 text-green-600 border-green-100";

  return (
    <div className="min-h-dvh bg-[#fafafa] pb-28">

      <header className="sticky top-0 z-40 glass border-b border-white/60">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="tap-scale w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <h1 className="text-[15px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Product Details
          </h1>
          <button className="tap-scale w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
            <Share2 size={16} className="text-gray-700" />
          </button>
        </div>
      </header>

      {/* ── Hero Product Image — real photo from Supabase ─────────────── */}
      <div className="relative w-full animate-fade-in" style={{ height: "300px" }}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(145deg, #f8f4ff 0%, #fce7f3 60%, #fdf2f8 100%)" }}
            />
            <div className="absolute inset-0">
              <ImagePlaceholder category={product.category_name} large />
            </div>
          </>
        )}

        <button
          onClick={() => setFavourited((f) => !f)}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all tap-scale ${
            favourited ? "bg-[#ec4899]" : "bg-white/80 backdrop-blur-sm"
          }`}
        >
          <Heart size={18} className={favourited ? "fill-white text-white animate-heart-beat" : "text-gray-400"} />
        </button>
      </div>

      <div className="px-4 pt-5 space-y-4 animate-fade-slide-up">

        {/* Badge row — only shows badges actually true in the database */}
        <div className="flex flex-wrap gap-2">
          {product.is_best_seller && (
            <span className="badge badge-bestseller text-[10px] px-2.5 py-1">
              🏆 Best Seller
            </span>
          )}
          {product.is_cruelty_free && (
            <span className="badge badge-cruelty-free text-[10px] px-2.5 py-1">
              <Leaf size={9} /> Cruelty-Free
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
          {product.category_name}
        </p>

        <h1 className="text-xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          {product.name}
        </h1>

        <p className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#1a1a2e" }}>
          {product.price_cfa.toLocaleString()}{" "}
          <span className="text-lg font-semibold text-gray-400">CFA</span>
        </p>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${stockBg}`}>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isOutOfStock ? "#dc2626" : isLowStock ? "#d97706" : "#16a34a" }}
          />
          {stockLabel}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-bold text-gray-900 mb-2 text-sm" style={{ fontFamily: "var(--font-display)" }}>
            About this product
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            {product.description ||
              "No description available yet. Contact us on WhatsApp for detailed information about ingredients, usage, and suitability for your skin type."}
          </p>
        </div>

        {/* ── Reviews — real rating & review_count from Supabase ────────── */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: "var(--font-display)" }}>
              Customer Reviews
            </h3>
            <button className="text-xs text-[#ec4899] font-medium">See all →</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                {product.rating}
              </p>
              <p className="text-[10px] text-gray-400">out of 5</p>
            </div>

            <div>
              <div className="flex gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Based on {product.review_count.toLocaleString()} reviews
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom" style={{ maxWidth: "448px", margin: "0 auto" }}>
        <div
          className="glass border-t border-white/60 px-4 pt-3 pb-4"
          style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total price</p>
              <p className="text-lg font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                {product.price_cfa.toLocaleString()}{" "}
                <span className="text-sm font-medium text-gray-400">CFA</span>
              </p>
            </div>

            <RoundWhatsAppButton
              productName={product.name}
              productPrice={product.price_cfa}
              disabled={isOutOfStock}
            />

            <button
              disabled={isOutOfStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all tap-scale ${
                isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#1a1a2e] text-white shadow-lg hover:bg-black"
              }`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              <ShoppingBag size={17} />
              {isOutOfStock ? "Unavailable" : "Order Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
