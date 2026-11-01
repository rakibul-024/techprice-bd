"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="status-page shell">
      <span className="status-code">!</span>
      <h1>তথ্য লোড করা যায়নি</h1>
      <p>{error.message || "একটি অপ্রত্যাশিত সমস্যা হয়েছে।"}</p>
      <div className="status-actions">
        <button className="button button-primary" onClick={reset} type="button">আবার চেষ্টা করুন</button>
        <Link className="button button-outline" href="/">হোমপেজে যান</Link>
      </div>
    </section>
  );
}
