import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { readArticleSummuries } from "@/server/articles";
import BlogTemplate from "@/components/Templates/BlogTemplate";
import ArticlePreview from "@/components/Orgs/ArticlePreview";
import TagNav from "@/components/Orgs/TagNav";
import { ArticleSummary, ArticleTag } from "@/types/article";

export type PageProps = {
  tag: ArticleTag;
  articles: ReadonlyArray<ArticleSummary>;
};

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  const tagSlug = ctx.params?.tag as string;

  const { articles, tags } = await readArticleSummuries();
  const taggedArticles = articles.filter((x) => x.tags.find((t) => t.slug === tagSlug) !== undefined);
  const tag = tags.find((x) => x.slug === tagSlug) ?? { slug: "-", name: "?" };

  return {
    props: {
      tag,
      articles: taggedArticles,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { tags } = await readArticleSummuries();

  const paths = tags.map((tag) => ({ params: { tag: tag.slug } }));

  return {
    paths,
    fallback: false,
  };
};

const Page: React.FC<PageProps> = ({ tag, articles }) => (
  <>
    <Head>
      <title>{`Tag: ${tag.name} | 有限猿定理`}</title>
      <meta name="description" content="有限猿定理：Nagayama Ryogaの技術記事がメインのブログです。" />
    </Head>
    <BlogTemplate>
      <TagNav tag={tag} />
      {articles.map((article) => (
        <ArticlePreview key={article.slug} article={article} />
      ))}
    </BlogTemplate>
  </>
);

export default Page;
