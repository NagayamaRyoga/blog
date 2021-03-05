import React from "react";
import { GetStaticProps } from "next";
import Head from "next/head";

import { ArticleSummaries, readArticleSummuries } from "@/server/articles";
import BlogTemplate from "@/components/Templates/BlogTemplate";
import ArticlePreview from "@/components/Orgs/ArticlePreview";

export type PageProps = {
  articles: ArticleSummaries;
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const articles = await readArticleSummuries();

  return {
    props: { articles },
  };
};

const Page: React.FC<PageProps> = ({ articles }) => (
  <>
    <Head>
      <title>有限猿定理</title>
      <meta name="description" content="有限猿定理：Nagayama Ryogaの技術記事がメインのブログです。" />
    </Head>
    <BlogTemplate>
      {articles.map((article) => (
        <ArticlePreview key={article.slug} article={article} />
      ))}
    </BlogTemplate>
  </>
);

export default Page;
