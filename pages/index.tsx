import React from "react";
import Head from "next/head";

import BlogTemplate from "@/components/Templates/BlogTemplate";

const Page: React.FC = () => (
  <>
    <Head>
      <title>有限猿定理</title>
      <meta name="description" content="有限猿定理：Nagayama Ryogaの技術記事がメインのブログです。" />
    </Head>
    <BlogTemplate></BlogTemplate>
  </>
);

export default Page;
