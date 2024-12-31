import Header from "@/components/layouts/role/Header";
import { Container } from "@chakra-ui/react";

export default function RoleLayout({ children }) {
  return (
    <>
      <Header />
      <Container>{children}</Container>
    </>
  );
}
