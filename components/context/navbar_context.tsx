import React, { Component, ReactNode, useContext, useState } from "react";

interface NavItem {
  name: string;
  path: string;
}

export const NavInit: NavItem[] = [
  { name: "home", path: "/home" },
  { name: "login", path: "/login" },
  { name: "about", path: "/about" },
];

export const NavUsers: NavItem[] = [
  { name: "home", path: "/home" },
  { name: "invoice", path: "/invoice" },
  { name: "account", path: "/account" },
];

export interface NavbarContextType {
  dirs: NavItem[];
  setDirs: React.Dispatch<React.SetStateAction<NavItem[]>>;
}

export const NavbarContext = React.createContext<NavbarContextType>({
  dirs: [],
  setDirs: () => {},
});

export const NavbarHolder = ({ children }: { children: ReactNode }) => {
  const [dirs, setDirs] = useState<NavItem[]>(NavInit);

  return (
    <NavbarContext.Provider value={{ dirs, setDirs }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbarContext = () => useContext(NavbarContext);
