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
export const fetchData = createAsyncThunk('appUsers/fetchData', async (params: DataParams) => {
  //console.log(params)
  const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}active`, {
    params
  })

  //console.log(response)

  return response
})

// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCUMENTAL}`, data)
    dispatch(fetchData(getState()))
    console.log(response)

    return response
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  (id: number | string, { getState, dispatch }: Redux) => {
    //console.log(id)
    const response = axios.delete(`${process.env.NEXT_PUBLIC_DOCUMENTAL}${id}/inactive`)
    console.log(id + 'se elimino con exito')
    dispatch(fetchData(getState().user.params))

    return response
  }
)

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
export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
    })
  }
})

export default appUsersSlice.reducer
export const { actions } = appUsersSlice
