# Webpack打包

## 模块打包工具的由来

- 模块化解决了我们在代码开发当中的代码组织问题，随着我们引入模块化，我们的应用会产生新的问题。
  - ES Modules存在环境兼容问题
  - 模块文件过多，网络请求频繁
  - 所有的前端资源都需要模块化
    - 随着应用的日益复杂，html/css文件也会面临这些问题
  - 开发阶段包含新特性的代码转换为绝大多数环境支持的代码，解决环境兼容的问题
  - 将散落的模块文件打包在一起，解决模块文件过多，请求频繁的问题
  - 支持不同类型的资源模块（.js/.css/.scss/.hbs/.png/.ts）

## 模块打包工具概要

- webpack
  - 模块打包器（Module bundler）
  - 
  - 
    - 将零散的模块代码打包到同一个js文件当中
  - 模块加载器（Loader）
    - 在代码中有环境兼容问题的代码通过模块加载器进行编译转换
  - 代码拆分（Code Splitting）
    - 将应用当中所有的代码按照我们的需要去打包，不用担心把所有的代码全部打包在一起产生的文件过大的问题，可以把应用程序初次运行的时候所必须的一些模块打包在一起，其它的模块单独的进行存放，实际需要使用的时候去异步加载这些模块。
  - 资源模块（Assets Module）
    - 支持以模块化的方式去载入任意类型的资源文件
  - 打包工具解决的是前端整体的模块化，并不单指JavaScript模块化

## 快速上手

webpack作为目前最主流的前端模块打包器，提供了一整套前端项目模块化方案。

- 安装：yarn add webpack webpack-cli --dev
- 编译：yarn webpack

## 配置文件

webpack4以后的版本它支持零配置的方式直接启动打包，打包过程会按照约定`src/index.js`=>`dist/main.js`

- 在项目根目录下添加一个webpack.config.js文件，这个文件是运行在Node环境中的，我们使用CommonJS规范

```javascript
const path = require('path')

module.exports = {
    //去指定webpack打包入口文件的路径
    entry: './src/main.js',
    //设置输出文件的配置
    output: {
        //输出文件的名称
        filename: 'bundle.js',
        //输出文件的路径（绝对路径）
        path: path.join(__dirname, 'dist')
    }
}
```

## 工作模式

webpack4新增工作模式做法，这种用法大大的简化了webpack配置的复杂程度，可以把它理解成针对于不同环境的几组预设配置

- 生产模式：yarn-webpack （默认webpack --mode production）
  - 自动启用优化插件，将我们的代码进行压缩
- 开发模式：webpack --mode development
  - 自动优化打包的速度，添加一些调试过程中需要的辅助到我们代码当中
- none模式：webpack --mode none
  - 进行最原始的打包，不会进行任何额外的处理

```javascript
module.exports = {
    //工作模式
    mode: 'development'
}
```

## 打包结果运行原理

整体生成的代码是一个立即执行的函数，这个函数接受一个modules的参数，调用时传入了一个数组

