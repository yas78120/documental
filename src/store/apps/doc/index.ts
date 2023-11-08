// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import { number } from 'yup'

interface docUnitys {
  unitys: string[]
}

interface DataParams {
  role: string
}
interface DataParam {
  view: string
  active: boolean
  page: number
  limit: number
  typeName: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface docDataCi {
  ci: string[]
}
interface docData {
  title: string
  documentTypeName: string
  description: string
  file: string[]
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

/*export const fetchData = createAsyncThunk('appDoc/fetchData', async (params: DataParams) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}documents-on-hold`)
    return response
  } catch (error) {
    throw error
  }
})*/
export const fetchData = createAsyncThunk('appDoc/fetchData', async (params: DataParam) => {
  try {
    console.log(params)
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}get-documents-lista-todo`, { params })
    console.log(response)
    return response.data
  } catch (error) {
    throw error
  }
})
/*export const fetchDataSend = createAsyncThunk('appDoc/fetchData', async (params: DataParams) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DOCUMENTAL}get-documents-lista-todo?view=ENVIADOS&page=1&limit=10`
    )
    console.log(response)
    return response.data
  } catch (error) {
    throw error
  }
})*/

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
  })*/

/*export const fetchDataSend = createAsyncThunk('appDoc/fetchDataSend', async (params: DataParams) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}documents-send-without-workflow`)
    //console.log(response)
    return response
  } catch (error) {
    throw error
  }
})*/

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
    console.log(response.data)
    return response.data.documents // Devuelve solo los datos de la respuesta
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
})

export const fetchDocPage = createAsyncThunk(
  'appDoc/fetchUsersByPage',
  async ({ page, pageSize }: { page: number; pageSize: number }, { getState, dispatch }: Redux) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}paginacion?page=${page}&limit=${pageSize}`)
    return response.data
  }
)

// ** Add User
export const addDoc = createAsyncThunk(
  'appDoc/addDoc',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    console.log(data)
    const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCUMENTAL}`, data)
    console.log(response.data)
    dispatch(fetchData(getState().doc.params))

    if (response.status === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Documento agregado con éxito',
        showConfirmButton: false,
        timer: 3000 // Duración de la notificación en milisegundos (3 segundos en este caso)
      })
    }

    return response
  }
)

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

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Documento enviado',
          showConfirmButton: false,
          timer: 3000 // Duración de la notificación en milisegundos (3 segundos en este caso)
        })
      }
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
      console.log(response)

      dispatch(fetchData(getState().doc.params))

      //dispatch(fetchDataSend(getState()))
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Documento enviado',
          showConfirmButton: false,
          timer: 3000 // Duración de la notificación en milisegundos (3 segundos en este caso)
        })
      }
      return response.data
    } catch (error) {
      console.error('Error sending document:', error)
      throw error
    }
  }
)
export const SendDocUnitys = createAsyncThunk(
  'appDoc/SendDocUnitys',
  async ({ docId, data }: { docId: string; data: docUnitys }, { getState, dispatch }: Redux) => {
    try {
      const id = docId
      console.log(data)
      //console.log(docId)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCUMENTAL}send-document-multiple-units/${id}`, data)
      dispatch(fetchData(getState()))
      //dispatch(fetchDataSend(getState()))
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Documento enviado',
          showConfirmButton: false,
          timer: 3000 // Duración de la notificación en milisegundos (3 segundos en este caso)
        })
      }
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
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Documento deriviado con éxito',
          showConfirmButton: false,
          timer: 3000 // Duración de la notificación en milisegundos (3 segundos en este caso)
        })
      }
      console.log(response)

      return response.data
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Visualize el documento primero'
        })
      }
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
export const deleteDoc = createAsyncThunk(
  'appDoc/deleteDoc',
  async (id: number | string, { getState, dispatch }: Redux) => {
    try {
      const result = await Swal.fire({
        title: '¿Estas Seguro?',
        text: '¡No podras revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, bórralo'
      })

      if (result.isConfirmed) {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_DOCUMENTAL}inactive/${id}`)
        dispatch(fetchData(getState().doc.params))
        console.log('eliminado con exito' + response.data)
        Swal.fire('¡Eliminado!', 'El archivo ha sido eliminado', 'success')
        return response.data
      } else {
        return null
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      Swal.fire('Error!', 'An error occurred while deleting the file.', 'error')
      throw error
    }
  }
)

export const fetchBase64File = async (id: string) => {
  try {
    //console.log(id)
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}get-base64-document/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

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

export const createCredenciales = createAsyncThunk(
  'appDoc/createCredenciales',
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
  async ({ docId, data }: { docId: string; data: DigitalSignature }, { getState, dispatch }: Redux) => {
    try {
      console.log(data)
      console.log(docId)

      // Intenta realizar la solicitud HTTP
      const response = await axios.post(`http://localhost:3501/digital-signature/${docId}/signature-document`, data)

      console.log(response)
      dispatch(fetchData(getState().doc.params))

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
      }
      if (error.response && error.response.status === 400) {
        // Si la respuesta es un error 400, muestra un mensaje de error con toast.error
        toast.error('Este documento ya tiene firma digital', {
          position: 'top-center' // Coloca las notificaciones en el centro superior de la pantalla
        })

        // Puedes usar rejectWithValue para devolver un valor personalizado como payload
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

export const appDocsSlice = createSlice({
  name: 'appDoc',
  initialState: {
    data: [],
    total: 1,
    totalPages: 1
    /*
      total: 1,
      params: {},
      allData: []*/
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.totalPages = action.payload.totalPages
    })
    /*builder.addCase(fetchDataSend.fulfilled, (state, action) => {
      if (action.meta.arg.params.view === 'ENVIADOS') {
        state.dataSend = action.payload.documents;
      } else {
        state.dataSendWorkflow = action.payload.data;
      }
    });
    */
  }
})
export const rootReducer = {
  appDoc: appDocsSlice.reducer
  // Otros slices si los tienes
}

export default appDocsSlice.reducer
export const { actions } = appDocsSlice
