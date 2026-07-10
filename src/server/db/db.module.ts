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
import { AppError } from "../utils/appError";
import { Doc, SortField, sortOrder } from "../utils/interfaces";

const userDocRefMaker = (userId: string) => {
  return doc(firestore, "users", userId);

};

const docRefMaker = (userId: string, docId: string) => {
  return doc(firestore, "documents", userId, "userDocs", docId);
};

const noteDocRefMaker = (userId: string, noteId: string) => {
  return doc(firestore, "documents", userId, "userDocs", noteId);
};

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

const documentCollectionRefMaker = (userId: string) => {
  return collection(firestore, "documents", userId, "userDocs");
};

const getCollectionDocs = async (
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  sort: SortField,
  order: sortOrder,
) => {
  const que = query(collectionRef, orderBy(sort, order),);


  const docs = await getDocs(que);

  if (docs.empty) {
    throw new AppError("No documents found", 404);
  }
  return docs.docs.map((doc) => doc.data() as Doc);
};

export {
  userDocRefMaker,
  noteDocRefMaker,
  fetchDoc,
  updateDoc,
  docRefMaker,
  documentCollectionRefMaker,
  getCollectionDocs,
};
