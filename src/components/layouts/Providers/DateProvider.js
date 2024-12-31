"use client";

import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Loader from "@/components/Loader";

const DateProvider = ({ children }) => {
  const [loaded, setLoad] = useState(false);

  useEffect(() => setLoad(true), []);

  if (!loaded)
    return (
      <div className="h-screen flex-center">
        <Loader />
      </div>
    );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  );
};

export default DateProvider;
