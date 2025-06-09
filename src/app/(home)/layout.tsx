"use client"

import "@/styles/globals.css";

import Footer from "../_components/home/Footer";
import ThemeToggle from "../_components/ThemeToggle";
import Navbar from "../_components/home/Navbar";


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="z-[9999]">
        <Navbar />
      </div>
      <div className="z-[10]">{children}</div>
      <div className="mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
        <ThemeToggle />
      </div>
      <Footer />
    </>
  );
}
