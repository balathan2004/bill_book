import React, { useEffect, useState } from "react";
import { docInterface, ResponseConfig } from "../utils/interfaces";
import { format, isThisYear } from "date-fns";
import styles from "@/styles/home.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import CheckIcon from "@mui/icons-material/Check";
import SendData from "../utils/sendData";
import { useLoadingContext } from "../context/loading_context";
import { formatDate, formatWithCommas } from "./addExpenseDoc";
import { LoadingButton } from "@mui/lab";
import { newDoc } from "@/pages/home";
interface props {
  data: docInterface;
  changeDocData: React.Dispatch<React.SetStateAction<docInterface[]>>;
  setEditableDoc: React.Dispatch<React.SetStateAction<string | null>>;
  isActiveEdit: string | null;
}

const handleDate = (date: number) => {
  return isThisYear(date)
    ? format(date, "dd MMM hh:mm a") // e.g., "10 May"
    : format(date, "dd MMM yyyy");
};

export default function SingleCard({
  data,
  setEditableDoc,
  changeDocData,
  isActiveEdit,
}: props) {
  const [isEditable, setIsEditable] = useState(false);

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

    console.log(response,"doc deletion")

    if (response.status == 200) {
      changeDocData((prev) => {
        return prev.filter((ele) => ele.doc_id != data.doc_id);
      });
    }
  };

  useEffect(() => {
    if (isEditable) {
      setEditableDoc(data.doc_id);
    }
  }, [isEditable]);

  useEffect(() => {
    if (isActiveEdit === null) {
      setIsEditable(false);
    }
  }, [isActiveEdit]);

  return (
    <ListItem disablePadding className={styles.income_card}>
      <div className={styles.card_top}>
        <div className={styles.card_left}>
          <ListItemAvatar>
            <Avatar
              src={`https://ui-avatars.com/api/?name=${data.name}`}
              sx={{ width: "100%", height: "100%" }}
              alt={data.name}
              className={styles.avatar}
            ></Avatar>
          </ListItemAvatar>

          <div className={styles.name_board}>
            <div className={styles.card_vertical}>
              <ListItemText className={styles.card_name} primary={data.name} />
              <ListItemText
                primary={handleDate(data.invoice_time)}
                sx={{
                  whiteSpace: "nowrap", // no wrapping
                  overflow: "hidden", // hide extra text
                  textOverflow: "ellipsis", // add ...
                  maxWidth: "100%", // respect container width
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.card_right}>
          <div className={styles.card_description_price}>
            <ListItemText>Description</ListItemText>

            <ListItemText>
              {data.description ? data.description : "empty"}
            </ListItemText>
          </div>
          <div className={styles.card_vertical_price}>
            <ListItemText>
              Costing ={formatWithCommas(data.quantity)}x
              {formatWithCommas(data.price)}
            </ListItemText>

            <ListItemText>
              Gross={formatWithCommas(data.gross_price)}
            </ListItemText>
          </div>
          <div>
            <div style={{ cursor: "pointer" }}>
              {!isEditable ? (
                <EditSquareIcon
                  onClick={() => setIsEditable((prev) => !prev)}
                  style={{
                    fontSize: "2rem",
                    color: "#1976d2", // blue color
                    transition: "transform 0.2s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.2)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              ) : (
                <CheckIcon
                  onClick={() => {
                    setEditableDoc(null);
                    setIsEditable((prev) => !prev);
                  }}
                  style={{
                    fontSize: "2rem",
                    color: "#2e7d32", // green color
                    transition: "transform 0.2s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.2)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              )}
            </div>
          </div>
          <div>
            <DeleteIcon
              style={{
                fontSize: "2rem",
                color: "red", // green color
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onClick={handleDelete}
            />
          </div>
          <div></div>
        </div>
      </div>
    </ListItem>
  );
}
