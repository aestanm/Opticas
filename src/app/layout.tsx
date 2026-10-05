import "./globals.css";
import type { Metadata } from "next";
import { QueryProvider } from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "Óptica Guillén | Salud visual en Cali",
  description:
    "Tecnología avanzada en salud visual, asesoría personalizada para cada mirada y lentes con diseño y precisión en Cali.",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
