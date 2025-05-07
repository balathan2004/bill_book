import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NavbarHolder } from "@/components/context/navbar_context";
import { LoaderHolder } from "@/components/context/loading_context";
import { ReplyHolder } from "@/components/context/reply_context";
import DrawerAppBar from "@/components/elements/navbar";
import ContextWrapper from "@/components/context/context.wrapper";
import { UserHolder } from "@/components/context/user_context";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <NavbarHolder>
      <LoaderHolder>
        <ReplyHolder>
          <UserHolder>
            <DrawerAppBar />
            <ContextWrapper>
              <Component {...pageProps} />
            </ContextWrapper>
          </UserHolder>
        </ReplyHolder>
      </LoaderHolder>
    </NavbarHolder>
  );
}
