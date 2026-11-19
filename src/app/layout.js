import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Ticker from "../components/Ticker";
import { auth } from "../lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "টেকপ্রাইস বিডি — প্রযুক্তি পণ্যের লাইভ বাজার দর",
    template: "%s | TechPrice BD",
  },
  description:
    "ঢাকার প্রযুক্তি বাজারের কম্পিউটার, গ্যাজেট ও স্মার্টফোনের সর্বশেষ দাম তুলনা করুন।",
};

export default async function RootLayout({ children }) {
  let currentUser = null;
  let sessionKnown = false;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    currentUser = session?.user ?? null;
    sessionKnown = true;
  } catch {
    // সেশন যাচাই ব্যর্থ হলে ক্লায়েন্ট সেশন দিয়ে হেডার দেখানো হবে
  }

  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteHeader currentUser={currentUser} sessionKnown={sessionKnown} />
        <Ticker />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
