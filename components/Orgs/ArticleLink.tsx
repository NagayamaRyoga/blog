import React from "react";

import { Link } from "@/components/Atoms/Link";
import { ArticleSummary } from "@/server/articles";

export type ArticleLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
  href?: never;
  article: ArticleSummary;
};

export const ArticleLink: React.FC<ArticleLinkProps> = ({ children, article, ...props }) => {
  return article.externalUrl === undefined ? (
    <Link {...props} href={`/${article.slug}`}>
      {children}
    </Link>
  ) : (
    <a target="_blank" rel="noreferrer" {...props} href={article.externalUrl}>
      {children}
    </a>
  );
};
