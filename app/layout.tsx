import type { Metadata } from "next";
import { Fraunces, Archivo, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nataliamachado.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Natália Machado — Redatora Publicitária",
    template: "%s · Natália Machado",
  },
  description:
    "Portfólio de Natália Machado, redatora publicitária em Curitiba/PR. Cases premiados (ADVB/PR), contas institucionais de grande porte e um jeito direto de escrever.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Natália Machado — Redatora Publicitária",
    description:
      "Portfólio de Natália Machado, redatora publicitária em Curitiba/PR. Cases premiados e contas institucionais de grande porte.",
    url: siteUrl,
    siteName: "Natália Machado",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Natália Machado — Redatora Publicitária",
    description:
      "Portfólio de Natália Machado, redatora publicitária em Curitiba/PR.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
