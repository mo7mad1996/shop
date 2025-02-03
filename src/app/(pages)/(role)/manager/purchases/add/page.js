"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/user";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

// libs
import { units as AllUnits } from "~/lib/details";

// components
import InputField from "~/components/layouts/role/InputField";
import SelectField from "~/components/layouts/role/SelectField";
import Loader from "~/components/Loader";
import * as Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { IconButton } from "@mui/material";
import PageHeader from "~/components/layouts/role/PageHeader";

// icons
import { IoIosSave } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { MdDeleteSweep } from "react-icons/md";
import { FaBuffer } from "react-icons/fa6";

let controller;

export default function AddPurchasesPage() {
  // config
  const { shop } = useUserContext();
  const { watch, register, handleSubmit, reset } = useForm();

  // data
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [productList, setProductList] = useState([]);
  const [item, setItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  //   const barcodeRef = useRef();

  // methods
  const setFocus = (id) => {
    const el = document.getElementById(id);
    if (el) el.focus();
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
        purchase_price: item.purchase_price / payload.unit,
        unit: payload.unit,
        total: (item.purchase_price / payload.unit) * payload.count,
      },
      ...v,
    ]);
    setItem(null);
    reset({ barcode: "", name: "", count: 1 }, { keepDefaultValues: true });

    setFocus("barcodeInput");
  };

  const getPayload = (payload) => {
    return {
      items: productList.map((i) => ({
        item: i._id,
        total: i.total,
        count: i.count / i.unit,
        selected_unit: i.unit,
      })),
      notes: payload.notes,
      total: productList.reduce((a, b) => a + b.total, 0),
    };
  };

  const addPurchases = async (payload) => {
    try {
      setSaveLoading(true);
      const purchase = getPayload(payload);
      const res = await axios.post("/api/buy", purchase);

      // actions
      toast.success("تم الحفظ");
      setOpen(false);
      setProductList([]);
      reset({ pay: 0 }, { keepDefaultValues: true });

      setTimeout(() => {
        setFocus("barcodeInput");
      }, 100);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // on component render
  useEffect(() => {
    setFocus("barcodeInput");

    function f6(e) {
      if (e.key == "F6") {
        e.preventDefault();
        setOpen(true);
      }
    }

    addEventListener("keydown", f6);
    return () => removeEventListener("keydown", f6);
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
  return (
    <div>
      <PageHeader title="فاتورة مشتريات" icon={<FaBuffer />} />

      <header>
        <div className=" grid grid-cols-4 ">
          <div className="col-span-1">
            <InputField
              label="ملاحظات"
              placeholder={"ملاحظات."}
              register={{ ...register("notes") }}
            />
          </div>
          <div className="col-span-2 flex items-end">
            <Dialog.DialogRoot
              open={open}
              placement="center"
              motionPreset="slide-in-bottom"
            >
              <Dialog.DialogTrigger asChild>
                <Tooltip
                  content="F6"
                  contentProps={{ css: { color: "white !important" } }}
                >
                  <button
                    className="btn my-3 mx-auto"
                    onClick={() => setOpen(true)}
                  >
                    <span>حفظ</span>
                    <IoIosSave />
                  </button>
                </Tooltip>
              </Dialog.DialogTrigger>
              <Dialog.DialogContent>
                <Dialog.DialogHeader>
                  <Dialog.DialogTitle>
                    <header className="flex my-3 gap-2 items-center text-xl text-bold">
                      <IoIosSave />

                      <span>الدفع</span>
                    </header>
                    <hr />
                  </Dialog.DialogTitle>
                  <Dialog.DialogCloseTrigger onClick={() => setOpen(false)} />
                </Dialog.DialogHeader>
                <Dialog.DialogBody>
                  {/* content here */}
                  <form onSubmit={handleSubmit(addPurchases)}>
                    <div className="text-start">
                      <Table.Root>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>الاجمالي</Table.Cell>
                            <Table.Cell>
                              <span>
                                {productList
                                  .reduce((a, b) => a + b.total, 0)
                                  .toFixed(2)}
                              </span>
                              <span>{shop.currency}</span>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>المدفوع</Table.Cell>
                            <Table.Cell>
                              <InputField
                                register={{ ...register("pay") }}
                                autoFocus
                              />
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>المتبقي</Table.Cell>
                            <Table.Cell>
                              <span>
                                {(
                                  (watch("pay") || 0) -
                                  productList.reduce((a, b) => a + b.total, 0)
                                ).toFixed(2)}
                              </span>
                              <span>{shop.currency}</span>
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table.Root>
                    </div>
                    <Button
                      className="btn w-full mt-3"
                      type="submit"
                      loading={saveLoading}
                    >
                      <span>حفظ</span>
                      <IoIosSave />
                    </Button>
                  </form>
                </Dialog.DialogBody>
              </Dialog.DialogContent>
            </Dialog.DialogRoot>
          </div>
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
              placeholder={item?.barcode || "باركود."}
              autoFocus
              register={{ ...register("barcode") }}
              defaultValue={item?.barcode}
              onBlur={getProducts}
              id="barcodeInput"
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
                {item && units.length ? (
                  <div className="flex items-end gap-1">
                    <SelectField
                      label="وحدة القياس"
                      items={units}
                      register={{ ...register("unit") }}
                      defaultValue={units.reduce(
                        (a, b) => Math.max(a, b.value),
                        0
                      )}
                    />
                    <Button type="submit" className="btn my-3">
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
            <ul className=" rounded  overflow-hidden border">
              {items.map((item, n) => (
                <div
                  key={n}
                  onClick={() => {
                    setItems([]);
                    setItem(item);
                  }}
                  className="cursor-pointer  grid grid-cols-5 gap-[1px]  bg-[#e9e8eb] group border-b-[1px]  hover:text-black text-[#63636c]"
                >
                  <span className="px-4 py-2 col-span-3 bg-white group-hover:bg-[#f9fbfe]">
                    {item.name}
                  </span>
                  <span className="px-4 py-2 col-span-1 bg-white group-hover:bg-[#f9fbfe]">
                    {(
                      item.purchase_price /
                      AllUnits[item.unit].at(-1).conversionFactor
                    ).toFixed(2)}{" "}
                    {shop.currency}
                  </span>
                  <span className="px-4 py-2 col-span-1 bg-white group-hover:bg-[#f9fbfe]">
                    {AllUnits[item.unit].at(-1).name}
                  </span>
                </div>
              ))}
            </ul>
          </div>
        </form>
        <Table.Root variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader></Table.ColumnHeader>
              <Table.ColumnHeader>المنتج</Table.ColumnHeader>
              <Table.ColumnHeader>الكميه</Table.ColumnHeader>
              <Table.ColumnHeader>سعر الوحده</Table.ColumnHeader>
              <Table.ColumnHeader>الاجمالي</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {productList.map((item, n) => (
              <Table.Row key={n}>
                <Table.Cell>
                  <IconButton
                    onClick={() =>
                      setProductList((v) => v.filter((_, i) => i != n))
                    }
                  >
                    <MdDeleteSweep />
                  </IconButton>
                </Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.count}</Table.Cell>
                <Table.Cell>
                  {item.purchase_price.toFixed(2)} {shop.currency}
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
