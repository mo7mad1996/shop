import Link from "next/link";


// icons
import { MdLogin } from "react-icons/md";


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {/* btn */}
          <Link className="btn-rounded" href="/login">
            <MdLogin />
            تسجيل الدخول →
          </Link>
        </div>
      </main>
    </div>
  );
}
