"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUserContext } from "@/context/user";
import { toast } from "react-toastify";
import axios from "axios";

// components
import InputField from "~/components/layouts/role/InputField";
import PageHeader from "~/components/layouts/role/PageHeader";
import { Button } from "@/components/ui/button";

// icons
import { FcSettings } from "react-icons/fc";

export default function SettingsPage() {
  const { shop, setShop } = useUserContext();
  const { register, handleSubmit } = useForm({ defaultValues: shop });

  // data
  const [loading, setLoading] = useState(false);

  const fields = [
    {
      title: "اسم المحل",
      name: "name",
    },
    {
      title: "العنوان",
      name: "address",
    },
    {
      title: "العمله",
      name: "currency",
    },
    {
      title: "رقم الهاتف",
      name: "phone",
    },
    {
      title: "تيك توك",
      name: "tiktok",
    },
    {
      title: "تويتر X",
      name: "twitter",
    },
    {
      title: "سجل تجاري",
      name: "cr",
    },
  ];

  const submit = async (payload) => {
    try {
      setLoading(true);
      const res = await axios.patch("/api/shop", payload);

      setShop({ ...shop, ...payload });
      toast.success("تم الحفظ");
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="الإعدادات" icon={<FcSettings />} />

      <form onSubmit={handleSubmit(submit)} className="mx-auto bg-white p-4">
        <h1 className="text-gray-600 my-4">إعدادات المركز</h1>

        <div className="grid grid-cols-2 gap-2">
          {fields.map((i, n) => {
            return (
              <div className="col-span-1">
                <InputField
                  key={n}
                  label={i.title}
                  placeholder={i.title}
                  register={register(i.name)}
                />
              </div>
            );
          })}
        </div>

        <Button loading={loading} type="submit" className="btn my-3 w-full">
          حفظ
        </Button>
      </form>
    </div>
  );
}
