const path = require("path");

module.exports = {
  output: "export",
  basePath: "/blog",
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    return config;
  },
};
