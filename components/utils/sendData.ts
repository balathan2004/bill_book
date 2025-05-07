import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { AuthResponseConfig, ResponseConfig } from "./interfaces";

interface Props {
  data: Object;
  route: string;
  credentials: boolean;
}

type ResponseInterfaces = ResponseConfig | AuthResponseConfig;

export default async function SendData({
  data,
  route,
  credentials = false,
}: Props) {
  try {
    const reqConfig: RequestInit = {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: credentials ? "include" : "omit",
    };

    const response = await fetch(route, reqConfig);
    const res = (await response.json()) as ResponseInterfaces;

    return res;
  } catch (err) {
    throw new Error(err as string);
  }
}
