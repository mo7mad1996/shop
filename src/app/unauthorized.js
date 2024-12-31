import { redirect } from "next/navigation";

export default function Unauthorized() {
  redirect("/login");
  return (
    <main>
      <h1>يرجى تسجيل الدخول</h1>
    </main>
  );
}
