import './editor.css'

export default () => {
    const element = document.createElement('input')

    element.contentEditable = true
    element.className = "editor"
    element.id = 'editor'

    console.log('editor init completed')
    return element
}