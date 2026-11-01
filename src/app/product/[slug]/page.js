import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "../../../lib/api";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  return {
    title: product ? `${product.name} এর দাম | TechPrice BD` : "পণ্য পাওয়া যায়নি",
    description: product?.description || "দোকানভিত্তিক দাম ও বাজারের তথ্য দেখুন।",
  };
}

function PriceStat({ label, value }) {
  return (
    <div className="price-stat">
      <span>{label}</span>
      <strong>{value || "তথ্য নেই"}</strong>
    </div>
  );
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const changeTone =
    product.changeType === "down"
      ? "down"
      : product.changeType === "flat"
        ? "flat"
        : "up";
  const shops = Array.isArray(product.shops) ? product.shops : [];
  const history = Array.isArray(product.history) ? product.history : [];

  return (
    <>
      <section className="product-detail-hero">
        <div className="shell">
          <div className="breadcrumbs">
            <Link href="/">হোম</Link><span>/</span>
            <Link href={`/category/${product.categorySlug}`}>{product.category}</Link><span>/</span>
            <span>{product.name}</span>
          </div>
          <div className="detail-title">
            <span className="detail-emoji" aria-hidden="true">{product.emoji || "⌘"}</span>
            <div>
              <span className="category-tag">{product.category}</span>
              <h1>{product.name}</h1>
              {product.englishName ? <p>{product.englishName}</p> : null}
            </div>
          </div>
          <div className="price-overview">
            <div className="current-price">
              <span>আজকের বাজার দর</span>
              <strong>{product.todayPriceBn}</strong>
              <span className={`change-pill ${changeTone}`}>{product.change || "পরিবর্তন নেই"}</span>
            </div>
            <PriceStat label="আগের দর" value={product.previousPrice ? `${product.previousPrice.toLocaleString("bn-BD")} টাকা` : null} />
            <PriceStat label="সর্বনিম্ন দর" value={product.minPriceBn} />
            <PriceStat label="সর্বোচ্চ দর" value={product.maxPriceBn} />
            <PriceStat label="গড় বাজার দর" value={product.avgPriceBn} />
          </div>
          <p className="detail-unit">দাম {product.unit ? `${product.unit} হিসেবে` : "প্রতি পিস"} · দোকান ও শাখাভেদে পরিবর্তিত হতে পারে</p>
        </div>
      </section>

      <div className="shell detail-content">
        <section className="detail-section">
          <div className="section-heading compact-heading">
            <div><span className="eyebrow">দোকানভিত্তিক তুলনা</span><h2>ঢাকার টেক মার্কেটের দাম</h2></div>
            <span className="live-indicator"><i /> {shops.length}টি দোকান</span>
          </div>
          {shops.length ? (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>দোকান</th><th>শাখা</th><th>সর্বনিম্ন</th><th>আজকের দাম</th><th>সর্বোচ্চ</th><th>স্টক</th></tr></thead>
                <tbody>
                  {shops.map((shop, index) => (
                    <tr key={`${shop.shopName}-${shop.branch}-${index}`}>
                      <td><strong>{shop.shopName}</strong></td>
                      <td>{shop.branch || "—"}</td>
                      <td>{shop.min || "—"}</td>
                      <td className="table-price">{shop.today || shop.avg || "—"}</td>
                      <td>{shop.max || "—"}</td>
                      <td><span className="stock-status">{shop.status || "দাম যাচাই করুন"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-panel">এই পণ্যের দোকানভিত্তিক রেট এখনো API-তে নেই।</div>
          )}
        </section>

        <div className="detail-two-col">
          <section className="detail-section">
            <div className="section-heading compact-heading">
              <div><span className="eyebrow">দামের গতিবিধি</span><h2>৭ দিনের দাম ইতিহাস</h2></div>
            </div>
            {history.length ? (
              <div className="table-wrap">
                <table className="data-table history-table">
                  <thead><tr><th>তারিখ</th><th>বাজার দর</th><th>পরিবর্তন</th></tr></thead>
                  <tbody>{history.map((entry, index) => (
                    <tr key={`${entry.date}-${index}`}><td>{entry.date}</td><td className="table-price">{entry.price}</td><td>{entry.change}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            ) : (
              <div className="history-empty">
                <div className="history-spark" aria-hidden="true">⌁</div>
                <strong>ঐতিহাসিক দামের তথ্য এখনো নেই</strong>
                <p>সার্ভার এই পণ্যের জন্য অতীতের দাম প্রকাশ করলে এখানে দেখা যাবে। বর্তমান বাজারদর লাইভ API থেকে এসেছে।</p>
              </div>
            )}
          </section>
          <section className="detail-section product-note">
            <div className="section-heading compact-heading">
              <div><span className="eyebrow">পণ্য সম্পর্কে</span><h2>মার্কেট নোট</h2></div>
            </div>
            <p>{product.description || "এই পণ্যের জন্য কোনো বিবরণ দেওয়া হয়নি।"}</p>
            <div className="buyer-tip"><span aria-hidden="true">✦</span><p>কেনার আগে দোকানের সঙ্গে বর্তমান স্টক, ওয়ারেন্টি ও চূড়ান্ত মূল্য নিশ্চিত করুন।</p></div>
          </section>
        </div>
        <Link className="back-catalog" href={`/category/${product.categorySlug}`}>← {product.category} ক্যাটাগরিতে ফিরে যান</Link>
      </div>
    </>
  );
}
