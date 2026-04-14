import type { Metadata } from "next";
import { Poppins, Righteous } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/cookie-banner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-poppins",
});

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-righteous",
});

export const metadata: Metadata = {
  title: "Food Theatre",
  description:
    "A curated stage for food, culture, immersive dining, and the stories that shape hospitality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${righteous.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
