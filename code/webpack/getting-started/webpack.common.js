const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

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

module.exports = {
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