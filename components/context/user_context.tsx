import React, { Component, ReactNode, useContext, useState } from "react";

interface NavItem {
  email:string,
  createdAt:number,

}

interface NavbarContextType {
  dirs: NavItem[];
  setDirs: React.Dispatch<React.SetStateAction<NavItem[]>>;
}

const NavbarContext = React.createContext<NavbarContextType>({
  dirs: [],
  setDirs: () => {},
});

export const NavbarHolder = ({ children }: { children: ReactNode }) => {
  const [dirs, setDirs] = useState<NavItem[]>([]);

  return (
    <NavbarContext.Provider value={{ dirs, setDirs }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useUserContext=()=>useContext(NavbarContext)
