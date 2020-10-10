const path = require("path");
const webpack = require("webpack");

const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  // 入口文件
  entry: "./src/main.js",
  // 输出文件的配置
  output: {
    // 输出文件的名称
    filename: "js/[name].[hash:8].js",
    // 输出文件的路径（绝对路径）
    path: path.join(__dirname, "dist"),
  },
  // 集中配置webpack内部的一些优化功能
  optimization: {
    // 把所有的公共模块提取到单独的bundle当中
    splitChunks: {
      chunks: "all",
    },
    // 开启sideEffects
    sideEffects: true,
    // 在输出结果中只导出被外部使用了的成员
    usedExports: true,
    minimize: true,
    // 开启代码压缩功能
    minimizer: [
      // 压缩样式文件
      new OptimizeCssAssetsWebpackPlugin(),
    ],
    // 尽可能合并每一个模块到一个函数中
    concatenateModules: true,
  },
  performance: {
    hints: "warning", // 枚举
    maxAssetSize: 1024 * 3000, // 整数类型（以字节为单位）
    maxEntrypointSize: 1024 * 5000, // 整数类型（以字节为单位）
    assetFilter: function (assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
    },
  },
  // 配置对象
  module: {
    // 其他资源模块加载规则
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
        // 排除 node_modules
        exclude: (file) => /node_modules/.test(file) && !/\.vue\.js/.test(file),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "eslint-loader",
        enforce: "pre",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          process.env.NODE_ENV !== "production"
            ? "vue-style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader", // Data URLs加载器
            options: {
              esModule: false,
              outputPath: "assets",
              name: "[name].[hash:8].[ext]",
              limit: 1024 * 10, // 只将10kb以下的文件用url-loader处理
            },
          },
        ],
      },
      {
        enforce: "pre",
        test: /\.(js|vue)$/,
        loader: "eslint-loader",
        exclude: /node_modules/,
      },
    ],
  },
  // 配置插件
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: "Hello Vue!",
      template: "public/index.html",
    }),
    // 自动提取css到一个单独的文件中
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
      chunkFilename: "css/[id].[hash:8].css",
    }),
    // 为代码注入全局成员
    new webpack.DefinePlugin({
      BASE_URL: '"./"',
    }),
  ],
};
