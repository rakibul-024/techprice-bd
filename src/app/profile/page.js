import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "../../components/AuthForms";
import { auth } from "../../lib/auth";

export const metadata = { title: "আমার প্রোফাইল | TechPrice BD" };

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?callbackUrl=%2Fprofile");

  const user = session.user;
  const initials = user.name
    ? user.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase()
    : "TP";

  return (
    <section className="profile-page shell">
      <div className="profile-card">
        <span className="eyebrow">আপনার অ্যাকাউন্ট</span>
        <h1>আমার প্রোফাইল</h1>
        <div className="profile-user">
          <span className="profile-avatar">
            {user.image ? (
              <Image alt="" height={76} src={user.image} unoptimized width={76} />
            ) : initials}
          </span>
          <div><h2>{user.name}</h2><p>{user.email}</p></div>
        </div>
        <dl className="profile-facts">
          <div><dt>নাম</dt><dd>{user.name || "সেট করা হয়নি"}</dd></div>
          <div><dt>ইমেইল</dt><dd>{user.email}</dd></div>
          <div><dt>যোগদানের তারিখ</dt><dd>{new Date(user.createdAt).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}</dd></div>
        </dl>
        <div className="profile-actions">
          <Link className="button button-primary" href="/profile/update">প্রোফাইল আপডেট</Link>
          <SignOutButton />
        </div>
      </div>
    </section>
  );
}
