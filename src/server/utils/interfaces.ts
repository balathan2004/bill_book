import { NextApiRequest } from "next";
import ShortUniqueId from "short-unique-id";

const { randomUUID } = new ShortUniqueId({ length: 12 });

export interface ResponseConfig {
  message: string;
}

export type DataRes<T> = ResponseConfig & {
  data: T,
}

export type ListRes<T> = ResponseConfig & {
  data: T[],
}


export interface User {
  display_name: string;
  email: string;
  profile_url: string;
  uid: string;
  createdAt: number;
  accessToken?: string;
  refreshToken?: string;
}

export interface Doc {
  doc_id: string;
  doc_text: string;
  doc_name: string;
  uid: string;
  doc_created: number;
  lastUpdated: number;
  clientOnlyDoc?: boolean;
  deleted?:boolean
}

// deprecatted for new api
export interface AuthResponseConfig extends ResponseConfig {
  credentials: User | null;
}

export interface docResponse extends ResponseConfig {
  docData: Doc[];
}
 // depracatedd for new api

export interface JwtRequest extends NextApiRequest {
  user?: User ;
}


export interface singleDocResponse extends ResponseConfig {
  docData: Doc | null;
}


export const createEmptyDoc = (uid: string) => {
  const creationTime = new Date().getTime();

  return {
    doc_id: randomUUID(),
    doc_name: "Untitled",
    doc_text: "",
    doc_created: creationTime,
    uid: uid,
    lastUpdated: creationTime,
    clientOnlyDoc: true,
  };
};

export type SortField = "doc_created" | "lastUpdated";
export type sortOrder = "asc" | "desc";