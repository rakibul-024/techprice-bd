import Link from "next/link";
import ProductExplorer from "../components/ProductExplorer";
import { getCategories, getFallers, getProducts, getRisers } from "../lib/api";
import { categories as categoryFallback } from "../lib/categories";

function MoverColumn({ title, icon, products, direction }) {
  return (
    <section className={`mover-panel mover-${direction}`}>
      <div className="mover-heading">
        <div>
          <span className="eyebrow">{icon} আজকের মার্কেট</span>
          <h3>{title}</h3>
        </div>
        <span className="mover-count">{products.length}টি পণ্য</span>
      </div>
      <div className="mover-list">
        {products.map((product) => (
          <Link className="mover-row" href={`/product/${product.slug}`} key={product.id}>
            <span className="mover-emoji" aria-hidden="true">{product.emoji || "⌘"}</span>
            <span className="mover-name">
              <strong>{product.name}</strong>
              <small>{product.category} · {product.unit || "প্রতি পিস"}</small>
            </span>
            <span className="mover-price">
              <strong>{product.todayPriceBn}</strong>
              <small>{product.change}</small>
            </span>
          </Link>
        ))}
      </div>
      {!products.length ? <p className="inline-empty">এই মুহূর্তে কোনো পরিবর্তনের তথ্য নেই।</p> : null}
    </section>
  );
}

