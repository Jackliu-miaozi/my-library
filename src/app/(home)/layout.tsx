import "@/styles/globals.css";

import Footer from "../_components/home/Footer";
import ThemeToggle from "../_components/ThemeToggle";
import Navbar from "../_components/home/Navbar";


export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <>
      <div className="z-[9999]">
        <Navbar />
      </div>
      <div className="z-[10]">
        {children}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <ThemeToggle />
      </div>
      <Footer />
    </>
  );
}
