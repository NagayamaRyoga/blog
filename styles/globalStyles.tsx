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
        color: ${theme.colors.main};
        font-family: ${theme.fonts.content};
      }

      p {
        margin-block-start: 1em;
        margin-block-end: 1em;
        line-height: 1.65;
      }

      * {
        box-sizing: border-box;
      }
    `}
  />
);

export default globalStyles;
