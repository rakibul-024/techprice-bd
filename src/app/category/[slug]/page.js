import Link from "next/link";
import { notFound } from "next/navigation";
import ProductExplorer from "../../../components/ProductExplorer";
import { getCategories, getProducts } from "../../../lib/api";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  return {
    title: category ? `${category.name} এর বাজার দর | TechPrice BD` : "ক্যাটাগরি পাওয়া যায়নি",
    description: category?.description || "ঢাকার প্রযুক্তি পণ্যের সর্বশেষ বাজার দর",
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(slug),
  ]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) notFound();

  return (
    <>
      <section className="category-hero">
        <div className="shell">
          <div className="breadcrumbs">
            <Link href="/">হোম</Link><span>/</span><span>{category.name}</span>
          </div>
          <div className="category-title-row">
            <span className="category-hero-icon" aria-hidden="true">{category.emoji}</span>
            <div>
              <span className="eyebrow">ক্যাটাগরি বাজার দর</span>
              <h1>{category.name}</h1>
              <p>{category.description}</p>
            </div>
          </div>
          <div className="category-summary">
            <span><strong>{products.length.toLocaleString("bn-BD")}</strong>টি পণ্য</span>
            <span><i /> লাইভ বাজার ডেটা</span>
          </div>
        </div>
      </section>

      <section className="section shell catalog-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{category.emoji} {category.name}</span>
            <h2>সর্বশেষ পণ্যের তালিকা</h2>
            <p>দাম অনুসারে সাজান, অথবা নাম দিয়ে নির্দিষ্ট পণ্য খুঁজুন।</p>
          </div>
          <Link className="button button-outline" href="/">← সব পণ্য</Link>
        </div>
        <ProductExplorer
          categories={categories}
          initialCategory={slug}
          products={products}
        />
      </section>
    </>
  );
}
