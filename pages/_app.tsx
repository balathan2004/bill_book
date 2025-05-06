import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NavbarHolder } from "@/components/context/navbar_context";
import { LoaderHolder } from "@/components/context/loading_context";
import { ReplyHolder } from "@/components/context/reply_context";
import DrawerAppBar from "@/components/elements/navbar";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <NavbarHolder>
      <LoaderHolder>
        <ReplyHolder>
          <DrawerAppBar/>
          <Component {...pageProps} />
        </ReplyHolder>
      </LoaderHolder>
    </NavbarHolder>
  );
}
