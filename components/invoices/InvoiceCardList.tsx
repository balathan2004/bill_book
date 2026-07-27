import InvoiceCard from "./invoiceCard";
import { InvoiceDoc } from "@/src/server/utils/interfaces";
import styles from "../../styles/home.module.css";

type Props = {
  invoices: InvoiceDoc[];
  currentDoc: Partial<InvoiceDoc>;
  setCurrentDoc: (item: InvoiceDoc) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
};

export default function InvoiceCardList({
  invoices,
  currentDoc,
  setCurrentDoc,
  onCancelEdit,
  onDelete,
}: Props) {
  return (
    <div className={""}>
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.doc_id}
          data={invoice}
          isActiveEdit={currentDoc.doc_id === invoice.doc_id}
          onEdit={() => setCurrentDoc(invoice)}
          onCancelEdit={onCancelEdit}
          onDelete={() => onDelete(invoice.doc_id)}
        />
      ))}
    </div>
  );
}
