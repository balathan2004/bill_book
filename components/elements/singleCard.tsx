import React, {  useState } from "react";
import { docInterface, ResponseConfig } from "../utils/interfaces";
import { format, isThisYear } from "date-fns";
import styles from "@/styles/home.module.css";
import { Box, Button, TextField } from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import CheckIcon from "@mui/icons-material/Check";
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
    const { name, value } = event.target;

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

  return (
    <div className={styles.income_card}>
      <div className={styles.card_top}>
        <div className={styles.card_left}>
          <img src={`https://ui-avatars.com/api/?name=${data.name}`}></img>

          <div className={styles.name_board}>
            <div className={styles.card_vertical}>
              <span>{docData.name}</span>
              <span>{handleDate(docData.created_at)}</span>
            </div>
          </div>
        </div>

        <div className={styles.card_right}>
          <div className={styles.card_vertical_price}>
            <span>
              Costing ={docData.quantity}x{docData.price}
            </span>

            <span>Gross={docData.gross_price}</span>
          </div>
          <div>
            {!isEditable ? (
              <EditSquareIcon onClick={() => setIsEditable((prev) => !prev)} />
            ) : (
              <CheckIcon onClick={() => setIsEditable((prev) => !prev)} />
            )}
          </div>
        </div>
      </div>
      <div className={styles.card_bottom}>
        {isEditable ? (
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
              type="number"
              value={docData?.quantity}
            ></TextField>
            <TextField
              required
              label="price"
              onChange={handleInput}
              name="price"
              placeholder="price"
              type="number"
              value={docData?.price}
            ></TextField>
            <TextField
              required
              onChange={handleInput}
              name="gross_price"
              placeholder="gross price"
              label="gross price"
              type="number"
              value={docData?.gross_price}
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
        ) : null}
      </div>
    </div>
  );
}
