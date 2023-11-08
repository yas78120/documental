import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { fetchBase64File } from 'src/store/apps/doc'

interface Base64Props {
  id: string
}
interface fileRegister {
  idFile: string
  fileBase64: string
}

const Base64: React.FC<Base64Props> = ({ id }) => {
  const [base64, setBase64] = useState<string | null>(null)
  //console.log(id)
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
      //console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchRevised = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCUMENTAL}mark-document-reviewed/${id}`)
      //console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const openBase64PdfInGoogleDocs = () => {
    if (base64) {
      const dataURI = `data:application/pdf;base64,${base64}`

      const windowName = '_blank'
      const newWindow = window.open('', windowName)
      newWindow?.document.write(
        `<html><body style="margin: 0; overflow: hidden;">
          <embed width="100%" height="100%" src="${dataURI}" />
        </body></html>`
      )
      fetchRevised()
    }
  }

  return <FaEye size={25} onClick={openBase64PdfInGoogleDocs} style={{ cursor: 'pointer' }} />
}

export default Base64
