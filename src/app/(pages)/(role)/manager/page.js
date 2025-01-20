// components
import { Grid, For, Box, GridItem } from "@chakra-ui/react";
import Link from "next/link";

// icons
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { GrDocumentStore } from "react-icons/gr";
import { PiUsersThreeBold } from "react-icons/pi";
import { RiSettingsLine, RiBillLine } from "react-icons/ri";
import { GoPeople } from "react-icons/go";
import { FaLongArrowAltLeft } from "react-icons/fa";

export default function Manager() {
  const links = [
    {
      title: "المخزن",
      to: "/manager/inventory",
      icon: <GrDocumentStore />,
    },
    {
      title: "المبيعات",
      to: "/manager/sales",
      icon: <LiaMoneyBillWaveSolid />,
    },
    {
      title: "المشتريات",
      to: "/manager/purchases",
      icon: <RiBillLine />,
    },
    {
      title: "المستخدمين",
      to: "/manager/users",
      icon: <PiUsersThreeBold />,
    },
    {
      title: "العملاء",
      to: "/manager/clients",
      icon: <GoPeople />,
    },
    {
      title: "الإعدادت",
      to: "/manager/settings",
      icon: <RiSettingsLine />,
    },
  ];

  return (
    <>
      <Box className=" p-6 text-center">
        <h2 className="text-4xl  mb-10 text-gray-900">
          مرحباً كيف حالك اليوم؟
        </h2>
        <p className="text-gray-600">من أين تحب ان نبدأ...</p>
      </Box>
      <hr className="my-4" />
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap={4}
      >
        <For each={links}>
          {(link, i) => (
            <GridItem key={i}>
              <Link href={link.to} title={link.title} className="block">
                <Box className=" group flex gap-2 items-center bg-white p-3 rounded-sm shadow-md text-gray-800 justify-between hover:bg-slate-50 pres">
                  {link.title}
                  <div className="relative">
                    <span className="absolute top-0 translate-x-4 translate-y-[-50%]  group-hover:translate-x-8 transition-all group-hover:opacity-0">
                      {link.icon}
                    </span>

                    <FaLongArrowAltLeft className="absolute  translate-y-[-50%] top-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all" />
                  </div>
                </Box>
              </Link>
            </GridItem>
          )}
        </For>
      </Grid>
    </>
  );
}
