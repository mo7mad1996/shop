"use client";
import { useEffect, useState } from "react";

// components
import Link from "next/link";
import Image from "next/image";
import { Container, IconButton } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  MenuSeparator,
  MenuItemGroup,
} from "@/components/ui/menu";
import moment from "moment-timezone";

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
  // render
  return (
    <header className={`${css.header} mb-3 bg-[#fff3] shadow-lg`}>
      <Container>
        <div className="flex items-center gap-2 py-3">
          <div className="logo">
            <Link href="/">
              <Image src={trueemit} alt="trueemit" height={70} />
            </Link>
          </div>

          <p className="flex-1 self-end">
            أهلا
            <span> احمد</span>
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
  // data
  const data = [
    [
      {
        title: "الرئيسيه",
        name: "home",
        icon: <LuLayoutDashboard />,
        action() {},
      },
      {
        title: "المشتريات",
        name: "purchases",
        icon: <RiBillLine />,
        action() {},
      },
      {
        title: "المبيعات",
        name: "sales",
        icon: <LiaMoneyBillWaveSolid />,
        action() {},
      },
      {
        title: "المخزن",
        name: "inventory",
        icon: <GrDocumentStore />,
        action() {},
      },
      {
        title: "العملاء",
        name: "clients",
        icon: <GoPeople />,
        action() {},
      },
    ],
    [
      {
        title: "الإعدادات",
        name: "settings",
        icon: <RiSettingsLine />,
        action() {},
      },
    ],
    [
      {
        title: "تسجيل الخروج",
        name: "logout",
        icon: <MdPowerSettingsNew />,
        action() {},
        attr: {
          color: "fg.error",
          _hover: { bg: "bg.error", color: "fg.error" },
        },
      },
    ],
  ];

  // render
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton aria-label="toggle menu" variant="outline">
          <RxHamburgerMenu />
        </IconButton>
      </MenuTrigger>

      <MenuContent>
        {data.map((g, i) => (
          <MenuItemGroup key={i} title="">
            {i > 0 && <MenuSeparator />}
            {g.map((l, i) => (
              <MenuItem
                onClick={(e) => l.action(e)}
                className={css.link}
                key={i}
                value={l.name}
                {...l.attr}
                title={l.title}
              >
                {l.icon}
                {l.title}
              </MenuItem>
            ))}
          </MenuItemGroup>
        ))}
      </MenuContent>
    </MenuRoot>
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
