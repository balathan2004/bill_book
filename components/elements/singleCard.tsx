import React, { Component } from "react";
import { docInterface } from "../utils/interfaces";
import { format, isThisYear } from "date-fns";
import styles from "@/styles/home.module.css";

interface props {
  data: docInterface;
}

const handleDate = (date: number) => {
  return isThisYear(date)
    ? format(date, "dd MMM") // e.g., "10 May"
    : format(date, "dd MMM yyyy");
};

export default function SingleCard({ data }: props) {
  return (
    <div className={styles.income_card}>
      <div>
        <img src={`https://ui-avatars.com/api/?name=${data.name}`}></img>
      </div>
      <div className={styles.card_right}>
        <div className={styles.card_vertical}>
          <span>{data.name}</span>
          <span>{handleDate(data.created_at)}</span>
        </div>

        <div className={styles.card_vertical_price}>
          <span>
            costing ={data.quantity}x{data.price}
          </span>

          <span>Gross={data.gross_price}</span>
        </div>
      </div>
    </div>
  );
}
