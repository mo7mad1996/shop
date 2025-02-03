"use client";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

// components
import PageHeader from "~/components/layouts/role/PageHeader";
import Loader from "~/components/Loader";
import InputField from "~/components/layouts/role/InputField";
import { Button } from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";

// icons
import { TbUserSquare } from "react-icons/tb";
import { GiTakeMyMoney } from "react-icons/gi";
import { IoIosSave } from "react-icons/io";
import moment from "moment";
import { useUserContext } from "@/context/user";
import Link from "next/link";

export default function SingleClient({ params }) {
  const { id } = params;
  const { shop } = useUserContext();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState(true);
  const [client, setClient] = useState(null);

  const getData = async () => {
    try {
      setLoading(true);
      const c = await axios.get(`/api/client/${id}`);
      const d = await axios.get(`/api/client/${id}/data`);

      const { purchases, debts } = d.data;
      const data = [
        ...purchases.map((i) => ({
          ...i,
          type: "purchase",
        })),
        ...debts.map((i) => ({
          ...i,
          type: "debt",
        })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setClient(c.data);
      setRows(data);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // render
  if (loading) return <Loader />;
  return (
    <div>
      <PageHeader title={client.name} icon={<TbUserSquare />}>
        <h3 className="flex-center gap-2">
          <span>ديونه</span>

          <span className="bg-red-100 px-3 py-2 rounded">
            {client.debt.toFixed(2)}
          </span>

          {shop.currency}
        </h3>
        <AddDebtRepayment action={getData} id={id} />
      </PageHeader>
      <ClientTable rows={rows} />

      <div className="bg-green-100 grid grid-cols-6 rounded">
        <div className="col-span-1 py-2 px-4">رصيد بداية</div>
        <div className="col-span-4 py-2 px-4">
          {client.start_debt.toFixed(2)} {shop.currency}
        </div>
        <div className="col-span-1 py-2 px-4">
          {moment(client.createdAt).format("L, LTS")}
        </div>
      </div>
    </div>
  );
}

function AddDebtRepayment({ action, id }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();

  // methods
  const addDebt = async (payload) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/debt", {
        ...payload,
        client: id,
      });
      setOpen(false);
      toast.success("تم اضافة المبلغ");
      action();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // render
  return (
    <Dialog.DialogRoot
      open={open}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <Dialog.DialogTrigger asChild>
        <button className="btn" onClick={() => setOpen(true)}>
          <span> سداد الديون</span>
          <GiTakeMyMoney />
        </button>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>
            <header className="flex my-3 gap-2 items-center text-xl text-bold">
              <GiTakeMyMoney />
              <span> سداد الديون</span>
            </header>
            <hr />
          </Dialog.DialogTitle>
          <Dialog.DialogCloseTrigger onClick={() => setOpen(false)} />
        </Dialog.DialogHeader>
        <Dialog.DialogBody>
          {/* content here */}
          <form onSubmit={handleSubmit(addDebt)}>
            <InputField
              label="القيمه"
              required
              type="number"
              placeholder="القيمه."
              register={{ ...register("amount") }}
            />
            <InputField
              label="ملاحظات"
              placeholder="ملاحظات."
              register={{ ...register("notes") }}
            />

            <Button type="submit" className="btn w-full" loading={loading}>
              <span>حفظ</span>

              <IoIosSave />
            </Button>
          </form>
        </Dialog.DialogBody>
      </Dialog.DialogContent>
    </Dialog.DialogRoot>
  );
}

function ClientTable({ rows }) {
  const { shop } = useUserContext();
  console.log(rows);

  return (
    <main className="flex flex-col gap-2 py-4">
      {rows.map((i, n) => (
        <div key={n}>
          {i.type == "debt" ? (
            <div className="bg-green-100 grid grid-cols-6 rounded">
              <div className="col-span-1 py-2 px-4">سداد دين</div>
              <div className="col-span-1 py-2 px-4">
                {i.amount.toFixed(2)} {shop.currency}
              </div>
              <div className="col-span-3 py-2 px-4">{i.notes}</div>
              <div className="col-span-1 py-2 px-4">
                {moment(i.createdAt).format("L, LTS")}
              </div>
            </div>
          ) : (
            <Link
              className="bg-slate-100 grid grid-cols-6 rounded "
              href={`/manager/sales/${i._id}/`}
            >
              <div className="col-span-1 py-2 px-4">فاتورة</div>
              <div className="col-span-2 py-2 px-4">{i.notes}</div>
              <div className="col-span-2 py-2 px-4">
                {i.total.toFixed(2)} {shop.currency}
              </div>
              <div className="col-span-1 py-2 px-4">
                {moment(i.createdAt).format("L, LTS")}
              </div>
            </Link>
          )}
        </div>
      ))}
    </main>
  );
}
