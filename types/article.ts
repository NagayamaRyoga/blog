export type ArticleTag = {
  slug: string;
  name: string;
};

export type ArticleSummary = {
  slug: string;
  title: string;
  publishedAt: string;
  tags: ReadonlyArray<ArticleTag>;
  thumbnail: string | null;
  ogpImage: string | null;
  externalUrl: string | null;
  preview: string;
  sourceBase: string;
};

export type ArticleSummaries = {
  articles: ReadonlyArray<ArticleSummary>;
  tags: ReadonlyArray<ArticleTag>;
};

export type ArticleContent = ArticleSummary & {
  bodyContent: string;
  bodyHtml: string;
};
