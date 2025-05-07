export interface ResponseConfig {
  message: string;
  status: 200 | 300 | 400;
}

export interface AuthResponseConfig extends ResponseConfig {
  credentials: UserDataInterface;
}

export interface PostResponseConfig extends ResponseConfig {
  postData: [] | null;
}

export interface SinglePostResponseConfig extends ResponseConfig {
  postData: null;
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
