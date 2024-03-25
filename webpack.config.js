const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public", to: "public" }, // Copy files from 'public' directory to 'dist/public'
        { from: "style", to: "style" }, // Copy files from 'style' directory to 'dist/style'
      ],
    }),
  ],
};
