import React from "react";
import { css, useTheme } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

import { Link } from "@/components/Atoms/Link";
import { ArticleTag } from "@/types/article";

export type TagProps = {
  children?: React.ReactNode;
  tag: ArticleTag;
};

export const Tag: React.FC<TagProps> = ({ children, tag }) => {
  const theme = useTheme();

  return (
    <Link
      href={`/tags/${tag.slug}`}
      css={css`
        color: ${theme.colors.accent};
        text-decoration: none;
      `}
    >
      <FontAwesomeIcon icon={faTag} />
      &nbsp;{tag.name}
      {children}
    </Link>
  );
};

export default Tag;
