/**
 * HOME PAGE — Legend Multibiz
 * ─────────────────────────────────────────────────────────────────────────
 * Structure:
 *   1. TopBar         — Search + Cart icons
 *   2. HeroCard       — Featured product, pulled live from Supabase
 *                       (the best-seller with the highest rating)
 *   3. SimilarRow     — Other best-sellers, horizontal scroll
 *   4. ProductGrid    — Full catalogue with category filter
 *   5. FloatingWhatsApp
 *
 * Guard: redirects to /onboarding if not completed yet.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, Star, Heart, ChevronRight, Leaf } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { supabase } from "@/lib/supabase/client";

interface FeaturedProduct {
  id: number;
  name: string;
  description: string | null;
  price_cfa: number;
  image_url: string | null;
  is_cruelty_free: boolean;
  rating: number;
  review_count: number;
  category_name: string;
}

export default function HomePage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const [hero, setHero] = useState<FeaturedProduct | null>(null);
  const [similar, setSimilar] = useState<FeaturedProduct[]>([]);
  const [heroFavourited, setHeroFavourited] = useState(false);
  const [heroLoading, setHeroLoading] = useState(true);

  /* Guard: redirect to onboarding if not completed */
  useEffect(() => {
    const done = localStorage.getItem("onboardingComplete");
    if (!done) {
      router.replace("/onboarding");
    } else {
      setIsReady(true);
    }
  }, [router]);

  /* Fetch the hero + similar products once the page is ready */
  useEffect(() => {
    if (isReady) fetchFeatured();
  }, [isReady]);

  /*
   * Fetch strategy:
   *   - Hero: the best-seller with the highest rating
   *   - Similar row: the next 4 best-sellers (excluding the hero)
   * If you don't have any is_best_seller=true products yet, this falls
   * back gracefully to the most recently added products instead.
   */
  async function fetchFeatured() {
    setHeroLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select(`
        id, name, description, price_cfa, image_url,
        is_cruelty_free, rating, review_count,
        categories (name)
      `)
      .order("is_best_seller", { ascending: false })
      .order("rating", { ascending: false })
      .limit(5);

    if (error) {
      console.error("[HomePage] fetchFeatured error:", error.message);
      setHeroLoading(false);
      return;
    }

    const formatted: FeaturedProduct[] = (data ?? []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price_cfa: item.price_cfa,
      image_url: item.image_url,
      is_cruelty_free: item.is_cruelty_free,
      rating: item.rating,
      review_count: item.review_count,
      category_name: item.categories?.name ?? "Uncategorised",
    }));

    setHero(formatted[0] ?? null);
    setSimilar(formatted.slice(1));
    setHeroLoading(false);
  }

  if (!isReady) {
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

  return (
    <div className="pb-nav bg-[#fafafa]">
      <TopBar />

      {/* ── Hero Featured Product (from Supabase) ─────────────────────── */}
      <section className="px-4 pt-2 pb-4 animate-fade-slide-up">
        {heroLoading ? (
          <div className="skeleton w-full rounded-3xl" style={{ height: "340px" }} />
        ) : hero ? (
          <HeroCard
            product={hero}
            favourited={heroFavourited}
            onToggleFavourite={() => setHeroFavourited((f) => !f)}
          />
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-50">
            <p className="text-sm text-gray-400">
              No products yet — add some in Supabase to see them here!
            </p>
          </div>
        )}
      </section>

      {/* ── Similar Products — Horizontal Scroll (from Supabase) ──────── */}
      {similar.length > 0 && (
        <section className="mb-5 animate-fade-slide-up stagger-2">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-[15px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Similar Products
            </h2>
            <button className="flex items-center gap-0.5 text-xs text-[#ec4899] font-medium">
              See all <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1">
            {similar.map((p) => (
              <SimilarCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Full Product Grid (from Supabase) ──────────────────────────── */}
      <section className="px-4 animate-fade-slide-up stagger-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[15px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
            All Products
          </h2>
        </div>
        <ProductGrid />
      </section>

      <FloatingWhatsApp />
    </div>
  );
}

/* ═══════════════════════════════════════ TopBar ═══════════════════════ */
function TopBar() {
  return (
    <header className="sticky top-0 z-40 bg-[#fafafa]/90 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
            Welcome back 👋
          </p>
          <h1 className="text-base font-bold leading-tight" style={{ fontFamily: "var(--font-display)", color: "#0a0a0f" }}>
            Legend Multibiz
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/search">
            <button className="tap-scale w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
              <Search size={17} className="text-gray-600" />
            </button>
          </Link>
          <Link href="/cart">
            <button className="tap-scale relative w-9 h-9 rounded-full bg-[#1a1a2e] flex items-center justify-center shadow-md">
              <ShoppingCart size={17} className="text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ec4899] text-white text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════ HeroCard ══════════════════════
   Now takes a real FeaturedProduct straight from Supabase.            */
function HeroCard({
  product,
  favourited,
  onToggleFavourite,
}: {
  product: FeaturedProduct;
  favourited: boolean;
  onToggleFavourite: () => void;
}) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-50">
        <div className="relative w-full" style={{ height: "220px" }}>
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" unoptimized priority />
          ) : (
            <ImagePlaceholder category={product.category_name} large />
          )}

          <div className="absolute top-3 left-3">
            <span className="badge badge-bestseller text-[10px] px-2.5 py-1">
              🏆 Best Seller
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavourite();
            }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all tap-scale ${
              favourited ? "bg-[#ec4899] shadow-lg" : "bg-white/80 backdrop-blur-sm shadow-sm"
            }`}
          >
            <Heart size={15} className={favourited ? "fill-white text-white animate-heart-beat" : "text-gray-400"} />
          </button>
        </div>

        <div className="px-4 py-3">
          {product.is_cruelty_free && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="badge badge-cruelty-free">
                <Leaf size={10} />
                Cruelty-Free
              </span>
            </div>
          )}

          <h3 className="font-bold text-[15px] text-gray-900 leading-snug mb-0.5" style={{ fontFamily: "var(--font-display)" }}>
            {product.name}
          </h3>

          <p className="text-xs text-gray-400 mb-2 line-clamp-1">
            {product.description || product.category_name}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={13}
                    className={
                      star <= Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">{product.review_count.toLocaleString()}</span>
            </div>

            <p className="text-sm font-bold text-gray-900">
              Total: <span className="text-[#ec4899]">{product.price_cfa.toLocaleString()} CFA</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════ SimilarCard ═══════════════════ */
function SimilarCard({ product }: { product: FeaturedProduct }) {
  return (
    <Link href={`/product/${product.id}`} className="flex-shrink-0">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 tap-scale" style={{ width: "130px" }}>
        <div className="relative w-full" style={{ height: "90px" }}>
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" unoptimized />
          ) : (
            <ImagePlaceholder category={product.category_name} />
          )}
        </div>

        <div className="p-2">
          <p className="text-[11px] font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">
            {product.name}
          </p>
          <p className="text-[11px] font-bold text-[#ec4899]">
            {product.price_cfa.toLocaleString()} CFA
          </p>
        </div>
      </div>
    </Link>
  );
}
