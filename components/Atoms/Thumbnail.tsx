import React from "react";
import { css, useTheme } from "@emotion/react";

export type ThumbnailProps = {
  src: string;
};

export const Thumbnail: React.FC<ThumbnailProps> = ({ src }) => {
  const theme = useTheme();

  return (
    <img
      src={src}
      css={css`
        max-width: 100%;
        outline: ${theme.colors.shadow} solid 1px;
      `}
    />
  );
};
