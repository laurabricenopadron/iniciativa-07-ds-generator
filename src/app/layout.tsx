import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Poppins, DM_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Design Gen — Generador de Sistemas de Diseño con IA",
  description: "Genera automáticamente un sistema de diseño completo a partir de tu marca con reglas de accesibilidad WCAG AA y exportable a Figma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} ${poppins.variable} ${dmSans.variable} font-sans text-[#1E1E1E] antialiased h-full`}
      >
        {children}
      </body>
    </html>
  );
}

