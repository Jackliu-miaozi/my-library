import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "../context/ThemeContext";
import { SessionProvider } from "next-auth/react";
import { Web3Provider } from "../context/Web3ContextNoWC";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <TRPCReactProvider>
        <SessionProvider>
          <Web3Provider>
            {children}
          </Web3Provider>
        </SessionProvider>
      </TRPCReactProvider>
    </ThemeProvider>
  );
}
