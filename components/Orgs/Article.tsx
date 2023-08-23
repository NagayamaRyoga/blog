import React from "react";
import { css, useTheme } from "@emotion/react";

import Tag from "@/components/Atoms/Tag";
import { ArticleLink } from "@/components/Orgs/ArticleLink";
import { ArticleSummary } from "@/types/article";

export type ArticleProps = {
  children: React.ReactNode;
  article: ArticleSummary;
};

export const ArticlePreview: React.FC<ArticleProps> = ({ children, article }) => {
  const publishedAt = new Date(article.publishedAt);
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
        <ArticleLink
          article={article}
          css={css`
            color: inherit;
            text-decoration: none;
          `}
        >
          {date}
        </ArticleLink>
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
        <ArticleLink
          article={article}
          css={css`
            color: inherit;
            text-decoration: none;
          `}
        >
          {article.title}
        </ArticleLink>
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
        {article.tags.map((tag) => (
          <li
            css={css`
              display: inline-flex;
              margin-inline-end: 1em;
              vertical-align: middle;
            `}
            key={tag.slug}
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
