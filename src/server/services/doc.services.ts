import { OrderByDirection } from "firebase/firestore";
import {
  invoiceRefMaker,
  fetchDoc,
  getCollectionDocs,
  invoiceCollectionRefMaker,
  updateDoc,
} from "../db/db.module";
import { InvoiceDoc } from "../utils/interfaces";


export const DocService = {
  putDoc: async (data: InvoiceDoc) => {
    const docRef = invoiceRefMaker(data.uid, data.doc_id);
    await updateDoc(docRef, data);
  },

  getDoc: async (userId: string, doc_id: string) => {
    const docRef = invoiceRefMaker(userId, doc_id);
    const docData = await fetchDoc(docRef, "Document not found");
    return docData as InvoiceDoc;
  },
  // getDocsQuery: async (userId: string, sort: SortField, order: sortOrder) => {
  getDocsQuery: async (userId: string, sort: keyof InvoiceDoc = "invoice_time", order: OrderByDirection = "desc") => {
    const collectionRef = invoiceCollectionRefMaker(userId);
    const allDocs = await getCollectionDocs(collectionRef, sort, order);
    return allDocs
  },

  postDoc: async (data: InvoiceDoc) => {
    const docRef = invoiceRefMaker(data.uid, data.doc_id);
    console.log({ docRef });
    await updateDoc(docRef, data);
  },

  deleteDoc: async (userId: string, doc_id: string) => {
    const docRef = invoiceRefMaker(userId, doc_id);
    const data = await fetchDoc(docRef, "Document not found");
    if (!data) {
      throw new Error("Document not found");
    }
    updateDoc(docRef, { deleted: true, ...data } as InvoiceDoc);
  },
};
