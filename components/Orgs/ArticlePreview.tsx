import React from "react";
import { css, useTheme } from "@emotion/react";

import { Thumbnail } from "@/components/Atoms/Thumbnail";
import Article from "@/components/Orgs/Article";
import { ArticleLink } from "@/components/Orgs/ArticleLink";
import { ArticleSummary } from "@/types/article";

export type ArticlePreviewProps = {
  article: ArticleSummary;
};

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article }) => {
  const thumbnail = article.thumbnail;
  const preview = article.preview;

  const theme = useTheme();

  return (
    <Article article={article}>
      {thumbnail && (
        <ArticleLink article={article}>
          <Thumbnail src={thumbnail} />
        </ArticleLink>
      )}
      <p>{preview}……</p>
      <div
        css={css`
          color: ${theme.colors.accent};
          font-family: ${theme.fonts.title};
          font-weight: 500;
          text-align: center;
        `}
      >
        <ArticleLink
          article={article}
          css={css`
            display: inline-block;
            padding: 0.2em 2em;
            color: inherit;
            text-decoration: none;
            border: solid 1px ${theme.colors.accent};
            border-radius: 1em;
          `}
        >
          続きを読む
        </ArticleLink>
      </div>
    </Article>
  );
};

export default ArticlePreview;
