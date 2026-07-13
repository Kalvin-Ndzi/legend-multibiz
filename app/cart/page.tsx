"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  return (
    <div className="min-h-dvh bg-[#fafafa] pb-nav flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-white/60">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => router.back()} className="tap-scale w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <h1 className="text-[15px] font-bold" style={{ fontFamily: "var(--font-display)" }}>My Cart</h1>
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-fade-slide-up">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-md" style={{ background: "linear-gradient(145deg, #fce7f3, #f8f4ff)" }}>
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>Your Cart</h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">Your cart is empty. Explore our products and add items to start your order. Fast delivery in Bamenda!</p>
        <button onClick={() => router.push("/")} className="tap-scale flex items-center gap-2 bg-[#1a1a2e] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
          Browse Products
        </button>
      </div>
    </div>
  );
}
