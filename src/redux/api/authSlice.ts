import { createSlice } from "@reduxjs/toolkit";
import authApi from "./authApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { User } from "@/src/server/utils/interfaces";


interface NavItem {
  name: string;
  path: string;
}

type AuthState = {
  userData: User | null;
  navState: NavItem[];
  accessToken: string | null;
  refreshToken: string | null;
};



export const NavGuests: NavItem[] = [
  // { name: "home", path: "/home" },
  { name: "login", path: "/auth/login" },
  { name: "register", path: "/auth/register" },
  { name: "about", path: "/about" },
];

export const NavUsers: NavItem[] = [
  { name: "home", path: "/home" },
  { name: "invoice", path: "/invoice" },
  { name: "account", path: "/account" },
];


const initialState: AuthState = {
  userData: null,
  navState: NavGuests,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  initialState: initialState,
  name: "authSlice",
  reducers: {

    setUser: (state, action) => {
      state.userData = action.payload;
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    logout: (state) => {
      state.userData = null;
      state.navState = NavGuests;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },

  },
  extraReducers: (builder) => {
    (builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.userData = payload.data;
        state.accessToken = payload.data?.accessToken || null;
        state.refreshToken = payload.data?.refreshToken || null;
        state.navState = NavUsers;
        localStorage.setItem("accessToken", payload.data?.accessToken || "");
        localStorage.setItem("refreshToken", payload.data?.refreshToken || "");
      },
    ),
      builder.addMatcher(
        authApi.endpoints.getLoginCred.matchFulfilled,
        (state, { payload }) => {

          state.userData = payload.data;
          state.accessToken = payload.data?.accessToken || null;
          state.refreshToken = payload.data?.refreshToken || null;
          state.navState = NavUsers;
        },
      ));
  },
});

export const { setAccessToken, setRefreshToken, logout, setUser } = authSlice.actions;

export const useAuth = () => {


  const dispatch = useDispatch();

  const changeAccessToken = (token: string) => {
    dispatch(setAccessToken(token));
  }

  const changeRefreshToken = (token: string) => {
    dispatch(setRefreshToken(token));
  }

  const logoutUser = () => {
    dispatch(logout());
  }


  const data = useSelector((state: RootState) => state.auth);

  return { ...data, changeAccessToken, changeRefreshToken, logoutUser };
};

export default authSlice.reducer;
