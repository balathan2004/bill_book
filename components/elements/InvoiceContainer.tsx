import React, { Component } from "react";
import SingleCard from "./singleCard";
import styles from "../../styles/home.module.css";
import { InvoiceDoc } from "@/src/server/utils/interfaces";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

type Props = {
  invoices: InvoiceDoc[];
  currentDoc: Partial<InvoiceDoc>;
  setCurrentDoc: (item: InvoiceDoc) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
};

export default function InvoiceContainer({
  invoices,
  currentDoc,
  onCancelEdit,
  onDelete,
  setCurrentDoc,
}: Props) {
  return (
    <div className={styles.items_container}>
      <Paper sx={{ width: "100%" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Gross</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {invoices?.map((item) => (
              <SingleCard
                data={item}
                key={item.doc_id}
                isActiveEdit={currentDoc.doc_id == item.doc_id}
                onEdit={() => setCurrentDoc(item)}
                onCancelEdit={onCancelEdit}
                onDelete={() => onDelete(item.doc_id)}
              />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
