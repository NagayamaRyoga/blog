import React from "react";
import { Global, css } from "@emotion/react";

export const globalStyles = (
  <Global
    styles={css`
      html,
      body {
        margin: 0;
      }
    `}
  />
);

export default globalStyles;
