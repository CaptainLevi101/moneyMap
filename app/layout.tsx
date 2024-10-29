import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";



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
  description: "Bubdget App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en"
      className="dark"
      style={{
        colorScheme:"dark"
      }}
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased w-full pl-4 pr-4`}
        >
         <Toaster richColors position="bottom-left"/>
          <RootProviders>
          {children}
          </RootProviders>
          
        </body>
      </html>
    </ClerkProvider>

  );
}
