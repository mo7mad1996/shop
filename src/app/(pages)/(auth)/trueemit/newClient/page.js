"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";

// components
import * as ChakraSteps from "@/components/ui/steps";
import * as FileUpload from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputField from "@/components/layouts/auth/forms/InputField";
import { Loader } from "@/components/Loader";

// icons
import { IoLockClosedOutline, IoLogoAppleAr } from "react-icons/io5";
import { FaTwitter, FaRegRegistered } from "react-icons/fa";
import { FaStoreAlt, FaStore } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { PiPhoneDisconnect } from "react-icons/pi";
import { RxCodesandboxLogo } from "react-icons/rx";
import { BsCalendar2Date } from "react-icons/bs";
import { LuUserRoundPlus } from "react-icons/lu";
import { TbPasswordUser } from "react-icons/tb";
import { BiLogoTiktok } from "react-icons/bi";
import { FcPrevious } from "react-icons/fc";
import { SlCalender } from "react-icons/sl";
import { TiUser } from "react-icons/ti";
import { FaRegIdCard } from "react-icons/fa6";
import { RiLockPasswordFill , RiBillLine} from "react-icons/ri";


// component
export default function NewClient() {
  const router = useRouter();

  // data
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
    {
      icon: <FaStore />,
      template: <Store1 action={() => setStep((v) => v + 1)} />,
    },
    {
      icon: <FaStoreAlt />,
      template: <Store2 action={() => setStep((v) => v + 1)} />,
    },
    {
      icon: <LuUserRoundPlus />,
      template: <User action={() => setStep((v) => v + 1)} />,
    },
  ];

  useEffect(() => {
    if (step == steps.length) router.push("/login");
  }, [step]);

  return (
    <>
      <div className=" text-center mb-0  py-1">
        <h3>تسجيل الشركه</h3>
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
    } catch (err) {
      console.error(err);
      toast.error(err.response?.date?.error || err.message);
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
        register={register("password")}
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
      toast.error(err.response?.data?.error || err.message);
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

const Store1 = ({ action }) => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const submit = (payload) => {
    try {
      setLoading(true);
      axios.patch("/api/shop", payload);
      action();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div>
        <label className="flex gap-1">
          <IoLogoAppleAr /> الشعار
        </label>
        <FileUpload.FileUploadRoot
          className="my-3"
          maxW="xl"
          alignItems="stretch"
          accept={["image/*"]}
          style={{
            "--chakra-colors-fg-muted": "white",
            "--chakra-colors-bg": "#000",
          }}
        >
          <FileUpload.FileUploadDropzone
            description="اسحب الملفات هنا وافلت او ارفع"
            className="h-3 text-white bg-[#fff2] min-h-32 "
          />
          <FileUpload.FileUploadList />
        </FileUpload.FileUploadRoot>
      </div>
      <InputField
        required
        icon={<RxCodesandboxLogo />}
        title="الاسم"
        register={register("name")}
      />
      <InputField
        title="العنوان"
        icon={<MdOutlineLocationOn />}
        register={register("address")}
      />
      <InputField
        title="العمله"
        icon={<RiBillLine />}
        register={register("currency")}
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

const Store2 = ({ action }) => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const submit = (payload) => {
    try {
      setLoading(true);
      axios.patch("/api/shop", payload);
      action();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <InputField
        icon={<PiPhoneDisconnect />}
        title="رقم الهاتف"
        register={register("phone")}
      />
      <InputField
        icon={<BiLogoTiktok />}
        title="tiktok"
        register={register("tiktok")}
      />
      <InputField
        icon={<FaTwitter />}
        title="twitter"
        register={register("twitter")}
      />
      <InputField
        icon={<FaRegRegistered />}
        title="سجل تجاري"
        register={register("cr")}
      />

      <Button
        type="submit"
        loading={loading}
        className="my-3 mx-auto w-full flex-center gap-2 p-3 bg-slate-600 rounded-sm hover:bg-slate-800 focus:bg-slate-900"
      >
        <span>التالي</span>
        <FcPrevious />
      </Button>
    </form>
  );
};

const User = ({ action }) => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const submit = (payload) => {
    try {
      setLoading(true);
      axios.post("/api/user", { ...payload, role: "manager" });
      action();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <InputField
        icon={<TiUser />}
        title="اسم المستخدم"
        required
        register={register("name")}
      />
      <InputField
        required
        icon={<FaRegIdCard />}
        title="رقم المستخدم"
        register={register("username")}
      />
      <InputField
        required
        icon={<RiLockPasswordFill />}
        title="كلمة المرور"
        type="password"
        register={register("password")}
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
