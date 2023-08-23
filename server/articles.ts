import { ArticleContent, ArticleSummaries, ArticleSummary, ArticleTag } from "@/types/article";

type SummaryFileEntry = {
  title: string;
  publishedAt: string;
  tags: string[];
  thumbnail?: string;
  ogpImage?: string;
  externalUrl?: string;
  preview: string;
  sourceBase: string;
};

interface SummaryFile {
  fileMap: Record<string, SummaryFileEntry>;
  sourceFileArray: ReadonlyArray<string>;
}

type ArticleFile = {
  slug: string;
  title: string;
  publishedAt: string;
  tags: ReadonlyArray<string>;
  thumbnail?: string;
  ogpImage?: string;
  externalUrl?: string;
  preview: string;
  sourceBase: string;
  bodyContent: string;
  bodyHtml: string;
};

const articleSlug = (sourceBase: string): string => {
  return sourceBase.replace(/\.md$/, "");
};

const toArticleTag = (tagName: string): ArticleTag => {
  const slug = tagName.replaceAll("/", "-");

  return {
    slug,
    name: tagName,
  };
};

const toArticleTags = (tagNames: ReadonlyArray<string>): Array<ArticleTag> => {
  return tagNames.map((tagName) => toArticleTag(tagName));
};

const toArticleSummary = (rawSummary: SummaryFileEntry): ArticleSummary => {
  return {
    slug: articleSlug(rawSummary.sourceBase),
    title: rawSummary.title,
    publishedAt: rawSummary.publishedAt,
    tags: toArticleTags(rawSummary.tags),
    thumbnail: rawSummary.thumbnail ?? null,
    ogpImage: rawSummary.ogpImage ?? null,
    externalUrl: rawSummary.externalUrl ?? null,
    preview: rawSummary.preview,
    sourceBase: rawSummary.sourceBase,
  };
};

const toArticleSummaries = (rawSummaries: ReadonlyArray<SummaryFileEntry>): Array<ArticleSummary> => {
  return rawSummaries.map((rawSummary) => toArticleSummary(rawSummary));
};

const toArticleContent = (rawArticle: ArticleFile): ArticleContent => {
  return {
    slug: articleSlug(rawArticle.sourceBase),
    title: rawArticle.title,
    publishedAt: rawArticle.publishedAt,
    tags: toArticleTags(rawArticle.tags),
    thumbnail: rawArticle.thumbnail ?? null,
    ogpImage: rawArticle.ogpImage ?? null,
    externalUrl: rawArticle.externalUrl ?? null,
    preview: rawArticle.preview,
    sourceBase: rawArticle.sourceBase,
    bodyContent: rawArticle.bodyContent,
    bodyHtml: rawArticle.bodyHtml,
  };
};

export const readArticleSummuries = async (): Promise<ArticleSummaries> => {
  const rawSummaries: SummaryFile = (await import("../dist/summary.json")).default;

  const rawSummaryEntries = Object.values(rawSummaries.fileMap)
    .map((x) => ({
      slug: x.sourceBase.replace(/\.md$/, ""),
      ...x,
    }))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  const articles = toArticleSummaries(rawSummaryEntries);
  const tagMaps = new Map(articles.flatMap((article) => article.tags).map((tag) => [tag.slug, tag]));
  const tags = Array.from(tagMaps.values());

  return { articles, tags };
};

export const readArticle = async (slug: string): Promise<ArticleContent> => {
  const rawArticle: ArticleFile = (await import(`../dist/${slug}.json`)).default;

  return toArticleContent(rawArticle);
};
