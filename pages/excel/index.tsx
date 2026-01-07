import React, { Component, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { DataGrid, Row } from "react-data-grid";
import { docInterface } from "@/components/utils/interfaces";
import { columns } from "../invoice";
import styles from '@/styles/excel.module.css'

export default function UploadPage() {
  const [data, setData] = useState<any[]>([]);

  const setTo8AM = (date: Date): number => {
    const newDate = new Date(date);
    newDate.setUTCHours(8, 0, 0, 0); // Set to 08:00:00.000 UTC
    return newDate.getTime();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: "binary", cellDates: true });

      // Read first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const parsedData = jsonData.map((item: any) => {
        return {
          ...item,
          created_at: setTo8AM(item.created_at),
          invoice_time: setTo8AM(item.invoice_time),
        };
      });
      setData(parsedData);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
        <div className="home_container">
    <div className="container">
      <form>
        <h1>Upload Excel File</h1>
       
        <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
      </form>
       <DataGrid  rowHeight={40} style={{height:'100%',width:"90%",margin:"auto"}} className={styles.list}  columns={columns} rows={data}  />
    </div>
    
</div>
  );
}
