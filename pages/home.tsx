import React, { useState } from "react";
import { Box, MenuItem, Select, TextField } from "@mui/material";
import AddExpenseDoc, {
  formatWithCommas,
} from "@/components/elements/addExpenseDoc";
import styles from "@/styles/home.module.css";
import ShortUniqueId from "short-unique-id";
import { useAuth } from "@/src/redux/api/authSlice";
import { InvoiceDoc, EditableBillDoc } from "@/src/server/utils/interfaces";
import {
  useDeleteDocMutation,
  useGetAllDocsQuery,
  useUpdateDocMutation,
} from "@/src/redux/api/docsApi";
import { OrderByDirection } from "firebase/firestore";
import { useGetAlltagsQuery } from "@/src/redux/api/tagsApi";
import InvoiceContainer from "@/components/elements/InvoiceContainer";
const uuid = new ShortUniqueId({ length: 20 });

export const newDoc = (): EditableBillDoc => {
  const now = Date.now();
  return {
    doc_id: uuid.rnd(),
    created_at: now,
    invoice_time: now,
    name: "",
    quantity: 1,
    price: 0,
    invoice_type: "income",
    gross_price: 0,
    description: "",
  };
};

const UUID = new ShortUniqueId({ length: 24 });

type unmappedSortKeys = "latest" | "oldest" | "price_asc" | "price_desc";

type queryType = {
  sort: keyof InvoiceDoc;
  orderBy: OrderByDirection;
};

const sortMap: Record<unmappedSortKeys, queryType> = {
  latest: {
    sort: "invoice_time",
    orderBy: "desc",
  },
  oldest: {
    sort: "invoice_time",
    orderBy: "asc",
  },
  price_asc: {
    sort: "gross_price",
    orderBy: "asc",
  },
  price_desc: {
    sort: "gross_price",
    orderBy: "desc",
  },
};

export default function Home() {
  const { userData } = useAuth();

  const { data: { data: options = [] } = {} } = useGetAlltagsQuery({});
  const [query, setQuery] = useState<queryType>({
    orderBy: "desc",
    sort: "invoice_time",
  });

  const { data: { data: docData } = {} } = useGetAllDocsQuery(query);

  const [updateDoc, { isLoading }] = useUpdateDocMutation();

  const [deleteDoc] = useDeleteDocMutation();

  const [editableDoc, setEditableDoc] = useState<EditableBillDoc>(newDoc());

  const handleTotal = (docData: InvoiceDoc[]) => {
    const incomeTotal = docData
      .filter((item) => item.invoice_type === "income")
      .reduce((sum, item) => (sum += item.gross_price), 0);

    const expensetotal = docData
      .filter((item) => item.invoice_type === "expense")
      .reduce((sum, item) => (sum += item.gross_price), 0);

    return incomeTotal - expensetotal;
  };

  const handleSelect = (event: any) => {
    const value = event.target.value as unmappedSortKeys;

    setQuery(sortMap[value]);
  };

  const handleSubmit = async () => {
    if (!userData?.uid || !editableDoc?.price || !editableDoc?.quantity) return;

    try {
      const fullData = {
        ...editableDoc,
        created_at: editableDoc.created_at || new Date().getTime(),
        uid: userData.uid,
        gross_price: editableDoc.price * editableDoc.quantity,
        doc_id: editableDoc.doc_id || UUID.randomUUID(),
        tags: (editableDoc.tags ?? []).map((tag) =>
          typeof tag === "string" ? tag : tag.id,
        ),
      } as InvoiceDoc;

      const res = await updateDoc(fullData).unwrap();

      resetEditableDoc();
    } catch (err) {
      console.log({ err });
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteDoc(id)
      .unwrap()
      .then((res) => console.log({ res }))
      .catch((err) => console.log({ err }));
  };

  const resetEditableDoc = () => {
    setEditableDoc(newDoc());
  };

  return (
    <div className="home_container">
      <div className={styles.home}>
        <div className={styles.center_container}>
          <h1>Your Invoices</h1>
          {userData && (
            <>
              <nav>
                <div>
                  {editableDoc && (
                    <AddExpenseDoc
                      allOptions={options}
                      onClear={resetEditableDoc}
                      onSubmit={handleSubmit}
                      setData={setEditableDoc}
                      data={editableDoc}
                      allDocs={docData || []}
                    />
                  )}
                </div>

                <div className={styles.items_searchbar}>
                  <TextField placeholder="search" />
                  <Select
                    defaultValue="latest"
                    onChange={handleSelect}
                    label="Sort By"
                    style={{ minWidth: "200px" }}
                  >
                    <MenuItem value="latest">Latest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                    <MenuItem value="price_asc">Price (ascending)</MenuItem>
                    <MenuItem value="price_desc">Price (decending)</MenuItem>
                  </Select>
                </div>
              </nav>

              <InvoiceContainer
                currentDoc={editableDoc}
                invoices={docData || []}
                setCurrentDoc={(item) => setEditableDoc(item)}
                onCancelEdit={resetEditableDoc}
                onDelete={(id) => handleDelete(id)}
              />

              <Box
                sx={{
                  position: "sticky",
                  bottom: 0,
                  backgroundColor: "background.paper",
                  borderTop: "1px solid #ccc",
                  // p: 2,
                  zIndex: 10,
                }}
              >
                <footer className={styles.footer}>
                  <h2 style={{ textAlign: "right", paddingRight: 12 }}>
                    Total: ₹{formatWithCommas(handleTotal(docData || []))}
                  </h2>
                </footer>
              </Box>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
