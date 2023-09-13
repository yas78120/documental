import React from 'react'
import { FaFilePdf, FaFileWord, FaFile, FaFileAlt, FaDownload } from 'react-icons/fa'
import Button from '@mui/material/Button'

interface Base64FileViewerProps {
  base64: string | undefined
}

const iconStyles = {
  verticalAlign: 'middle',
  marginRight: '2px'
}

const buttonStyles = {
  // Establece el ancho del botón al tamaño del icono (ajusta esto según tus necesidades)
  height: '38px',
  width: '12px', // Establece la altura del botón al tamaño del icono (ajusta esto según tus necesidades)
  padding: '0' // Elimina el relleno interno del botón
}

const Base64FileViewer: React.FC<Base64FileViewerProps> = ({ base64 }) => {
  // If base64 is not defined or not a string, show an error message.
  if (!base64 || typeof base64 !== 'string') {
    return <div>No se puede mostrar el archivo. Tipo de archivo no compatible.</div>
  }

  const googleDocsUrl = `https://docs.google.com/viewer?url=data:application/pdf;base64,${base64}`

  // If the file is an image, show the image.
  if (base64.startsWith('data:image')) {
    return <img src={base64} alt='Archivo' width='100' />
  }

  let icon
  let buttonText
  let data: string

  if (base64.startsWith('JVBER')) {
    data = 'data:application/pdf;base64,' + base64
    base64 = data
    icon = <FaFilePdf style={iconStyles} />
  } else if (base64.startsWith('UEsDB')) {
    data = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + base64
    base64 = data
    icon = <FaFileWord style={iconStyles} />
  } else if (base64.startsWith('CQkJC') || base64.startsWith('OC4yM')) {
    data = 'data:@file/plain;base64,' + base64
    base64 = data
    icon = <FaFileAlt style={iconStyles} />
  } else {
    // If the file is of another type, show an error message or anything appropriate.
    return <div>No se puede mostrar el archivo. Tipo de archivo no compatible.</div>
  }

  return (
    <Button
      variant='text'
      color='primary'
      href={base64}
      download
      startIcon={<FaDownload />}
      style={buttonStyles}
    ></Button>
  )
}

export default Base64FileViewer
