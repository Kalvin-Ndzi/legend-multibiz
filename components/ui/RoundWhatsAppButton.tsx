/**
 * ROUND WHATSAPP BUTTON — Legend Multibiz
 * Small inline WhatsApp button used on product cards + detail page CTA bar.
 */

"use client";

import Image from "next/image";

interface RoundWhatsAppButtonProps {
  productName: string;
  productPrice: number;
  disabled?: boolean;
}

const WA_NUMBER = "237600000000"; // TODO: replace with real number

export function RoundWhatsAppButton({ productName, productPrice, disabled }: RoundWhatsAppButtonProps) {
  if (disabled) {
    return (
      <div
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
        title="Currently out of stock"
      >
        <span className="text-sm" role="img" aria-label="Out of stock">🕒</span>
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const message = `Hello! I'd like to order:\n\n*${productName}*\nPrice: ${productPrice.toLocaleString()} CFA\n\nIs it available?`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Order ${productName} on WhatsApp`}
      className="tap-scale w-9 h-9 rounded-full bg-[#25d366] flex items-center justify-center shadow-md hover:shadow-lg flex-shrink-0 transition-shadow"
    >
      <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={20} height={20} className="drop-shadow-sm" />
    </button>
  );
}
