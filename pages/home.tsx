import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
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
    setShowingDocs(sortingElements(showingDocs, value));
  };

  function sortingElements(data: docInterface[], sortBy: sortingTypes) {
    if (sortBy == "ascending") {
      data.sort((a, b) => a.price - b.price);
    } else if (sortBy == "decending") {
      data.sort((a, b) => b.price - a.price);
    } else if (sortBy == "latest") {
      data.sort((a, b) => b.created_at - a.created_at);
    } else if (sortBy == "oldest") {
      data.sort((a, b) => a.created_at - b.created_at);
    } else if (sortBy == "by_name") {
      data = _.sortBy(data, "name");
    }
    return data;
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
              <AddExpenseDoc userId={userCred?.uid} setDocData={setDocData} />
              <div className={styles.items_container}>
                <div className={styles.items_searchbar}>
                  <TextField placeholder="search" onChange={handleInput} />
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    defaultValue="latest"
                    onChange={handleSelect}
                    label="Sort By"
                  >
                    <MenuItem value="latest">Latest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                    <MenuItem value="ascending">Price (ascending)</MenuItem>
                    <MenuItem value="decending">Price (decending)</MenuItem>
                    <MenuItem value="by_name">By Name</MenuItem>
                  </Select>
                </div>

                {showingDocs.map((item) => (
                  <SingleCard
                    data={item}
                    changeDocData={setDocData}
                    key={item.doc_id}
                  />
                ))}
                <div>
                  <Box
                    sx={{
                      position: "sticky",
                      bottom: 0,
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
                </div>
              </div>
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

    const response = await fetch("http://localhost:3000/api/docs/get_docs", {
      body: JSON.stringify({ uid }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
