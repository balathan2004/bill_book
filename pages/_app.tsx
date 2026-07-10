import "@/styles/globals.css";
import type { AppProps } from "next/app";
import DrawerAppBar from "@/components/elements/navbar";
import ContextWrapper from "@/components/context/context.wrapper";

import { Provider } from "react-redux";
import { store } from "@/src/redux/store";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="container">
      <Provider store={store}>
        <DrawerAppBar />
        <ContextWrapper>
          <Component {...pageProps} />
        </ContextWrapper>
      </Provider>
    </div>
  );
}