function Hero({ categories, products, risers }) {
  const featured = risers[0] || products[0];
  const productCount = products.length.toLocaleString("bn-BD");
  const categoryLinks = categories.slice(0, 5);

  return (
    <section className="hero-section">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="pulse-dot" /> টেকপ্রাইস বিডি · লাইভ মার্কেট ইনডেক্স ২০২৬</div>
          <h1>লেটেস্ট কম্পিউটার ও গ্যাজেটের <span>যাচাইকৃত বাজার দর</span></h1>
          <p>
            স্টার টেক, রায়ান্স, আইডিবি ও মাল্টিপ্ল্যান সেন্টারের সর্বশেষ প্রসেসর,
            গ্রাফিক্স কার্ড, র‍্যাম, এসএসডি ও স্মার্টফোনের আসল বাজার দর এক নজরে তুলনা করুন।
          </p>
          <div className="hero-category-block">
            <span className="eyebrow">জনপ্রিয় ক্যাটাগরি</span>
            <div className="hero-category-pills">
              {categoryLinks.map((category) => (
                <Link
                  className="hero-category-pill"
                  href={`/category/${category.slug}`}
                  key={category.slug}
                >
                  {category.emoji} {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hero-actions">
            <Link className="button button-primary" href="#market-movers">📊 আজকের মার্কেট মুভার্স দেখুন ↓</Link>
            <Link className="button button-outline" href="#all-products">🛒 সব পণ্যের ক্যাটালগ</Link>
          </div>
          <div className="hero-trust"><span>✓</span> লাইভ ডেটা <span>✓</span> দোকানভিত্তিক তুলনা <span>✓</span> নিয়মিত আপডেট</div>
        </div>
        <div className="market-preview">
          <div className="preview-top">
            <div className="preview-icon">ϟ</div>
            <div>
              <h2>আজকের মার্কেট অ্যানালিটিক্স</h2>
              <p>ঢাকা টেক হাব লাইভ রেট</p>
            </div>
            <span className="live-pill">লাইভ ইনডেক্স</span>
          </div>
          <div className="preview-price">
            <span>আজকের হাইলাইট</span>
            <strong>{featured?.todayPriceBn || "লাইভ রেট দেখুন"}</strong>
            <small>{featured?.name || "বাজারের সর্বশেষ আপডেট"}</small>
          </div>
          <div className="preview-chart" aria-label="বাজারের গতিবিধির ভিজ্যুয়াল">
            {[34, 48, 41, 58, 52, 72, 63, 81, 69, 92, 77, 100, 84, 108, 92, 121].map((height, index) => (
              <span key={index} style={{ height: `${height}px` }} />
            ))}
          </div>
          <div className="preview-stats">
            <div><span>ক্যাটালগে পণ্য</span><strong>{productCount}+</strong></div>
            <div><span>দাম বেড়েছে</span><strong className="text-up">{risers.length}টি</strong></div>
            <div><span>দাম কমেছে</span><strong className="text-down">লাইভ</strong></div>
          </div>
          <div className="preview-foot"><span className="pulse-dot" /> রিয়েল-টাইম বাজার ডেটা <span>আজ আপডেট হয়েছে</span></div>
        </div>
      </div>
    </section>
  );
}

function MarketPulse({ productCount, categoryCount, riserCount, fallerCount }) {
  const cards = [
    { icon: "↗", label: "দাম বাড়ছে", value: `${riserCount}টি পণ্য`, tone: "pulse-up" },
    { icon: "↘", label: "দাম কমছে", value: `${fallerCount}টি পণ্য`, tone: "pulse-down" },
    { icon: "▦", label: "লাইভ ক্যাটালগ", value: `${productCount.toLocaleString("bn-BD")}টি পণ্য`, tone: "pulse-purple" },
    { icon: "✓", label: "ক্যাটাগরি", value: `${categoryCount.toLocaleString("bn-BD")}টি বিভাগ`, tone: "pulse-blue" },
  ];

  return (
    <section className="shell pulse-strip" aria-label="বাজারের সংক্ষিপ্ত পরিসংখ্যান">
      {cards.map((card) => (
        <div className="pulse-card" key={card.label}>
          <span className={`pulse-card-icon ${card.tone}`}>{card.icon}</span>
          <span><small>{card.label}</small><strong>{card.value}</strong></span>
          <span className="pulse-arrow" aria-hidden="true">→</span>
        </div>
      ))}
    </section>
  );
}

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q : "";
  const [categories, products, risers, fallers] = await Promise.all([
    getCategories(),
    getProducts(),
    getRisers(),
    getFallers(),
  ]);
  const availableCategories = categories.length ? categories : categoryFallback;
  const topProducts = [...products].sort((a, b) => a.todayPrice - b.todayPrice);

  return (
    <>
      <Hero categories={availableCategories} products={products} risers={risers} />
      <MarketPulse
        categoryCount={categories.length}
        fallerCount={fallers.length}
        productCount={products.length}
        riserCount={risers.length}
      />

      <section className="section shell" id="market-movers">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ঢাকার টেক মার্কেট · আজ</span>
            <h2>আজকের মার্কেট মুভার্স</h2>
            <p>কোন পণ্যের দাম বাড়ছে, আর কোনটির দাম কমছে—এক নজরে তুলনা করুন।</p>
          </div>
          <span className="live-indicator"><i /> লাইভ আপডেট</span>
        </div>
        <div className="movers-grid">
          <MoverColumn direction="up" icon="↗" products={risers} title="আজ দাম বেড়েছে" />
          <MoverColumn direction="down" icon="↘" products={fallers} title="আজ দাম কমেছে" />
        </div>
      </section>

      <section className="shell insight-banner">
        <div className="insight-icon">✦</div>
        <div>
          <span className="eyebrow">স্মার্ট বায়ার ইনসাইট</span>
          <h2>দাম তুলনা করে কিনুন, সাশ্রয় করুন</h2>
          <p>দোকানভিত্তিক সর্বনিম্ন, সর্বোচ্চ ও গড় দাম দেখে আপনার বাজেটের সেরা পণ্যটি বেছে নিন।</p>
        </div>
        <Link className="button button-dark" href="#all-products">ক্যাটালগ দেখুন <span aria-hidden="true">→</span></Link>
      </section>

      <section className="section shell catalog-section" id="all-products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">আপনার পছন্দের প্রযুক্তি পণ্য</span>
            <h2>সব পণ্যের ক্যাটালগ</h2>
            <p>ক্যাটাগরি, দাম বা নাম দিয়ে ফিল্টার করে পছন্দের পণ্য খুঁজুন।</p>
          </div>
          <span className="catalog-live"><i /> {products.length.toLocaleString("bn-BD")}টি পণ্য</span>
        </div>
        <ProductExplorer
          categories={availableCategories}
          initialQuery={query}
          products={products}
        />
      </section>
    </>
  );
}
