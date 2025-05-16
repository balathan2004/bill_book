import React, { Component, ReactNode, useEffect } from "react";
import { AuthResponseConfig } from "../utils/interfaces";
import { useUserContext } from "./user_context";
import { useRouter } from "next/router";
import { useNavbarContext, NavUsers } from "./navbar_context";

export default function ContextWrapper({ children }: { children: ReactNode }) {
  const { setUserCred } = useUserContext();
  const { setDirs } = useNavbarContext();
  const router = useRouter();
  const getCred = async function () {
    const response = await fetch("/api/auth/login_cred", {
      method: "GET",
    });

    const res = (await response.json()) as AuthResponseConfig;
    if (res.status == 200) {
      setUserCred(res.credentials);
      setDirs(NavUsers);
      if (router.pathname.includes("/auth")||router.pathname.endsWith('/')) {
        router.push("/home");
      }
    }
  };

  useEffect(() => {
    getCred();
  }, []);

  return <>{children}</>;
}
