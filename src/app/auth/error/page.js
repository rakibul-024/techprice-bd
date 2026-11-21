import Link from "next/link";

const errorMessages = {
  account_not_linked: {
    title: "এই ইমেইলে আগে থেকেই অ্যাকাউন্ট আছে",
    description:
      "নিরাপত্তার জন্য নতুন Google/GitHub পরিচয় নিজে থেকে পুরোনো অ্যাকাউন্টে জোড়া হয়নি। আগের লগইন পদ্ধতিতে প্রবেশ করে প্রোফাইল থেকে সোশ্যাল অ্যাকাউন্টটি সংযুক্ত করুন।",
  },
  unable_to_link_account: {
    title: "সোশ্যাল অ্যাকাউন্ট সংযুক্ত করা যায়নি",
    description:
      "Google/GitHub অ্যাকাউন্টটি অন্য TechPrice BD অ্যাকাউন্টে সংযুক্ত থাকতে পারে। আগের লগইন পদ্ধতিতে প্রবেশ করে প্রোফাইল থেকে আবার সংযুক্ত করুন; provider-এর ইমেইলও বর্তমান অ্যাকাউন্টের ইমেইলের সঙ্গে মিলতে হবে।",
  },
  invalid_code: {
    title: "লগইন কোডটি আর বৈধ নেই",
    description:
      "নতুন করে লগইন শুরু করুন এবং provider-এর অনুমতি দেওয়ার পর একই browser tab-এ ফিরে আসা সম্পন্ন করুন।",
  },
  state_mismatch: {
    title: "লগইন অনুরোধ মেলেনি",
    description:
      "পুরোনো OAuth tab বন্ধ করে আবার লগইন শুরু করুন। একই browser session ব্যবহার করুন।",
  },
  state_not_found: {
    title: "লগইন সেশন পাওয়া যায়নি",
    description:
      "OAuth flow-এর মাঝখানে browser session হারিয়ে গেছে। আবার লগইন শুরু করুন।",
  },
};

export const metadata = { title: "লগইন সমস্যা | TechPrice BD" };

export default async function AuthErrorPage({ searchParams }) {
  const params = await searchParams;
  const code = typeof params?.error === "string" ? params.error : "";
  const error = errorMessages[code] || {
    title: "লগইন সম্পন্ন করা যায়নি",
    description:
      "OAuth app-এর client ID, matching client secret, callback URL এবং BETTER_AUTH_URL মিলিয়ে দেখুন।",
  };

  return (
    <section className="status-page shell">
      <span className="status-code">!</span>
      <h1>{error.title}</h1>
      <p>{error.description}</p>
      {code ? <code className="auth-error-code">{code}</code> : null}
      <div className="status-actions">
        <Link className="button button-primary" href="/signin">আবার লগইন করুন</Link>
        <Link className="button button-outline" href="/">হোমপেজে যান</Link>
      </div>
    </section>
  );
}
