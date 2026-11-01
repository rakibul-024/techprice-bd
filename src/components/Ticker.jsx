import Link from "next/link";
import { getTickerItems } from "../lib/api";

export default async function Ticker() {
  let items = [];
  let feedError = "";

  try {
    items = await getTickerItems();
  } catch (error) {
    feedError = error.message;
  }

  return (
    <div className={`ticker ${feedError ? "ticker-error" : ""}`}>
      <div className="ticker-label"><i /> লাইভ রেট</div>
      {feedError ? (
        <p className="ticker-message" title={feedError}>
          লাইভ বাজার ফিড এই মুহূর্তে পাওয়া যাচ্ছে না
        </p>
      ) : items.length ? (
        <div className="ticker-window">
          <div className="ticker-track">
            {[...items, ...items].map((item, index) => (
              <Link
                href={`/product/${item.slug}`}
                className="ticker-item"
                key={`${item.id}-${index}`}
              >
                {item.text}
                <span className={item.changeType === "down" ? "down" : "up"}>
                  {item.changeType === "down" ? "▼" : "▲"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="ticker-message">আজকের জন্য কোনো লাইভ রেট নেই</p>
      )}
    </div>
  );
}
