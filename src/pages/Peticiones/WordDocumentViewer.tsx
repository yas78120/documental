import React, { useState } from 'react'
import mammoth from 'mammoth'

interface WordDocumentViewerProps {
  base64: string | null // Aquí debes definir el tipo de base64Content
}

function WordDocumentViewer({ base64 }: WordDocumentViewerProps) {
  //console.log(base64)

  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  let data
  if (base64?.startsWith('UEsDB')) {
    data = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + base64
    base64 = data
  }

  console.log(base64)
  const handleConvert = async () => {
    /*
    if (base64) {
      // Decodifica el contenido base64 en un ArrayBuffer
      const binaryString = window.atob(base64)
      const arrayBuffer = new ArrayBuffer(binaryString.length)
      const uint8Array = new Uint8Array(arrayBuffer)
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i)
      }

      // Convierte el ArrayBuffer en HTML usando mammoth.js
      const result = await mammoth.convertToHtml({ arrayBuffer })

      // Actualiza el estado con el contenido HTML resultante
      setHtmlContent(result.value)
    }*/
  }

  return (
    <div>
      <button onClick={handleConvert}>Convertir a HTML</button>
      {htmlContent && (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} style={{ border: '1px solid #ccc', padding: '10px' }} />
      )}
    </div>
  )
}
export default WordDocumentViewer
/*import React, { useState } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

function MyEditor() {
  const [editorData, setEditorData] = useState('')

  const handleEditorChange = (event, editor) => {
    const data = editor.getData()
    setEditorData(data)
  }

  return (
    <div>
      <h2>Editor de Texto CKEditor 5</h2>
      <CKEditor editor={ClassicEditor} data={editorData} onChange={handleEditorChange} />
      <div>
        <h3>Contenido del Editor:</h3>
        <div dangerouslySetInnerHTML={{ __html: editorData }} />
      </div>
    </div>
  )
}

export default */
