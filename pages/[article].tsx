import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useTheme } from "@emotion/react";

import { ArticleType, readArticle, readArticleSummuries } from "@/server/articles";
import BlogTemplate from "@/components/Templates/BlogTemplate";
import Article from "@/components/Orgs/Article";
import { contentStyles } from "@/styles/contentStyles";

export type PageProps = {
  article: ArticleType;
};

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  const slug = ctx.params?.article as string;
  const article = await readArticle(slug);

  return {
    props: {
      article,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await readArticleSummuries();

  const paths = articles.map(({ slug }) => ({ params: { article: slug } }));

  return {
    paths,
    fallback: false,
  };
};

const Page: React.FC<PageProps> = ({ article }) => {
  const slug = article.slug;
  const url = `/${slug}`;
  const title = article.title;
  const publishedAt = new Date(article.publishedAt);
  const tags = article.tags;
  const preview = article.preview;
  const ogpImage = article.ogpImage ?? article.thumbnail;

  const theme = useTheme();

  return (
    <>
      <Head>
        <title>{title} | 有限猿定理</title>
        <meta name="description" content={preview} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={preview} />
        <meta property="og:site_name" content="有限猿定理" />
        {ogpImage && <meta property="og:image" content={ogpImage} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <BlogTemplate>
        <Article url={url} title={title} publishedAt={publishedAt} tags={tags}>
          <div dangerouslySetInnerHTML={{ __html: article.bodyHtml }} css={contentStyles(theme)} />
        </Article>
      </BlogTemplate>
    </>
  );
};

export default Page;
