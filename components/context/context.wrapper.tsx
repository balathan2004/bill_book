import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useLazyGetLoginCredQuery } from "@/src/redux/api/authApi";
import { useAuth } from "@/src/redux/api/authSlice";

export default function ContextWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [getLoginCred, { data, isLoading, isError }] =
    useLazyGetLoginCredQuery();

  const { changeAccessToken, changeRefreshToken } = useAuth();

  useEffect(() => {
    const getCred = async function () {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.log("No refresh token found");
          return;
        }

        if (!accessToken) {
          console.log("No access token found");
          return;
        }

        changeAccessToken(accessToken);

        changeRefreshToken(refreshToken);

        const response = await getLoginCred().unwrap();
        if (response?.data) {
          // console.log({ response }, "response from getLoginCred");
        }
      } catch (error) {
        console.log({ error }, "error from getLoginCred");
      }
    };
    getCred();
  }, []);

  return <>{children}</>;
}
