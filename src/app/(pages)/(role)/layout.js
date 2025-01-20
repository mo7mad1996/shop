import Header from "@/components/layouts/role/Header/index.js";
import { Container } from "@chakra-ui/react";

export default function RoleLayout({ children }) {
  return (
    <>
      <Header />
      <Container>{children}</Container>
      <h3 className="text-sm fixed bottom-0 right-0 pointer-events-none text-gray-600 w-screen p-3 text-center">
        <Container>
          تم انتاج هذا البرنامج بواسطة{" "}
          <a
            className="pointer-events-auto"
            href="https://portfolio-mohamed-ibrahim.onrender.com/"
            target="_blank"
          >
            TRUEEMIT
          </a>
        </Container>
      </h3>
    </>
  );
}
