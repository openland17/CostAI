import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "@/lib/store";
import Sidebar from "@/components/layout/Sidebar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CostAI — Construction Cost Estimating",
  description:
    "AI-powered construction cost scheduling and estimating for Australian property developers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${dmMono.variable} font-sans antialiased`}
      >
        <ProjectProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="ml-[260px] flex-1 overflow-x-hidden">
              <div className="mx-auto max-w-[1400px] px-8 py-8">
                {children}
              </div>
            </main>
          </div>
        </ProjectProvider>
      </body>
    </html>
  );
}
