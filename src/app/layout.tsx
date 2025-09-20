import type { Metadata } from "next";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";

import "./globals.css";

export const metadata: Metadata = {
  title: "UniDoc",
  description: "Where healthcare meets convenience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white text-neutral-800">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body className="min-h-screen bg-white text-neutral-800">
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}
