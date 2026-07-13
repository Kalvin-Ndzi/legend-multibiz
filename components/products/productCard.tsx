/**
 * PRODUCT CARD — Legend Multibiz
 * ─────────────────────────────────────────────────────────────────────────
 * 2-column grid card. Now reads REAL data straight from Supabase:
 *   • image_url        — real product photo (falls back to gradient if empty)
 *   • is_best_seller    — you toggle this per-product in the Table Editor
 *   • is_cruelty_free   — same, toggle per product
 *   • rating / review_count — real numbers you can update anytime
 *
 * Nothing here is hardcoded/mocked anymore — every visual detail comes
 * from the product row you pass in.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Leaf } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { RoundWhatsAppButton } from "@/components/ui/RoundWhatsAppButton";

interface ProductCardProps {
  id: number;
  name: string;
  price_cfa: number;
  stock_quantity: number;
  image_url: string | null;
  category_name: string;
  is_best_seller: boolean;
  is_cruelty_free: boolean;
  rating: number;
  review_count: number;
}

export function ProductCard({
  id,
  name,
  price_cfa,
  stock_quantity,
  image_url,
  category_name,
  is_best_seller,
  is_cruelty_free,
  rating,
  review_count,
}: ProductCardProps) {
  const [favourited, setFavourited] = useState(false);

  const isOutOfStock = stock_quantity <= 0;
  const isLowStock   = stock_quantity > 0 && stock_quantity <= 3;

  const stockText = isOutOfStock
    ? "Out of Stock"
    : isLowStock
    ? `Only ${stock_quantity} left`
    : "In Stock";

  const stockColor = isOutOfStock
    ? "text-red-500"
    : isLowStock
    ? "text-orange-500"
    : "text-green-600";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-slide-up">

      {/* ── Image Section ─────────────────────────────────────────────── */}
      <Link href={`/product/${id}`} className="block">
        <div className="relative w-full" style={{ aspectRatio: "1" }}>
          {image_url ? (
            /* Real product photo from Supabase Storage / URL */
            <Image
              src={image_url}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              unoptimized
            />
          ) : (
            /* Safety net — only shows if a product has no photo yet */
            <ImagePlaceholder category={category_name} />
          )}

          {/* Best Seller badge — only if flagged true in the database */}
          {is_best_seller && !isOutOfStock && (
            <div className="absolute top-2 left-2">
              <span className="badge badge-bestseller text-[9px] px-2 py-0.5">
                🏆 Best Seller
              </span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              setFavourited((f) => !f);
            }}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 tap-scale ${
              favourited ? "bg-[#ec4899] shadow-md" : "bg-white/80 backdrop-blur-sm shadow-sm"
            }`}
          >
            <Heart
              size={13}
              className={favourited ? "fill-white text-white animate-heart-beat" : "text-gray-300"}
            />
          </button>
        </div>
      </Link>

      {/* ── Content Section ───────────────────────────────────────────── */}
      <div className="p-2.5 space-y-1.5">

        {/* Cruelty-Free badge — only if flagged true in the database */}
        {is_cruelty_free && (
          <div className="flex items-center gap-1">
            <span className="badge badge-cruelty-free text-[9px] px-1.5 py-0.5">
              <Leaf size={8} />
              Cruelty-Free
            </span>
          </div>
        )}

        <Link href={`/product/${id}`}>
          <h3
            className="font-bold text-[12px] text-gray-900 line-clamp-2 leading-snug hover:text-[#ec4899] transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {name}
          </h3>
        </Link>

        <p className="text-[10px] text-gray-400 uppercase tracking-wide">
          {category_name}
        </p>

        {/* Star rating — real values from database */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={10}
                className={
                  star <= Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-[9px] text-gray-400">
            {review_count.toLocaleString()} Reviews
          </span>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <div>
            <p className="text-[10px] text-gray-400">Total:</p>
            <p className="text-[13px] font-bold text-gray-900">
              {price_cfa.toLocaleString()}{" "}
              <span className="text-[10px] font-medium text-gray-500">CFA</span>
            </p>
            <p className={`text-[9px] font-medium ${stockColor}`}>
              {stockText}
            </p>
          </div>

          <RoundWhatsAppButton
            productName={name}
            productPrice={price_cfa}
            disabled={isOutOfStock}
          />
        </div>
      </div>
    </div>
  );
}
