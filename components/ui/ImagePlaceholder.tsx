/**
 * IMAGE PLACEHOLDER — Legend Multibiz
 * Gradient fallback shown only if a product has no image_url at all.
 * Once every product has a real photo in Supabase, this becomes a rare
 * safety net rather than the default look.
 */

const CATEGORY_THEMES: Record<string, [string, string]> = {
  Skincare:    ["🧴", "linear-gradient(145deg, #fce7f3, #f8f4ff)"],
  Makeup:      ["💄", "linear-gradient(145deg, #ffe4e6, #fce7f3)"],
  "Body Care": ["🛀", "linear-gradient(145deg, #f0f9ff, #e0f2fe)"],
  "Hair Care": ["💇", "linear-gradient(145deg, #fef9c3, #fef3c7)"],
  Fragrance:   ["🌸", "linear-gradient(145deg, #fdf2f8, #fce7f3)"],
  Wellness:    ["✨", "linear-gradient(145deg, #f0fdf4, #dcfce7)"],
  Laptops:     ["💻", "linear-gradient(145deg, #eff6ff, #dbeafe)"],
  Monitors:    ["🖥️",  "linear-gradient(145deg, #f8fafc, #e2e8f0)"],
  Accessories: ["🖱️",  "linear-gradient(145deg, #f5f3ff, #ede9fe)"],
};

const DEFAULT_THEME: [string, string] = [
  "✨",
  "linear-gradient(145deg, #f8f4ff, #fce7f3)",
];

export function ImagePlaceholder({
  category,
  large = false,
}: {
  category?: string;
  large?: boolean;
}) {
  const [icon, gradient] = category
    ? (CATEGORY_THEMES[category] ?? DEFAULT_THEME)
    : DEFAULT_THEME;

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-2"
      style={{ background: gradient }}
    >
      <span className="select-none" style={{ fontSize: large ? "64px" : "40px", opacity: 0.55 }}>
        {icon}
      </span>
      {large && category && (
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          {category}
        </p>
      )}
    </div>
  );
}
