import React from "react";
import { useUserContext } from "@/components/context/user_context";
import styles from "@/styles/account.module.css";
import { formatDistanceToNow } from "date-fns";

export default function Account() {
  const { userCred } = useUserContext();

  return (
    <div className="home_container">
      <div className={styles.home}>
        {userCred ? (
          <article>
            <h1>Your Account</h1>
            <div className={styles.img_container}>
              <img
                referrerPolicy="no-referrer"
                src={userCred?.profile_url}
              ></img>
              <span>{userCred?.display_name}</span>
            </div>
            <div className={styles.content}>
              <span>{userCred?.email}</span>
              <span>{`Joined ${formatDistanceToNow(
                userCred?.created_at
              )}`}</span>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
