import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "./shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Listable",
  description: "Listable is a versatile and easy-to-use list system built with Next.js and NextAuth",
};


export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}