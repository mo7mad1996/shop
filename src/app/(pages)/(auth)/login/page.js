"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "~/context/user";
import moment from "moment";

// components
import InputField from "@/components/layouts/auth/forms/InputField";
import { Button } from "@/components/ui/button";

// icons
import { FaUser } from "react-icons/fa";
import { TbPasswordFingerprint } from "react-icons/tb";
import { BiLogInCircle } from "react-icons/bi";

// component
export default function Login() {
  // config
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const { setUser } = useUserContext();

  // data
  const [loading, setLoading] = useState(false);

  // methods
  const submit = async (payload) => {
    try {
      setLoading(true);

      // send request
      const res = await axios.post("/api/auth", payload);
      const { user } = res.data;

      setUser(user);
      // actions
      router.push(user?.role);
      if (user.lastLogin)
        toast.success(
          "اهلا بعودتك اخر تسجيل دخول كان في" +
            moment(user.lastLogin).format("L, LTS")
        );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // render
  return (
    <>
      <div className="title text-center">
        <h3>تسجيل الدخول</h3>
        <p>مرحبا بعودتك</p>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <InputField
          title="رقم المستخدم"
          icon={<FaUser />}
          required
          autoFocus
          register={register("username")}
        />
        <InputField
          title="كلمة المرور"
          required
          icon={<TbPasswordFingerprint />}
          type="password"
          register={register("password")}
        />

        <Button
          type="submit"
          className="my-3 mx-auto w-full flex-center gap-2 p-3 bg-slate-600 rounded-sm hover:bg-slate-800 focus:bg-slate-900"
          loading={loading}
        >
          <span>تسجيل دخول</span>
          <BiLogInCircle />
        </Button>
      </form>
    </>
  );
}
