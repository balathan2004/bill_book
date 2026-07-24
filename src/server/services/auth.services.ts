import { auth } from "../db/firebase.server";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { fetchDoc, updateDoc, userDocRefMaker } from "../db/db.module";
import { User } from "../utils/interfaces";
import { generateUsername } from "unique-username-generator";

export const AuthService = {
  login: async (email: string, password: string) => {
    const userID = (await signInWithEmailAndPassword(auth, email, password))
      .user.uid;

    const userDocRef = userDocRefMaker(userID);
    const data = (await fetchDoc(
      userDocRef,
      "User document not found",
    )) as User;

    return data;
  },

  register: async (email: string, password: string) => {
    const emailSplit: string = email.split("@")[0].slice(0, 6);

    const userDoc = (
      await createUserWithEmailAndPassword(auth, email, password)
    ).user;



    const data: User = {
      email: email,
      display_name: userDoc.displayName
        ? userDoc.displayName
        : generateUsername(emailSplit, 3, 20, "user-"),
      profile_url: userDoc.photoURL
        ? userDoc.photoURL
        : `https://ui-avatars.com/api/?name=${emailSplit}`,
      uid: userDoc.uid,
      createdAt: new Date().getTime(),
    };

    console.log({ data });

    await updateDoc(userDocRefMaker(userDoc.uid), data).catch((err) => {
      console.error(err);
      throw new Error("Failed to create user document");
    });

    return data;
  },
  login_cred: async (uid: string) => {

    console.log({ uid }, "login_cred");
    const docRef = userDocRefMaker(uid);
    const data = (await fetchDoc(docRef)) as User;

    return data;
  },

  reset_password: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  },
};
