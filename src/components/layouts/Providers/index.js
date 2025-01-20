"use client";
import moment from "moment";
import "moment/locale/ar-kw";

// Providers
import dynamic from "next/dynamic";
const DateProvider = dynamic(() => import("./DateProvider"), { ssr: false });
import ChakraProvider from "./ChakraProvider";
import MuiProvider from "./MuiProvider";

//  notifications
import { ToastContainer } from "react-toastify";

export default function Providers({ children }) {
  moment.locale("ar_KW");

  return (
    <ChakraProvider>
      <DateProvider suppressHydrationWarning>
        <MuiProvider>
          {children}
          <ToastContainer position="bottom-center" />
        </MuiProvider>
      </DateProvider>
    </ChakraProvider>
  );
}
