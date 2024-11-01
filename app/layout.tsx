import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MoneyMap",
  description: "Budget App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <Head>
        <title>{metadata.title as string}</title>
      </Head>
      <ClerkProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased w-full pl-4 pr-4`}
        >
          <Toaster richColors position="bottom-left" />
          <RootProviders>{children}</RootProviders>
        </body>
      </ClerkProvider>
    </html>
  );
}
