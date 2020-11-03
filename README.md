# 简答题

## 1、Webpack的构建流程主要有哪些环节，如果可以请尽可能的描述Webpack打包的整个过程。

- 主要环节
  - entry：找到入口文件
  - module：从入口开始递归找出所有依赖的模块
  - loader：把模块原内容解析转换成新内容
  - plugin：通过钩子函数在构建过程中可以做一些额外的操作
  - output：输出结果
- 打包过程
  - 入口
    - webpack根据我们的配置找到其中的一个文件作为打包的入口
  - 解析资源模块
    - 解析入口文件的import/require语句解析推断出所依赖的资源模块
  - 生成依赖树
    - 解析完成每个模块的依赖关系后最终会形成整个项目所有文件之间依赖关系的依赖树
  - 递归依赖树
    - 递归依赖树，找到每个节点所对应的资源文件
  - 加载模块
    - 根据配置文件中的rules去加载对应的加载器加载这个模块
  - 输出
    - 将最终的加载结果放入到输出文件中，从而实现整个项目的打包

## 2、Loader和Plugin有哪些不同？请描述一下开发Loader和Plugin的思路。

- Loader
  - 专注实现资源模块的加载，实现整体项目的打包
- Plugin
  - 增强webpack在项目自动化的能力
    - 清除dist目录
    - 拷贝静态文件至输出目录
    - 压缩输出代码
- Loader开发思路
  - 负责资源文件从输入到输出的转换
  - 管道的概念，可以将此次Loader的结果交给下一个Loader处理
  - 对于同一个资源可一次使用多个Loader
- Plugin开发思路
  - 通过钩子机制实现
  - 必须是一个函数或者是一个包含apply方法的对象

# 编程题

## 1、使用Webpack实现Vue项目打包任务

[项目代码](https://github.com/xiazanzhang/fed-e-task-02-02/tree/main/code/vue-app-base)

## 环境准备

### 1：安装Webpack

```
# 安装webpack
$ yarn add webpack --dev

# 安装webpack-cli
$ yarn add webpack-cli --dev

# 安装webpack-dev-server
$ yarn add webpack-dev-server --dev

# 安装webpack-merge来实现配置文件合并
$ yarn add webpack-merge --dev
```

### 2：安装依赖包

```
# Vue Loader 是一个 webpack 的 loader，它允许你以一种名为单文件组件 (SFCs)的格式撰写 Vue 组件
$ yarn add vue-loader @vue/cli-plugin-babel --dev

# 该软件包允许使用Babel和webpack来转译JavaScript文件。
$ yarn add babel-loader @babel/core @babel/preset-env --dev

# 解析less
$ yarn add less less-loader --dev

# 通过注入<style>标签将CSS添加到DOM
$ yarn add style-loader --dev

# 解析css
$ yarn add css-loader --dev

$ 解析HTML
$ yarn add html-loader --dev

# 指示webpack将所需的对象作为文件发出并返回其公共URL
$ yarn add file-loader --dev

# 将文件作为base64编码的URL加载
$ yarn add url-loader --dev

# 运行跨平台设置和使用环境变量的脚本
$ yarn add cross-env --dev

# 插件化的代码检测工具
$ yarn add eslint --dev

# 一个在git暂存文件上运行linters的工具
$ yarn add lint-staged --dev

# 一个流行的代码格式化工具
$ yarn add prettier --dev

# git hooks工具
$ yarn add husky --dev

# 清除目录
$ yarn add clean-webpack-plugin --dev

# 拷贝文件/文件夹
$ yarn add copy-webpack-plugin --dev

# 生成HTML文件
$ yarn add html-webpack-plugin --dev

# 将css提取为独立的文件
$ yarn add mini-css-extract-plugin --dev

# 压缩css文件
$ yarn add optimize-css-assets-webpack-plugin --dev

# css代码检查工具
$ yarn add stylelint-webpack-plugin --dev
```

### 3：创建webpack.common.js

```javascript
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
  // 集中配置webpack内
