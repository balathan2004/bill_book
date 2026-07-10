import React, { Component, ReactNode, useEffect } from "react";
import { AuthResponseConfig } from "../utils/interfaces";
import { useRouter } from "next/router";

export default function ContextWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const getCred = async function () {
    const response = await fetch("/api/auth/login_cred", {
      method: "GET",
    });

    const res = (await response.json()) as AuthResponseConfig;
    if (res.status == 200) {
      if (router.pathname.includes("/auth") || router.pathname.endsWith("/")) {
        router.push("/home");
      }
    }
  };

  useEffect(() => {
    getCred();
  }, []);

  return <>{children}</>;
}
