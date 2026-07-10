// baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { DataRes, User } from "@/server/utils/interfaces";
import { setAccessToken } from "./authSlice";
import { ref } from "firebase/storage";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  // no credentials here
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.userData.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;

    const refreshToken =
      state.auth.userData.refreshToken ||
      localStorage.getItem("refreshToken") ||
      null;

    console.log({ refreshToken }, "refresh token in baseQueryWithAuth");

    if (!refreshToken) {
      api.logout();
      return result;
    }

    const { data: responseData, error } = (await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: {
          refreshToken,
        },
      },
      api,
      extraOptions,
    )) as { data: any; error: any };
    if (responseData && responseData.data) {
      const data = responseData?.data as User;

      localStorage.setItem("accessToken", data.accessToken || "");
      api.dispatch(setAccessToken(data.accessToken));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.logout();
    }
  }
  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["docs"],
  endpoints: () => ({}),
});
