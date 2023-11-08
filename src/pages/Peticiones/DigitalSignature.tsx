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
//import { addCredenciales } from 'src/store/apps/consultas'
import { addDigitalSignature, createCredenciales } from 'src/store/apps/doc'
import RecoverPin from './RecoverPin'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import InputAdornment from '@mui/material/InputAdornment'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
  docId: string
}

interface DigitalCredencials {
  password: string
  pin: string
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

const SidebarAddUser = (props: SidebarAddUserType) => {
  const { open, toggle, docId } = props

  console.log(props)
  //console.log(docId)

  const { reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const dispatch = useDispatch<AppDispatch>()
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [recoverPinOpen, setRecoverPinOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPin, setShowPin] = useState(false)

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const onChangePin = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Obtener el valor del campo de entrada
    let value = event.target.value

    // Eliminar cualquier carácter no alfabético ni numérico
    value = value.replace(/[^A-Z0-9]/g, '')

    // Limitar la longitud a 5 caracteres

    if (value.length > 5) {
      value = value.slice(0, 5)
    }

    // Convertir todo a mayúsculas
    value = value.toUpperCase()

    // Actualizar el estado con el valor formateado
    setPin(value)
  }

  const handleSubmit = () => {
    const data: DigitalCredencials = {
      pin: pin,
      password: password
    }
    setPin('')
    setPassword('')
    toggle()
    reset()
    console.log(data)

    dispatch(addDigitalSignature({ docId, data }))
  }

  const handleClose = () => {
    toggle()
    reset()
  }
  const handleForgotPin = () => {
    setRecoverPinOpen(true)
  }
  const toggleShowPassword = () => {
    setShowPassword(prevShowPassword => !prevShowPassword)
  }
  const toggleShowPin = () => {
    setShowPin(prevShowPin => !prevShowPin)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='user-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 500, p: [2, 4], height: '60%', maxHeight: 370 } }}
      aria-describedby='user-view-edit-description'
    >
      <Header>
        <Typography variant='h6' sx={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}>
          Añadir Firma Digital
        </Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      {recoverPinOpen && (
        <RecoverPin
          open={recoverPinOpen}
          toggle={() => setRecoverPinOpen(false)} // Función para cerrar SendFileWorkflow
        />
      )}
      <Box sx={{ p: 5 }}>
        <form>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel>Contraseña</InputLabel>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={onChangePassword}
              autoComplete='off'
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={toggleShowPassword} edge='end'>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel>Pin</InputLabel>
            <Input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={onChangePin}
              autoComplete='off'
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={toggleShowPin} edge='end'>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button size='large' variant='contained' sx={{ mr: 3 }} onClick={handleSubmit}>
              Enviar
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancelar
            </Button>
          </div>
          <Button color='primary' onClick={handleForgotPin}>
            ¿Has olvidado tu Pin?
          </Button>
        </form>
      </Box>
    </Dialog>
  )
}

export default SidebarAddUser
