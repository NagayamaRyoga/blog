import React from "react";
import globalStyles from "@/styles/globalStyles";

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps }) => (
  <>
    {globalStyles}
    <Component {...pageProps} />
  </>
);

export default App;
