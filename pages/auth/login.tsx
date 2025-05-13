import { Button } from "@mui/material";
import React, { Component } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { useLoadingContext } from "@/components/context/loading_context";
import { auth } from "@/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  AuthResponseConfig,
  UserDataInterface,
} from "@/components/utils/interfaces";
import SendData from "@/components/utils/sendData";
import { useRouter } from "next/router";
import { useUserContext } from "@/components/context/user_context";

export default function Login() {
  const { loading, setLoading } = useLoadingContext();
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const { setUserCred } = useUserContext();

  const handlePopUp = async () => {
    setLoading(true);
    const userCred = await signInWithPopup(auth, provider).then((user) => {
      return {
        display_name: user.user.displayName || user.user.email,
        email: user.user.email,
        created_at: user.user.metadata.creationTime
          ? new Date(user.user.metadata.creationTime).getTime()
          : new Date().getTime(),
        uid: user.user.uid,
        profile_url: user.user.photoURL || "",
      } as UserDataInterface;
    });

    const response = (await SendData({
      data: userCred,
      route: "/api/auth/login",
      credentials: true,
    })) as AuthResponseConfig;
    setLoading(false);
    if (response.status == 200) {
      setUserCred(response.credentials);
      router.push("/");
    }
  };

  return (
    <div className="home_container">
      <Button
        component="label"
        variant="contained"
        loading={loading}
        loadingPosition="start"
        tabIndex={-1}
        startIcon={<GoogleIcon />}
        onClick={handlePopUp}
      >
        Continue With Google
      </Button>
    </div>
  );
}
