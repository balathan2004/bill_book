import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { format, isThisYear } from "date-fns";

import { InvoiceDoc, InvoiceTagItem } from "@/src/server/utils/interfaces";
import { formatWithCommas } from "../elements/addExpenseDoc";

type Props = {
  data: InvoiceDoc;
  isActiveEdit: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
};

const handleDate = (date: number) => {
  return isThisYear(date)
    ? format(date, "dd MMM hh:mm a")
    : format(date, "dd MMM yyyy");
};

export default function InvoiceCard({
  data,
  isActiveEdit,
  onEdit,
  onCancelEdit,
  onDelete,
}: Props) {
  return (
    <Paper
      style={{
        backgroundColor: data.invoice_type === "income" ? "#E8F5E9" : "#FDC086",
      }}
      elevation={2}
      sx={{ p: 2, mb: 2, borderRadius: 3 }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {data.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {handleDate(data.invoice_time)}
          </Typography>
        </Box>

        {/* Actions */}
        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent="flex-end"
          spacing={1}
        >
          <Chip
            size="small"
            color={data.invoice_type === "income" ? "success" : "error"}
            label={data.invoice_type.toLocaleUpperCase()}
          />

          {isActiveEdit ? (
            <IconButton color="success" onClick={onCancelEdit}>
              <CheckIcon />
            </IconButton>
          ) : (
            <IconButton color="primary" onClick={onEdit}>
              <EditSquareIcon />
            </IconButton>
          )}

          <IconButton color="error" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Amounts */}
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Quantity</Typography>
          <Typography>{formatWithCommas(data.quantity)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Price</Typography>
          <Typography>₹{formatWithCommas(data.price)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Gross</Typography>

          <Typography
            fontWeight={700}
            color={
              data.invoice_type === "income" ? "success.main" : "error.main"
            }
          >
            ₹{formatWithCommas(data.gross_price)}
          </Typography>
        </Stack>
      </Stack>

      {/* Description */}
      {data.description && (
        <>
          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" color="text.secondary">
            Description
          </Typography>

          <Typography>{data.description}</Typography>
        </>
      )}

      {/* Tags */}
      {data.tags?.length ? (
        <>
          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {(data.tags as InvoiceTagItem[]).map((tag) => (
              <Chip key={tag.id} size="small" label={tag.name} />
            ))}
          </Stack>
        </>
      ) : null}
    </Paper>
  );
}
