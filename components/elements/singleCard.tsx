import React, { useState } from "react";
import { docInterface, ResponseConfig } from "../utils/interfaces";
import { format, isThisYear } from "date-fns";
import styles from "@/styles/home.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Box,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import CheckIcon from "@mui/icons-material/Check";
import SendData from "../utils/sendData";
import { formatWithCommas } from "./addExpenseDoc";
interface props {
  data: docInterface;
  changeDocData: React.Dispatch<React.SetStateAction<docInterface[]>>;
}

const handleDate = (date: number) => {
  return isThisYear(date)
    ? format(date, "dd MMM") // e.g., "10 May"
    : format(date, "dd MMM yyyy");
};

export default function SingleCard({ data, changeDocData }: props) {
  const [docData, setDocData] = useState(data);
  const [isEditable, setIsEditable] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const value = event.target.value.replace(/,/g, "");

    setDocData((prev) => {
      const updatedDoc = {
        ...prev,
        [name]: value,
      };

      const quantity = updatedDoc.quantity || 0;
      const price = updatedDoc.price || 0;

      if (name === "quantity" || name === "price") {
        updatedDoc.gross_price = quantity * price;
      }

      return updatedDoc;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/docs/add_doc", {
      method: "POST",
      body: JSON.stringify(docData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await response.json()) as ResponseConfig;

    if (res.status == 200) {
      changeDocData((prev) => {
        const filtered = prev.filter((item) => item.doc_id != data.doc_id);
        return [...filtered, docData];
      });
    }
  };

  const handleDelete = async () => {
    const confimation = confirm("do you want to delete this transaction");
    if (!confimation) {
      return;
    }

    const sendData = {
      uid: data.uid,
      doc_id: data.doc_id,
    };

    const response = await SendData({
      data: sendData,
      route: "/api/docs/delete_doc",
    });

    if (response.status == 200) {
      changeDocData((prev) => {
        return prev.filter((ele) => ele.doc_id != data.doc_id);
      });
    }
  };

  return (
    <ListItem disablePadding className={styles.income_card}>
      <div className={styles.card_top}>
        <div className={styles.card_left}>
          <ListItemAvatar>
            <Avatar
              src={`https://ui-avatars.com/api/?name=${data.name}`}
              sx={{ width: "100%", height: "100%" }}
              alt={data.name}
            ></Avatar>
          </ListItemAvatar>

          <div className={styles.name_board}>
            <div className={styles.card_vertical}>
              <ListItemText className={styles.card_name} primary={data.name} />
              <ListItemText primary={handleDate(docData.created_at)} />
            </div>
          </div>
        </div>

        <div className={styles.card_right}>
          <div className={styles.card_vertical_price}>
            <ListItemText>
              Costing ={formatWithCommas(docData.quantity)}x
              {formatWithCommas(docData.price)}
            </ListItemText>

            <ListItemText>
              Gross={formatWithCommas(docData.gross_price)}
            </ListItemText>
          </div>
          <div>
            {!isEditable ? (
              <EditSquareIcon onClick={() => setIsEditable((prev) => !prev)} />
            ) : (
              <CheckIcon onClick={() => setIsEditable((prev) => !prev)} />
            )}
          </div>
          <div>
            <DeleteIcon onClick={handleDelete} />
          </div>
          <div></div>
        </div>
      </div>
      <div className={styles.card_bottom}>
        {isEditable ? (
          <div className={styles.add_doc}>
            <form onSubmit={handleSubmit}>
              <TextField
                required
                placeholder="name"
                name="name"
                value={docData?.name}
                onChange={handleInput}
                label="name"
              ></TextField>

              <TextField
                required
                label="quantity"
                onChange={handleInput}
                name="quantity"
                placeholder="quantity"
                type="text"
                sx={{ width: 150 }}
                value={formatWithCommas(docData?.quantity)}
              ></TextField>
              <TextField
                required
                label="price"
                onChange={handleInput}
                name="price"
                placeholder="price"
                type="text"
                sx={{ width: 150 }}
                value={formatWithCommas(docData?.price)}
              ></TextField>
              <TextField
                required
                onChange={handleInput}
                name="gross_price"
                placeholder="gross price"
                label="gross price"
                type="text"
                value={formatWithCommas(docData?.gross_price)}
                sx={{ width: 150 }}
                disabled
              ></TextField>
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ height: "56px", width: "100px" }}
                  fullWidth
                >
                  Save
                </Button>
              </Box>
            </form>
            <div className="spacer"></div>
          </div>
        ) : null}
      </div>
    </ListItem>
  );
}
