import React, { useState } from "react";
import { docInterface, ResponseConfig } from "../utils/interfaces";
import { TextField, Button, Box } from "@mui/material";
import ShortUniqueId from "short-unique-id";
import styles from "@/styles/home.module.css";
const uuid = new ShortUniqueId({ length: 20 });

interface Props {
  userId: string;
  setDocData: React.Dispatch<React.SetStateAction<docInterface[]>>;
}

export const formatWithCommas = (val: number) => {
  return val ? Number(val).toLocaleString("en-US") : val;
};

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function AddExpenseDoc({ userId, setDocData }: Props) {
  const time = new Date().getTime();

  const initDoc: docInterface = {
    doc_id: uuid.rnd(),
    uid: userId,
    created_at: time,
    invoice_time: time,
    name: "",
    quantity: 1,
    price: 0,
    gross_price: 0,
    description: "",
  };

  const [singleDoc, setSingleDoc] = useState<docInterface>(initDoc);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const value = event.target.value.replace(/,/g, "");

    setSingleDoc((prev) => {
      const updatedDoc = {
        ...prev,
        [name]: value,
      };

      const quantity = updatedDoc.quantity || 0;
      const price = updatedDoc.price || 0;

      if (name === "quantity" || name === "price") {
        updatedDoc.gross_price = quantity * price;
      }
      if (name == "invoice_time") {
        updatedDoc.invoice_time = new Date(value).getTime();
      }

      return updatedDoc;
    });
  };

  const appendDoc = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      return;
    }
    const response = await fetch("/api/docs/add_doc", {
      method: "POST",
      body: JSON.stringify(singleDoc),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await response.json()) as ResponseConfig;

    if (res.status == 200) {
      setDocData((prev) => [{ ...singleDoc }, ...prev]);
      setSingleDoc(initDoc);
    }
  };

 

  return (
    <div className={styles.add_doc}>
      <form onSubmit={appendDoc}>
        <TextField
          required
          placeholder="name"
          name="name"
          value={singleDoc?.name}
          onChange={handleInput}
          label="name"
        ></TextField>

        <TextField
          placeholder="description"
          name="description"
          value={singleDoc?.description}
          onChange={handleInput}
          label="description"
        ></TextField>

        <TextField
          required
          label="quantity"
          onChange={handleInput}
          name="quantity"
          placeholder="quantity"
          type="text"
          sx={{ width: 150 }}
          value={formatWithCommas(singleDoc?.quantity)}
        ></TextField>
        <TextField
          required
          label="price"
          onChange={handleInput}
          name="price"
          placeholder="price"
          type="text"
          sx={{ width: 150 }}
          value={formatWithCommas(singleDoc?.price)}
        ></TextField>
        <TextField
          required
          onChange={handleInput}
          name="gross_price"
          placeholder="gross price"
          label="gross price"
          type="text"
          value={formatWithCommas(singleDoc?.gross_price)}
          disabled
          sx={{ width: 150 }}
        ></TextField>
        <TextField
          required
          label="Invoice Time"
          type="datetime-local"
          name="invoice_time"
          value={formatDate(singleDoc.invoice_time)}
          onChange={handleInput}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ width: 250 }}
        />
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
    </div>
  );
}
