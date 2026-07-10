import {
  DataRes,
  ResponseConfig,
  User,
} from "@/server/utils/interfaces";
import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      DataRes<User>,
      { email: string; password: string }
    >({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: { data: payload },
      }),
    }),
    register: builder.mutation<
      DataRes<User>,
      { email: string; password: string }
    >({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
    }),
    getLoginCred: builder.query<DataRes<User>, void>({
      query: (payload) => ({
        url: "/auth/login_cred",
        method: "GET",
      }),
    }),
    logout: builder.query<DataRes<User>, void>({
      query: (payload) => ({
        url: "/auth/logout",
        method: "GET",
      }),
    }),
    resetPasswordEmail: builder.mutation<ResponseConfig, { email: string }>({
      query: (payload) => ({
        url: `/auth/reset_password?email=${payload.email}`,
        body: payload,
        method: "POST"
      })
    })
  }),
});

export default authApi;
export const {
  useLoginMutation,
  useRegisterMutation,
  useLazyGetLoginCredQuery,
  useResetPasswordEmailMutation,
  useLazyLogoutQuery
} = authApi;
