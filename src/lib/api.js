const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://tech-gadget-dor-server.vercel.app"
).replace(/\/+$/, "");

async function request(path, label) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  } catch (error) {
    throw new Error(`${label} লোড করা যায়নি। API সার্ভারের সংযোগ পরীক্ষা করুন।`, {
      cause: error,
    });
  }

  if (!response.ok) {
    if (response.status === 404 && path.startsWith("/product/")) return null;
    throw new Error(`${label} লোড করা যায়নি (HTTP ${response.status})।`);
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    throw new Error(`${label} API থেকে সঠিক JSON পাওয়া যায়নি।`, {
      cause: error,
    });
  }

  if (result?.success !== true) {
    throw new Error(`${label} API অনুরোধটি সফল হয়নি।`);
  }

  return result.data;
}

async function requestList(path, label) {
  const data = await request(path, label);
  if (!Array.isArray(data)) {
    throw new Error(`${label} API একটি তালিকা ফেরত দেয়নি।`);
  }
  return data;
}

export function getCategories() {
  return requestList("/categories", "ক্যাটাগরি");
}

export function getProducts(categorySlug) {
  const query = categorySlug
    ? `?category=${encodeURIComponent(categorySlug)}`
    : "";
  return requestList(`/products${query}`, "পণ্যের তালিকা");
}

export function getRisers() {
  return requestList("/risers", "দাম বেড়েছে এমন পণ্যের তালিকা");
}

export function getFallers() {
  return requestList("/fallers", "দাম কমেছে এমন পণ্যের তালিকা");
}

export function getTickerItems() {
  return requestList("/ticker", "লাইভ বাজার টিকার");
}

export function getProduct(slug) {
  return request(`/product/${encodeURIComponent(slug)}`, "পণ্যের বিবরণ");
}
