/**
 * CATEGORY FILTER — Legend Multibiz
 * Horizontal scrollable pill tabs for filtering products by category.
 */

"use client";

interface CategoryFilterProps {
  categories: { id: number; name: string }[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const allCategories = [{ id: 0, name: "All" }, ...categories];

  return (
    <div className="sticky top-[57px] bg-[#fafafa] z-30 border-b border-gray-100 mb-4">
      <div className="flex gap-0 overflow-x-auto scrollbar-hide">
        {allCategories.map((category) => {
          const isActive = selectedCategory === category.name;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.name)}
              className={`relative flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 tap-scale ${
                isActive ? "text-[#1a1a2e] font-semibold" : "text-gray-400 hover:text-gray-600"
              }`}
              style={{ minHeight: "44px" }}
            >
              {category.name}
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#ec4899] animate-scale-pop" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
