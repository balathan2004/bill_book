export interface ResponseConfig {
  message: string;
  status: 200 | 300 | 400;
}

export interface AuthResponseConfig extends ResponseConfig {
  credentials: UserDataInterface;
}

export interface docResponseConfig extends ResponseConfig {
  docData: docInterface[];
}

export interface UserDataInterface {
  uid: string;
  email: string;
  display_name: string;
  created_at: number;
  profile_url: string;
}

export const dummyCred = {
  uid: "",
  email: "",
  display_name: "",
  created_at: 0,
  profile_url: "",
};

export interface docInterface {
  uid: string;
  doc_id: string;
  created_at: number;
  name: string;
  invoice_time:number;
  price: number;
  quantity: number;
  gross_price: number;
  description:string
}
