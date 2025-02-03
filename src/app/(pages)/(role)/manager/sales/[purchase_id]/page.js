"use client";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/user";

// components
import { List } from "@chakra-ui/react";
import Loader from "~/components/Loader";
import { Table } from "@chakra-ui/react";
import Image from "next/image";

// icons
import { IoLocationSharp } from "react-icons/io5";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaTiktok } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";

// assets
import trueemit from "@/assets/images/trueemit.png";

export default function PurchasePage({ params }) {
  const { shop } = useUserContext();
  const { purchase_id } = params;

  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPurchase = async () => {
    try {
      const req = await axios.get(`/api/purchase/${purchase_id}`);

      const { data } = req;
      console.log(data);
      setPurchase(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPurchase();
  }, []);

  if (loading) return <Loader />;
  return (
    <>
      <div className="my-12">
        <div className="bg-[#f9f9f9] border rounded-2xl p-5 max-w-[640px] mx-auto">
          <header>
            <div className="flex">
              <div className="flex-1">
                <h3>فاتورة مشتريات</h3>
                <span className="text-gray-500 text-sm">
                  {purchase.client.name}
                </span>
                <div className="text-gray-500 text-sm">
                  {moment(purchase.createdAt).format("L, LTS")}
                </div>
              </div>
              <div className="">
                <Image
                  src={shop.logo || trueemit}
                  alt="trueemit"
                  height={70}
                  priority
                />
              </div>
            </div>
            <hr className="my-4" />
          </header>

          <main>
            <Table.Root
              size="sm"
              variant="outline"
              className="bg-[#ffffffd3] rounded"
            >
              <Table.Header>
                <Table.Row classname=" text-gray-400">
                  <Table.ColumnHeader>الصنف</Table.ColumnHeader>
                  <Table.ColumnHeader>السعر</Table.ColumnHeader>
                  <Table.ColumnHeader>الكميه</Table.ColumnHeader>
                  <Table.ColumnHeader>الاجمالي</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {purchase.items.map(
                  ({ item, selected_unit, count, total }, n) => (
                    <Table.Row key={n}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>
                        {(total / (count * selected_unit)).toFixed(2)}
                      </Table.Cell>
                      <Table.Cell>{selected_unit * count} </Table.Cell>
                      <Table.Cell>{total.toFixed(2)}</Table.Cell>
                    </Table.Row>
                  )
                )}
              </Table.Body>
            </Table.Root>

            <hr className="my-4" />

            <div className="grid grid-cols-5">
              <div className="col-span-3"></div>
              <div className="col-span-1 text-gray-400">الاجمالي</div>
              <div className="col-span-1 font-bold ">
                {purchase.total.toFixed(2)} {shop.currency}
              </div>
            </div>
            <hr className="my-3" />

            <ul className="flex py-3 flex-col ">
              {[
                { title: "address", icon: <IoLocationSharp /> },
                {
                  title: "phone",
                  icon: <IoPhonePortraitOutline />,
                },
                { title: "tiktok", icon: <FaTiktok /> },
                { title: "twitter", icon: <FaTwitter /> },
              ].map((a) => {
                if (shop[a.title])
                  return (
                    <li
                      className="flex-1 flex items-center gap-3 justify-end text-gray-600"
                      key={a.title}
                    >
                      <span>{shop[a.title]}</span>
                      {a.icon}
                    </li>
                  );
              })}
            </ul>
            <hr className="my-3" />
            <h3 className="text-center">{shop.name}</h3>
          </main>
        </div>
      </div>
    </>
  );
}
