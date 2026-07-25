import React from "react";
import styles from "@/styles/account.module.css";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/src/redux/api/authSlice";
import Image from "next/image";

export default function Account() {
  const { userData } = useAuth();

  return (
    <div className="home_container">
      <div className={styles.home}>
        {userData ? (
          <article>
            <h1>Your Account</h1>
            <div className={styles.img_container}>
              <Image
                alt="profile_image"
                referrerPolicy="no-referrer"
                src={userData?.profile_url}
              ></Image>
              <span>{userData?.display_name}</span>
            </div>
            <div className={styles.content}>
              <span>{userData?.email}</span>
              <span>{`Joined ${formatDistanceToNow(
                userData?.createdAt,
              )}`}</span>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
