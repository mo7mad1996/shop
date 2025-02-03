"use client";
import { useState, useEffect, useRef } from "react";
import moment from "moment";

// components
import PageHeader from "~/components/layouts/role/PageHeader";
import { Table } from "@chakra-ui/react";
import Loader from "~/components/Loader";
import Link from "next/link";

// icons
import { RiBillLine } from "react-icons/ri";
import { TbLayoutGridAdd } from "react-icons/tb";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/user";
import { useRouter } from "next/navigation";

export default function PurchasesPage() {
  const router = useRouter();

  const { shop } = useUserContext();
  const [purchases, setPurchases] = useState([]);
  const [page, setPage] = useState(-1);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null); // Reference for the observer

  // methods
  const getPurchases = async () => {
    try {
      const perPage = 20;
      const res = await axios.get("/api/buy", {
        params: { page, perPage },
      });

      const { data } = res;
      if (data.length < perPage) setLoading(false);

      setPurchases((d) => [...d, ...data]);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
      console.error(err);
    }
  };

  // on Component Render.
  useEffect(() => {
    if (page > -1) getPurchases();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) setPage((i) => i + 1);
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, []);

  // render
  return (
    <div className="mb-8">
      <PageHeader title="المشتريات" icon={<RiBillLine />}>
        <Link href="/manager/purchases/add" className="btn">
          <TbLayoutGridAdd />
          <span>إضافة فاتورة</span>
        </Link>
      </PageHeader>

      <Table.Root variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>الوقت والتاريخ</Table.ColumnHeader>
            <Table.ColumnHeader>ملاحظات</Table.ColumnHeader>
            <Table.ColumnHeader>المبلغ</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {purchases.map((purchase) => (
            <Table.Row
              key={purchase._id}
              className="hover:bg-gray-200 cursor-pointer"
              onClick={(e) => router.push(`/manager/purchases/${purchase._id}`)}
            >
              <Table.Cell>
                {moment(purchase.createdAt).format("LTS - L")}
              </Table.Cell>
              <Table.Cell>{purchase.notes}</Table.Cell>
              <Table.Cell>
                {purchase.total.toFixed(2)} {shop.currency}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      {loading && (
        <div ref={observerRef}>
          <Loader />
        </div>
      )}
    </div>
  );
}
