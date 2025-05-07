import React, { Component, ReactNode, useContext, useState } from "react";
import { UserDataInterface } from "../utils/interfaces";

type userType = UserDataInterface | null;

interface UserContextType {
  userCred: userType;
  setUserCred: React.Dispatch<React.SetStateAction<userType>>;
}

const UserContext = React.createContext<UserContextType>({
  userCred: null,
  setUserCred: () => {},
});

export const UserHolder = ({ children }: { children: ReactNode }) => {
  const [userCred, setUserCred] = useState<userType>(null);

  return (
    <UserContext.Provider value={{ userCred, setUserCred }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
