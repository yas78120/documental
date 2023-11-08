// userSlice.js

import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

axios.interceptors.request.use(config => {
  if (config.headers) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export const fetchUser = createAsyncThunk('appUser/fetchUser', async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_USER}`)
    //console.log(response)
    return response
  } catch (error) {
    throw error
  }
})

export const appUserSlice = createSlice({
  name: 'appUser',
  initialState: {
    user: {
      // Inicializa 'user' como un objeto vacío
      ci: '',
      name: '',
      email: '',
      rolUser: [],
      lastName: '',
      unity: '',
      file: '',
      _id: ''
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload.data
    })
  }
})

export default appUserSlice.reducer
export const { actions } = appUserSlice
