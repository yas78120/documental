import React, { useState } from 'react'
import { EditorState, convertToRaw, ContentState, ContentBlock, genKey } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import axios from 'axios'
import { Editor } from 'react-draft-wysiwyg'
import { Button } from '@mui/material'

interface GeneratePdf {
  htmlContent: string
  nameFile: string
  descriptionFile: string
}

const EditorControlled = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [base64, setBase64] = useState<string>('')

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState)
  }

  const handleSaveButtonClick = async () => {
    try {
      const rawContent = convertToRaw(editorState.getCurrentContent())
      const htmlContent = convertRawToHTML(rawContent)
      console.log(htmlContent)

      const data: GeneratePdf = {
        htmlContent: htmlContent,
        nameFile: 'Licencia2',
        descriptionFile: 'asbcjbajscjkask'
      }

      const url = 'http://localhost:3501/documents/generate-pdf'

      const response = await axios.post(url, data)

      if (response.data && response.data.pdfBase64) {
        setBase64(response.data.pdfBase64)

        const dataURI = `data:application/pdf;base64,${base64}`
        const windowName = '_blank'
        const newWindow = window.open('', windowName)

        newWindow?.document.write(
          `<html><body style="margin: 0; overflow: hidden;">
            <embed width="100%" height="100%" src="${dataURI}" />
          </body></html>`
        )
      } else {
        console.error('Respuesta inesperada del servidor:', response)
      }
    } catch (error) {
      console.error('Error al guardar el contenido:', error)
      //alert('Error al guardar el contenido.')
    }
  }

  const convertRawToHTML = (rawContent: any) => {
    console.log(rawContent)
    const contentBlocks = rawContent.blocks
    const contentState = ContentState.createFromBlockArray(contentBlocks.map(convertBlockToContentBlock))
    return stateToHTML(contentState)
  }

  const convertBlockToContentBlock = (rawBlock: any) => {
    console.log(rawBlock)
    return new ContentBlock({
      key: genKey(),
      type: rawBlock.type,
      text: rawBlock.text,
      characterList: rawBlock.inlineStyleRanges.map(convertInlineStyleToCharacterList),
      data: rawBlock.data
    })
  }
  /*
  const convertInlineStyleToCharacterList = (inlineStyle: any) => {
    return Array.from({ length: inlineStyle.length }, () => {
      return { style: inlineStyle.style, entity: null }
    })
  }
*/
  return (
    <div>
      {/* Editor Draft.js */}
      <Editor editorState={editorState} onEditorStateChange={handleEditorChange} />

      {/* Botón para guardar */}
      <Button onClick={handleSaveButtonClick}>Guardar</Button>
    </div>
  )
}

export default EditorControlled
