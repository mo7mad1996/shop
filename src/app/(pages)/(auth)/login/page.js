"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";

// components
import InputField from "@/components/layouts/auth/forms/InputField";
import { Button } from "@/components/ui/button";

// icons
import { FaUser } from "react-icons/fa";
import { TbPasswordFingerprint } from "react-icons/tb";
import { BiLogInCircle } from "react-icons/bi";
import { useApi } from "@/lib/api";

// component
export default function Login() {
  // config
  const { register, handleSubmit } = useForm();
  const api = useApi();

  // data
  const [loading, setLoading] = useState(false);

  // methods
  const submit = async (payload) => {
    try {
      setLoading(true);

      const res = await api.post("/api/auth", payload);

      console.log(res);
    } catch (err) {
      console.error(err);
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
          {...register("username")}
        />
        <InputField
          title="كلمة المرور"
          required
          icon={<TbPasswordFingerprint />}
          type="password"
          {...register("password")}
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
