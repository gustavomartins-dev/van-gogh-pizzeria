import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Van-Gogh | Pizzaria & Restaurante em Santos",
  description: "Uma experiência em camadas: pizzas artesanais, vinhos e noites memoráveis no José Menino.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
