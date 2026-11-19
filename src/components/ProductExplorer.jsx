"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

const SUB_FILTERS = [
  { label: "সব", pattern: null },
  { label: "ইন্টেল", pattern: /intel|ইন্টেল/i },
  { label: "এএমডি", pattern: /amd|ryzen|রাইজেন|athlon| Radeon|\brx\b/i },
  { label: "এনভিডিয়া", pattern: /nvidia|geforce|এনভিডিয়া/i },
  { label: "গেমিং", pattern: /gaming|গেমিং|rog|hyperx|razer|fantech/i },
  { label: "স্যামসাং", pattern: /samsung|স্যামসাং/i },
  { label: "এপল", pattern: /apple|iphone|macbook|এপল|আইফোন/i },
];

export default function ProductExplorer({
  products,
  categories,
  initialCategory = "all",
  initialQuery = "",
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState("featured");
  const [query, setQuery] = useState(initialQuery);
  const [subFilter, setSubFilter] = useState("সব");

  const visibleSubFilters = useMemo(() => {
    return SUB_FILTERS.filter((filter) => {
      if (!filter.pattern) return true;
      return products.some((product) => {
        const searchable = `${product.name} ${product.englishName || ""} ${product.category}`;
        return filter.pattern.test(searchable);
      });
    });
  }, [products]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const activeFilter = SUB_FILTERS.find((filter) => filter.label === subFilter);
    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.categorySlug === selectedCategory;
      const searchable = `${product.name} ${product.englishName || ""} ${product.category}`
        .toLocaleLowerCase();
      const matchesSubFilter =
        !activeFilter?.pattern ||
        activeFilter.pattern.test(`${product.name} ${product.englishName || ""} ${product.category}`);
      return (
        matchesCategory &&
        matchesSubFilter &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.todayPrice - b.todayPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.todayPrice - a.todayPrice);
    }

    return filtered;
  }, [products, query, selectedCategory, sortOrder, subFilter]);

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
              <option value="featured">ডিফল্ট রেট</option>
              <option value="lowToHigh">দাম: কম থেকে বেশি ↑</option>
              <option value="highToLow">দাম: বেশি থেকে কম ↓</option>
            </select>
          </label>
        </div>
      </div>
      {visibleSubFilters.length > 1 ? (
        <div aria-label="সাব-ফিল্টার" className="subfilter-row">
          <span className="subfilter-label">দ্রুত ফিল্টার</span>
          <div className="filter-chips subfilter-chips">
            {visibleSubFilters.map((filter) => (
              <button
                className={subFilter === filter.label ? "filter-chip active" : "filter-chip"}
                key={filter.label}
                onClick={() => setSubFilter(filter.label)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
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
              setSubFilter("সব");
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
