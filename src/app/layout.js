import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Ticker from "../components/Ticker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "টেকপ্রাইস বিডি — প্রযুক্তি পণ্যের লাইভ বাজার দর",
    template: "%s | TechPrice BD",
  },
  description:
    "ঢাকার প্রযুক্তি বাজারের কম্পিউটার, গ্যাজেট ও স্মার্টফোনের সর্বশেষ দাম তুলনা করুন।",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteHeader />
        <Ticker />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
