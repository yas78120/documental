// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users

export const fetchData = createAsyncThunk('doc/fetchData', async (params: DataParams) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}active`, {
      params
    })

    params
    return response
  } catch (error) {
    throw error
  }
})

/*export const fetchData = createAsyncThunk('appUsers/fetchData', async (params: DataParams) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}active`, {
      params
    })

    return response.data // Devuelve solo los datos de la respuesta
  } catch (error) {
    throw error // Lanzar el error para que Redux Toolkit lo capture
  }
})*/

// ** Add User
export const addDoc = createAsyncThunk(
  'appDoc/addDoc',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    //console.log(data)
    const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCUMENTAL}`, data)
    dispatch(fetchData(getState()))
    console.log(response)

    return response
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
    .delete(`http://10.10.214.219:8085/documents/${_id}/inactive `)
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
    data: []
    /*
    total: 1,
    params: {},
    allData: []*/
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
    })
  }
})

export default appDocsSlice.reducer
export const { actions } = appDocsSlice
