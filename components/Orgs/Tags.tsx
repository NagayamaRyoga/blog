import React from "react";
import { css, useTheme } from "@emotion/react";

import { ArticleSummaries } from "@/server/articles";
import Tag from "@/components/Atoms/Tag";

export type TagsProps = {
  articles: ArticleSummaries;
};

const compareString = (a: string, b: string): number => (a > b ? +1 : a < b ? -1 : 0);

export const Tags: React.FC<TagsProps> = ({ articles }) => {
  const tagTallies = articles
    .flatMap((x) => x.tags)
    .reduce((tally: { [K in string]: number }, tag) => {
      const count = (tally[tag] ?? 0) + 1;
      return { ...tally, [tag]: count };
    }, {});

  const tagAndOccurrencies = Object.entries(tagTallies).sort((a, b) => compareString(a[0], b[0]));

  const theme = useTheme();

  return (
    <section
      css={css`
        margin: 1rem 0;
        padding: 1rem 2rem;
        background-color: ${theme.colors.base};
        filter: drop-shadow(6px 6px 0 ${theme.colors.shadow});
        font-family: ${theme.fonts.title};
      `}
    >
      <h4
        css={css`
          margin-block-start: 0rem;
          margin-block-end: 0.5rem;
          font-weight: 500;
        `}
      >
        タグ一覧
      </h4>
      <ul
        css={css`
          display: flex;
          flex-wrap: wrap;
          margin: 0;
          padding: 0;
          font-size: 0.8rem;
          list-style: none;

          & > li {
            margin-inline-end: 1em;
          }
        `}
      >
        {tagAndOccurrencies.map(([tag, n]) => (
          <li key={tag}>
            <Tag tag={tag}>&nbsp;({n})</Tag>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Tags;
