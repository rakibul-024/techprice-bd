"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

export default function ProductExplorer({
  products,
  categories,
  initialCategory = "all",
  initialQuery = "",
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState("featured");
  const [query, setQuery] = useState(initialQuery);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.categorySlug === selectedCategory;
      const searchable = `${product.name} ${product.englishName || ""} ${product.category}`
        .toLocaleLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.todayPrice - b.todayPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.todayPrice - a.todayPrice);
    }

    return filtered;
  }, [products, query, selectedCategory, sortOrder]);

  return (
    <div>
      <div className="catalog-controls">
        <div className="filter-chips" aria-label="ক্যাটাগরি ফিল্টার">
          <button
            className={selectedCategory === "all" ? "filter-chip active" : "filter-chip"}
            onClick={() => setSelectedCategory("all")}
            type="button"
          >
            সব পণ্য
          </button>
          {categories.map((category) => (
            <button
              className={selectedCategory === category.slug ? "filter-chip active" : "filter-chip"}
              key={category.slug}
              onClick={() => setSelectedCategory(category.slug)}
              type="button"
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
        <div className="catalog-tools">
          <label className="catalog-search">
            <span className="sr-only">ক্যাটালগে খুঁজুন</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ক্যাটালগে খুঁজুন"
              type="search"
              value={query}
            />
          </label>
          <label className="sort-select">
            <span className="sr-only">দাম অনুসারে সাজান</span>
            <select onChange={(event) => setSortOrder(event.target.value)} value={sortOrder}>
              <option value="featured">জনপ্রিয়তা</option>
              <option value="lowToHigh">দাম: কম থেকে বেশি</option>
              <option value="highToLow">দাম: বেশি থেকে কম</option>
            </select>
          </label>
        </div>
      </div>
      {visibleProducts.length ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">⌕</span>
          <h3>কোনো পণ্য পাওয়া যায়নি</h3>
          <p>অন্য শব্দ বা ক্যাটাগরি দিয়ে আবার খুঁজুন।</p>
          <button
            className="button button-outline"
            onClick={() => {
              setQuery("");
              setSelectedCategory("all");
            }}
            type="button"
          >
            ফিল্টার মুছুন
          </button>
        </div>
      )}
      <div className="catalog-count">
        {visibleProducts.length}টি পণ্য দেখানো হচ্ছে
        <Link href="#all-products">উপরে যান ↑</Link>
      </div>
    </div>
  );
}
