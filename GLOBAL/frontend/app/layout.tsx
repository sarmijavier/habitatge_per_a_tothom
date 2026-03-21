import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";

import "./globals.css";

const headingFont = Newsreader({
  subsets: ["latin"],
  variable: "--font-heading",
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "GLOBAL Local Prototype",
  description: "Prototipo local de GLOBAL para análisis de vivienda, leyes y comparativas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
