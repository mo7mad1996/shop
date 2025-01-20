"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import axios from "axios";
import moment from "moment";

// utils
import { roles } from "~/lib/details";
import { useUserContext } from "~/context/user";

// components
import PageHeader from "~/components/layouts/role/PageHeader";
import InputField from "~/components/layouts/role/InputField";
import SelectField from "~/components/layouts/role/SelectField";
import * as Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { IconButton } from "@mui/material";

// icons
import { FaPlus } from "react-icons/fa6";
import { PiUsersThreeBold } from "react-icons/pi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoIosSave } from "react-icons/io";
import { LiaUserEditSolid } from "react-icons/lia";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { AiOutlineUserDelete } from "react-icons/ai";

// main page component
export default function Users() {
  const getUsers = async () => {
    try {
      setLoader(true);
      const res = await axios.get("/api/user/all");
      const data = res.data.users;
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoader(false);
    }
  };

  // data
  const [loader, setLoader] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <PageHeader title="المستخدمين" icon={<PiUsersThreeBold />}>
        <AddUserDialog action={getUsers} />
      </PageHeader>

      <UsersList items={users} loader={loader} action={getUsers} />
    </div>
  );
}

// components
function AddUserDialog({ action }) {
  const [open, setOpen] = useState(false);

  const addUser = async (payload, cb) => {
    try {
      await axios.post("/api/user", payload);
      toast.success("تم اضافة المستخدم");
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
        <button className="btn" onClick={() => setOpen(true)}>
          <span>إضافة مستخدم جديد</span>
          <FaPlus />
        </button>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>
            <header className="flex my-3 gap-2 items-center text-xl text-bold">
              <AiOutlineUserAdd />
              <span>إضافة مستخدم جديد</span>
            </header>
            <hr />
          </Dialog.DialogTitle>
          <Dialog.DialogCloseTrigger onClick={() => setOpen(false)} />
        </Dialog.DialogHeader>
        <Dialog.DialogBody>
          {/* form component */}
          <UserForm action={addUser} />
        </Dialog.DialogBody>
      </Dialog.DialogContent>
    </Dialog.DialogRoot>
  );
}
function UserForm({ action, initValues = {} }) {
  const { register, handleSubmit } = useForm({
    defaultValues: { ...initValues, password: "" },
  });

  // data
  const [loading, setLoading] = useState(false);
  const items = Object.entries(roles).map(([value, label]) => ({
    label,
    value,
  }));

  // methods
  const submit = (payload) => {
    setLoading(true);

    action(payload, () => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <InputField
        label="الاسم"
        required
        placeholder="اسم المستخدم."
        register={{ ...register("name") }}
      />
      <InputField
        label="رقم المستخدم"
        register={{ ...register("username") }}
        required
        placeholder="رقم المستخدم."
      />
      <InputField
        label="كلمة المرور"
        required
        placeholder="كلمة المرور."
        type="password"
        register={{ ...register("password") }}
      />
      <SelectField
        label="الدور"
        items={items}
        register={{ ...register("role") }}
      />

      <Button type="submit" className="btn w-full" loading={loading}>
        <span>حفظ</span>

        <IoIosSave />
      </Button>
    </form>
  );
}
function UsersList({ items, loader, action }) {
  const { user: authUser } = useUserContext();

  return (
    <>
      <h2 className="text-gray-500 mt-12 mb-5">
        عدد المستخدمين للنظام ({items.length})
      </h2>
      {loader && <Loader />}
      {items.length > 0 && (
        <ul className="rounded-md shadow-lg bg-[#edebed] flex flex-col-reverse gap-1 p-1 my-4">
          {items.map((user, n) => (
            <li
              key={n}
              className="grid grid-cols-7 bg-white p-2 rounded-md cursor-pointer hover:bg-slate-100 group "
            >
              <div className="col-span-1 text-2xl flex-center ">
                <AiOutlineUser />
              </div>
              <div className="col-span-2 px-5">
                <h3>
                  {user.name}
                  {user._id == authUser._id && " (أنت)"}.
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 mx-2  rounded-full inline-grid place-items-center">
                    {roles[user.role]}
                  </span>
                </h3>

                <span className="text-gray-500 text-xs">
                  رقم المستخدم: {user.username}
                </span>
              </div>
              <div className="col-span-2 ">
                <span className="text-gray-500 text-xs">اخر دخول</span>
                <h3>
                  {user.lastLogin ? moment(user.lastLogin).calendar() : "-"}
                </h3>
              </div>
              <div className="col-span-2  gap-4 flex-center opacity-0 group-hover:opacity-100">
                <DialogEdit user={user} action={action} />
                {user._id != authUser._id && (
                  <DialogDelete user={user} action={action} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
function DialogEdit({ user, action }) {
  const [open, setOpen] = useState(false);

  const editUser = async (payload, cb) => {
    try {
      await axios.patch("/api/user/" + payload._id, payload);
      toast.success("تم حفظ المستخدم");
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
          onClick={() => setOpen(true)}
        >
          <MdOutlineModeEditOutline />
        </IconButton>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>
            <header className="flex my-3 gap-2 items-center text-xl text-bold">
              <LiaUserEditSolid />
              <span>تعديل المستخدم </span>
              <q className="bg-slate-200 text-slate-500 text-sm px-2 py-1 rounded">
                {user.name}
              </q>
            </header>
            <hr />
          </Dialog.DialogTitle>
          <Dialog.DialogCloseTrigger onClick={() => setOpen(false)} />
        </Dialog.DialogHeader>
        <Dialog.DialogBody>
          {/* form component */}
          <UserForm action={editUser} initValues={user} />
        </Dialog.DialogBody>
      </Dialog.DialogContent>
    </Dialog.DialogRoot>
  );
}
function DialogDelete({ user, action }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const deleteUser = async () => {
    try {
      setLoading(true);
      await axios.delete("/api/user/" + user._id);
      toast.success("تم حذف المستخدم");
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
              <span>حذف المستخدم </span>
              <q className="bg-slate-200 text-slate-500 text-sm px-2 py-1 rounded">
                {user.name}
              </q>
            </header>
            <hr />
          </Dialog.DialogTitle>
          <Dialog.DialogCloseTrigger onClick={() => setOpen(false)} />
        </Dialog.DialogHeader>
        <Dialog.DialogBody>
          <p>هل انت متاكد من حذف {user.name} من مستخدمين النظام ؟</p>
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
            className="bg-red-500 w-22 text-white px-4 py-2 rounded"
            onClick={deleteUser}
            loading={loading}
          >
            نعم
          </Button>
        </Dialog.DialogFooter>
      </Dialog.DialogContent>
    </Dialog.DialogRoot>
  );
}
