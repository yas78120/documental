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
import { addDigitalSignature, createCredenciales, recrearCredenciales } from './Consultas'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
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

const RecoverPin = (props: SidebarAddUserType) => {
  const { open, toggle } = props

  console.log(props)
  //console.log(docId)

  const { reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const dispatch = useDispatch<AppDispatch>()
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const onChangePin = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Obtener el valor del campo de entrada
    let value = event.target.value

    // Eliminar cualquier carácter no alfabético ni numérico
    value = value.replace(/[^A-Z0-9]/g, '')

    // Limitar la longitud a 5 caracteres
    /*
    if (value.length > 5) {
      value = value.slice(0, 5)
    }
*/
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

    dispatch(recrearCredenciales({ ...data }))
  }

  const handleClose = () => {
    toggle()
    reset()
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
          Recuperar Pin
        </Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>

      <Box sx={{ p: 5 }}>
        <form>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField label='Ingrese su Contraseña' value={password} onChange={onChangePassword} autoComplete='off' />

            {/*errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>*/}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField label='Ingrese su nuevo Pin' value={pin} onChange={onChangePin} autoComplete='off' />

            {/*errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>*/}
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

export default RecoverPin
