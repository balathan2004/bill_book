import { deleteDoc } from "firebase/firestore";
import {
  documentCollectionRefMaker,
  fetchDoc,
  getCollectionDocs,
  noteDocRefMaker,
  updateDoc,
} from "../db/db.module";
import { Doc, SortField, sortOrder } from "../utils/interfaces";

export const DocService = {
  putDoc: async (data: Doc) => {
    const docRef = noteDocRefMaker(data.uid, data.doc_id);
    await updateDoc(docRef, data);
  },

  getDoc: async (userId: string, doc_id: string) => {
    const docRef = noteDocRefMaker(userId, doc_id);
    const docData = await fetchDoc(docRef, "Document not found");
    return docData as Doc;
  },

  getDocsQuery: async (userId: string, sort: SortField, order: sortOrder) => {
    const collectionRef = documentCollectionRefMaker(userId);
    const allDocs = await getCollectionDocs(collectionRef, sort, order);
    return allDocs.filter((item) => !item.deleted);
  },

  postDoc: async (data: Doc) => {
    const docRef = noteDocRefMaker(data.uid, data.doc_id);
    console.log({ docRef });
    await updateDoc(docRef, data);
  },

  deleteDoc: async (userId: string, doc_id: string) => {
    const docRef = noteDocRefMaker(userId, doc_id);
    const data = await fetchDoc(docRef, "Document not found");
    if (!data) {
      throw new Error("Document not found");
    }
    updateDoc(docRef, { deleted: true, ...data } as Doc);
  },
};
