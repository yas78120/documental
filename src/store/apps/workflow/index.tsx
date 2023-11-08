// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
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

interface Workflow {
  nombre: string
  descriptionWorkflow: string
  pasos: {
    paso: number
    oficina: string
  }[]
}

axios.interceptors.request.use(config => {
  if (config.headers) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export const fetchWorkflow = createAsyncThunk('appWorflow/fetchWorflow', async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL_WORKFLOW}active`)
    return response
  } catch (error) {
    throw error
  }
})

// ** Add User
export const addWorkflow = createAsyncThunk('appWorkflow/addWorkflow', async (data: Workflow) => {
  console.log(data)
  const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCUMENTAL_WORKFLOW}`, data)
  console.log(response)
  if (response.status === 201) {
    Swal.fire({
      icon: 'success',
      title: 'Flujo de trabajo agregado con éxito',
      showConfirmButton: false,
      timer: 3000 // Duración de la notificación en milisegundos (3 segundos en este caso)
    })
  }

  return response
})

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
      dispatch(fetchWorkflow())
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

export const workflowSlice = createSlice({
  name: 'appWorkflow',
  initialState: {
    workflow: []

    /*
      total: 1,
      params: {},
      allData: []*/
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchWorkflow.fulfilled, (state, action) => {
      state.workflow = action.payload.data
    })
  }
})

export default workflowSlice.reducer
export const { actions } = workflowSlice
