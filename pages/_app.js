import React from "react";

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps }) => <>
  <Component {...pageProps} />
</>;

export default App;