![](https://s1.ax1x.com/2020/10/06/0NzfQf.png)

展开这个数组，数组中的每一个元素都是一个参数列表相同的函数，这里的函数对于的是源代码当中的模块，每一个模块最终都会包裹到这些函数当中，从而实现模块的私有作用域

![](https://s1.ax1x.com/2020/10/06/0USIc6.png)

![](https://s1.ax1x.com/2020/10/06/0U94OK.png)

## 资源模块加载

Loader是Webpack的核心特性，借助于Loader就可以加载任何类型的资源。

以加载css为例，首先安装css-loader来转换css文件，在安装style-loader将css-loader转换过后的结果通过style标签的形式添加到页面上，webpack配置如下：

```javascript
    // 配置对象
    module: {
        //其他资源模块加载规则
        rules: [{
            //匹配打包过程中遇到的文件路径
            test: /.css$/,
            //匹配文件打包过程中用的loader 配置了多个loader执行顺序是从后往前执行
            use: [
                'style-loader', //把css-loader转换后的结果通过style标签的形式添加到页面上
                'css-loader' //处理css文件的加载器
            ]
        }]
    }
```

## 导入资源模块

webpack的打包入口一般是javascript文件，一般打包入口是应用程序的运行入口，目前而言，前端应用中的业务是由JavaScript来驱动的。

```javascript
import './heading.css'

export default () => {
    const element = document.createElement('h2')

    element.textContent = 'Hello world'
    element.classList.add('heading')
    element.addEventListener('click', () => {
        alert('Hello webpack')
    })

    return element
}
```

- 传统的做法当中我们将样式和行为单独分开和引入，webpack建议我们在js文件当中载入css，我们编写代码的过程当中根据代码需要动态导入资源文件，真正需要资源的不是应用，而是此时正在编写的代码
- JavaScript驱动整个前端应用，在实现业务功能的过程当中可能需要图片或者样式等资源文件，如果建立了这个依赖关键，逻辑合理，JS确实需要这些资源文件，确保上线资源不缺失，都是必要的
- 学习新事物不是学会它的所有用法你就能提高，因为这些东西照着文章谁都可以，要搞清楚它为什么这样设计，基本上算是出道了
  - 新事物的思想才是突破点

## 加载器

### 文件加载器

- file-loader 处理文件加载器

- 文件加载器的工作过程

  - webpack在打包时遇到我们的图片文件，根据我们配置文件当中的配置匹配到对应的文件加载器，此时文件加载器开始工作，它先将我们导入的文件拷贝到输出目录，然后将输出目录的路径作为当前模块的返回值返回，这样对于我们的应用来说所需要的资源就被发布出来了，同时我们可以通过模块的导出成员拿到我们资源的访问路径

  - ```javascript
    {
    	test: /.png$/,
    	use: 'file-loader' //文件加载器
    }
    ```

![](https://s1.ax1x.com/2020/10/07/0daxDs.png)

### URI加载器

- Data URIs是一种当前URL就能表示文件内容的方式，这种URL中的文本就已经包含了文件内容，我们在使用这种URL的时候就不会去发送任何的HTTP请求

- url-loader Data URI加载器

  - ```javascript
    {
    	test: /.png$/,
    	use: 'url-loader', //Data URLs加载器
    	//配置选项
    	options: {
    		limit: 10 * 1024 // 只将10kb以下的文件用url-loader处理
    	}
    }
    ```

- 最佳实践

  - 小文件使用Data URLs，减少请求次数
  - 大文件单独提前存放，提高加载速度
  - 超出10KB文件单独提取存放
  - 小于10KB文件转换为Data URLs嵌入代码

- 注意事项：对于超出大小的文件url loader会去调用file loader，所以还是要安装fileloader

### 常用分类加载器

webpack的资源加载器类似生活当中工厂里面的生产车间，它是用来处理和加工打包过程当作的资源文件

- 编译转换类
  - 这种类型的loader会把我们的模块转换成JavaScript的代码
- 文件操作类
  - 文件操作类型的加载器会把我们的资源模块拷贝到输出目录，同时将文件的访问路径向外导出
- 代码检查类
  - 对我们所加载到的资源文件进行校验，它的目的统一我们的代码风格，提高我们的代码质量

### Webpack与ES 2015

由于webpack默认就能处理我们代码当中的import/export，所以很自然的有人认为webpack会自动编译es6的代码，因为模块打包需要，所以处理import/export，除此之外并不能处理代码当中其他的es6特性，如果我们需要在打包过程当作处理其他es6特性的转换，我们需要为js文件添加一个额外的编译性loader

- babel-loader，一个编译型loader，用来处理es6特性的转换

  - ```javascript
    {
        test: /.js$/,
            use: {
                loader: 'babel-loader', //处理es6代码当作的新特性
                    options: {
                        //babel只是一个转换js代码的平台，在平台转换过程中需要额外的插件
                        presets: ['@babel/preset-env'] 
                    }
            }
    }
    ```

- webpack只是打包工具

- 加载器可以用来编译转换代码

### 加载资源的方式

- 遵循ES Modules标准规范的import声明
- 遵循CommonJS标准的Require函数
- 遵循AMD标准的define函数和require函数
- Loader加载非JavaScript也会触发资源加载
  - 样式代码中的@import指令和url函数
  - HTML代码中图片标签的src属性
- *样式代码中的@import指令和url函数
- *HTML代码中图片标签的src属性

```javascript
{
    test: /.html$/,
    use: {
            loader: 'html-loader', //html解析器
            options: {
            // html加载的时候对页面上的一些属性做一些额外处理
            attrs: [
                'img:src', //默认
                'a:href'
            ]
        }
    }
}
```

### 核心工作原理

![](https://s1.ax1x.com/2020/10/07/0d2Shj.png)

- 在我们的项目当中一般都会散落着各种各样的代码和资源文件，webpack会根据我们的配置找到其中的一个文件作为打包的入口，然后顺着为我们的入口文件当中的代码，根据我们代码中出现的import/require之内的语句解析推断出来这个文件所依赖的资源模块，分别去解析每个资源模块的资源依赖，最后会形成整个项目中所有文件之间依赖关系的依赖树，有了这个依赖树过后会递归这个依赖树，找到每个节点所对应的资源文件，根据我们配置文件当中的rules属性去找到这个模块所对应的加载器，然后交给对应的加载器去加载这个模块，最后将加载到的结果放入到bundle.js（配置的输出文件路径）当中，从而实现整个项目的打包
- Loader机制是Webpack的核心，如果没有loader就没有办法去实现各种资源文件的加载，对于webpack来说就只是一个打包或者合并代码的工具了

### 开发一个Loader

- markdown-loader 在代码当中直接导入markdown文件

  - 输入就是资源文件的内容
  - 输出是处理完成之后的结果

- 实现方式

  ```javascript
  const marked = require('marked') //markdown解析模块
  
  module.exports = source => {
      const html = marked(source)
          //返回的类型一定要是js代码
          // return 'console.log("hello ~")'
          //直接拼接html当中存在的换行符和内部的引号拼接在一起可能引起语法错误
          // return `module.exports="${html}"` 
          //CommonJS方式导出字符串
          // return `module.exports=${JSON.stringify(html)}`
          //ES Modules方式导出
          // return `export default ${JSON.stringify(html)}`
  
      //返回html字符串交给下一个loader处理
      return html
  }
  ```

  ```javascript
   {
       test: /.md$/,
       use: [
           'html-loader',
           './markdown-loader'
       ]
   }
  ```

- 工作原理

  - Loader负责资源文件从输入到输出的转换
  - Loader是一种管道的概念，我们可以将我们此次Loader的结果交给下一个Loader处理
  - 对于同一个资源可一次使用多个Loader
    - css-loader=>style-loader

## 插件机制介绍

- 插件机制是webpack另外一个核心特性，目的是为了增强webpack在项目自动化的能力
- loader专注实现资源模块的加载，从而实现整体项目的打包
- plugin解决其他自动化工作
  - 清除dist目录
  - 拷贝静态文件至输出目录
  - 压缩输出代码
- webpack+plugin实现了大多前端工程化绝大多数经常用到的部分

### 自动清除输出目录插件

- clean-webpack-plugin 自动清除输出目录

```javascript
//配置插件
plugins: [
    //清理输出目录
    new CleanWebpackPlugin()
]
```

### 自动生成HTML插件

- html-webpack-plugin 自动生成使用bundle.js的HTML

```javascript
//配置插件
plugins: [
    //清理输出目录
    new CleanWebpackPlugin(),
    //自动生成index.html
    new HtmlWebpackPlugin({
        title: 'Webpack Plugin Sample',
        meta: {
        	viewport: 'width=device-width'
        },
        template: './index.html'
    }),
    //用于生成about.html
    new HtmlWebpackPlugin({
        filename: 'about.html'
    })
]
```

### 插件使用总结

- copy-webpack-plugin 将文件拷贝到输出目录  
- 社区当中提供了成百上千的插件，我们并不需要全部认识，当我们有特殊需求时，我们只需要提取需求当中的关键词，然后去github上搜索它们，虽然每个插件的作业不经相同，但是它们的用法上几乎类似。

### 开发一个插件

- 相比于loader，plugin拥有更宽的能力范围，loader只是加载模块的环境去工作，plugin的工作范围几乎可以触及到webpack工作的每一个环节
- plugin通过钩子机制实现
- webpack要求plugin必须是一个函数或者是一个包含apply方法的对象
- 总结
  - 插件是通过在生命周期的钩子中挂载函数实现扩展

```javascript
class MyPlugin {
    apply(compiler) {
        console.log('My Plugin 启动')
        compiler.hooks.emit.tap('MyPlugin', compilation => {
            //compilation可以理解为此次打包的上下文
            for (const name in compilation.assets) {
                // console.log(compilation.assets[name].source())
                //判断是否是js文件
                if (name.endsWith('.js')) {
                    //获取文件的内容
                    const contents = compilation.assets[name].source()
                        //将注释替换成空
                    const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
                        //将最终结果覆盖原有的内容当中
                    compilation.assets[name] = {
                        //返回新的内容
                        source: () => withoutComments,
                        //返回内容大小，这个方式是webpack内部要求必须的方法
                        size: () => withoutComments.length
                    }
                }
            }
        })
    }
}
```

```javascript
//配置插件
plugins: [
    //自定义插件 删除生成的js文件当中的注释
    new MyPlugin()
]
```

## 开发体验问题

- 以HTTP Server运行，而不是以文件的方式进行预览
- 自动编译+自动刷新
- 提供Source Map支持

### 自动编译

- watch工作模式
  - 监听文件变化，自动重新打包
  - yarn webpack --watch

### 自动刷新浏览器

- BrowserSync 这个工具可以帮我们实现自动刷新的功能
  - 需要同时使用两个工具
  - 开发效率上降低，开发过程当中webpack会不断写入磁盘，browserSync又从磁盘中读取出来，这个过程当中一次就会多出两步的读写操作

### Webpack Dev Server

- Webpack Dev Server是Webpack官方推出的一个开发工具
- 提供用于开发的HTTP Server
- 集成自动编译和自动刷新浏览器等功能

### 静态资源访问

- Webpack Dev Server默认会将构建结果输出的文件全部作为开发服务器的资源文件，只要通过webpack打包输出的文件都能被访问到，但如果还有一些静态资源也需要作为开发资源被访问的化，需要额外的告诉webpack dev server
- contentBase 额外为开发服务器指定查找资源目录

### 代理API

- 跨域资源共享（CORS），使用CORS的前提是API必须支持，并不是任何情况下API都应该支持

- 同源部署（域名端口协议一致）

- 开发阶段接口跨域

  - 开发服务器中配置代理服务，把接口服务代理到本地开发服务的地址

- webpack dev server支持配置代理

- 用法

  - 目标：将Github API代理到开发服务器

  ```javascript
  // webpack dev server的配置选项
  devServer: {
      //静态资源文件路径
      contentBase: ['./public'],
          //代理对象
          proxy: {
              '/api': {
                  //http://localhost:8080/api/users =>https://api.github.com/api/users
                  target: 'https://api.github.com',
                      //http://localhost:8080/api/users =>https://api.github.com/users
                      //代理路径重写
                      publicPath: {
                          '^/api': ''
                      },
                      //不能使用 localhost:8080 作为请求 github 的主机名
                      changeOrigin: true //以实际代理请求的主机名去请求
              }
          }
  }
  ```

### Source Map

- 运行的代码与源代码之间完全不同，如果需要调试应用，错误信息无法定位，调试和报错都是基于运行代码
- Sourece Map(源代码地图)，可以通过SourceMap文件逆向解析源代码
- Sourece Map解决了源代码与运行代码不一致所产生的问题

### 配置Source Map

```javascript
//配置开发过程中的辅助工具
devtool: 'source-map'
```

- 截止到目前，webpack支持12种不同的方式，每种方式的效率和效果各不相同

|                                          |          |              |          |                        |
| :--------------------------------------- | :------- | :----------- | :------- | :--------------------- |
| devtool                                  | 构建速度 | 重新构建速度 | 生产环境 | 品质(quality)          |
| (none)                                   | 非常快速 | 非常快速     | yes      | 打包后的代码           |
| eval                                     | 非常快速 | 非常快速     | no       | 生成后的代码           |
| eval-cheap-source-map                    | 比较快   | 快速         | no       | 转换过的代码（仅限行） |
| eval-cheap-module-source-map             | 中等     | 快速         | no       | 原始源代码（仅限行）   |
| eval-source-map                          | 慢       | 比较快       | no       | 原始源代码             |
| eval-nosources-source-map                |          |              |          |                        |
| eval-nosources-cheap-source-map          |          |              |          |                        |
| eval-nosources-cheap-module-source-map   |          |              |          |                        |
| cheap-source-map                         | 比较快   | 中等         | yes      | 转换过的代码（仅限行） |
| cheap-module-source-map                  | 中等     | 比较慢       | yes      | 原始源代码（仅限行）   |
| inline-cheap-source-map                  | 比较快   | 中等         | no       | 转换过的代码（仅限行） |
| inline-cheap-module-source-map           | 中等     | 比较慢       | no       | 原始源代码（仅限行）   |
| inline-source-map                        | 慢       | 慢           | no       | 原始源代码             |
| inline-nosources-source-map              |          |              |          |                        |
| inline-nosources-cheap-source-map        |          |              |          |                        |
| inline-nosources-cheap-module-source-map |          |              |          |                        |
| source-map                               | 慢       | 慢           | yes      | 原始源代码             |
| hidden-source-map                        | 慢       | 慢           | yes      | 原始源代码             |
| hidden-nosources-source-map              |          |              |          |                        |
| hidden-nosources-cheap-source-map        |          |              |          |                        |
| hidden-nosources-cheap-module-source-map |          |              |          |                        |
| hidden-cheap-source-map                  |          |              |          |                        |
| hidden-cheap-module-source-map           |          |              |          |                        |
| nosources-source-map                     | 慢       | 慢           | yes      | 无源代码内容           |
| nosources-cheap-source-map               |          |              |          |                        |
| nosources-cheap-module-source-map        |          |              |          |                        |

### eval模式的Source Map

- eval是js当中的一个函数，它可以运行字符串当中的js代码，默认情况下运行在临时的虚拟机环境当中
- 不会生成source map文件，构建速度最快，只能定位源代码文件的名称，而不知道具体的行列信息

### devtool模式对比

- eval
  - 将我们的模块代码放到eval函数当中去执行，并且通过source url去标注文件的路径，这种模式下没有生成source map，它只能定位哪个文件出了错误
- eval-sourece-map
  - 同样使用eval函数去执行模块代码，它除了帮我们定位错误的文件，还能帮我们定位到行和列的信息，对比eval模式它生成了source map
- cheap-eval-sourece-map
  - 阉割版的eval-sourece-map，生成的source map只有行的信息，没有列的信息，但速度会更快
  - es6转换够后的结果
- cheap-module-eval-sourece-map
  - 和cheap-eval-sourece-map类似，不同的是它定位的源代码就是我们实际编写的源代码，没有经过转换的
- cheap-source-map
  - 没有eval意味着没有用eval的方式去执行模块代码
  - 没有module意味着是经过loader处理过后的代码
- inline-source-map
  - 和普通的source map模式一样
  - 普通模式是以物理文件地址方式存在
  - inline-source-map使用的是dataurl方式去嵌入到我们的代码当中，体积会变大很多
- hidden-source-map
  - 这种模式在构建过程当中生成了map文件，但是代码当中并没有通过注释的方式去引入这个文件
  - 开发第三方包的时候比较有用
- nosources-source-map
  - 没有源代码，但提供了行列信息，为了在生产环境当中不会暴露源代码的情况
- eval：是否使用eval执行模块代码
- cheap：Source Map是否包含行信息
- module：是否能够得到Loader处理之前的源代码

### 选择Source Map模式

- 开发模式
  - cheap-module-eval-sourece-map
    - 代码每行不会超过80个字符
    - 经过Loader转换过后的差异较大，需要调试源代码
    - 首次打包速度慢无所谓，重写打包相对较快
- 生产模式
  - none
    - Source Map会暴露源代码
    - 调试是开发阶段的事情，生成环境不建议使用source map
- 理解不同模式的差异，适配不同的环境

## 自动刷新的问题

- 问题：页面整体刷新，页面之前的操作状态会丢失
- 需求：页面不刷新的前提下，模块也可以及时刷新

### HMR体验

- Hot Module Replacement(模块热替换/热更新)
- 热拔插
  - 在一个正在运行的机器上随时插拔设备，而我们机器的运行状态不会受插拔设备的影响，而插上的设备可以立即开始工作
  - 电脑上的USB端口可以热拔插
- 模块热替换
  - 可以在应用程序运行的过程中实时替换某个模块，应用运行状态不受影响
  - 自动刷新导致页面状态丢失，热替换只将修改的模块实时替换至应用中
- HMR是Webpack中最强大的功能之一，极大程度提高了开发者的工作效率

### 开启HMR

- HMR集成在webpack-dev-server中

  - webpack-dev-server --hot开启特性
  - 也可以在配置文件当中配置开启特性

  ```javascript
  //热更新插件
  new webpack.HotModuleReplacementPlugin()
  ```

### HMR疑问

- Webpack中的HMR并不可以开箱即用
- Webpack中的HMR需要手动处理模块热替换逻辑
- 为什么样式文件的热更新开箱即用？
  - 样式文件是经过loader处理的，在style-loader处理样式文件的过程中就已经自动了热更新，所以不需要我们额外做手动的操作
- 凭什么样式可以自动处理，脚本文件要手动处理？
  - 样式文件处理过后只需要把css及时替换到页面当中，可以覆盖到之前的文件从而实现热更新
  - 编写的脚本文件是没有任何的规律的，webpack在面对这些毫无规律的JS模块不知道如何去处理这些更新过后的模块，没有办法帮我们实现一个通用情况的模块替换方案
  - 我的项目没有手动处理，JS照样可以热替换？
    - 使用了vue-cli/create react等脚手架工具，框架下的开发，每种文件都是有规律的，框架提供的就是一些规则
    - 通过脚手架创建的项目内部都集成了HMR方案
- 总结：我们需要手动处理JS模块热更新后的热替换

### 使用HMR API

- ```javascript
  module.hot.accept('./editor', () => {
      console.log('editor模块更新了，需要这里手动处理热更新')
  })
  ```

### 处理JS模块热替换

```javascript
//存储最后一次更新的值
let lastEditor = editor
module.hot.accept('./editor', () => {
    console.log('editor模块更新了，需要这里手动处理热更新', lastEditor.value)
    //拿到编辑的内容
    const value = lastEditor.value
    //移除原来的元素
    document.body.removeChild(editor)
    //创建一个新的元素
    const newEditor = createEditor()
    //将原来的只添加到新元素的值当中 避免原来的值丢失
    newEditor.value = value
    //将新元素追加到页面
    document.body.appendChild(newEditor)
    //记录最新的元素 否则下次找不到这个元素了
    lastEditor = newEditor
})
```

- webpack根本没有办法去提供一个通用的替换方案

### 处理图片模块热替换

```javascript
//图片的热处理替换
module.hot.accept('./01.png', () => {
    img.src = background
    console.log(background)
})
```

### HMR注意事项

- 处理HMR的代码报错会导致自动刷新，控制台错误信息就会被清除，不易察觉
- 没启用HMR的情况下，HMR API会报错
- 代码中多了一些与业务无关的代码

## 生产环境优化

- 生成环境和开发环境有很大的差异
- 生成环境注重运行效率
- 开发环境注重开发效率
- 模式（mode）
- 为不同的工作环境创建不同的配置

### 不同环境下的配置

- 配置文件根据环境不同导出不同配置
- 一个环境对应一个配置文件

```javascript
/**
 * 不同的环境返回不同的配置
 * @param {*} env CLI传递的环境名参数
 * @param {*} argv 运行CLI过程中所传递的所有参数
 */
module.exports = (env, argv) => {
    //开发环境的配置
    const config = {
        //工作模式
        mode: 'none',
        //去指定webpack打包入口文件的路径
        entry: './src/main.js',
        //设置输出文件的配置
        output: {
            //输出文件的名称
            filename: 'bundle.js',
            //输出文件的路径（绝对路径）
            path: path.join(__dirname, 'dist'),
            //打包过后的文件具体存放位置
            // publicPath: 'dist/'
        },
        // webpack dev server的配置选项
        devServer: {
            //开启热更新 报错会重新刷新浏览器，不易调试
            hot: true,
            //无论代码是否被处理了热替换，浏览器都不会自动刷新
            hotOnly: true,
            //静态资源文件路径
            contentBase: ['./public'],
            //代理对象
            proxy: {
                '/api': {
                    //http://localhost:8080/api/users =>https://api.github.com/api/users
                    target: 'https://api.github.com',
                    //http://localhost:8080/api/users =>https://api.github.com/users
                    //代理路径重写
                    publicPath: {
                        '^/api': ''
                    },
                    //不能使用 localhost:8080 作为请求 github 的主机名
                    changeOrigin: true //以实际代理请求的主机名去请求
                }
            }
        },
        //配置开发过程中的辅助工具
        devtool: 'eval',
        // 配置对象
        module: {
            //其他资源模块加载规则
            rules: [{
                    //匹配打包过程中遇到的文件路径
                    test: /.css$/,
                    //匹配文件打包过程中用的loader 配置了多个loader执行顺序是从后往前执行
                    use: [
                        'style-loader', //把css-loader转换后的结果通过style标签的形式添加到页面上
                        'css-loader' //处理css文件的加载器
                    ]
                },
                {
                    test: /.png$/,
                    use: {
                        loader: 'url-loader', //Data URLs加载器
                        //配置选项
                        options: {
                            limit: 10 * 1024 // 只将10kb以下的文件用url-loader处理
                        }
                    }
                }, {
                    test: /.html$/,
                    use: {
                        loader: 'html-loader', //html解析器
                        options: {
                            // html加载的时候对页面上的一些属性做一些额外处理
                            attrs: [
                                'img:src', //默认
                                'a:href'
                            ]
                        }
                    }
                }, {
                    test: /.md$/,
                    use: [
                        'html-loader',
                        './markdown-loader'
                    ]
                },
                // {
                //     test: /.js$/,
                //     use: {
                //         loader: 'babel-loader', //处理es6代码当中的新特性
                //         options: {
                //             presets: ['@babel/preset-env'] //babel只是一个转换js代码的平台，在平台转换过程中需要额外的插件
                //         }
                //     }
                // }
            ]
        },
        //配置插件
        plugins: [
            //清理输出目录
            //new CleanWebpackPlugin(),
            //用于拷贝文件到输出目录 开发阶段最好不要使用这个插件 影响效率
            // new CopyWebpackPlugin({
            //     patterns: [
            //         // 'public/**',
            //         'public'
            //     ]
            // }),
            //自动生成index.html
            // new HtmlWebpackPlugin({
            //     title: 'Webpack Plugin Sample',
            //     meta: {
            //         viewport: 'width=device-width'
            //     },
            //     filename: 'index.html'
            // }),
            //用于生成about.html
            new HtmlWebpackPlugin({
                filename: 'index.html'
            }),
            //自定义插件 删除生成的js文件当中的注释
            new MyPlugin(),
            //热更新插件
            new webpack.HotModuleReplacementPlugin()
        ]
    }

    if (env === 'production') {
        console.log('生成环境')
        config.mode = 'production'
        config.devtool = false
        config.plugins = [...config.plugins, new CleanWebpackPlugin()]
    } else {
        console.log('开发环境')
    }

    return config
}
```

```javascript
// 开发环境
yarn webpack

// 生产环境
yarn webpack --env production
```

### 不同环境的配置文件

- 通过判断环境名参数去返回不同的配置对象这种方式只适用于中小型项目，一旦项目变得复杂，配置文件也变得复杂起来
- 对于大型项目建议使用不同环境对应不同配置文件来实现

### DefinePlugin

- 为代码注入全局成员

```javascript
//为代码注入全局成员
new webpack.DefinePlugin({
    //符合JS语法的代码
    API_BASE_URL: '"https://api.example.com"'
})
```

### 体验Tree Shaking

- 检测代码中未引用的代码，然后移除掉它们
- 在生产模式下自动开启

### 使用Tree Shaking

- Tree Shaking不是指某个配置选项，它是一组功能搭配使用后的效果

- production模式下自动开启

- 其他模式开启

  ```javascript
  //集中配置webpack内部的一些优化功能
  optimization: {
      //在输出结果中只导出被外部使用了的成员
      usedExports: true,
      //开启代码压缩功能
      minimize: true
  }
  ```

### 合并模块

- concatenateModules 
  - 尽可能将所有模块合并到一起输出到一个函数中，即提升了运行效率，又减少了代码的体积

### Tree Shaking与Babel

- Tree Shaking的实现前提是ES Module
  - 由Webpack打包的代码必须使用ESM
  - 为了转换代码中的ECMScript新特性，很多时候使用babel-loader去处理JS，babel转换我们的代码时有可能处理掉我们使用的ES Modules,把它们转换成了CommonJS,取决于我们有没有使用转换ESM的插件

### sideEffects

- sideEffects允许我们通过配置的方式来标识我们的代码是否有副作用,从而为Tree Shaking提供更大的压缩空间
- 副作用：模块执行时除了导出成员之外所作的事情
- sideEffects一般用于npm包标记是否有副作用

### sideEffects注意

- 确保你的代码真的没有副作用，否则webpack打包时会误删掉那些有副作用的代码

### 代码分割

webpack将我们所有的代码都打包到一起，如果我们的应用程序非常复杂，模块非常多的情况下，那么我们的打包结果就会特别的大，我们的应用程序开始工作时并不是每个模块在启动时都是必要的，比较合理的方案是分包，按需加载，这样就能大大提高我们应用程序的相应速度和运行效率

### 多入口打包

- 适用于传统的多页应用程序，一个页面对应一个打包入口，公共部分单独提取

### 提取公共模块

- 多入口打包存在一个小问题，不同的打包入口当中一定会存在一些公用的部分

  ```javascript
  //把所有的公共模块提取到单独的bundle当中
  splitChunks: {
      chunks: 'all'
  }
  ```

### 动态导入

- 需要用到某个模块时，在加载这个模块
- 动态导入的模块会被自动分包

### 魔法注释

- 如果需要给bundle命名的化可以使用webpack提供的魔法注释去实现
- 特有格式：/* webpackChunkName: '名称' */这样就可以给分包或者bundle起名字了
- 如果名称相同，他们会被打包在一起

### MiniCssExtractPlugin

- 可以将css代码从打包结果当中提取出来
- 通过这个插件可以实现css模块的按需加载

### OptimizeCssAssetsWebpack

- 可以压缩我们的样式文件

### 输出文件名 Hash

- 部署前端资源文件时，会开启静态资源缓存，对于用户的浏览器而言，它就可以缓存我们的静态资源文件，提高我们整体应用程序的相应速度

- 生产模式下，文件名使用Hash，一旦资源文件发生改变，文件名称也会发生变化
- hash：整个项目当中有任何一个地方发生改动，这一次打包过程当中的hash值都会发生变化
- chunkhash：在打包过程当中只要是同一路的打包，chunkhash都是相同的
- contenthash：根据输出文件的内容生成的hash值
- 可以通过占位符的方式指定生成hash的长度，例如：[contenthash:8]