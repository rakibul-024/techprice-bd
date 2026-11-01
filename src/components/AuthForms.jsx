"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";

function getErrorMessage(error, fallback) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function SocialButtons({ googleConfigured, githubConfigured }) {
  const [error, setError] = useState("");

  async function signIn(provider) {
    setError("");
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/profile",
      });

      if (result.error) {
        setError(result.error.message || "সোশ্যাল লগইন শুরু করা যায়নি।");
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError, "সোশ্যাল লগইন শুরু করা যায়নি।"));
    }
  }

  return (
    <>
      <div className="social-buttons">
        <button
          className="social-button"
          disabled={!googleConfigured}
          onClick={() => signIn("google")}
          type="button"
        >
          <span className="social-google">G</span>
          Google দিয়ে চালিয়ে যান
          {!googleConfigured ? <small>কনফিগার করা হয়নি</small> : null}
        </button>
        <button
          className="social-button"
          disabled={!githubConfigured}
          onClick={() => signIn("github")}
          type="button"
        >
          <span className="social-github">GH</span>
          GitHub দিয়ে চালিয়ে যান
          {!githubConfigured ? <small>কনফিগার করা হয়নি</small> : null}
        </button>
      </div>
      {error ? <p className="form-message form-error" role="alert">{error}</p> : null}
    </>
  );
}

export function SignInForm({ googleConfigured, githubConfigured }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const formData = new FormData(event.currentTarget);
      const result = await authClient.signIn.email({
        email: formData.get("email"),
        password: formData.get("password"),
        callbackURL: "/profile",
      });

      if (result.error) {
        setError(result.error.message || "লগইন করা যায়নি। ইমেইল ও পাসওয়ার্ড যাচাই করুন।");
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "লগইন করা যায়নি। আবার চেষ্টা করুন।"));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>ইমেইল ঠিকানা<input autoComplete="email" name="email" required type="email" /></label>
        <label>পাসওয়ার্ড<input autoComplete="current-password" minLength="8" name="password" required type="password" /></label>
        {error ? <p className="form-message form-error" role="alert">{error}</p> : null}
        <button className="button button-primary auth-submit" disabled={pending} type="submit">
          {pending ? "লগইন হচ্ছে..." : "লগইন করুন"}
        </button>
      </form>
      <div className="auth-divider"><span>অথবা</span></div>
      <SocialButtons googleConfigured={googleConfigured} githubConfigured={githubConfigured} />
      <p className="auth-switch">নতুন এখানে? <Link href="/signup">অ্যাকাউন্ট তৈরি করুন</Link></p>
    </>
  );
}

export function SignUpForm({ googleConfigured, githubConfigured }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const formData = new FormData(event.currentTarget);
      const result = await authClient.signUp.email({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        callbackURL: "/profile",
      });

      if (result.error) {
        setError(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।"));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>আপনার নাম<input autoComplete="name" name="name" required type="text" /></label>
        <label>ইমেইল ঠিকানা<input autoComplete="email" name="email" required type="email" /></label>
        <label>পাসওয়ার্ড<input autoComplete="new-password" minLength="8" name="password" required type="password" /></label>
        {error ? <p className="form-message form-error" role="alert">{error}</p> : null}
        <button className="button button-primary auth-submit" disabled={pending} type="submit">
          {pending ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
        </button>
      </form>
      <div className="auth-divider"><span>অথবা</span></div>
      <SocialButtons googleConfigured={googleConfigured} githubConfigured={githubConfigured} />
      <p className="auth-switch">আগে থেকেই অ্যাকাউন্ট আছে? <Link href="/signin">লগইন করুন</Link></p>
    </>
  );
}

export function ProfileUpdateForm({ name, image }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setPending(true);
    try {
      const formData = new FormData(event.currentTarget);
      const result = await authClient.updateUser({
        name: formData.get("name"),
        image: formData.get("image") || null,
      });

      if (result.error) {
        setError(result.error.message || "প্রোফাইল আপডেট করা যায়নি।");
        return;
      }

      setSuccess("আপনার প্রোফাইল আপডেট হয়েছে।");
      router.refresh();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "প্রোফাইল আপডেট করা যায়নি।"));
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="auth-form profile-update-form" onSubmit={handleSubmit}>
      <label>নাম<input defaultValue={name} name="name" required type="text" /></label>
      <label>প্রোফাইল ছবির URL<input defaultValue={image || ""} name="image" placeholder="https://example.com/photo.jpg" type="url" /></label>
      {error ? <p className="form-message form-error" role="alert">{error}</p> : null}
      {success ? <p className="form-message form-success" role="status">{success}</p> : null}
      <button className="button button-primary auth-submit" disabled={pending} type="submit">
        {pending ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
      </button>
    </form>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSignOut() {
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError(result.error.message || "লগআউট করা যায়নি।");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "লগআউট করা যায়নি।"));
    }
  }

  return (
    <div>
      <button className="button button-outline" onClick={handleSignOut} type="button">লগআউট</button>
      {error ? <p className="form-message form-error" role="alert">{error}</p> : null}
    </div>
  );
}
