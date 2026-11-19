"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";

function getInitials(name) {
  if (!name) return "TP";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase();
}

export default function UserMenu({ initialUser = null, sessionKnown = false }) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [fallbackUser, setFallbackUser] = useState(initialUser);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const user = data ? data.user : fallbackUser;

  if (isPending && !user && !sessionKnown) {
    return <span aria-hidden="true" className="user-menu-pending" />;
  }

  if (!user) {
    return (
      <div className="header-actions">
        <Link className="text-link" href="/signin">লগইন</Link>
        <Link className="button button-primary button-small" href="/signup">নিবন্ধন</Link>
      </div>
    );
  }

  async function handleSignOut() {
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError(result.error.message || "লগআউট করা যায়নি।");
        return;
      }
      setFallbackUser(null);
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      setError("লগআউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  return (
    <div className="user-menu" ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="user-trigger"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="user-avatar">
          {user.image ? (
            <Image alt="" height={34} src={user.image} unoptimized width={34} />
          ) : (
            getInitials(user.name)
          )}
        </span>
        <span className="user-trigger-text">
          <strong>{user.name || "আমার অ্যাকাউন্ট"}</strong>
          <small>প্রোফাইল দেখুন</small>
        </span>
        <span aria-hidden="true" className="user-caret">▾</span>
      </button>

      {open ? (
        <div className="user-panel" role="menu">
          <div className="user-panel-head">
            <strong>{user.name || "ব্যবহারকারী"}</strong>
            <span>{user.email}</span>
          </div>
          <Link href="/profile" onClick={() => setOpen(false)} role="menuitem">
            👤 আমার প্রোফাইল
          </Link>
          <Link href="/profile/update" onClick={() => setOpen(false)} role="menuitem">
            ✎ প্রোফাইল আপডেট
          </Link>
          <button onClick={handleSignOut} role="menuitem" type="button">
            ⏻ লগআউট
          </button>
          {error ? (
            <p className="form-message form-error" role="alert">{error}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
