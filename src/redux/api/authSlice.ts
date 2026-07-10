import { createSlice } from "@reduxjs/toolkit";
import authApi from "./authApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { UserDataInterface } from "@/components/utils/interfaces";

interface NavItem {
  name: string;
  path: string;
}



export const NavGuests: NavItem[] = [
  { name: "home", path: "/home" },
  { name: "login", path: "/auth/login" },
  { name: "about", path: "/about" },
];

export const NavUsers: NavItem[] = [
  { name: "home", path: "/home" },
  { name: "invoice", path: "/invoice" },
  { name: "account", path: "/account" },
];


const initialState = {
  userData: {
    display_name: "",
    email: "",
    profile_url: "",
    uid: "",
    created_at: 0,

  } as UserDataInterface,
  navState: NavGuests,
};

const authSlice = createSlice({
  initialState: initialState,
  name: "authSlice",
  reducers: {

  },
  extraReducers: (builder) => {
    (builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.userData = payload.data;
        state.navState = NavUsers;
        localStorage.setItem("accessToken", payload.data?.accessToken || "");
        localStorage.setItem("refreshToken", payload.data?.refreshToken || "");
      },
    ),
      builder.addMatcher(
        authApi.endpoints.getLoginCred.matchFulfilled,
        (state, { payload }) => {
          state.userData = payload.data;
          state.navState = NavUsers;
        },
      ));
  },
});

// export const { setAccessToken, setRefreshToken } = authSlice.actions;

export const useAuth = () => {


  const data = useSelector((state: RootState) => state.auth);

  return { ...data };
};

export default authSlice.reducer;
