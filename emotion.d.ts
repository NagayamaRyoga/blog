import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      base: string;
      main: string;
      accent: string;
      background: string;
      shadow: string;
    }

    maxWidth: string;
  }
}
