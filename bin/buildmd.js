const processmd = require("processmd").default;

const options = {
  files: `${__dirname}/../posts/*.md`,
  outputDir: `${__dirname}/../dist`,
  summaryOutput: `${__dirname}/../dist/summary.json`,
  filenamePrefix: "",
  renderLatex: true,
  highlightCode: true,
  preview: 180,
  previewDelimiter: "\n",
  includeBodyProps: false,
  includeTitle: true,
  includeDir: false,
  includeBase: false,
  includeExt: false,
  includeSourceBase: true,
  includeSourceExt: false,
  convertMode: "json",
  stdout: false,
  markdownRenderer: null,
  markdownOptions: {
    html: true,
    linkify: true,
  },
  headingIds: false,
};

processmd(options);
