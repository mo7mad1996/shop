// components
import PageHeader from "~/components/layouts/role/PageHeader";
import Link from "next/link";

// icons
import { RiBillLine } from "react-icons/ri";
import { TbLayoutGridAdd } from "react-icons/tb";

export default function PurchasesPage() {
  return (
    <div>
      <PageHeader title="المشتريات" icon={<RiBillLine />}>
        <Link href="/manager/purchases/add" className="btn">
          <TbLayoutGridAdd />
          <span>إضافة فاتورة</span>
        </Link>
      </PageHeader>
    </div>
  );
}
