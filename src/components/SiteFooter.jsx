import Link from "next/link";
import { categories } from "../lib/categories";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-about">
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark" aria-hidden="true">▤</span>
            <strong>টেকপ্রাইস <em>বিডি</em></strong>
          </Link>
          <p>ঢাকার প্রযুক্তি বাজারের সর্বশেষ দর, এক জায়গায়—সহজে তুলনা করুন, বুঝে কিনুন।</p>
          <span className="verified-note">✓ যাচাইকৃত বাজার তথ্য • নিয়মিত আপডেট</span>
        </div>
        <div>
          <h2>ক্যাটাগরি</h2>
          {categories.map((category) => (
            <Link href={`/category/${category.slug}`} key={category.slug}>
              {category.emoji} {category.name}
            </Link>
          ))}
        </div>
        <div>
          <h2>দরকারি লিংক</h2>
          <Link href="/#all-products">সব পণ্যের ক্যাটালগ</Link>
          <Link href="/#market-movers">আজকের মার্কেট মুভার্স</Link>
          <Link href="/signin">আপনার অ্যাকাউন্ট</Link>
          <Link href="/signup">নতুন অ্যাকাউন্ট খুলুন</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="shell">
          <span>© {new Date().getFullYear()} TechPrice BD</span>
          <span>দাম দোকান ও সময়ভেদে পরিবর্তিত হতে পারে—কেনার আগে বিক্রেতার সঙ্গে নিশ্চিত হোন।</span>
        </div>
      </div>
    </footer>
  );
}
