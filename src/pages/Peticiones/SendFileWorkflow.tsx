// ** React Imports
import { useEffect, useRef, useState } from 'react'

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
import { SendDoc, addDoc } from 'src/store/apps/doc'
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
  worflowName: string
  ci: string[]
}

interface workflowName {
  _id: string
  nombre: string
  pasos: {
    _id: string
    idOffice: string
    oficina: string
  }[]
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

  //console.log(docId)

  const dispatch = useDispatch<AppDispatch>()
  const {
    reset,
    control,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const [groupworkflowName, setgroupworkflowName] = React.useState<workflowName[]>([])
  const [userList, setUserList] = React.useState<ListUser[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const getDestino = async () => {
    try {
      const response = await axios.get<workflowName[]>(`${process.env.NEXT_PUBLIC_DOCUMENTAL_WORKFLOW}active`)
      console.log(response.data)
      setgroupworkflowName(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getUserList = async () => {
    try {
      const response = await axios.get<ListUser[]>(`${process.env.NEXT_PUBLIC_DOCUMENTAL_PERSONAL}`)
      setUserList(response.data)
    } catch (error) {
      console.error('Error al obtener la lista de useral', error)
    }
  }

  useEffect(() => {
    getDestino()
    getUserList()
  }, [])

  const [workflow, setWorkflow] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuOpen2, setMenuOpen2] = useState(false)

  const handleOptionChange = (event: SelectChangeEvent<string>) => {
    setWorkflow(event.target.value)
    //setMenuOpen(false) // Cerrar el menú al seleccionar una opción
  }

  const handleUserSelect = (event: SelectChangeEvent<string[]>) => {
    const newValue = Array.isArray(event.target.value) ? event.target.value : [event.target.value]

    setSelectedUsers(newValue)
    setMenuOpen2(false)
  }

  const handleSelectWorkflow = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    const setSelectedWorkflowId = event.target.value
    setSelectedWorkflow(setSelectedWorkflowId)
    //console.log(setSelectedWorkflowId)

    // Filtrar la lista de usuarios para mostrar solo los que pertenecen a la unidad seleccionada
    ///const filteredUsers = userList.filter(user => user.unity === setSelectedWorkflowId)
    //const selectedUsersIds = filteredUsers.map(user => user.name)
    //console.log(filteredUsers)
    /// setUserList(filteredUsers)
    //console.log(selectedUsersIds)
  }

  const dateWorkflow = groupworkflowName.filter(groupworkflowName => groupworkflowName.nombre === selectedWorkflow)
  const office = dateWorkflow[0]?.pasos[0]?.oficina
  // console.log(office)

  const userSelectOffice = userList.filter(userList => userList.unity === office)
  //console.log(userSelectOffice)
  /*const handleUnityChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    const setSelectedWorkflowId = event.target.value

    setsetSelectedWorkflow(setSelectedWorkflowId)
    console.log(setSelectedWorkflowId)

    const setSelectedWorkflowObj = groupworkflowName.find(option => option.nombre === setSelectedWorkflowId)
    if (setSelectedWorkflowObj) {
      // Asumiendo que pasos es un arreglo, puedes acceder al primer elemento (índice 0) como sigue
      console.log('entroooo')
      if (setSelectedWorkflowObj.steps) {
        console.log('entrooo2')
        const b = setSelectedWorkflowObj.steps
        //a = setSelectedWorkflowObj.steps.pasos[0].idOffice
        //console.log(a)
      }

      // Ahora puedes trabajar con idOffice
    } else {
      console.error('No se encontró la unidad seleccionada')
    }

    // Filtrar la lista de usuarios para mostrar solo los que pertenecen a la unidad seleccionada
    const filteredUsers = userList.filter(user => user.unity === setSelectedWorkflowId)
    //const selectedUsersIds = filteredUsers.map(user => user.name)
    //console.log(filteredUsers)
    setUserList(filteredUsers)
    //console.log(selectedUsersIds)
  }*/

  const handleSubmit = () => {
    const data: docData = {
      worflowName: selectedWorkflow,
      ci: selectedUsers
    }
    toggle()
    reset()
    console.log(data)
    dispatch(SendDoc({ docId, data }))
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const [recipientUser, setRecipientUser] = useState<string>('')

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
          {/*<FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel>Flujo de Trabajo</InputLabel>
            <Controller
              name='workflowName'
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange } }) => (
                <Select
                  value={workflow}
                  onChange={handleOptionChange}
                  label='Seleccionar Step'
                  open={menuOpen} // Controlar la apertura/cierre del menú
                  onClose={() => setMenuOpen(false)} // Cerrar el menú cuando se hace clic fuera de él
                  onOpen={() => setMenuOpen(true)} // Abrir el menú cuando se hace clic en él
                >
                  {groupworkflowName.map(option => (
                    <MenuItem key={option._id} value={option.nombre}>
                      {option.nombre}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.workflowName && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.workflowName.message}</FormHelperText>
            )}
            </FormControl>*/}
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel>Seleccionar Flujo de Trabajo</InputLabel>
            <Select value={selectedWorkflow} onChange={handleSelectWorkflow} label='Seleccionar Flujo de Trabajo'>
              {groupworkflowName.map(option => (
                <MenuItem key={option._id} value={option.nombre}>
                  {option.nombre}
                </MenuItem>
              ))}
            </Select>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>Oficina a enviar: {office}</div>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel>Seleccionar Usuario de Destino</InputLabel>

            <Select
              multiple
              value={selectedUsers}
              onChange={handleUserSelect}
              label='Seleccionar Usuario de Destino'
              open={menuOpen2} // Controla la apertura/cierre del menú
              onClose={() => setMenuOpen2(false)} // Cierra el menú cuando se hace clic fuera de él
              onOpen={() => setMenuOpen2(true)}
              disabled={!selectedWorkflow}
            >
              {userSelectOffice.map(user => (
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
