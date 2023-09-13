// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Input from '@mui/material/Input'
import { useDropzone } from 'react-dropzone'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { SendDoc, SendDocUser, addDoc } from 'src/store/apps/doc'
import { toast } from 'react-toastify'

// ** Types Imports
import { AppDispatch } from 'src/store'
import axios from 'axios'
import React from 'react'
import { Chip, Dialog } from '@mui/material'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
  docId: string
}

interface docData {
  ci: string[]
}

interface unityName {
  _id: string
  name: string
}

interface ListUser {
  _id: string
  name: string
  ci: string
  unity: string
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  title: yup.string().required(),
  documentTypeName: yup.string().required(),
  stateDocument: yup.string().required(),
  workflowName: yup.string().required(),
  description: yup.string().required(),
  file: yup.mixed().required('Documento es requerido')
})

const defaultValues = {
  workflowName: ''
}

const SidebarAddUser = (props: SidebarAddUserType) => {
  const { open, toggle, docId } = props

  const [groupUnity, setGroupUnity] = useState<unityName[]>([])
  const [userList, setUserList] = useState<ListUser[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedUnity, setSelectedUnity] = useState<string>('')
  const [openSelect, setOpenSelect] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const getDestino = async () => {
    try {
      const response = await axios.get<unityName[]>(`${process.env.NEXT_PUBLIC_DOCUMENTAL_ORGANIGRAMA}`)
      setGroupUnity(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getUserList = async () => {
    try {
      const response = await axios.get<ListUser[]>(`${process.env.NEXT_PUBLIC_DOCUMENTAL_PERSONAL}`)
      setUserList(response.data)
    } catch (error) {
      console.error('Error al obtener la lista de usuarios', error)
    }
  }

  useEffect(() => {
    getDestino()
    getUserList()
  }, [])

  const handleUnityChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    const selectedUnityId = event.target.value
    setSelectedUnity(selectedUnityId)
    console.log(selectedUnityId)

    // Filtrar la lista de usuarios para mostrar solo los que pertenecen a la unidad seleccionada
    const filteredUsers = userList.filter(user => user.unity === selectedUnityId)
    //const selectedUsersIds = filteredUsers.map(user => user.name)
    //console.log(filteredUsers)
    setUserList(filteredUsers)
    //console.log(selectedUsersIds)
  }

  const handleUserSelect = (event: SelectChangeEvent<string[]>, child: React.ReactNode) => {
    const newValue = event.target.value as string[]
    setSelectedUsers(newValue)
    setOpenSelect(false)
  }
  const handleSubmit = () => {
    const data: docData = {
      ci: selectedUsers
    }
    toggle()
    console.log(data)

    dispatch(SendDocUser({ docId, data }))

    toast.success('Documento enviado con éxito', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000 // Duración de la notificación en milisegundos (3 segundos en este caso)
    })
  }
  const handleClose = () => {
    toggle()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='user-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 600, p: [2, 4], height: '60%', maxHeight: 600 } }}
      aria-describedby='user-view-edit-description'
    >
      <Header>
        <Typography variant='h6' sx={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}>
          Enviar Documento
        </Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel>Unidad</InputLabel>
            <Select value={selectedUnity} onChange={handleUnityChange} label='Seleccionar Unidad'>
              {groupUnity.map(option => (
                <MenuItem key={option._id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel>Destino</InputLabel>
            <Select
              multiple
              value={selectedUsers}
              onChange={handleUserSelect}
              label='Destino'
              open={openSelect} // Controla la apertura/cierre del menú
              onClose={() => setOpenSelect(false)} // Cierra el menú cuando se hace clic fuera de él
              onOpen={() => setOpenSelect(true)}
              disabled={!selectedUnity} // Deshabilitar la selección de usuarios si no se ha seleccionado una unidad
            >
              {userList.map(user => (
                <MenuItem key={user._id} value={user.ci}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button size='large' variant='contained' sx={{ mr: 3 }} onClick={handleSubmit}>
              Enviar
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </Box>
    </Dialog>
  )
}

export default SidebarAddUser
