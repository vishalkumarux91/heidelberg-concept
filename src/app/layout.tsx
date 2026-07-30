import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
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
  themeColor: "#f2efe8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      data-annotations="off"
      className={`${archivo.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
