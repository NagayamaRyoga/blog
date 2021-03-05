import React from "react";
import { ThemeProvider } from "@emotion/react";

import globalStyles from "@/styles/globalStyles";
import { defaultTheme } from "@/styles/theme";

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps }) => (
  <ThemeProvider theme={defaultTheme}>
    {globalStyles}
    <Component {...pageProps} />
  </ThemeProvider>
);

export default App;
