import React from "react";
import { css, useTheme } from "@emotion/react";

import Header from "@/components/Orgs/Header";

export const BlogTemplate: React.FC = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      css={css`
        margin: 0 auto;
        max-width: ${theme.maxWidth};
      `}
    >
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default BlogTemplate;
