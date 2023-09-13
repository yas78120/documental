import { Button } from '@mui/material'
import React from 'react'
import { FaDownload, FaEye } from 'react-icons/fa'

interface Base64Props {
  base64: string | undefined
}
const buttonStyles = {
  width: '50px',
  height: '38px',
  padding: '0'
}

const Base64: React.FC<Base64Props> = ({ base64 }) => {
  const openBase64PdfInGoogleDocs = () => {
    if (base64) {
      const eBase64 = encodeURIComponent(base64)
      const dataURI = `data:application/pdf;base64,${eBase64}`

      const windowName = '_blank'
      const newWindow = window.open('', windowName)
      newWindow?.document.write(
        `<html><body style="margin: 0; overflow: hidden;">
          <embed width="100%" height="100%" src="${dataURI}" />
        </body></html>`
      )
    }
  }

  return (
    <Button
      //variant='outlined'
      variant='text'
      color='primary'
      onClick={openBase64PdfInGoogleDocs}
      startIcon={<FaEye size={28} />}
      style={buttonStyles}
    ></Button>
  )
}

export default Base64
