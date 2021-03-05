import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { ArticleSummaries, readArticleSummuries } from "@/server/articles";
import BlogTemplate from "@/components/Templates/BlogTemplate";
import ArticlePreview from "@/components/Orgs/ArticlePreview";
import TagNav from "@/components/Orgs/TagNav";

export type PageProps = {
  tag: string;
  articles: ArticleSummaries;
};

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  const tag = ctx.params?.tag as string;
  const articles = (await readArticleSummuries()).filter((x) => x.tags.includes(tag));

  return {
    props: {
      tag,
      articles,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await readArticleSummuries();
  const tagSet = new Set(articles.map((x) => x.tags).flat());
  const tags = Array.from(tagSet).sort();

  const paths = tags.map((tag) => ({ params: { tag } }));

  return {
    paths,
    fallback: false,
  };
};

const Page: React.FC<PageProps> = ({ tag, articles }) => (
  <>
    <Head>
      <title>{tag} | 有限猿定理</title>
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
