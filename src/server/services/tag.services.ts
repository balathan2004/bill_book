import { OrderByDirection } from "firebase/firestore";
import {
  fetchDoc,
  getCollectionDocs,
  invoiceCollectionRefMaker,
  updateDoc,
  tagRefMaker,
  tagsCollectionRefMaker,
} from "../db/db.module";
import { InvoiceDoc, InvoiceTagItem } from "../utils/interfaces";


export const TagService = {
  patchDoc: async (data: InvoiceTagItem, userId: string) => {
    const docRef = tagRefMaker(userId, data.id);
    await updateDoc(docRef, data);
  },

  getDoc: async (userId: string, doc_id: string) => {
    const docRef = tagRefMaker(userId, doc_id);
    const docData = await fetchDoc(docRef, "Document not found");
    return docData as InvoiceTagItem;
  },

  getDocsQuery: async (userId: string, sort: keyof InvoiceTagItem = "created_at", order: OrderByDirection = "desc") => {
    const collectionRef = tagsCollectionRefMaker(userId);
    const allDocs = await getCollectionDocs(collectionRef, sort, order);
    return allDocs
  },

  deleteDoc: async (userId: string, doc_id: string) => {
    const docRef = tagRefMaker(userId, doc_id);
    const data = await fetchDoc(docRef, "Document not found");
    if (!data) {
      throw new Error("Document not found");
    }
    updateDoc(docRef, { deleted: true, ...data } as InvoiceTagItem);
  },
};
