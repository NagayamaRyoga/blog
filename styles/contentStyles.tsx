import { css, SerializedStyles, Theme } from "@emotion/react";

export const contentStyles = (theme: Theme): SerializedStyles => css`
  margin-block-start: 2.5rem;
  font-family: ${theme.fonts.content};
  font-weight: 500;
  line-height: 1.5;
  word-break: break-word;

  h1 {
    margin-block-start: 1em;
    margin-block-end: 1em;
    font-size: 2em;
    font-weight: 100;
    color: ${theme.colors.accent};
    border-block-end: solid 1px ${theme.colors.accent};
  }

  h2 {
    margin-block-start: 0.5em;
    margin-block-end: 0.5em;
    font-size: 1.5em;
    font-weight: 100;
    color: ${theme.colors.accent};
    border-block-end: solid 1px ${theme.colors.accent};
  }

  h3 {
    margin-block-start: 1.6em;
    margin-block-end: 0.8em;
    font-size: 1.2em;
    font-weight: 100;
    color: ${theme.colors.accent};
  }

  table {
    border-collapse: collapse;

    thead {
      tr {
        border-bottom: double 3px ${theme.colors.main};
      }
    }

    tbody {
      tr {
        border-bottom: solid 1px ${theme.colors.main};
      }
    }

    th,
    td {
      padding: 0.5em 1em;
    }
  }

  strong {
    color: ${theme.colors.accent};
  }

  code {
    padding: 0.2em 0.4em;
    font-size: 0.9em;
    font-family: ${theme.fonts.code};
    font-weight: 500;
    background: #ececec;
  }

  pre {
    padding: 0.5em 0.8em;
    background: #f1f0f0;
    overflow: auto;

    code {
      padding: 0;
      background: none;
    }
  }

  hr {
    margin: 1.5em 0;
    height: 1px;
    background-color: ${theme.colors.accent};
    border: none;
  }

  blockquote {
    margin: 1em 0;
    padding-left: 1em;
    border-left: solid 4px #809ee9;
  }

  a {
    color: ${theme.colors.accent};
  }

  .hljs-comment {
    color: #0f990f;
  }
  .hljs-string {
    color: #ff7300;
  }
  .hljs-name {
    color: #1c50df;
  }
  .hljs-keyword {
    color: #1c50df;
  }
  .hljs-number {
    color: #658116;
  }
  .hljs-meta {
    color: #808080;
  }
`;

export default contentStyles;
