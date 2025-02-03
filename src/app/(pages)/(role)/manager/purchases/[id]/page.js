"use client";

import { useUserContext } from "@/context/user";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// component
import Loader from "~/components/Loader";
import { Table } from "@chakra-ui/react";
import moment from "moment";

export default function Purchase({ params }) {
  const { id } = params;
  const { shop } = useUserContext();

  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState(null);

  //   methods
  const getPurchase = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/buy/${id}`);

      const { data } = res;
      console.log(data);
      setPurchase(data);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPurchase();
  }, []);
  if (loading || !purchase) return <Loader />;
  return (
    <>
      <header>
        <div className="flex items-center justify-between ">
          <div>
            <h3 className="text-2xl">فاتورة</h3>
            <div className="my-3 text-gray-500">
              {moment(purchase.createdAt).format("L - (hh:mm a)")}
            </div>
            <div className="my-3 text-gray-500">{purchase.notes}</div>
          </div>

          <div className=" bg-white px-7 py-3 shadow-lg rounded-3xl border">
            <span className="text-gray-400 my-3 text-sm ">الإجمالي</span>

            <div className="text-bold py-3">
              {purchase.total.toFixed(2)} {shop.currency}
            </div>
          </div>
        </div>

        <hr className="my-3" />
      </header>

      <Table.Root variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>الصنف</Table.ColumnHeader>
            <Table.ColumnHeader>سعر الشراء</Table.ColumnHeader>
            <Table.ColumnHeader>الكمية</Table.ColumnHeader>
            <Table.ColumnHeader>الاجمالي</Table.ColumnHeader>
            <Table.ColumnHeader></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {purchase.items.map(({ item, selected_unit, count, total }, n) => (
            <Table.Row key={n}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>
                {(total / (count * selected_unit)).toFixed(2)}
              </Table.Cell>
              <Table.Cell>{selected_unit * count} </Table.Cell>
              <Table.Cell>{total.toFixed(2)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
