// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

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
  })*/

export const fetchDataSend = createAsyncThunk('appDoc/fetchDatoSend', async (params: DataParams) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}get-all-documents-send`)
    //console.log(response)
    return response
  } catch (error) {
    throw error
  }
})
export const fetchDataRecib = createAsyncThunk('appDoc/fetchDataRecib', async (params: DataParams) => {
  //console.log(params)
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}get-recieved-documents`)
    //console.log(response.data)
    return response // Devuelve solo los datos de la respuesta
  } catch (error) {
    throw error // Lanzar el error para que Redux Toolkit lo capture
  }
})

// ** Add User
export const addDoc = createAsyncThunk(
  'appDoc/addDoc',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    console.log(data)
    const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCUMENTAL}`, data)
    dispatch(fetchData(getState()))
    console.log(response)

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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCUMENTAL}${id}/sent-document-employeeds`, data)
      dispatch(fetchData(getState()))
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
        `${process.env.NEXT_PUBLIC_DOCUMENTAL}${id}/send-document-without-workflow`,
        data
      )
      dispatch(fetchData(getState()))
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCUMENTAL}${docId}/derive-document-employeed`, data)
      dispatch(fetchDataRecib(getState()))
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
  const response = axios.delete(`${process.env.NEXT_PUBLIC_DOCUMENTAL}${id}/inactive`)
  console.log(id + 'se elimino con exito')
  dispatch(fetchData(getState().doc.params))

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
export const appDocsSlice = createSlice({
  name: 'appDoc',
  initialState: {
    data: [],
    dataSend: [],
    dataRecib: []
    /*
      total: 1,
      params: {},
      allData: []*/
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
    }),
      builder.addCase(fetchDataSend.fulfilled, (state, action) => {
        state.dataSend = action.payload.data // Actualiza el estado para fetchDatoSend
      }),
      builder.addCase(fetchDataRecib.fulfilled, (state, action) => {
        state.dataRecib = action.payload.data // Actualiza el estado para fetchDatoSend
      })
  }
})

export default appDocsSlice.reducer
export const { actions } = appDocsSlice
