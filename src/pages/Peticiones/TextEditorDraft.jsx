import React, { useState, useEffect } from 'react'
import { Editor, EditorState, RichUtils, ContentState, convertFromRaw, convertToRaw } from 'draft-js'
import 'draft-js/dist/Draft.css'

function TextEditor({ base64 }) {
  const bufferToString = buffer => {
    const binaryString = String.fromCharCode.apply(null, new Uint16Array(buffer))
    return decodeURIComponent(escape(binaryString))
  }

  let data
  if (base64.startsWith('JVBER')) {
    data = 'data:application/pdf;base64,' + base64
    base64 = data
  } else if (base64.startsWith('UEsDB')) {
    data = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + base64
    base64 = data
  } else if (base64.startsWith('CQkJC') || base64.startsWith('OC4yM')) {
    data = 'data:@file/plain;base64,' + base64
    base64 = data
  }
  const base64ToString = base64 => {
    const bytes = new Uint8Array(Buffer.from(base64, 'base64'))
    return new TextDecoder().decode(bytes)
  }
  const initialEditorState = base64
    ? EditorState.createWithContent(ContentState.createFromText(bufferToString(base64)))
    : EditorState.createEmpty()

  const [editorState, setEditorState] = useState(initialEditorState)
  const [previewMode, setPreviewMode] = useState(false)
  const [customStyleMode, setCustomStyleMode] = useState(false)
  const [customTextColor, setCustomTextColor] = useState('#000000')

  useEffect(() => {
    if (base64) {
      setEditorState(EditorState.createWithContent(ContentState.createFromText(base64ToString(base64))))
    }
  }, [base64])

  const handleEditorChange = newEditorState => {
    setEditorState(newEditorState)
  }

  const toggleInlineStyle = style => {
    const newState = RichUtils.toggleInlineStyle(editorState, style)
    setEditorState(newState)
  }

  const toggleBlockType = blockType => {
    const newState = RichUtils.toggleBlockType(editorState, blockType)
    setEditorState(newState)
  }

  const handleTextColorChange = event => {
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

  const handleCustomTextColorChange = event => {
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
        <button className='editor-button' onClick={handleCustomStyle}>
          Estilo Personalizado
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
