"use client";

import React, { createContext, useContext, useState } from "react";

const Context = createContext();

export const useUserContext = () => {
  return useContext(Context);
};

export const UserContextProvider = ({ children, initialContextValue }) => {
  const [user, setUser] = useState(initialContextValue.user);
  const [shop, setShop] = useState(initialContextValue.shop);

  return (
    <Context.Provider value={{ user, setUser, shop, setShop }}>
      {children}
    </Context.Provider>
  );
};
