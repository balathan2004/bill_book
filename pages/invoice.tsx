import { docInterface, docResponseConfig } from "@/components/utils/interfaces";
import { Button, TextField } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import * as XLSX from "xlsx";

const columns = [
  { key: "name", name: "Name" },
  { key: "quantity", name: "quantity" },
  { key: "price", name: "Price" },
  { key: "gross_price", name: "Total" },
  { key: "description", name: "description" },
  {
    key: "invoice_time",
    name: "Invoice Time",
    renderCell: ({ row }: { row: any }) =>
      new Date(row.invoice_time).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
  },
  {
    key: "created_at",
    name: "Created At",
    renderCell: ({ row }: { row: any }) =>
      new Date(row.created_at).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
  },
];

interface Props {
  data: docInterface[];
}

export default function Invoice({ data }: Props) {
  function exportToExcel() {
    const newData = data.map((ele) => {
      const { doc_id, uid, ...others } = ele;

      return {
        ...others,
        invoice_time: new Date(others.invoice_time).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        created_at: new Date(others.created_at).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(newData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(workbook, "data.xlsx");
  }

  return (
    <div className="home_container">
      <DataGrid
        style={{ backgroundColor: "white" }}
        columns={columns}
        rows={data}
      />
      <div>
        <Button onClick={exportToExcel}>Download</Button>
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
