import { NextApiRequest } from "next";

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

// deprecatted for new api
export interface AuthResponseConfig extends ResponseConfig {
  credentials: User | null;
}


export interface JwtRequest extends NextApiRequest {
  user?: User;
}

export type InvoiceTagItem = {
  id: string,
  name: string,
  created_at: number,
  icon?: string,
  deleted?: boolean
}





export interface InvoiceDoc {
  uid: string;
  doc_id: string;
  created_at: number;
  name: string;
  tags: (string | InvoiceTagItem)[], // string when upload , tag item when from server 
  invoice_time: number;
  price: number;
  quantity: number;
  gross_price: number;
  invoice_type: "expense" | "income";
  description: string
  deleted?: boolean;
}

export type EditableBillDoc = Partial<InvoiceDoc>
