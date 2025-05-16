import React, { useEffect, useState } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext } from "next";
import { docResponseConfig, docInterface } from "@/components/utils/interfaces";
import { useUserContext } from "@/components/context/user_context";
import AddExpenseDoc, {
  formatWithCommas,
} from "@/components/elements/addExpenseDoc";
import SingleCard from "@/components/elements/singleCard";
import styles from "@/styles/home.module.css";

type sortingTypes = "ascending" | "decending" | "latest" | "oldest" | "by_name";

export default function Home({ data }: { data: docInterface[] }) {
  const { userCred } = useUserContext();
  const [docData, setDocData] = useState<docInterface[]>(data);
  const [showingDocs, setShowingDocs] = useState<docInterface[]>(data);

  const [sortBy, setSortBy] = useState<sortingTypes>("latest");

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (!value) {
      setShowingDocs(docData);
    }

    const filtered = docData.filter((doc) => doc.name.includes(value));
    setShowingDocs(filtered);
  };

  useEffect(() => {
    if (docData.length > 0) setShowingDocs(docData);
  }, [docData]);

  const handleSelect = (event: any) => {
    const value = event.target.value as sortingTypes;
    setSortBy(value);
  };

  useEffect(() => {
    setShowingDocs(sortingElements(showingDocs, sortBy));
  }, [sortBy]);

  function sortingElements(data: docInterface[], sortBy: sortingTypes) {
    const copiedData = data.slice();

    switch (sortBy) {
      case "ascending":
        return copiedData.sort((a, b) => a.gross_price - b.gross_price);
      case "decending":
        return copiedData.sort((a, b) => b.gross_price - a.gross_price);
      case "latest":
        return copiedData.sort((a, b) => b.invoice_time - a.invoice_time);
      case "oldest":
        return copiedData.sort((a, b) => a.invoice_time - b.invoice_time);
      case "by_name":
        return _.sortBy(copiedData, "name");
      default:
        return copiedData;
    }
  }

  const handleTotal = (docData: docInterface[]) => {
    const total = docData.reduce((sum, item) => (sum += item.gross_price), 0);

    return total;
  };

  return (
    <div className="home_container">
      <div className={styles.home}>
        <div className={styles.center_container}>
          <h1>Your Invoices</h1>
          {userCred ? (
            <>
              <nav>
                <div>
                  <AddExpenseDoc
                    userId={userCred?.uid}
                    setDocData={setDocData}
                  />
                </div>

                <div className={styles.items_searchbar}>
                  <TextField placeholder="search" onChange={handleInput} />
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    defaultValue="latest"
                    onChange={handleSelect}
                    label="Sort By"
                    style={{ minWidth: "200px" }}
                  >
                    <MenuItem value="latest">Latest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                    <MenuItem value="ascending">Price (ascending)</MenuItem>
                    <MenuItem value="decending">Price (decending)</MenuItem>
                    <MenuItem value="by_name">By Name</MenuItem>
                  </Select>
                </div>
              </nav>

              <div className={styles.items_container}>
                {showingDocs.map((item) => (
                  <SingleCard
                    data={item}
                    changeDocData={setDocData}
                    key={item.doc_id}
                  />
                ))}
              </div>
              <footer className={styles.footer}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderTop: "1px solid #ccc",
                    padding: 2,
                    textAlign: "right",
                    boxShadow: 2,
                  }}
                >
                  <Typography variant="h6">
                    Total: ₹{formatWithCommas(handleTotal(showingDocs))}
                  </Typography>
                </Box>
              </footer>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<ParsedUrlQuery>
) {
  try {
    const uid = context.req.cookies.bill_book_uid;
    if (!uid) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DomainUrl}/api/docs/get_docs`,
      {
        body: JSON.stringify({ uid }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const res = (await response.json()) as docResponseConfig;

    console.log(res);

    if (res.status == 200) {
      return {
        props: {
          data: res.docData,
        },
      };
    } else {
      return {
        props: {
          data: [],
        },
      };
    }
  } catch (err) {
    throw new Error(err as string);
  }
}
