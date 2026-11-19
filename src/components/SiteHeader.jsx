import Link from "next/link";
import { getCategories } from "../lib/api";
import { categories as fallbackCategories } from "../lib/categories";
import UserMenu from "./UserMenu";

async function loadCategories() {
  try {
    const liveCategories = await getCategories();
    if (liveCategories.length) return liveCategories;
  } catch {
    // ফিড আসতে না পারলে স্থানীয় ক্যাটাগরি তালিকা দেখানো হবে
  }
  return fallbackCategories;
}

export default async function SiteHeader({ currentUser = null, sessionKnown = false }) {
  const categories = await loadCategories();
  const todayBn = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="site-header">
      <div className="header-main shell">
        <Link className="brand" href="/" aria-label="TechPrice BD হোম">
          <span aria-hidden="true" className="brand-mark">
            ▤
          </span>
          <span>
            <strong>
              টেকপ্রাইস <em>বিডি</em>
            </strong>
            <small>ঢাকার প্রযুক্তি বাজারের নির্ভরযোগ্য দর</small>
          </span>
          <span className="brand-status">
            <span className="live-badge"><i /> লাইভ</span>
            <span className="header-date">{todayBn}</span>
          </span>
        </Link>

        <form action="/" className="header-search" role="search">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="পণ্য খুঁজুন"
            name="q"
            placeholder="প্রসেসর, GPU, ফোন বা গ্যাজেট খুঁজুন..."
            type="search"
          />
          <button aria-label="খুঁজুন" type="submit">↵</button>
        </form>

        <UserMenu initialUser={currentUser} sessionKnown={sessionKnown} />
      </div>
      <nav aria-label="ক্যাটাগরি" className="category-nav shell">
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
