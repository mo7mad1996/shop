"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "@/context/user";
import { useForm } from "react-hook-form";

// libs
import { units as AllUnits } from "~/lib/details";

// components
import InputField from "~/components/layouts/role/InputField";
import SelectField from "~/components/layouts/role/SelectField";
import Loader from "~/components/Loader";
import * as RadioCard from "@/components/ui/radio-card";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Table } from "@chakra-ui/react";

// icons
import { FaPlus } from "react-icons/fa6";

let controller;

export default function Casher() {
  // config
  const { shop } = useUserContext();
  const { watch, register, handleSubmit, reset } = useForm();

  // data
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [productList, setProductList] = useState([]);
  const [item, setItem] = useState(null);
  const barcodeInput = useRef(null);

  // methods
  const getCLients = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/client");
      const { data } = res;
      setClients(data.map((i) => ({ label: i.name, value: i._id })));
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getProducts = async () => {
    setItems([]);
    if (!(!!watch("barcode") || !!watch("name"))) return;

    // Abort previous request if it exists
    if (controller) {
      controller.abort();
    }

    // Create new controller for this request
    controller = new AbortController();

    try {
      const res = await axios.get("/api/product/item", {
        params: {
          barcode: watch("barcode"),
          name: watch("name"),
        },
        signal: controller.signal,
      });

      const { data } = res;
      if (!data.length) toast.error("ليس هناك منتجات");

      if (data.length == 1) setItem(data[0]);
      else setItems(data);
    } catch (err) {
      if (err.message == "canceled") return;
      console.error(err);
    }
  };

  const appendProduct = (payload) => {
    if (!item) return;

    setProductList((v) => [
      {
        ...item,
        count: payload.count,
        selling_price: item.selling_price / payload.unit,
        unit: payload.unit,
        total: (item.selling_price / payload.unit) * payload.count,
      },
      ...v,
    ]);
    setItem(null);
    reset({ barcode: "", name: "", count: 1 }, { keepDefaultValues: true });
    // barcodeInput.current.focus();
  };

  // on component render
  useEffect(() => {
    getCLients();
  }, []);

  useEffect(() => {
    getProducts();
  }, [watch("name")]);

  useEffect(() => {
    if (item) {
      const unitList = AllUnits[item.unit || 0].map((i) => ({
        label: i.name,
        value: i.conversionFactor,
      }));
      setUnits(unitList);
    }
  }, [item]);

  // render
  if (loading) return <Loader />;
  return (
    <div>
      <header>
        <div className=" grid grid-cols-4 ">
          <div className="col-span-1">
            <SelectField
              label="العميل"
              items={clients}
              register={{ ...register("client") }}
            />
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-1 flex flex-row gap-3 justify-end items-end pb-3 ">
            <div>اجمالي المبلغ :</div>
            <span className="bg-green-200 text-green-700 px-2 py-1  rounded">
              {productList.reduce((a, b) => a + b.total, 0).toFixed(2)}
            </span>
            <span>{shop.currency}</span>
          </div>
        </div>
      </header>
      <hr />

      <main>
        <form
          className="grid grid-cols-4 bg-white p-1 gap-2"
          onSubmit={handleSubmit(appendProduct)}
        >
          <div className="col-span-1">
            <InputField
              label="باركود"
              placeholder="باركود."
              autoFocus
              register={{ ...register("barcode") }}
              defaultValue={item?.barcode}
              onBlur={getProducts}
              // innerref={barcodeInput}
            />
          </div>
          <div className="col-span-2">
            {item ? (
              <InputField
                label="اسم المنتج"
                disabled={true}
                placeholder={item.name}
                value={item.name}
              />
            ) : (
              <InputField
                label="اسم المنتج"
                placeholder="ابحث باسم المنتج"
                register={{ ...register("name") }}
                disabled={watch("barcode")}
              />
            )}
          </div>
          <div className="col-span-1">
            <div className="flex">
              <div className="flex-1">
                <InputField
                  defaultValue="1"
                  label="الكميه"
                  type="number"
                  register={{ ...register("count") }}
                />
              </div>
              <div className="flex-1">
                {item ? (
                  <div className="flex items-center">
                    <SelectField
                      register={{ ...register("unit") }}
                      label="وحدة القياس"
                      items={units}
                      defaultValue={units.reduce(
                        (a, b) => Math.max(a, b.value),
                        0
                      )}
                    />
                    <Button type="submit">
                      <FaPlus />
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <RadioCard.RadioCardRoot>
              {items.map((item, n) => (
                <RadioCard.RadioCardItem
                  key={n}
                  label={item.name}
                  value={item}
                  description={`${item.selling_price?.toFixed(2)} ${
                    shop.currency
                  }`}
                  addon={item.barcode}
                  onClick={() => {
                    setItem(item);
                    setItems([]);
                  }}
                />
              ))}
            </RadioCard.RadioCardRoot>
          </div>
        </form>
        <Table.Root variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>المنتج</Table.ColumnHeader>
              <Table.ColumnHeader>الكميه</Table.ColumnHeader>
              <Table.ColumnHeader>سعر الوحده</Table.ColumnHeader>
              <Table.ColumnHeader>الاجمالي</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {productList.map((item, n) => (
              <Table.Row key={n}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.count}</Table.Cell>
                <Table.Cell>
                  {item.selling_price.toFixed(2)} {shop.currency}
                </Table.Cell>
                <Table.Cell>
                  {item.total.toFixed(2)} {shop.currency}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </main>
    </div>
  );
}
