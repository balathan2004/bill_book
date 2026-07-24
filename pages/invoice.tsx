import { useGetAllDocsQuery } from "@/src/redux/api/docsApi";
import { Button } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import * as XLSX from "xlsx";

export const columns = [
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

export default function Invoice() {
  const { data: { data: docData = [] } = {} } = useGetAllDocsQuery({});

  function exportToExcel() {
    const newData =
      docData?.map((ele) => {
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
      }) || [];

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
        rows={docData}
      />
      <div>
        <Button onClick={exportToExcel}>Download</Button>
      </div>
    </div>
  );
}
