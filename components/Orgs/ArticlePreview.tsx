import React from "react";
import { css, useTheme } from "@emotion/react";

import { ArticleSummary } from "@/server/articles";
import { Link } from "@/components/Atoms/Link";
import { Thumbnail } from "@/components/Atoms/Thumbnail";
import Article from "@/components/Orgs/Article";

export type ArticlePreviewProps = {
  article: ArticleSummary;
};

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article }) => {
  const slug = article.slug;
  const url = `/${slug}`;
  const thumbnail = article.thumbnail;
  const preview = article.preview;

  const theme = useTheme();

  return (
    <Article article={article}>
      {thumbnail && (
        <Link href={url}>
          <Thumbnail src={thumbnail} />
        </Link>
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
        <Link
          href={url}
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
        </Link>
      </div>
    </Article>
  );
};

export default ArticlePreview;
