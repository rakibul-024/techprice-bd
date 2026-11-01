import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileUpdateForm } from "../../../components/AuthForms";
import { auth } from "../../../lib/auth";

export const metadata = { title: "প্রোফাইল আপডেট | TechPrice BD" };

export default async function ProfileUpdatePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?callbackUrl=%2Fprofile%2Fupdate");

  return (
    <section className="auth-page shell">
      <div className="auth-card">
        <Link className="back-catalog" href="/profile">← প্রোফাইলে ফিরে যান</Link>
        <span className="eyebrow">অ্যাকাউন্ট সেটিংস</span>
        <h1>প্রোফাইল আপডেট</h1>
        <p className="auth-intro">আপনার নাম এবং প্রোফাইল ছবির URL পরিবর্তন করুন।</p>
        <ProfileUpdateForm image={session.user.image} name={session.user.name} />
      </div>
    </section>
  );
}
