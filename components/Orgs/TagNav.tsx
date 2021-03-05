import React from "react";
import Link from "next/link";
import { css, useTheme } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

import Tag from "@/components/Atoms/Tag";
import { basePath } from "@/next.config";

export type TagNavProps = {
  tag: string;
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
      <Link href="/">
        <a
          href={`${basePath}/`}
          css={css`
            color: ${theme.colors.accent};
            text-decoration: none;
          `}
        >
          記事一覧
        </a>
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
