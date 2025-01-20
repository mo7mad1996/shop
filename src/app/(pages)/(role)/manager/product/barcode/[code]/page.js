"use client";
import Barcode from "react-barcode";

export default async function Page({ params }) {
  const { code } = await params;

  return (
    <div className="m-auto w-fit px-5">
      <Barcode value={code} />
      <div designmode="on" className="p-6"></div>
    </div>
  );
}
