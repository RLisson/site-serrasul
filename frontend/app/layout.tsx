import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Serrasul Telecom | Internet Fibra Óptica e TV",
  description:
    "Navegue na velocidade da luz com os planos de internet 100% fibra óptica da Serrasul Telecom. Consulte cobertura e assine já!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-[#F2F2F2] text-[#212640] antialiased">{children}</body>
    </html>
  );
}
