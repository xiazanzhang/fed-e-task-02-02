const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    // 清理输出目录
    new CleanWebpackPlugin(),
    // 用于拷贝文件到输出目录 开发阶段最好不要使用这个插件 影响效率
    new CopyWebpackPlugin({
      patterns: [
        // 'public/**',
        "public",
      ],
    }),
  ],
});
