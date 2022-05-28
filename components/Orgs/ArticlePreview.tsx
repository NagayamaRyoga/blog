import React from "react";
import Link from "next/link";
import { css, useTheme } from "@emotion/react";

import { ArticleSummary } from "@/server/articles";
import { Thumbnail } from "@/components/Atoms/Thumbnail";
import Article from "@/components/Orgs/Article";
import { basePath } from "@/next.config";

export type ArticlePreviewProps = {
  article: ArticleSummary;
};

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article }) => {
  const slug = article.slug;
  const url = `/${slug}`;
  const title = article.title;
  const publishedAt = new Date(article.publishedAt);
  const tags = article.tags;
  const thumbnail = article.thumbnail;
  const preview = article.preview;
  const aritlceUrl = `${basePath}${url}`;

  const theme = useTheme();

  return (
    <Article url={url} title={title} publishedAt={publishedAt} tags={tags}>
      {thumbnail && (
        <Link href={url}>
          <a href={aritlceUrl}>
            <Thumbnail src={thumbnail} />
          </a>
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
        <Link href={url}>
          <a
            href={aritlceUrl}
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
          </a>
        </Link>
      </div>
    </Article>
  );
};

export default ArticlePreview;
