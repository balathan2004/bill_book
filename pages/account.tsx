import React from "react";
import styles from "@/styles/account.module.css";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/src/redux/api/authSlice";

export default function Account() {
  const { userData } = useAuth();

  return (
    <div className="home_container">
      <div className={styles.home}>
        {userData ? (
          <article>
            <h1>Your Account</h1>
            <div className={styles.img_container}>
              <img
                referrerPolicy="no-referrer"
                src={userData?.profile_url}
              ></img>
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
