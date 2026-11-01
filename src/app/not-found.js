import Link from "next/link";

export default function NotFound() {
  return (
    <section className="status-page shell">
      <span className="status-code">404</span>
      <h1>পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h1>
      <p>লিংকটি ভুল হতে পারে, অথবা পণ্য/ক্যাটাগরিটি আর পাওয়া যাচ্ছে না।</p>
      <Link className="button button-primary" href="/">হোমপেজে ফিরে যান</Link>
    </section>
  );
}
