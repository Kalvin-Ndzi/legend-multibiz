/**
 * FLOATING WHATSAPP BUTTON — Legend Multibiz
 * Fixed pulsing green FAB, bottom-right. Opens WhatsApp with a pre-filled
 * generic inquiry message (or product-specific if props are passed).
 *
 * TODO: replace WA_NUMBER with your real WhatsApp number.
 */

"use client";

import Image from "next/image";

interface FloatingWhatsAppProps {
  productName?: string;
  productPrice?: number;
}

const WA_NUMBER = "237600000000"; // TODO: replace with real number

export function FloatingWhatsApp({ productName, productPrice }: FloatingWhatsAppProps) {
  const handleClick = () => {
    const message =
      productName && productPrice
        ? `Hello! I'm interested in ordering:\n\n*${productName}*\nPrice: ${productPrice.toLocaleString()} CFA\n\nIs this available?`
        : "Hello! I'm interested in your Legend Multibiz products. Can you help me?";

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Contact us on WhatsApp"
      className="fixed z-40 animate-pulse-green bg-[#25d366] rounded-full shadow-xl tap-scale flex items-center justify-center"
      style={{ bottom: "88px", right: "16px", width: "54px", height: "54px" }}
    >
      <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={30} height={30} className="drop-shadow-sm" />
    </button>
  );
}
