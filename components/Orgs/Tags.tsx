import React from "react";
import { css, useTheme } from "@emotion/react";

import Tag from "@/components/Atoms/Tag";
import { ArticleSummaries, ArticleSummary, ArticleTag } from "@/types/article";

const compareString = (a: string, b: string): number => (a > b ? +1 : a < b ? -1 : 0);

type TagOccurrencies = {
  tag: ArticleTag;
  count: number;
};

const countTagOccurrences = (articles: ReadonlyArray<ArticleSummary>): ReadonlyArray<TagOccurrencies> => {
  const allArticleTags = articles.flatMap((x) => x.tags);

  const tagOccurrences = new Map<string, TagOccurrencies>();
  for (const tag of allArticleTags) {
    const tagOccurrence = tagOccurrences.get(tag.slug);
    if (tagOccurrence !== undefined) {
      tagOccurrences.set(tag.slug, { tag, count: tagOccurrence.count + 1 });
    } else {
      tagOccurrences.set(tag.slug, { tag, count: 1 });
    }
  }

  return Array.from(tagOccurrences.values()).sort((a, b) => {
    if (a.count !== b.count) {
      return b.count - a.count;
    }
    return compareString(a.tag.slug, b.tag.slug);
  });
};

export type TagsProps = {
  articleSummaries: ArticleSummaries;
};

export const Tags: React.FC<TagsProps> = ({ articleSummaries }) => {
  const tagOccurrences = countTagOccurrences(articleSummaries.articles);

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
        {tagOccurrences.map(({ tag, count }) => (
          <li key={tag.slug}>
            <Tag tag={tag}>&nbsp;({count})</Tag>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Tags;
