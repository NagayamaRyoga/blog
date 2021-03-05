import React from "react";
import Link from "next/link";
import { css, useTheme } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

import { basePath } from "@/next.config";

export type TagProps = {
  tag: string;
};

export const Tag: React.FC<TagProps> = ({ tag }) => {
  const theme = useTheme();

  return (
    <Link href={`/tags/${tag}`}>
      <a
        href={`${basePath}/tags/${tag}`}
        css={css`
          color: ${theme.colors.accent};
          text-decoration: none;
        `}
      >
        <FontAwesomeIcon icon={faTag} />
        &nbsp;{tag}
      </a>
    </Link>
  );
};

export default Tag;
