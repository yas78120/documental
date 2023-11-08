// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
//import { toast } from 'react-toastify'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

interface DataParams {
  role: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface docData {
  worflowName: string
  ci: string[]
}

interface docDataCi {
  ci: string[]
}

interface Observed {
  motivo: String
}
interface docType {
  _id: string
  typeName: string
}
interface DigitalCredencials {
  password: string
  pin: string
}
interface DigitalSignature {
  password: string
  pin: string
}
// ** Fetch Users

axios.interceptors.request.use(config => {
  if (config.headers) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export const getTypeDoc = createAsyncThunk('appDocuments/', async () => {
  try {
    const response = await axios.get<docType[]>(`${process.env.NEXT_PUBLIC_DOCUMENTATION_TYPE}active`)

    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(error)
  }
})

export const createCredenciales = createAsyncThunk(
  'appDocuments/createCredenciales',
  async (data: DigitalCredencials, { rejectWithValue }) => {
    try {
      console.log(data)

      // Intenta realizar la solicitud HTTP
      const response = await axios.post(`http://localhost:3501/digital-signature/generate-credential`, data)

      console.log(response)

      if (response.status === 201) {
        // Si la respuesta es un estado 200, muestra un mensaje de éxito con toast.success
        toast.success('Credenciales creadas exitosamente', {
          position: 'top-center' // Coloca las notificaciones en el centro superior de la pantalla
        })
      }

      // Devuelve la respuesta si la solicitud fue exitosa
      return response.data // O response en su totalidad, dependiendo de lo que quieras almacenar en el estado
    } catch (error: any) {
      // Maneja el error aquí
      console.error('Error al enviar la solicitud:', error)

      if ((error.response && error.response.status === 400) || error.response.status === 401) {
        // Si la respuesta es un error 400, muestra un mensaje de error con toast.error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Usted ya cuenta con credenciales'
        })
      } else {
        // Si es otro tipo de error, lanza el error nuevamente para que Redux Toolkit lo maneje como un error de acción
        throw error
      }
    }
  }
)

export const addDigitalSignature = createAsyncThunk(
  'appDoc/addDigitalSignature',
  async ({ docId, data }: { docId: string; data: DigitalSignature }, { rejectWithValue }) => {
    try {
      console.log(data)
      console.log(docId)

      // Intenta realizar la solicitud HTTP
      const response = await axios.post(`http://localhost:3501/digital-signature/${docId}/signature-document`, data)

      console.log(response)

      if (response.status === 201) {
        // Si la respuesta es un estado 200, muestra un mensaje de éxito con toast.success
        toast.success('Se añadio la firma digital exitosamente', {
          position: 'top-center', // Coloca las notificaciones en el centro superior de la pantalla
          duration: 5000
        })
      }

      // Devuelve la respuesta si la solicitud fue exitosa
      return response.data // O response en su totalidad, dependiendo de lo que quieras almacenar en el estado
    } catch (error: any) {
      // Maneja el error aquí
      console.error('Error al enviar la solicitud:', error)

      if (error.response && error.response.status === 401) {
        // Si la respuesta es un error 400, muestra un mensaje de error con toast.error
        toast.error('Pin/Contraseña invalido', {
          position: 'top-center' // Coloca las notificaciones en el centro superior de la pantalla
        })

        // Puedes usar rejectWithValue para devolver un valor personalizado como payload
        return rejectWithValue('Usted ya cuenta con credenciales')
      }
      if (error.response && error.response.status === 400) {
        // Si la respuesta es un error 400, muestra un mensaje de error con toast.error
        toast.error('Este documento ya tiene firma digital', {
          position: 'top-center' // Coloca las notificaciones en el centro superior de la pantalla
        })

        // Puedes usar rejectWithValue para devolver un valor personalizado como payload
        return rejectWithValue('Este documento ya tiene firma digital')
      } else {
        // Si es otro tipo de error, lanza el error nuevamente para que Redux Toolkit lo maneje como un error de acción
        throw error
      }
    }
  }
)

export const recrearCredenciales = createAsyncThunk(
  'appDoc/recrearCredenciales',
  async (data: DigitalCredencials, { rejectWithValue }) => {
    try {
      console.log(data)

      // Intenta realizar la solicitud HTTP
      const response = await axios.post(`http://localhost:3501/digital-signature/recover-pin`, data)

      console.log(response)

      if (response.status === 201) {
        // Si la respuesta es un estado 200, muestra un mensaje de éxito con toast.success
        toast.success('Credenciales creadas exitosamente', {
          position: 'top-center' // Coloca las notificaciones en el centro superior de la pantalla
        })
      }

      // Devuelve la respuesta si la solicitud fue exitosa
      return response.data // O response en su totalidad, dependiendo de lo que quieras almacenar en el estado
    } catch (error: any) {
      // Maneja el error aquí
      console.error('Error al enviar la solicitud:', error)

      if (error.response && error.response.status === 400) {
        // Si la respuesta es un error 400, muestra un mensaje de error con toast.error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Usted ya cuenta con credenciales'
        })
      } else {
        // Si es otro tipo de error, lanza el error nuevamente para que Redux Toolkit lo maneje como un error de acción
        throw error
      }
    }
  }
)

