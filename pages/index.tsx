import React from "react";
import { GetStaticProps } from "next";
import Head from "next/head";

import { readArticleSummuries } from "@/server/articles";
import BlogTemplate from "@/components/Templates/BlogTemplate";
import ArticlePreview from "@/components/Orgs/ArticlePreview";
import Tags from "@/components/Orgs/Tags";
import { ArticleSummaries } from "@/types/article";

export type PageProps = {
  articleSummaries: ArticleSummaries;
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const articleSummaries = await readArticleSummuries();

  return {
    props: {
      articleSummaries,
    },
  };
};

const Page: React.FC<PageProps> = ({ articleSummaries }) => (
  <>
    <Head>
      <title>有限猿定理</title>
      <meta name="description" content="有限猿定理：Nagayama Ryogaの技術記事がメインのブログです。" />
    </Head>
    <BlogTemplate>
      {articleSummaries.articles.map((article) => (
        <ArticlePreview key={article.slug} article={article} />
      ))}
      <Tags articleSummaries={articleSummaries} />
    </BlogTemplate>
  </>
);

export default Page;
