import React from "react";
import { format, isThisYear } from "date-fns";
import styles from "@/styles/home.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { ListItemText, TableCell, TableRow } from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import CheckIcon from "@mui/icons-material/Check";
import { formatWithCommas } from "../elements/addExpenseDoc";
import { InvoiceDoc } from "@/src/server/utils/interfaces";

interface props {
  data: InvoiceDoc;
  isActiveEdit: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

const handleDate = (date: number) => {
  return isThisYear(date)
    ? format(date, "dd-MMM hh:mm a") // e.g., "10 May"
    : format(date, "dd MMM yyyy");
};

export default function SingleCard({
  data,
  isActiveEdit,
  onCancelEdit,
  onEdit,
  onDelete,
}: props) {
  return (
    <TableRow className={styles.income_card}>
      <TableCell>
        <div className={styles.card_left}>
          <div className={styles.name_board}>
            <div className={styles.card_vertical}>
              <ListItemText className={styles.card_name} primary={data.name} />
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={handleDate(data.invoice_time)}
          sx={{
            whiteSpace: "nowrap", // no wrapping
            overflow: "hidden", // hide extra text
            textOverflow: "ellipsis", // add ...
            maxWidth: "100%", // respect container width
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText>
          {data.description ? data.description : "empty"}
        </ListItemText>
      </TableCell>

      <TableCell>
        <ListItemText>{formatWithCommas(data.quantity)}</ListItemText>
      </TableCell>

      <TableCell>
        <ListItemText>{formatWithCommas(data.price)}</ListItemText>
      </TableCell>

      <TableCell>
        <ListItemText>{formatWithCommas(data.gross_price)}</ListItemText>
      </TableCell>

      <TableCell>
        <div>
          {data.tags?.map((item: any) => (
            <ListItemText key={item.id}>{item.name}</ListItemText>
          ))}
        </div>
      </TableCell>

      <TableCell>
        <div className={styles.card_right}>
          <div className={styles.card_vertical_price}></div>
          <div>
            <div style={{ cursor: "pointer" }}>
              {isActiveEdit ? (
                <CheckIcon
                  onClick={onCancelEdit}
                  style={{
                    fontSize: "2rem",
                    color: "#2e7d32", // green color
                    transition: "transform 0.2s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.2)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              ) : (
                <EditSquareIcon
                  onClick={onEdit}
                  style={{
                    fontSize: "2rem",
                    color: "#1976d2", // blue color
                    transition: "transform 0.2s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.2)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              )}
            </div>
          </div>
          <div>
            <DeleteIcon
              style={{
                fontSize: "2rem",
                color: "red", // green color
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onClick={onDelete}
            />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
