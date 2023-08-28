import React from 'react'

interface DocumentViewerProps {
  file: string
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ file }) => {
  const getMimeTypeFromfile = (file: string) => {
    if (file) {
      // Obtener el tipo de archivo desde el encabezado de la file
      const matches = file.match(/^data:(.*);base64,(.*)$/)
      if (matches) {
        return matches[1]
      }
    }
    return null
  }

  const mimeType = getMimeTypeFromfile(file)
  console.log('mimeType:', mimeType)

  if (!mimeType) {
    return <div>Error: Tipo de archivo no válido.</div>
  }

  const supportedMimeTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',

    'application/msword', // for .doc files
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // for .docx files
    'text/plain'
  ]
  const isSupportedType = supportedMimeTypes.includes(mimeType)

  if (isSupportedType) {
    return <iframe src={`data:${mimeType};file,${file}`} width='100%' height='500px' />
  } else {
    return <div>No se puede mostrar el documento. Tipo de archivo no compatible.</div>
  }
}

export default DocumentViewer
