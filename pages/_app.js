import React from "react";
import Head from "next/head";
import { ThemeProvider } from "@emotion/react";
import "@fortawesome/fontawesome-svg-core/styles.css";

import globalStyles from "@/styles/globalStyles";
import { defaultTheme } from "@/styles/theme";

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;500&display=swap" />
    </Head>
    <ThemeProvider theme={defaultTheme}>
      {globalStyles}
      <Component {...pageProps} />
    </ThemeProvider>
  </>
);

export default App;
