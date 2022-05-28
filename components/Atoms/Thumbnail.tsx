import React from "react";
import { css } from "@emotion/react";

export type ThumbnailProps = {
  src: string;
};

export const Thumbnail: React.FC<ThumbnailProps> = ({ src }) => {
  return (
    <img
      src={src}
      css={css`
        max-width: 100%;
      `}
    />
  );
};
