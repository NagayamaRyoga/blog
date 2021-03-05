import React from "react";
import { css, useTheme } from "@emotion/react";

import Header from "@/components/Orgs/Header";

export const BlogTemplate: React.FC = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      css={css`
        margin: 0 auto;
        padding: 0 1rem;
        padding-bottom: 1px;
        max-width: ${theme.maxWidth};
        min-width: ${theme.minWidth};
        box-sizing: content-box;
      `}
    >
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default BlogTemplate;
