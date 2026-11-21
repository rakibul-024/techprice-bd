"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

const REFRESH_INTERVAL = 60_000;

function subscribeToMotionPreference(onChange) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionPreference() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function TickerLive({ initialItems, initialError }) {
  const [items, setItems] = useState(initialItems);
  const [feedError, setFeedError] = useState(initialError);
  const [motionOverride, setMotionOverride] = useState(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getReducedMotionPreference,
    () => false,
  );
  const tickerRunning = motionOverride ?? !prefersReducedMotion;

  useEffect(() => {
    let active = true;

    async function refreshTicker() {
      try {
        const response = await fetch("/api/market/ticker", {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        const result = await response.json();

        if (!response.ok || result.success !== true || !Array.isArray(result.data)) {
          throw new Error(result.message || "লাইভ রেট আপডেট করা যায়নি।");
        }

        if (active) {
          setItems(result.data);
          setFeedError("");
        }
      } catch (error) {
        if (active) {
          setFeedError(
            error instanceof Error ? error.message : "লাইভ রেট আপডেট করা যায়নি।",
          );
        }
      }
    }

    void refreshTicker();
    const intervalId = window.setInterval(refreshTicker, REFRESH_INTERVAL);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={`ticker ${feedError ? "ticker-error" : ""}`}>
      <div className="ticker-label"><i /> লাইভ রেট</div>
      {items.length ? (
        <div
          aria-label="সর্বশেষ লাইভ পণ্যের দাম"
          className="ticker-window"
          title={feedError || "লাইভ পণ্যের দাম"}
        >
          <div className={`ticker-track ${tickerRunning ? "is-running" : ""}`}>
            {[...items, ...items].map((item, index) => (
              <Link
                aria-hidden={index >= items.length}
                className="ticker-item"
                href={`/product/${item.slug}`}
                key={`${item.id}-${index}`}
                tabIndex={index >= items.length ? -1 : undefined}
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
        <p className="ticker-message" title={feedError || undefined}>
          {feedError ? "লাইভ বাজার ফিড এই মুহূর্তে পাওয়া যাচ্ছে না" : "আজকের জন্য কোনো লাইভ রেট নেই"}
        </p>
      )}
      {items.length ? (
        <button
          aria-label={tickerRunning ? "লাইভ টিকার থামান" : "লাইভ টিকার চালু করুন"}
          aria-pressed={tickerRunning}
          className="ticker-control"
          onClick={() => setMotionOverride((running) => !(running ?? tickerRunning))}
          type="button"
        >
          {tickerRunning ? "Ⅱ" : "▶"}
        </button>
      ) : null}
      {feedError && items.length > 0 ? (
        <span className="ticker-stale" role="status">শেষ আপডেট দেখানো হচ্ছে</span>
      ) : null}
    </div>
  );
}
