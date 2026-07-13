/**
 * ONBOARDING — Legend Multibiz
 * 3-screen flow: Splash/Login -> Feature 1 -> Feature 2 -> Home
 * No real auth wired up yet. Social buttons + skip button all just
 * advance to the next screen / mark onboarding complete.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Apple } from "lucide-react";
import Image from "next/image";

const TOTAL_SCREENS = 3;

const featureSlides = [
  {
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80&fit=crop",
    tag: "Legend Multibiz Products",
    tagHighlight: "50% Off",
    headline: "Fresh Start For\nYour Regimen",
    sub: "Discover the best skincare products\ncurated just for you",
  },
  {
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80&fit=crop",
    tag: "Fast Delivery",
    tagHighlight: "Bamenda & Beyond",
    headline: "Original Products\nAt Your Door",
    sub: "100% authentic beauty essentials\ndelivered with care",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [screen, setScreen] = useState(0);
  const [email, setEmail] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem("onboardingComplete");
    if (done) router.replace("/");
  }, [router]);

  const goNext = () => {
    setTransitioning(true);
    setTimeout(() => {
      if (screen < TOTAL_SCREENS - 1) setScreen((s) => s + 1);
      else completeOnboarding();
      setTransitioning(false);
    }, 220);
  };

  const goBack = () => {
    if (screen === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setScreen((s) => s - 1);
      setTransitioning(false);
    }, 220);
  };

  const skipOnboarding = () => completeOnboarding();

  const completeOnboarding = () => {
    localStorage.setItem("onboardingComplete", "true");
    router.replace("/");
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    goNext();
  };

  return (
    <div
      className="relative w-full min-h-dvh bg-white overflow-hidden"
      style={{ opacity: transitioning ? 0 : 1, transition: "opacity 200ms ease" }}
    >
      {screen === 0 && (
        <SplashScreen
          email={email}
          setEmail={setEmail}
          onEmailContinue={handleEmailContinue}
          onSkip={skipOnboarding}
          onNext={goNext}
        />
      )}

      {screen >= 1 && (
        <FeatureScreen
          slide={featureSlides[screen - 1]}
          screenIndex={screen}
          totalScreens={TOTAL_SCREENS}
          onNext={goNext}
          onBack={goBack}
          onSkip={skipOnboarding}
          isLast={screen === TOTAL_SCREENS - 1}
        />
      )}
    </div>
  );
}

function SplashScreen({
  email, setEmail, onEmailContinue, onSkip, onNext,
}: {
  email: string;
  setEmail: (v: string) => void;
  onEmailContinue: (e: React.FormEvent) => void;
  onSkip: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <div className="relative flex-shrink-0" style={{ height: "46vh" }}>
        <Image
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=85&fit=crop&crop=top"
          alt="Legend Multibiz — Premium Cosmetics"
          fill
          className="object-cover object-top"
          priority
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(255,255,255,1) 100%)" }}
        />
      </div>

      <div className="flex-1 bg-white px-6 pt-2 pb-8 flex flex-col animate-fade-slide-up">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #ec4899, #be185d)" }}>
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="text-sm font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-display)", color: "#1a1a2e" }}>
            Legend Multibiz
          </span>
        </div>

        <h1 className="text-center text-2xl font-bold mb-1 leading-tight" style={{ fontFamily: "var(--font-display)", color: "#0a0a0f" }}>
          Welcome to Claim Your
          <br />
          Lucky Bag
        </h1>

        <p className="text-center text-sm text-gray-400 mb-6">
          Log in or sign up to shop over 9,000 products
        </p>

        <form onSubmit={onEmailContinue} className="space-y-3 mb-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1 ml-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#f9f9fb] text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-gray-500 hover:bg-gray-50 active:scale-95 transition-all">
            Continue <ArrowRight size={16} />
          </button>
        </form>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-300">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="space-y-3">
          <button onClick={onNext} className="tap-scale w-full flex items-center justify-center gap-3 bg-[#1a1a2e] text-white py-3.5 rounded-2xl text-sm font-semibold transition-all hover:bg-black">
            <Apple size={18} />
            Continue with Apple
          </button>

          <button onClick={onNext} className="tap-scale w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3.5 rounded-2xl text-sm font-semibold border border-gray-200 transition-all hover:bg-gray-50">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="flex justify-center mt-5">
          <button onClick={onSkip} aria-label="Skip onboarding" className="tap-scale w-10 h-10 rounded-full bg-[#1a1a2e] flex items-center justify-center shadow-lg hover:bg-black transition-all">
            <ArrowRight size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureScreen({
  slide, screenIndex, totalScreens, onNext, onBack, isLast,
}: {
  slide: (typeof featureSlides)[0];
  screenIndex: number;
  totalScreens: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isLast: boolean;
}) {
  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div
        className="flex-shrink-0 flex items-center justify-center relative"
        style={{ height: "52vh", background: "linear-gradient(160deg, #f8f4ff 0%, #fce7f3 60%, #fdf2f8 100%)" }}
      >
        <div className="absolute top-6 right-6 w-24 h-24 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
        <div className="absolute bottom-10 left-4 w-16 h-16 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #be185d, transparent)" }} />

        <div
          className="relative rounded-full overflow-hidden shadow-2xl animate-scale-pop"
          style={{ width: "62vw", maxWidth: "260px", height: "62vw", maxHeight: "260px", border: "4px solid rgba(255,255,255,0.9)" }}
        >
          <Image src={slide.image} alt="Legend Multibiz feature" fill className="object-cover object-top" unoptimized />
        </div>
      </div>

      <div className="flex-1 px-7 pt-6 pb-8 flex flex-col animate-fade-slide-up">
        <p className="text-center text-sm text-gray-400 mb-3">
          The <span className="font-bold text-gray-700">{slide.tag}</span>{" "}
          <span className="font-bold text-[#ec4899]">{slide.tagHighlight}</span>
        </p>

        <h1 className="text-center text-[28px] font-bold mb-3 leading-tight" style={{ fontFamily: "var(--font-display)", color: "#0a0a0f" }}>
          {slide.headline.split("\n").map((line, i) => (
            <span key={i}>{line}{i < slide.headline.split("\n").length - 1 && <br />}</span>
          ))}
        </h1>

        <p className="text-center text-sm text-gray-400 leading-relaxed mb-auto">
          {slide.sub.split("\n").map((line, i) => (
            <span key={i}>{line}{i < slide.sub.split("\n").length - 1 && <br />}</span>
          ))}
        </p>

        <div className="flex items-center justify-between mt-6">
          <button onClick={onBack} className="tap-scale w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all">
            <ArrowLeft size={18} />
          </button>

          <div className="flex gap-1.5 items-center">
            {Array.from({ length: totalScreens }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{ width: i === screenIndex ? "20px" : "7px", height: "7px", background: i === screenIndex ? "#1a1a2e" : "#d1d1d6" }}
              />
            ))}
          </div>

          <button onClick={onNext} className="tap-scale flex items-center gap-2 bg-[#1a1a2e] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-black transition-all">
            {isLast ? "Start" : "Next"}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
