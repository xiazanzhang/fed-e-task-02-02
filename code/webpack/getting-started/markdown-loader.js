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