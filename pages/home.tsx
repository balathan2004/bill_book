import React, { useState } from "react";
import { Button } from "@mui/material";
import _ from "lodash";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext } from "next";
import { docResponseConfig, docInterface } from "@/components/utils/interfaces";
import { useUserContext } from "@/components/context/user_context";
import AddExpenseDoc from "@/components/elements/addExpenseDoc";
import SingleCard from "@/components/elements/singleCard";
import styles from "@/styles/home.module.css";

function groupByTypeAndTime(docData: docInterface[]) {
  // Group by type
  const groupedByType = _.groupBy(docData, "name");

  // Group by date (time) separately
  const groupedByDate = _.groupBy(docData, (item) =>
    new Date(item.created_at).toDateString()
  );

  return {
    groupedByType,
    groupedByDate,
  };
}

export default function Home({ data }: { data: docInterface[] }) {
  const { userCred } = useUserContext();
  const [docData, setDocData] = useState<docInterface[]>(data);

  // const { groupedByType, groupedByDate } = groupByTypeAndTime(docData);

  const [isGroupedType, setIsGroupedType] = useState(false);

  const handleToggle = () => {
    setIsGroupedType((prev) => !prev);
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
                {docData.map((item) => (
                  <SingleCard data={item} key={item.doc_id} />
                ))}
              </div>

              <Button onClick={handleToggle}>Toggle Group</Button>
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
