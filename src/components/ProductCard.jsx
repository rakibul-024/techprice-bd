import Link from "next/link";

export default function ProductCard({ product }) {
  const isDown = product.changeType === "down";
  const isFlat = product.changeType === "flat";

  return (
    <article className="product-card">
      <Link
        className="product-card-link"
        href={`/product/${product.slug}`}
        aria-label={`${product.name} এর বিস্তারিত দেখুন`}
      >
        <div className="product-art">
          <span className="product-emoji" aria-hidden="true">{product.emoji || "⌘"}</span>
          <span className="category-tag">{product.category}</span>
        </div>
        <div className="product-card-body">
          <h3>{product.name}</h3>
          {product.englishName ? <p className="product-english">{product.englishName}</p> : null}
          <div className="product-price-row">
            <strong>{product.todayPriceBn || `${product.todayPrice} টাকা`}</strong>
            <span className={`change-pill ${isDown ? "down" : isFlat ? "flat" : "up"}`}>
              {product.change || "—"}
            </span>
          </div>
          <div className="product-card-meta">
            <span>প্রতি {product.unit || "পিস"}</span>
            {product.minPriceBn ? <span>সর্বনিম্ন {product.minPriceBn}</span> : null}
          </div>
        </div>
      </Link>
      <Link className="product-details-link" href={`/product/${product.slug}`}>
        বিস্তারিত দেখুন <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
