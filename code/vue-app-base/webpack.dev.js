const { merge } = require("webpack-merge")
const webpack = require("webpack")
const common = require("./webpack.common")
const StyleLintPlugin = require("stylelint-webpack-plugin")

module.exports = merge(common, {
  // 工作模式
  mode: "development",
  // 开发服务
  devServer: {
    // 静态资源访问文件
    contentBase: "public",
    // 开启热更新 报错会重新刷新浏览器，不易调试
    hot: true,
    // 无论代码是否被处理了热替换，浏览器都不会自动刷新
    hotOnly: true,
  },
  // 配置开发过程中的辅助工具
  devtool: "source-map",
  // 配置插件
  plugins: [
    // 热更新插件
    new webpack.HotModuleReplacementPlugin(),
    // 支持在 Vue 单文件组件的样式部分的代码校验。
    new StyleLintPlugin({
      files: ["**/*.{vue,htm,html,css,sss,less,scss,sass}"],
    })
  ]
});
