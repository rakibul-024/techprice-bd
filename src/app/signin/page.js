import Link from "next/link";
import { SignInForm } from "../../components/AuthForms";

export const metadata = { title: "লগইন | TechPrice BD" };

export default function SignInPage() {
  return (
    <section className="auth-page shell">
      <div className="auth-card">
        <Link className="auth-brand" href="/">টেকপ্রাইস <em>বিডি</em></Link>
        <span className="eyebrow">আপনার অ্যাকাউন্টে প্রবেশ করুন</span>
        <h1>স্বাগতম</h1>
        <p className="auth-intro">আপনার পছন্দের পণ্য ও বাজারদরের আপডেট এক জায়গায় রাখুন।</p>
        <SignInForm
          googleConfigured={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}
          githubConfigured={Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)}
        />
      </div>
    </section>
  );
}
