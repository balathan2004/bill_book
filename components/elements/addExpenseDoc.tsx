import React, { useEffect, useRef } from "react";
import { TextField, Box, Select, MenuItem } from "@mui/material";
import styles from "@/styles/addDoc.module.css";
import { LoadingButton } from "@mui/lab";
import {
  InvoiceDoc,
  EditableBillDoc,
  InvoiceTagItem,
} from "@/src/server/utils/interfaces";
import TagPicker from "./multiSelect";

interface Props {
  data: EditableBillDoc;
  allOptions: InvoiceTagItem[];
  setData: React.Dispatch<React.SetStateAction<Partial<InvoiceDoc>>>;
  allDocs: InvoiceDoc[];
  onSubmit: () => void;
  onClear: () => void;
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

export default function AddExpenseDoc({
  data,
  allOptions,
  setData,
  allDocs,
  onSubmit,
  onClear,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute("list", "expenses");
    }
  }, []);

  const handleDocChange = (
    key: keyof EditableBillDoc,
    value: number | string,
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.add_doc}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <TextField
          required
          placeholder="name"
          name="name"
          value={data?.name}
          onChange={(event) => handleDocChange("name", event.target.value)}
          label="name"
          inputRef={inputRef}
          className={styles.input}
        />

        <datalist id="expenses">
          {[...new Set(allDocs.map((ele) => ele.name))].map((name) => (
            <option value={name} key={name}>
              {name}
            </option>
          ))}
        </datalist>

        <TextField
          placeholder="description"
          name="description"
          value={data?.description}
          onChange={(event) =>
            handleDocChange("description", event.target.value)
          }
          label="description"
          className={styles.input}
        />

        <TextField
          required
          label="quantity"
          onChange={(event) =>
            handleDocChange("quantity", parseInt(event.target.value))
          }
          name="quantity"
          placeholder="quantity"
          type="number"
          className={styles.count_input}
          value={formatWithCommas(data?.quantity || 0)}
        />

        <TextField
          required
          label="price"
          onChange={(event) =>
            handleDocChange("price", parseInt(event.target.value))
          }
          name="price"
          placeholder="price"
          type="number"
          className={styles.count_input}
          value={data?.price || 0}
        />

        <TextField
          required
          label="Invoice Time"
          type="datetime-local"
          name="invoice_time"
          className={styles.input_time}
          value={formatDate(data?.invoice_time || new Date().getTime())}
          onChange={(event) =>
            handleDocChange(
              "invoice_time",
              new Date(event.target.value).getTime(),
            )
          }
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Select
          size="small"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={data.invoice_type}
          label="invoice type"
          onChange={(event) =>
            handleDocChange("invoice_type", event.target.value)
          }
        >
          <MenuItem value={"income"}>Income</MenuItem>
          <MenuItem value={"expense"}>Expense</MenuItem>
        </Select>

        <TagPicker
          value={(data.tags as any) || []}
          options={allOptions}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              tags: value,
            }))
          }
        />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <strong>Total:</strong>
          &nbsp;₹{formatWithCommas((data.price || 0) * (data.quantity || 0))}
        </Box>

        <Box>
          <LoadingButton
            variant="contained"
            style={{ marginRight: 12 }}
            sx={{ height: "56px", width: "100px" }}
            fullWidth
            type="submit"
            loadingPosition="start"
          >
            Save
          </LoadingButton>
          <LoadingButton
            onClick={onClear}
            variant="contained"
            color="error"
            sx={{ height: "56px", width: "100px" }}
            fullWidth
            loadingPosition="start"
          >
            Clear
          </LoadingButton>
        </Box>
      </form>
    </div>
  );
}
