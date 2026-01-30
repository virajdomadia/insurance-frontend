import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Unified Social Insurance Platform",
  description: "Insurance management for Citizens and NGOs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
