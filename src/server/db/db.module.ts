import { firestore } from "./firebase.server";
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  setDoc,
  orderBy,
} from "firebase/firestore";
import { InvoiceDoc } from "../utils/interfaces";


const userDocRefMaker = (userId: string) => {
  return doc(firestore, "users", userId);

};

const invoiceRefMaker = (userId: string, docId: string) => {
  return doc(firestore, "invoices", userId, "docs", docId);
};

const tagRefMaker = (userId: string, docId: string) => {
  return doc(firestore, "tags", userId, "docs", docId);
}

const invoiceCollectionRefMaker = (userId: string) => {
  return collection(firestore, "invoices", userId, "docs");
};


const tagsCollectionRefMaker = (userId: string) => {
  return collection(firestore, "tags", userId, "docs");
}



const fetchDoc = async (
  docRef: DocumentReference<DocumentData, DocumentData>,
  errorMessage?: string,
) => {
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error(errorMessage || "Document does not exist");
  }
  return docSnap.data();
};

const updateDoc = async (
  docRef: DocumentReference<DocumentData, DocumentData>,
  data: any,
) => {

  await setDoc(docRef, data, { merge: true });
};




const getCollectionDocs = async (
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  sort: any,
  order: any,
) => {
  const que = query(collectionRef, orderBy(sort, order));

  const docs = await getDocs(que);

  return docs.docs.map((doc) => doc.data()) || []
};

export {
  userDocRefMaker,
  fetchDoc,
  updateDoc,
  invoiceRefMaker,
  tagRefMaker,
  invoiceCollectionRefMaker,
  tagsCollectionRefMaker,
  getCollectionDocs,
};
