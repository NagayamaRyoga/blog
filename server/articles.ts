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
