import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import _, { values } from "lodash";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext } from "next";
import { docResponseConfig, docInterface } from "@/components/utils/interfaces";
import { useUserContext } from "@/components/context/user_context";
import AddExpenseDoc from "@/components/elements/addExpenseDoc";
import SingleCard from "@/components/elements/singleCard";
import styles from "@/styles/home.module.css";

export default function Home({ data }: { data: docInterface[] }) {
  const { userCred } = useUserContext();
  const [docData, setDocData] = useState<docInterface[]>(data);
  const [showingDocs, setShowingDocs] = useState<docInterface[]>(data);

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

  const handleTotal=(docData:docInterface[])=>{

    const total =docData.reduce((sum,item)=>sum+=item.gross_price,0)

    return total;

  }

  return (
    <div className="home_container">
      <div className={styles.home}>
        <div className={styles.center_container}>
          <h1>Your Invoices</h1>
          {userCred ? (
            <>
              <AddExpenseDoc userId={userCred?.uid} setDocData={setDocData} />
              <div className={styles.items_container}>
                <TextField
                  placeholder="search"
                  fullWidth
                  onChange={handleInput}
                />
                {showingDocs.map((item) => (
                  <SingleCard
                    data={item}
                    changeDocData={setDocData}
                    key={item.doc_id}
                  />
                ))}
                <div>
                  <p>total = {handleTotal(showingDocs)}</p>
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
