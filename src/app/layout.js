import "./globals.scss";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

import Providers from "@/components/layouts/Providers";
import UserContextProvider from "@/components/layouts/Providers/UserContextProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="rtl" suppressHydrationWarning>
      <body className={`antialiased Alexandria-font`}>
        <UserContextProvider>
          <Providers>{children}</Providers>
        </UserContextProvider>
      </body>
    </html>
  );
}
