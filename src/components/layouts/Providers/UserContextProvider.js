import { UserContextProvider } from "~/context/user";
import { headers } from "next/headers";

export default function Provider({ children }) {
  const headersList = headers();
  const user = JSON.parse(decodeURIComponent(headersList.get("user"))) || null;
  const shop = JSON.parse(decodeURIComponent(headersList.get("shop"))) || null;

  return (
    <UserContextProvider initialContextValue={{ user, shop }}>
      {children}
    </UserContextProvider>
  );
}
