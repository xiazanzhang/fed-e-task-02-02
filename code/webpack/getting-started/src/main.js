import createHeading from './heading.js'
import createEditor from './editor.js'
import './main.css'
import imgsrc from './01.png'
import about from './about.md'

console.log(about)
const heading = createHeading()
document.body.append(heading)
document.write(about)

const img = new Image();
img.src = imgsrc
document.body.append(img)

const editor = createEditor();
document.body.append(editor)

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

//图片的热处理替换
module.hot.accept('./01.png', () => {
    img.src = background
    console.log(background)
})

console.log(API_BASE_URL)