import type { Metadata } from "next";
import { Baloo_2, Nunito, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// The public site URL. Defaults to the production domain; override per
// environment with NEXT_PUBLIC_SITE_URL (e.g. http://localhost:3000 in dev).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamcoder.dev";

const title = "dreamcode - learn · solve · dream";
const description =
  "Tiny lessons and glowing problems, served all night. Python, JavaScript, C#, and TypeScript, one neon mile at a time.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "dreamcode",
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "dreamcode",
    url: siteUrl,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${nunito.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem('dc_appearance');if(p!=='light'&&p!=='dark'&&p!=='automatic')p='automatic';var h=new Date().getHours();var t=p==='automatic'?(h>=7&&h<19?'light':'dark'):p;document.documentElement.dataset.appearance=p;document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.appearance='automatic';document.documentElement.dataset.theme='dark'}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
