import { Theme } from "@emotion/react";

export const defaultTheme: Theme = {
  colors: {
    base: "#ffffff",
    main: "#2f3131",
    accent: "#e234e2",
    background: "#eaddf0",
    shadow: "rgba(226, 52, 226, 0.3)",
  },

  fonts: {
    title: '"Noto Sans JP", sans-serif',
    content: '"游ゴシック Medium", YuGothic, YuGothicM, "Hiragino Kaku Gothic ProN", "Hiragino Kaku Gothic Pro", メイリオ, Meiryo, sans-serif',
    code: 'Consolas, "Courier New", Courier, Monaco, monospace',
  },

  minWidth: "30rem",
  maxWidth: "60rem",
};
