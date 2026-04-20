import type { Metadata, Viewport } from "next";
import { Montserrat, Roboto } from "next/font/google";
import { Header, Footer, WhatsAppButton, CartDrawer } from "@/components";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://aliciamoralescoach.com";

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
    siteName: "Escuela de Competencias Aplicadas",
    title: "Escuela de Competencias Aplicadas | Alicia Morales",
    description:
      "Acompañamos a organizaciones para el desarrollo del talento que impulsa resultados. Coaching y competencias transversales.",
    images: [
      {
        url: "https://aliciamoralescoach.com/og-image-v2.jpg",
        width: 1200,
        height: 630,
        alt: "Escuela de Competencias Aplicadas - Alicia Morales",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Escuela de Competencias Aplicadas | Alicia Morales",
    description:
      "Acompañamos a organizaciones para el desarrollo del talento que impulsa resultados.",
    images: ["https://aliciamoralescoach.com/og-image-v2.jpg"],
  },
  verification: {
    // Placeholder for Google Search Console
    // google: "your-google-verification-code",
  },
  category: "Coaching",
  icons: {
    icon: "/Favicon_AliciaMoralesCoach.svg",
    shortcut: "/Favicon_AliciaMoralesCoach.svg",
    apple: "/Favicon_AliciaMoralesCoach.svg",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/Favicon_AliciaMoralesCoach.svg",
    },
  },
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
    <html lang="es" className="dark" style={{ colorScheme: 'dark' }}>
      <body
        className={`${roboto.variable} ${montserrat.variable} antialiased overflow-x-hidden`}
        style={{ backgroundColor: '#1A1A1A', color: '#FAFAFA' }}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <CartDrawer />
      </body>
    </html>
  );
}
