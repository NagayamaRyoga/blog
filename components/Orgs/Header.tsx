import React from "react";
import Link from "next/link";
import { css, useTheme } from "@emotion/react";

import { basePath } from "@/next.config";

export const Header: React.FC = () => {
  const theme = useTheme();

  const links = [
    {
      href: "/",
      content: <>About</>
    },
    {
      href: "https://github.com/NagayamaRyoga",
      content: <>GitHub</>
    },
  ];

  return (
    <header
      css={css`
        display: grid;
        grid-template-rows: 1fr auto;
        grid-template-columns: 1fr;
        grid-template-areas: "brand links";

        margin: 0.5rem 0;
        padding: 0.5rem 2rem;
        background-color: ${theme.colors.base};
        filter: drop-shadow(6px 6px 0 ${theme.colors.shadow});
      `}
    >
      <h1
        css={css`
          grid-area: "header";
          margin: 0;
          color: ${theme.colors.accent};
          font-size: 1.6rem;
          font-weight: 100;
        `}
      >
        <Link href="/">
          <a
            href={basePath}
            css={css`
              color: inherit;
              text-decoration: none;
            `}
          >
            有限猿定理
          </a>
        </Link>
      </h1>
      <ul
        css={css`
          display: flex;
          flex-direction: row;
          margin: 0;
          padding: 0.2rem 0;
          list-style: none;
          color: ${theme.colors.accent};
          font-size: 1.2rem;
          font-weight: 100;
        `}
      >
        {links.map(({ href, content }) => (
          <li
            key={href}
            css={css`
              margin-inline-start: 1.2rem;
            `}
          >
            <a
              css={css`
                display: inline-flex;
                vertical-align: middle;
                color: inherit;
                text-decoration: none;
              `}
              href={href}
            >
              {content}
            </a>
          </li>
        ))}
      </ul>
    </header >
  );
};

export default Header;
