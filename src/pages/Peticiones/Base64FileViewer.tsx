import React from 'react'
import { FaFilePdf, FaFileWord, FaFile, FaFileAlt } from 'react-icons/fa'

interface Base64FileViewerProps {
  base64: string | undefined
  theme: 'light' | 'dark' // Agrega una prop para el tema
}

const getLinkStyles = (theme: 'light' | 'dark') => ({
  textDecoration: 'none',
  display: 'inline-block',
  padding: '8px',
  border: '1px solid',
  borderRadius: '4px',
  margin: '4px',
  transition: 'background-color 0.3s, color 0.3s',
  color: theme === 'light' ? '#333' : '#fff', // Cambia el color según el tema
  borderColor: theme === 'light' ? '#ccc' : '#888', // Cambia el color del borde según el tema
  backgroundColor: theme === 'light' ? '#fff' : '#333' // Cambia el color de fondo según el tema
})

const iconStyles = {
  verticalAlign: 'middle',
  marginRight: '4px'
}

const Base64FileViewer: React.FC<Base64FileViewerProps> = ({ base64, theme = 'light' }) => {
  //console.log('base64:', base64) // Debug statement

  // If base64 is not defined or not a string, show an error message.
  if (!base64 || typeof base64 !== 'string') {
    return <div>No se puede mostrar el archivo. Tipo de archivo no compatible.</div>
  }

  // If the file is an image, show the image.
  if (base64.startsWith('data:image')) {
    return <img src={base64} alt='Archivo' width='100' />
  }

  if (base64.startsWith('data:application/pdf')) {
    return (
      <a href={base64} download style={getLinkStyles(theme)}>
        <FaFilePdf style={iconStyles} /> Descargar PDF
      </a>
    )
  }

  if (base64.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    return (
      <a href={base64} download style={getLinkStyles(theme)}>
        <FaFileWord style={iconStyles} />
        Descargar
      </a>
    )
  }

  if (base64.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    return (
      <a href={base64} download style={getLinkStyles(theme)}>
        <FaFileWord style={iconStyles} />
        Descargar
      </a>
    )
  }

  if (base64.startsWith('data:@file/plain')) {
    return (
      <a href={base64} download style={getLinkStyles(theme)}>
        <FaFileAlt style={iconStyles} />
        Descargar
      </a>
    )
  }
  if (base64.startsWith('data:text/plain')) {
    return (
      <a href={base64} download style={getLinkStyles(theme)}>
        <FaFileAlt style={iconStyles} />
        Descargar
      </a>
    )
  }

  // If the file is of another type, show an error message or anything appropriate.
  return <div>No se puede mostrar el archivo. Tipo de archivo no compatible.</div>
}

export default Base64FileViewer
