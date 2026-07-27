import { useMediaQuery, useTheme } from "@mui/material";
import InvoiceTable from "./InvoiceTable";
import InvoiceCardList from "./InvoiceCardList";
import { InvoiceDoc } from "@/src/server/utils/interfaces";

type Props = {
  invoices: InvoiceDoc[];
  currentDoc: Partial<InvoiceDoc>;
  setCurrentDoc: (item: InvoiceDoc) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
};

export default function InvoiceContainer(props: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    return <InvoiceCardList {...props} />;
  }

  return <InvoiceTable {...props} />;
}
