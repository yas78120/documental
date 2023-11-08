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

export const fetchTypeDoc = createAsyncThunk('appDocType/fetchTypeDoc', async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTATION_TYPE}active`)

    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(error)
  }
})

export const appDocsSlice = createSlice({
  name: 'appDocType',
  initialState: {
    data: []
    /*
      total: 1,
      params: {},
      allData: []*/
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchTypeDoc.fulfilled, (state, action) => {
      state.data = action.payload
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

export default appDocsSlice.reducer
export const { actions } = appDocsSlice
