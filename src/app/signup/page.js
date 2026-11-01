import Link from "next/link";
import { SignUpForm } from "../../components/AuthForms";

export const metadata = { title: "নিবন্ধন | TechPrice BD" };

export default function SignUpPage() {
  return (
    <section className="auth-page shell">
      <div className="auth-card">
        <Link className="auth-brand" href="/">টেকপ্রাইস <em>বিডি</em></Link>
        <span className="eyebrow">TechPrice BD-তে যোগ দিন</span>
        <h1>নতুন অ্যাকাউন্ট তৈরি করুন</h1>
        <p className="auth-intro">বাজারদর তুলনা ও স্মার্ট কেনাকাটার জন্য বিনামূল্যে নিবন্ধন করুন।</p>
        <SignUpForm
          googleConfigured={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}
          githubConfigured={Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)}
        />
      </div>
    </section>
  );
}
