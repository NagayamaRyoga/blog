import React from "react";
import { css, useTheme } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

import { Link } from "@/components/Atoms/Link";

export type TagProps = {
  children?: React.ReactNode;
  tag: string;
};

export const Tag: React.FC<TagProps> = ({ children, tag }) => {
  const theme = useTheme();

  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      css={css`
        color: ${theme.colors.accent};
        text-decoration: none;
      `}
    >
      <FontAwesomeIcon icon={faTag} />
      &nbsp;{tag}
      {children}
    </Link>
  );
};

export default Tag;
