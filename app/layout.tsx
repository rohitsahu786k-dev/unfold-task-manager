import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UnfoldCRO - Task & Project Management",
  description: "Modern SaaS admin dashboard for task, project, and meeting management",
  icons: {
    icon: "/assets/unfold-favicon.png",
    shortcut: "/assets/unfold-favicon.png",
    apple: "/assets/unfold-favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} antialiased bg-white text-gray-900`}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
