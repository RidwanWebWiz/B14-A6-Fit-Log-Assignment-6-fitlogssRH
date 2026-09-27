import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FitLog",
  description: "Gym Companion & Workout Library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-[#0b0c0e] text-white min-h-screen flex flex-col font-sans antialiased">
        <WorkoutProvider>
          <Navbar />
          <main className="grow max-w-6xl mx-auto w-full p-8">
            {children}
          </main>
          <Footer />
          <Toaster theme="dark" position="bottom-right" />
        </WorkoutProvider>
      </body>
    </html>
  );
}