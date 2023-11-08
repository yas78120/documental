// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'

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

/*
export const fetchData = createAsyncThunk('appDoc/fetchData', async (params: DataParams) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}documents-on-hold`)
    return response
  } catch (error) {
    throw error
  }
})

/*export const fetchDato = createAsyncThunk('doc/fetchDato', async (params: DataParams) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}get-all-documents-send`, {
        params
      })

      params
      return response
    } catch (error) {
      throw error
    }
  })

export const fetchDataSend = createAsyncThunk('appDoc/fetchDataSend', async (params: DataParams) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}documents-send-without-workflow`)
    //console.log(response)
    return response
  } catch (error) {
    throw error
  }
})

export const fetchDataSendWorkflow = createAsyncThunk('appDoc/fetchDataSendWorkflow', async (params: DataParams) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}obtain-documents-send-with-workflow`)
    //console.log(response)
    return response
  } catch (error) {
    throw error
  }
})

export const fetchDataRecib = createAsyncThunk('appDoc/fetchDataRecib', async (params: DataParams) => {
  //console.log(params)
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}recieved-without-workflow`)
    //console.log(response.data)
    return response // Devuelve solo los datos de la respuesta
  } catch (error) {
    throw error // Lanzar el error para que Redux Toolkit lo capture
  }
})

export const fetchDataRecibWorkflow = createAsyncThunk('appDoc/fetchDataRecibWorkflow', async (params: DataParams) => {
  //console.log(params)
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}obtain-received-and-derived-documents`)
    //console.log(response.data)
    return response // Devuelve solo los datos de la respuesta
  } catch (error) {
    throw error // Lanzar el error para que Redux Toolkit lo capture
  }
})

export const fetchDataObserved = createAsyncThunk('appDoc/fetchDataObserved', async (params: DataParams) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}get-documents-observed`)
    return response
  } catch (error) {
    throw error
  }
})*/

// ** Add User
export const addCredenciales = createAsyncThunk(
  'appDoc/addCredenciales',
  async (data: DigitalCredencials, { rejectWithValue }) => {
    try {
      console.log(data)

      // Intenta realizar la solicitud HTTP
      const response = await axios.post('http://localhost:3501/digital-signature/generate-credential', data)

      console.log(response)

      // Devuelve la respuesta si la solicitud fue exitosa
      return response.data // O response en su totalidad, dependiendo de lo que quieras almacenar en el estado
    } catch (error: any) {
      // Maneja el error aquí
      console.error('Error al enviar la solicitud:', error)

      if (error.response && error.response.status === 400) {
        // Si la respuesta es un error 400, muestra un mensaje de error con toast.error
        toast.error('Usted ya cuenta con credenciales', {
          position: 'top-center' // Coloca las notificaciones en el centro superior de la pantalla
        })

        // Puedes usar rejectWithValue para devolver un valor personalizado como payload
        return rejectWithValue('Usted ya cuenta con credenciales')
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
