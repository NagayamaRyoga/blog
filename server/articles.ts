interface SummaryFile {
  fileMap: {
    [K in string]: {
      title: string;
      publishedAt: string;
      tags: string[];
      preview: string;
      sourceBase: string;
    };
  };
  sourceFileArray: string[];
}

export interface ArticleSummary {
  slug: string;
  title: string;
  publishedAt: string;
  tags: string[];
  preview: string;
  sourceBase: string;
}

export type ArticleSummaries = ArticleSummary[];

export interface ArticleType {
  slug: string;
  title: string;
  publishedAt: string;
  tags: string[];
  bodyContent: string;
  bodyHtml: string;
  preview: string;
  sourceBase: string;
}

export const readArticleSummuries = async (): Promise<ArticleSummaries> => {
  const rawSummaries: SummaryFile = (await import("../dist/summary.json")).default;
  const summaries = Object.values(rawSummaries.fileMap)
    .map((x) => ({
      slug: x.sourceBase.replace(/\.md$/, ""),
      ...x,
    }))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  return summaries;
};

export const readArticle = async (slug: string): Promise<ArticleType> => {
  const rawArticle: Omit<ArticleType, "slug"> = (await import(`../dist/${slug}.json`)).default;
  const article = {
    slug: rawArticle.sourceBase.replace(/\.md$/, ""),
    ...rawArticle,
  };

  return article;
};
