import React, { useState } from 'react'
import { ContentBlock, ContentState, EditorState, convertFromRaw, convertToRaw, genKey } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html' // Importa stateToHTML
import axios from 'axios'
import { Editor } from 'react-draft-wysiwyg'
import { Button } from '@mui/material'
import draftToHtml from 'draft-convert'

// ...
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
    // Obtén el contenido en formato raw
    const rawContent = convertToRaw(editorState.getCurrentContent())
    const htmlContent = convertRawToHTML(rawContent)
    console.log(htmlContent)

    // Convierte el contenido raw a HTML utilizando stateToHTML

    const data: GeneratePdf = {
      htmlContent: htmlContent,
      nameFile: 'Licencia2',
      descriptionFile: 'asbcjbajscjkask'
    }

    const url = 'http://localhost:3501/documents/generate-pdf'

    try {
      // Envía el contenido HTML al backend
      console.log(htmlContent)
      const response = await axios.post(url, data)
      setBase64(response.data.pdfBase64)
      console.log(response)
    } catch (error) {
      console.error('Error al guardar el contenido:', error)
      alert('Error al guardar el contenido.')
    }
    if (base64 && typeof window !== 'undefined') {
      // Solo ejecuta esta parte del código en el lado del cliente
      const dataURI = `data:application/pdf;base64,${base64}`

      const windowName = '_blank'
      const newWindow = window.open('', windowName)
      newWindow?.document.write(
        `<html><body style="margin: 0; overflow: hidden;">
            <embed width="100%" height="100%" src="${dataURI}" />
          </body></html>`
      )
    }
  }
  //console.log(base64)

  const convertRawToHTML = (rawContent: any) => {
    const contentBlocks = rawContent.blocks
    console.log(contentBlocks)
    const htmlContent = contentBlocks
      .map((block: any) => {
        let blockText = block.text
        const blockAling = block.data && block.data['text-align'] ? block.data['text-align'] : 'left'
        let blockHTML = `<p style="text-align: ${blockAling}">`

        let hasBold = false
        let hasItalic = false
        let hasRedColor = false
        let hasUnderline = false
        let hasFontSize = false
        let a

        block.inlineStyleRanges.forEach((styleRange: any) => {
          const style = styleRange.style

          if (style === 'BOLD') {
            hasBold = true
          }
          if (style === 'ITALIC') {
            hasItalic = true
          }
          if (style === 'color-rgb(255,0,0)') {
            hasRedColor = true
          }
          if (style === 'UNDERLINE') {
            hasUnderline = true
          }
          if (style.startsWith('fontsize-')) {
            a = style.replace('fontsize-', '')
            hasFontSize = true
          }
        })

        if (hasBold) {
          blockHTML += '<strong>'
        }
        if (hasRedColor) {
          blockHTML += '<span style="color: #ff0000;">'
        }
        if (hasItalic) {
          blockHTML += '<em>'
        }
        if (hasUnderline) {
          blockHTML += '<span style="text-decoration: underline;">'
        }
        if (hasFontSize) {
          blockHTML += `<span style="font-size: ${a}px;">`
        }

        blockHTML += blockText

        if (hasItalic) {
          blockHTML += '</em>'
        }
        if (hasRedColor) {
          blockHTML += '</span>'
        }
        if (hasBold) {
          blockHTML += '</strong>'
        }
        if (hasUnderline) {
          blockHTML += '</span>'
        }
        if (hasFontSize) {
          blockHTML += '</span>'
        }

        blockHTML += '</p>'
        return blockHTML
      })
      .join('')

    return htmlContent
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
    console.log(inlineStyle)
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
