import "./globals.css";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COMPANY } from "@/data/site";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata = {
  title: {
    default: `${COMPANY.brand} — ${COMPANY.legalName}`,
    template: `%s | ${COMPANY.brand}`
  },
  description: `${COMPANY.legalName} (${COMPANY.brand}) — ${COMPANY.tagline}`,
  icons: {
    icon: "/logo-cks.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <div className="site-shell">
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
