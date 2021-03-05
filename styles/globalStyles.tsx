import React from "react";
import { Global, css } from "@emotion/react";

export const globalStyles = (
  <Global
    styles={(theme) => css`
      html,
      body {
        margin: 0;
        height: 100%;
      }

      body {
        background: ${theme.colors.background};
      }

      * {
        box-sizing: border-box;
      }
    `}
  />
);

export default globalStyles;
