"use client";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";

// components
import * as ChakraSteps from "@/components/ui/steps";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputField from "@/components/layouts/auth/forms/InputField";
import Loader from "@/components/Loader";

// icons
import { IoLockClosedOutline } from "react-icons/io5";
import { BsCalendar2Date } from "react-icons/bs";
import { TbPasswordUser } from "react-icons/tb";
import { FcPrevious } from "react-icons/fc";
import { SlCalender } from "react-icons/sl";

// component
export default function newPeriod() {
  const [step, setStep] = useState(0);
  const steps = [
    {
      icon: <IoLockClosedOutline />,
      template: <Password action={() => setStep((v) => v + 1)} />,
    },
    {
      icon: <SlCalender />,
      template: <SelectDate action={() => setStep((v) => v + 1)} />,
    },
  ];

  useEffect(() => {
    if (step == steps.length) redirect("/login");
  }, [step]);

  return (
    <>
      <div className=" text-center mb-0  py-1">
        <h3>انتهت الفتره</h3>
        <p className="text-gray-400 text-xs ">
          هذه الصفحه خاصه بشركه trueemit فقط
          <br />
          ان ظهرت الرجاء التواصل مع الشركه
          <br />
          <a
            href="tel:+201063525389"
            style={{ direction: "ltr", display: "block" }}
            className="my-2"
          >
            (+20) 10-6352-5389
          </a>
        </p>
      </div>
      <ChakraSteps.StepsRoot
        count={steps.length}
        linear={true}
        step={step}
        css={{
          "--chakra-colors-color-palette-muted": "#6e63ec96",
          direction: "rtl",
        }}
      >
        <ChakraSteps.StepsList>
          {steps.map((s, i) => (
            <ChakraSteps.StepsItem index={i} key={i} icon={s.icon} />
          ))}
        </ChakraSteps.StepsList>

        {steps.map((s, i) => (
          <ChakraSteps.StepsContent key={i} index={i}>
            {s.template}
          </ChakraSteps.StepsContent>
        ))}

        <ChakraSteps.StepsCompletedContent>
          <div className="py-3 text-center ">
            جاري الحفظ
            <br />
            <Loader />
          </div>
        </ChakraSteps.StepsCompletedContent>
      </ChakraSteps.StepsRoot>
    </>
  );
}

const Password = ({ action }) => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const submit = async (payload) => {
    setLoading(true);

    try {
      const res = await axios.post("/api/shop", payload);
      if (res.data.isValid) action();
      else toast.error("كلمة المرور غير صحيحه");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.date || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(submit)}>
      <InputField
        name="password"
        title="كملة مرور trueemit"
        required
        icon={<TbPasswordUser />}
        type="password"
        {...register("password")}
      />

      <Button
        loading={loading}
        type="submit"
        className="my-3 mx-auto w-full flex-center gap-2 p-3 bg-slate-600 rounded-sm hover:bg-slate-800 focus:bg-slate-900"
      >
        <span>التالي</span>
        <FcPrevious />
      </Button>
    </form>
  );
};

const SelectDate = ({ action }) => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  const submit = () => {
    try {
      setLoading(true);
      axios.patch("/api/shop", { expired: date });
      action();
    } catch (err) {
      console.error(err);
      toast.error(err.response.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <label className="flex gap-1">
        <BsCalendar2Date /> إستخدام حتى
      </label>
      <DatePicker
        className="w-full border-none"
        onChange={(e) => setDate(dayjs(e).toISOString())}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
            borderBottom: "2px solid white",
          },
          "& .MuiSvgIcon-root": {
            color: "white",
          },
          "& .MuiOutlinedInput-input": {
            color: "white",
          },
          "& css-jupps9-MuiInputBase-root-MuiOutlinedInput-root:hover": {
            borderColor: "white",
          },
        }}
      />
      <Button
        type="submit"
        className="my-3 mx-auto w-full flex-center gap-2 p-3 bg-slate-600 rounded-sm hover:bg-slate-800 focus:bg-slate-900"
        loading={loading}
      >
        <span>التالي</span>

        <FcPrevious />
      </Button>
    </form>
  );
};
