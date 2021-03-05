import React from "react";
import Link from "next/link";
import { css, useTheme } from "@emotion/react";

import Tag from "@/components/Atoms/Tag";
import { basePath } from "@/next.config";

export type ArticleProps = {
  url: string;
  title: string;
  publishedAt: Date;
  tags: string[];
};

export const ArticlePreview: React.FC<ArticleProps> = ({ url, title, publishedAt, tags, children }) => {
  const date = `${publishedAt.getFullYear()}-${publishedAt.getMonth() + 1}-${publishedAt.getDate()}`;

  const theme = useTheme();

  return (
    <article
      css={css`
        margin-block-start: 1rem;
        margin-block-end: 1rem;
        padding-block-start: 1.5rem;
        padding-block-end: 1.5rem;
        padding-inline-start: 2rem;
        padding-inline-end: 2rem;
        background-color: ${theme.colors.base};
        filter: drop-shadow(6px 6px 0 ${theme.colors.shadow});
      `}
    >
      <div
        css={css`
          color: ${theme.colors.accent};
          font-family: ${theme.fonts.title};
          font-weight: 500;
        `}
      >
        <Link href={url}>
          <a
            href={`${basePath}${url}`}
            css={css`
              color: inherit;
              text-decoration: none;
            `}
          >
            {date}
          </a>
        </Link>
      </div>
      <h1
        css={css`
          margin-block-start: 0.5rem;
          margin-block-end: 0.5rem;
          border-bottom: solid 1px ${theme.colors.accent};
          color: ${theme.colors.accent};
          font-family: ${theme.fonts.title};
          font-size: 2rem;
          font-weight: 100;
        `}
      >
        <Link href={url}>
          <a
            href={`${basePath}${url}`}
            css={css`
              color: inherit;
              text-decoration: none;
            `}
          >
            {title}
          </a>
        </Link>
      </h1>
      <ul
        css={css`
          margin-block-start: 0.5rem;
          margin-block-end: 0.5rem;
          padding: 0;
          color: ${theme.colors.accent};
          font-family: ${theme.fonts.title};
          font-size: 0.8rem;
          list-style: none;
        `}
      >
        {tags.map((tag) => (
          <li
            css={css`
              display: inline-flex;
              margin-inline-end: 1em;
              vertical-align: middle;
            `}
            key={tag}
          >
            <Tag tag={tag} />
          </li>
        ))}
      </ul>
      <div>{children}</div>
    </article>
  );
};

export default ArticlePreview;
