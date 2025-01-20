"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserContext } from "~/context/user";

// components
import Link from "next/link";
import Image from "next/image";
import { Container, IconButton } from "@chakra-ui/react";
import * as MenuUI from "@/components/ui/menu";
import moment from "moment-timezone";
import axios from "axios";

// icons
import { LuLayoutDashboard } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiSettingsLine, RiBillLine } from "react-icons/ri";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { GoPeople } from "react-icons/go";
import { MdPowerSettingsNew } from "react-icons/md";
import { GrDocumentStore } from "react-icons/gr";

// assets
import trueemit from "@/assets/images/trueemit.png";
// css
import css from "./style.module.scss";

// component
export default function Header() {
  const search = useSearchParams();
  const headerSearch = search.get("header");

  if (headerSearch == "no") return <></>;

  // setup
  const { user } = useUserContext();

  // render
  return (
    <header
      className={`${css.header} mb-3 bg-[#fffa] shadow-lg z-10 sticky top-0`}
    >
      <Container>
        <div className="flex items-center gap-2 py-3">
          <div className="logo">
            <Link href="/">
              <Image src={trueemit} alt="trueemit" height={70} />
            </Link>
          </div>

          <p className="flex-1 self-end">
            أهلا،
            <span> {user.name}</span>
          </p>

          <Clock />
          <Menu />
        </div>
      </Container>
    </header>
  );
}

// compoenent
function Menu() {
  // config
  const router = useRouter();
  const { user } = useUserContext();

  // data
  const data = [
    [
      {
        title: "الرئيسيه",
        name: "home",
        icon: <LuLayoutDashboard />,
        action() {
          router.push("/");
        },
        role: ["casher", "manager"],
      },
      {
        title: "المشتريات",
        name: "purchases",
        icon: <RiBillLine />,
        action() {
          router.push("/manager/purchases");
        },
        role: ["manager"],
      },
      {
        title: "المبيعات",
        name: "sales",
        icon: <LiaMoneyBillWaveSolid />,
        action() {
          router.push("/manager/sales");
        },
        role: ["manager"],
      },
      {
        title: "المخزن",
        name: "inventory",
        icon: <GrDocumentStore />,
        action() {
          router.push("/manager/inventory");
        },
        role: ["manager"],
      },
      {
        title: "العملاء",
        name: "clients",
        icon: <GoPeople />,
        action() {
          router.push("/manager/clients");
        },
        role: ["manager"],
      },
    ],
    [
      {
        title: "الإعدادات",
        name: "settings",
        icon: <RiSettingsLine />,
        action() {
          router.push(`/${user.role}/settings`);
        },
        role: ["casher", "manager"],
      },
    ],
    [
      {
        title: "تسجيل الخروج",
        name: "logout",
        icon: <MdPowerSettingsNew />,
        action() {
          axios.delete("/api/auth").then((d) => router.push("/login"));
        },
        attr: {
          color: "fg.error",
          _hover: { bg: "bg.error", color: "fg.error" },
        },
        role: ["casher", "manager"],
      },
    ],
  ];

  // render
  return (
    <MenuUI.MenuRoot>
      <MenuUI.MenuTrigger asChild>
        <IconButton aria-label="toggle menu" variant="outline">
          <RxHamburgerMenu />
        </IconButton>
      </MenuUI.MenuTrigger>

      <MenuUI.MenuContent>
        {data.map((g, i) => (
          <MenuUI.MenuItemGroup key={i} title="">
            {i > 0 && <MenuUI.MenuSeparator />}
            {g
              .filter((e) => e.role.includes(user.role))
              .map((l, i) => (
                <MenuUI.MenuItem
                  onClick={(e) => l.action(e)}
                  className={css.link}
                  key={i}
                  value={l.name}
                  {...l.attr}
                  title={l.title}
                >
                  {l.icon}
                  {l.title}
                </MenuUI.MenuItem>
              ))}
          </MenuUI.MenuItemGroup>
        ))}
      </MenuUI.MenuContent>
    </MenuUI.MenuRoot>
  );
}

function Clock() {
  const userTimezone = moment.tz.guess();
  const [time, setTime] = useState(moment().tz(userTimezone));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().tz(userTimezone));
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${css.clock} Geomatrix `}>
      <div className={`${css.time} ep-stellari`}>
        {time.format("hh:mm")}
        <span className={css.a}>{time.format("a")}</span>
      </div>

      <div className={css.date}>{time.format("DD/MM/YYYY")}</div>
    </div>
  );
}
