"use client";

import { useEffect, useState } from "react";
import { Provider } from "@/components/ui/provider";
import { ThemeProvider } from "next-themes";
// import { system } from "@/lib/theme";

import Loader from "@/components/Loader";

export default function ChakraProvider({ children }) {
  const [loaded, setLoad] = useState(false);

  useEffect(() => setLoad(true), []);

  if (!loaded)
    return (
      <div className="h-screen flex-center">
        <Loader />
      </div>
    );
  return (
    <Provider>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </Provider>
  );
}
