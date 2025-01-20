"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUserContext } from "~/context/user";
import axios from "axios";

// components
import * as Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputField from "~/components/layouts/role/InputField";
import PageHeader from "~/components/layouts/role/PageHeader";
import Loader from "@/components/Loader";
import Link from "next/link";
import { IconButton } from "@mui/material";

// icons
import { GoPeople } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import { IoIosSave } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { TbUserEdit } from "react-icons/tb";
import { AiOutlineUserDelete } from "react-icons/ai";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  // methods
  const getClients = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/client");
      const { data } = res;
      setClients(data);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  // render
  return (
    <>
      <PageHeader title="العملاء" icon={<GoPeople />}>
        <AddClient action={getClients} />
      </PageHeader>

      <h2 className="text-gray-500 mt-12 mb-5">قائمة العملاء.</h2>
      {loading ? <Loader /> : <Clients data={clients} action={getClients} />}
    </>
  );
}

function AddClient({ action }) {
  const [open, setOpen] = useState(false);

  // methods
  const addProduct = async (payload, cb) => {
    try {
      const res = await axios.post("/api/client", {
        ...payload,
        start_debt: payload.debt,
      });
      setOpen(false);
      toast.success("تم اضافة العميل");
      action();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      cb();
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
          <span>اضف منتج</span>
          <FaPlus />
        </button>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>
            <header className="flex my-3 gap-2 items-center text-xl text-bold">
              <FaPlus />

              <span>اضف عميل</span>
            </header>
            <hr />
          </Dialog.DialogTitle>
          <Dialog.DialogCloseTrigger onClick={() => setOpen(false)} />
        </Dialog.DialogHeader>
        <Dialog.DialogBody>
          {/* content here */}
          <ClientForm action={addProduct} />
        </Dialog.DialogBody>
      </Dialog.DialogContent>
    </Dialog.DialogRoot>
  );
}

function ClientForm({ action, initValues = {} }) {
  const [loading, setLoading] = useState(false);

  const { register, watch, handleSubmit } = useForm({
    defaultValues: initValues,
  });

  // methods
  const submit = (payload) => {
    setLoading(true);

    action(payload, () => setLoading(false));
  };

  // render
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit(submit)}>
        <InputField
          label="اسم العميل"
          required
          placeholder="اسم العميل."
          register={{ ...register("name") }}
        />
        <InputField
          label="ديونه"
          type="number"
          placeholder="ديون قديمه."
          register={{ ...register("debt") }}
        />
        {initValues && (
          <InputField
            label="ديونه بدايه التسجيل"
            type="number"
            placeholder="ديونه بداية التسجيل."
            register={{ ...register("start_debt") }}
          />
        )}

        <Button type="submit" className="btn w-full" loading={loading}>
          <span>حفظ</span>

          <IoIosSave />
        </Button>
      </form>
    </div>
  );
}

function Clients({ data, action }) {
  const { shop } = useUserContext();
  if (!data.length) return <></>;

  return (
    <>
      <ul className="rounded-md shadow-lg bg-[#edebed] flex flex-col-reverse gap-1 p-1 my-4">
        {data.map((client, n) => (
          <Item key={n} client={client} action={action} />
        ))}
      </ul>

      <div>
        اجمالي ديون العملاء:
        <span className="text-red-500 bg-red-100 rounded px-2 py-1">
          {data.reduce((a, b) => a + (b.debt || 0), 0).toFixed(2)}
        </span>
        {shop.currency}
      </div>
    </>
  );
}

function Item({ client, action }) {
  const { shop } = useUserContext();

  return (
    <li>
      <Link
        href={`/manager/clients/${client._id}`}
        className="grid grid-cols-7 bg-white p-2 rounded-md cursor-pointer hover:bg-slate-100 group "
      >
        <div className="col-span-1 text-2xl flex-center ">
          <AiOutlineUser />
        </div>
        <div className="col-span-2 px-5">
          <span className="text-gray-500 text-xs">اسم العميل </span>
          <h3>{client.name}</h3>
        </div>
        <div className="col-span-2 ">
          <span className="text-gray-500 text-xs">ديونه</span>
          <h3>
            {(client.debt || 0).toFixed(2)} {shop.currency}
          </h3>
        </div>
        <div
          className="col-span-2  gap-4 flex-center opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <DialogEdit client={client} action={action} />
          <DialogDelete client={client} action={action} />
        </div>
      </Link>
    </li>
  );
}

function DialogEdit({ client, action }) {
  const [open, setOpen] = useState(false);

  const editClient = async (payload, cb) => {
    try {
      await axios.patch("/api/client/" + payload._id, payload);
      setOpen(false);
      action();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      cb();
    }
  };
  return (
    <Dialog.DialogRoot
      open={open}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <Dialog.DialogTrigger asChild>
        <IconButton
          aria-label="edit"
          color="warning"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <MdOutlineModeEditOutline />
        </IconButton>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>
            <header className="flex my-3 gap-2 items-center text-xl text-bold">
              <TbUserEdit />
              <span>تعديل بيانات العميل </span>
              <q className="bg-slate-200 text-slate-500 text-sm px-2 py-1 rounded">
                {client.name}
              </q>
            </header>
            <hr />
          </Dialog.DialogTitle>
          <Dialog.DialogCloseTrigger onClick={() => setOpen(false)} />
        </Dialog.DialogHeader>
        <Dialog.DialogBody>
          <ClientForm action={editClient} initValues={client} />
        </Dialog.DialogBody>
      </Dialog.DialogContent>
    </Dialog.DialogRoot>
  );
}

function DialogDelete({ client, action }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const deleteClient = async () => {
    try {
      setLoading(true);
      await axios.delete("/api/client/" + client._id);
      toast.success("تم حذف العميل");
      setOpen(false);
      action();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.DialogRoot
      open={open}
      role="alertdialog"
      motionPreset="slide-in-bottom"
    >
      <Dialog.DialogTrigger asChild>
        <IconButton
          aria-label="delete"
          color="error"
          onClick={() => setOpen(true)}
        >
          <AiOutlineUserDelete />
        </IconButton>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>
            <header className="flex my-3 gap-2 items-center text-xl text-bold">
              <AiOutlineUserDelete />
              <span>حذف العميل </span>
              <q className="bg-slate-200 text-slate-500 text-sm px-2 py-1 rounded">
                {client.name}
              </q>
            </header>
            <hr />
          </Dialog.DialogTitle>
          <Dialog.DialogCloseTrigger onClick={() => setOpen(false)} />
        </Dialog.DialogHeader>
        <Dialog.DialogBody>
          <p>هل انت متاكد من حذف {client.name} من قائمة العملاء ؟</p>
        </Dialog.DialogBody>

        <Dialog.DialogFooter>
          <Dialog.DialogActionTrigger asChild>
            <Button
              className="px-4 py-2 w-22 rounded border"
              onClick={() => setOpen(false)}
            >
              لا
            </Button>
          </Dialog.DialogActionTrigger>
          <Button
            className="bg-red-500 w-22 text-white px-4 py-2 rounded mx-1"
            onClick={deleteClient}
            loading={loading}
          >
            نعم
          </Button>
        </Dialog.DialogFooter>
      </Dialog.DialogContent>
    </Dialog.DialogRoot>
  );
}
