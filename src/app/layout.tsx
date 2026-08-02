import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const title = "Mycem Cement — Strong for every season. Responsible for the next.";
const description =
  "Mycem is the Indian cement brand of Heidelberg Materials. A hundred and fifty years of material science, two decades building India.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
  // Concept build, not for public indexing.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#004E2B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        {/* First hero frame only — the other three lazy-load, or they
            compete for bandwidth at first paint. */}
        <link
          rel="preload"
          as="image"
          href="/hero/summer-2560.avif"
          type="image/avif"
          imageSrcSet="/hero/summer-1080.avif 1080w, /hero/summer-1600.avif 1600w, /hero/summer-2560.avif 2560w, /hero/summer-3840.avif 3840w"
          imageSizes="100vw"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink-deep">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
