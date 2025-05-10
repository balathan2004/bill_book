import React, { Component, ReactNode, useEffect } from "react";
import { AuthResponseConfig } from "../utils/interfaces";
import { useUserContext } from "./user_context";
import { useRouter } from "next/router";

export default function ContextWrapper({ children }: { children: ReactNode }) {
  const { setUserCred } = useUserContext();
  const router = useRouter();
  const getCred = async function () {
    const response = await fetch("/api/auth/login_cred", {
      method: "GET",
    });

    const res = (await response.json()) as AuthResponseConfig;
    if (res.status == 200) {
      router.push("/home");
      setUserCred(res.credentials);
    }
  };

  useEffect(() => {
    getCred();
  }, []);

  return <>{children}</>;
}
