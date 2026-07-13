/**
 * BOTTOM NAVIGATION BAR — Legend Multibiz
 * Persistent 5-tab nav bar. Hidden on /onboarding.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Search, User, ShoppingCart } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home",       href: "/",           icon: Home        },
  { label: "Favourites", href: "/favourites",  icon: Heart       },
  { label: "Search",     href: "/search",      icon: Search      },
  { label: "You",        href: "/account",     icon: User        },
  { label: "Cart",       href: "/cart",        icon: ShoppingCart },
] as const;

const HIDDEN_ROUTES = ["/onboarding"];

export function BottomNav() {
  const pathname = usePathname();
  if (HIDDEN_ROUTES.includes(pathname)) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ maxWidth: "448px", margin: "0 auto" }}
    >
      <div
        className="glass border-t border-white/60 safe-bottom"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="flex justify-around items-center px-2 pt-2 pb-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                  isActive ? "text-[#1a1a2e]" : "text-gray-400"
                }`}
                style={{ minWidth: "52px" }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? "text-[#ec4899]" : ""}
                />
                <span
                  className={`text-[10px] font-medium transition-all ${
                    isActive ? "text-[#1a1a2e] font-semibold" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div
                    className="w-1 h-1 rounded-full bg-[#ec4899] animate-scale-pop"
                    style={{ marginTop: "1px" }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
