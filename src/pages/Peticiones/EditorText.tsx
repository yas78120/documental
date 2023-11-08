import React, { useState, useEffect } from 'react'
import { Editor, EditorState, RichUtils, ContentState, convertFromRaw, convertToRaw } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { convertToHTML, ContentStateConverter } from 'draft-convert'

function TextEditor({}) {
  const initialEditorState = EditorState.createEmpty()

  const [editorState, setEditorState] = useState(initialEditorState)
  const [previewMode, setPreviewMode] = useState(false)
  const [customStyleMode, setCustomStyleMode] = useState(false)
  const [customTextColor, setCustomTextColor] = useState('#000000')

  const handleEditorChange = (newEditorState: React.SetStateAction<EditorState>) => {
    setEditorState(newEditorState)
  }

  const toggleInlineStyle = (style: string) => {
    const newState = RichUtils.toggleInlineStyle(editorState, style)
    setEditorState(newState)
  }

  const toggleBlockType = (blockType: string) => {
    const newState = RichUtils.toggleBlockType(editorState, blockType)
    setEditorState(newState)
  }

  const handleTextColorChange = (event: { target: { value: any } }) => {
    const color = event.target.value
    const newEditorState = RichUtils.toggleInlineStyle(editorState, `COLOR-${color}`)
    setEditorState(newEditorState)
  }

  const handleFontSizeIncrease = () => {
    const currentStyle = editorState.getCurrentInlineStyle()
    const newFontSize = currentStyle.has('LARGE') ? 'NORMAL' : 'LARGE'
    const newState = RichUtils.toggleInlineStyle(editorState, newFontSize)
    setEditorState(newState)
  }

  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  const handleCustomStyle = () => {
    setCustomStyleMode(!customStyleMode)
  }

  const handleCustomTextColorChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setCustomTextColor(event.target.value)
  }

  const handleSave = () => {
    // Obtener el contenido actual del editor
    const contentState = editorState.getCurrentContent()
    const rawContentState = convertToRaw(contentState)

    // Convertir el contenido a una cadena JSON y guardar en el estado local
    const serializedContent = JSON.stringify(rawContentState)
    localStorage.setItem('savedContent', serializedContent)

    // Opcional: Mostrar un mensaje de éxito

    console.log('Contenido guardado exitosamente.')
    handleLoad()
  }

  const handleLoad = () => {
    const savedContent = localStorage.getItem('savedContent')

    if (savedContent) {
      const parsedContent = JSON.parse(savedContent)
      const contentState = convertFromRaw(parsedContent)
      const newEditorState = EditorState.createWithContent(contentState)
      setEditorState(newEditorState)

      console.log('Contenido cargado exitosamente.')
    }
  }
  const htmlConvertOptions = {
    styleToHTML: (style: string) => {
      if (style.startsWith('COLOR-')) {
        const color = style.split('-')[1]
        return `<span style="color: ${color};"></span>`
      }
      return null
    }
  }

  const contentStateConverter: ContentStateConverter = convertToHTML(htmlConvertOptions)
  const contentState = editorState.getCurrentContent()
  const html = contentStateConverter(contentState)
  return (
    <div>
      <div>
        <button className='editor-button' onClick={() => toggleInlineStyle('BOLD')}>
          <strong>Negrita</strong>
        </button>
        <button className='editor-button' onClick={() => toggleInlineStyle('ITALIC')}>
          <em>Cursiva</em>
        </button>
        <button className='editor-button' onClick={() => toggleInlineStyle('UNDERLINE')}>
          <u>Subrayado</u>
        </button>
        <select onChange={handleTextColorChange}>
          <option value=''>Color de Texto</option>
          <option value='red'>Rojo</option>
          <option value='blue'>Azul</option>
          <option value='green'>Verde</option>
        </select>
        <button className='editor-button' onClick={handleFontSizeIncrease}>
          Aumentar Tamaño de Letra
        </button>
        <button className='editor-button' onClick={() => toggleBlockType('header-one')}>
          H1
        </button>
        <button className='editor-button' onClick={() => toggleBlockType('header-two')}>
          H2
        </button>
        <button className='editor-button' onClick={() => toggleBlockType('header-three')}>
          H3
        </button>
        <button className='editor-button' onClick={() => toggleBlockType('header-four')}>
          H4
        </button>
        <button className='editor-button' onClick={() => toggleBlockType('header-five')}>
          H5
        </button>
        <button className='editor-button' onClick={() => toggleBlockType('header-six')}>
          H6
        </button>

        <button className='editor-button' onClick={togglePreview}>
          Vista Previa
        </button>

        <button className='editor-button' onClick={handleSave}>
          Guardar
        </button>
        <button className='editor-button' onClick={handleLoad}>
          Cargar
        </button>
      </div>
      {customStyleMode && (
        <div>
          <label>Color de Texto:</label>
          <input type='color' value={customTextColor} onChange={handleCustomTextColorChange} />
          {/* Agrega más opciones personalizadas según sea necesario */}
        </div>
      )}
      <div className='editor-container'>
        {previewMode ? (
          <div>
            <h4>Vista Previa:</h4>
            <div dangerouslySetInnerHTML={{ __html: convertToHTML(editorState.getCurrentContent()) }} />
          </div>
        ) : (
          <Editor editorState={editorState} onChange={handleEditorChange} />
        )}
      </div>
    </div>
  )
}

export default TextEditor