/*
export const SendDoc = createAsyncThunk(
  'appDoc/SendDoc',
  async ({ docId, data }: { docId: string; data: docData }, { getState, dispatch }: Redux) => {
    try {
      const id = docId
      console.log(data)
      //console.log(docId)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCUMENTAL}send-document-employeeds/${id}`, data)
      dispatch(fetchData(getState()))
      dispatch(fetchDataSendWorkflow(getState()))
      console.log(response)
      return response.data
    } catch (error) {
      console.error('Error sending document:', error)
      throw error
    }
  }
)

export const SendDocUser = createAsyncThunk(
  'appDoc/SendDocUser',
  async ({ docId, data }: { docId: string; data: docDataCi }, { getState, dispatch }: Redux) => {
    try {
      const id = docId
      console.log(data)
      //console.log(docId)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOCUMENTAL}send-document-without-workflow/${id}`,
        data
      )
      dispatch(fetchData(getState()))
      dispatch(fetchDataSend(getState()))
      console.log(response)
      return response.data
    } catch (error) {
      console.error('Error sending document:', error)
      throw error
    }
  }
)

export const DeriveDoc = createAsyncThunk(
  'appDoc/DeriveDoc',
  async ({ docId, data }: { docId: string; data: docDataCi }, { getState, dispatch }: Redux) => {
    try {
      console.log(data)
      console.log(docId)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCUMENTAL}derive-document-employeed/${docId}`, data)
      dispatch(fetchDataRecibWorkflow(getState()))

      console.log(response)
      return response.data
    } catch (error) {
      console.error('Error sending document:', error)
      throw error
    }
  }
)

export const ObservedDoc = createAsyncThunk(
  'appDoc/DeriveDoc',
  async ({ docId, paso, data }: { docId: string; paso: number; data: Observed }, { getState, dispatch }: Redux) => {
    try {
      console.log(paso)
      console.log(data)
      console.log(docId)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOCUMENTAL}mark-document-observed/${docId}/${paso}`,
        data
      )
      dispatch(fetchDataRecibWorkflow(getState()))
      dispatch(fetchDataObserved(getState()))
      console.log(response)
      return response.data
    } catch (error) {
      console.error('Error sending document:', error)
      throw error
    }
  }
)

// ** Delete User
export const deleteDoc = createAsyncThunk('appDoc/deleteDoc', (id: number | string, { getState, dispatch }: Redux) => {
  //console.log(id)
  const response = axios.delete(`${process.env.NEXT_PUBLIC_DOCUMENTAL}inactive/${id}`)
  dispatch(fetchData(getState().doc.params))
  console.log(id + 'se elimino con exito')

  return response
})

export const docType = createAsyncThunk('appDoc/docType', () => {
  //console.log(id)
  const response = axios.get<docType[]>(`${process.env.NEXT_PUBLIC_DOCUMENTATION_TYPE}active`)

  //console.log(response.data)

  return response
})
/*
  export const deleteDoc = async (_id: string | number) => {
    await axios
      .delete(`http://10.10.214.219:/documents/${_id}/inactive `)
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.error(error)
      })

  }*/
