import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Header, Footer } from "@/components";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://aliciamorales.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alicia Morales | Coach Profesional - Desarrollo Personal",
    template: "%s | Alicia Morales Coach",
  },
  description:
    "Coach profesional certificada ICF. Te acompaño a transformar tu vida con claridad, propósito y acción. Sesiones individuales y programas de desarrollo personal.",
  keywords: [
    "coach profesional",
    "coaching de vida",
    "desarrollo personal",
    "coaching Chile",
    "coaching Santiago",
    "coach certificada ICF",
    "transformación personal",
    "bienestar",
    "coaching ontológico",
    "coaching ejecutivo",
  ],
  authors: [{ name: "Alicia Morales", url: siteUrl }],
  creator: "Alicia Morales",
  publisher: "Alicia Morales",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: siteUrl,
    siteName: "Alicia Morales Coach",
    title: "Alicia Morales | Coach Profesional",
    description:
      "Transforma tu vida con acompañamiento experto. Coach certificada ICF con +100 clientes satisfechos.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Alicia Morales - Coach Profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alicia Morales | Coach Profesional",
    description:
      "Transforma tu vida con acompañamiento experto. Coach certificada ICF.",
    images: ["/og-image.jpg"],
  },
  verification: {
    // Placeholder for Google Search Console
    // google: "your-google-verification-code",
  },
  category: "Coaching",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFBF9" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1614" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased overflow-x-hidden`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html >
  );
}
