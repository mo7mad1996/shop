"use client";

// Providers
import dynamic from "next/dynamic";
const DateProvider = dynamic(() => import("./DateProvider"), { ssr: false });
import ChakraProvider from "./ChakraProvider";

//  notifications
import { ToastContainer } from "react-toastify";

export default function Providers({ children }) {
  return (
    <ChakraProvider>
      <DateProvider suppressHydrationWarning>
        {children}
        <ToastContainer />
      </DateProvider>
    </ChakraProvider>
  );
}
