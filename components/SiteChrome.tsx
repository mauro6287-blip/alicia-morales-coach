"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import CartDrawer from "./cart/CartDrawer";

const CHROMELESS_PREFIXES = ["/admin", "/verificar"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChromeless = CHROMELESS_PREFIXES.some((p) => pathname?.startsWith(p));

  if (isChromeless) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </>
  );
}
