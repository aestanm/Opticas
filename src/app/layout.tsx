import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ópticas - Sistema de Gestión",
  description: "Sistema de gestión para clínicas oftalmológicas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
