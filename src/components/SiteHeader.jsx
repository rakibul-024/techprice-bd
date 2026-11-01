import Link from "next/link";
import { categories } from "../lib/categories";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-main shell">
        <Link className="brand" href="/" aria-label="TechPrice BD হোম">
          <span className="brand-mark" aria-hidden="true">
            ▤
          </span>
          <span>
            <strong>
              টেকপ্রাইস <em>বিডি</em>
            </strong>
            <small>ঢাকার প্রযুক্তি বাজারের নির্ভরযোগ্য দর</small>
          </span>
          <span className="live-badge"><i /> LIVE</span>
        </Link>

        <form className="header-search" action="/" role="search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            name="q"
            placeholder="প্রসেসর, GPU, ফোন বা গ্যাজেট খুঁজুন..."
            aria-label="পণ্য খুঁজুন"
          />
          <button type="submit" aria-label="খুঁজুন">↵</button>
        </form>

        <div className="header-actions">
          <Link className="text-link" href="/signin">লগইন</Link>
          <Link className="button button-primary button-small" href="/signup">নিবন্ধন</Link>
        </div>
      </div>
      <nav className="category-nav shell" aria-label="ক্যাটাগরি">
        <Link className="nav-all" href="/#all-products">🏠 সব পণ্য</Link>
        {categories.map((category) => (
          <Link href={`/category/${category.slug}`} key={category.slug}>
            <span aria-hidden="true">{category.emoji}</span>
            {category.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
