import React, { useEffect, useState } from 'react'
import { FaFilePdf, FaFileWord, FaFile, FaFileAlt, FaDownload } from 'react-icons/fa'
import Button from '@mui/material/Button'
import axios from 'axios'

interface Base64FileViewerProps {
  id: string | undefined
  fileName: string | undefined
}

const iconStyles = {
  verticalAlign: 'middle',
  marginRight: '2px'
}

const linkStyles = {
  textDecoration: 'none', // Elimina el subrayado
  color: 'inherit' // Utiliza el color de texto heredado (generalmente negro)
}

const buttonStyles = {
  // Establece el ancho del botón al tamaño del icono (ajusta esto según tus necesidades)
  height: '38px',
  width: '12px', // Establece la altura del botón al tamaño del icono (ajusta esto según tus necesidades)
  padding: '0' // Elimina el relleno interno del botón
}

interface Base64 {
  idDocument: string
  fileBase64: string
}

const Base64FileViewer: React.FC<Base64FileViewerProps> = ({ id, fileName }) => {
  //console.log(id)
  const [Base64, setBase64] = useState<string>('')

  useEffect(() => {
    if (id) {
      const fetchDataFile = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL_FILE}document-files/${id}`)
          //console.log(response.data)
          const fileRegister = response.data.fileRegister
          if (fileRegister.length > 0) {
            const fileId = fileRegister[0].idFile
            fetchDataBase64(fileId)
          }
        } catch (error) {
          console.error(error)
        }
      }
      fetchDataFile()
    }
  }, [id])

  const fetchDataBase64 = async (fileId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOCUMENTAL_FILE}base64-document-files/${id}/${fileId}`
      )
      setBase64(response.data)
      //console.log(response)
    } catch (error) {
      console.error(error)
    }
  }
  let base64: string | undefined = ''
  base64 = Base64

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
  //return <FaDownload size={25} href={base64} style={{ cursor: 'pointer' }} />

  /*return (
    <Button
      variant='text'
      color='primary'
      href={base64}
      download
      startIcon={<FaDownload />}
      style={buttonStyles}
    ></Button>
  )*/
  return (
    <div>
      {<FaDownload />}
      <a href={base64} download={fileName || 'archivo'} target='_blank' style={linkStyles}>
        Descargar
      </a>
    </div>
  )
}

export default Base64FileViewer
