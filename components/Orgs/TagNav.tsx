import React from "react";
import { css, useTheme } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

import { Link } from "@/components/Atoms/Link";
import Tag from "@/components/Atoms/Tag";
import { ArticleTag } from "@/types/article";

export type TagNavProps = {
  tag: ArticleTag;
};

export const TagNav: React.FC<TagNavProps> = ({ tag }) => {
  const theme = useTheme();

  return (
    <nav
      css={css`
        margin-block-start: 1rem;
        margin-block-end: 1rem;
        padding-block-start: 1rem;
        padding-block-end: 1rem;
        padding-inline-start: 2rem;
        padding-inline-end: 2rem;
        font-family: ${theme.fonts.title};
        font-weight: 500;
        background-color: ${theme.colors.base};
        filter: drop-shadow(6px 6px 0 ${theme.colors.shadow});
      `}
    >
      <Link
        href="/"
        css={css`
          color: ${theme.colors.accent};
          text-decoration: none;
        `}
      >
        記事一覧
      </Link>
      <FontAwesomeIcon
        icon={faCaretRight}
        css={css`
          margin-inline-start: 0.5em;
          margin-inline-end: 0.5em;
        `}
      />
      <Tag tag={tag} />
    </nav>
  );
};

export default TagNav;
