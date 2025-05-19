import React, { useEffect, useState } from "react";
import { docInterface, ResponseConfig } from "../utils/interfaces";
import { TextField, Button, Box } from "@mui/material";
import styles from "@/styles/home.module.css";
import { LoadingButton } from "@mui/lab";
import { useLoadingContext } from "../context/loading_context";

interface Props {
  data: docInterface;
  setDocData: React.Dispatch<React.SetStateAction<docInterface[]>>;
  resetAddDoc:()=>void
 
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

export default function AddExpenseDoc({ data, resetAddDoc,setDocData }: Props) {
  const [singleDoc, setSingleDoc] = useState<docInterface>(data);

  const { loading, setLoading } = useLoadingContext();

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
    setLoading(true);

    const response = await fetch("/api/docs/add_doc", {
      method: "POST",
      body: JSON.stringify(singleDoc),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await response.json()) as ResponseConfig;
    setLoading(false);
    if (res.status == 200) {
      setDocData((prev) => {
        const filtered = prev.filter((doc) => doc.doc_id != singleDoc.doc_id);
        return [singleDoc, ...filtered];
      });
      resetAddDoc()
    }
  };

  useEffect(() => {
    setSingleDoc(data);
  }, [data]);

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
          className={styles.input}
        ></TextField>

        <TextField
          placeholder="description"
          name="description"
          value={singleDoc?.description}
          onChange={handleInput}
          label="description"
          className={styles.input}
        ></TextField>

        <TextField
          required
          label="quantity"
          onChange={handleInput}
          name="quantity"
          placeholder="quantity"
          type="text"
          className={styles.input}
          value={formatWithCommas(singleDoc?.quantity)}
        ></TextField>
        <TextField
          required
          label="price"
          onChange={handleInput}
          name="price"
          placeholder="price"
          type="text"
          className={styles.input}
          value={formatWithCommas(singleDoc?.price)}
        ></TextField>
        <TextField
          required
          onChange={handleInput}
          name="gross_price"
          placeholder="gross price"
          label="gross price"
          type="text"
          className={styles.input}
          value={formatWithCommas(singleDoc?.gross_price)}
          disabled
        ></TextField>
        <TextField
          required
          label="Invoice Time"
          type="datetime-local"
          name="invoice_time"
          className={styles.input_time}
          value={formatDate(singleDoc.invoice_time)}
          onChange={handleInput}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Box>
          <LoadingButton
            variant="contained"
            sx={{ height: "56px", width: "100px" }}
            fullWidth
            loading={loading} // your boolean state
            type="submit"
            loadingPosition="start"
          >
            Save
          </LoadingButton>
        </Box>
      </form>
    </div>
  );
}
