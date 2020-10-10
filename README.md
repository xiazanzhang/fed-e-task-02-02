# 简单题

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

```

### 4：创建webpack.dev.js

```javascript
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

```

### 5：创建webpack.prod.js

```
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

```

### 6：创建.eslintrc.js

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'quotes': 0,
    'semi': 0,
    'comma-dangle': 0
  }
}
```

### 7：修改package.json

```json
{
  "name": "vue-app-base",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "webpack-dev-server --config webpack.dev.js",
    "build": "cross-env NODE_ENV=production webpack --config webpack.prod.js",
    "format": "prettier . --write",
    "lint": "eslint --ext js,vue",
    "precommit": "lint-staged"
  },
  "dependencies": {
    "core-js": "^3.6.5",
    "vue": "^2.6.11"
  },
  "devDependencies": {
    "@babel/core": "^7.11.6",
    "@babel/preset-env": "^7.11.5",
    "@vue/cli-plugin-babel": "^4.5.7",
    "babel-loader": "^8.1.0",
    "clean-webpack-plugin": "^3.0.0",
    "copy-webpack-plugin": "^6.2.0",
    "cross-env": "^7.0.2",
    "css-loader": "^4.3.0",
    "eslint": "^7.11.0",
    "eslint-config-standard": "^14.1.1",
    "eslint-loader": "^4.0.2",
    "eslint-plugin-import": "^2.22.1",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^4.2.1",
    "eslint-plugin-standard": "^4.0.1",
    "eslint-plugin-vue": "^7.0.1",
    "file-loader": "^6.1.0",
    "html-loader": "^1.3.1",
    "html-webpack-plugin": "^4.5.0",
    "husky": "^4.3.0",
    "less": "^3.12.2",
    "less-loader": "^7.0.1",
    "lint-staged": "^10.4.0",
    "mini-css-extract-plugin": "^0.12.0",
    "optimize-css-assets-webpack-plugin": "^5.0.4",
    "prettier": "^2.1.2",
    "style-loader": "^1.3.0",
    "stylelint": "^13.7.2",
    "stylelint-webpack-plugin": "^2.1.0",
    "url-loader": "^4.1.0",
    "vue-loader": "^15.9.3",
    "vue-style-loader": "^4.1.2",
    "vue-template-compiler": "^2.6.12",
    "webpack": "^4.44.2",
    "webpack-cli": "^3.3.12",
    "webpack-dev-server": "^3.11.0",
    "webpack-merge": "^5.2.0"
  },
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/essential",
      "eslint:recommended"
    ],
    "parserOptions": {
      "parser": "babel-eslint"
    },
    "rules": {}
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ],
  "husky": {
    "hooks": {
      "pre-commit": "yarn run precommit"
    }
  },
  "lint-staged": {
    "*.js": [
      "eslint",
      "git add"
    ]
  }
}
```

## 开始使用

```
# 使用 yarn 安装依赖
$ yarn

# 开发模式运行
$ yarn serve

# 生产环境编译
$ yarn build

# 自动格式化代码
$ yarn format

# 代码检查
$ yarn lint

# precommit
$ yarn precommit
```

