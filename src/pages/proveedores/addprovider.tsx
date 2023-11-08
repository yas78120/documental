// ** React Imports
import { ChangeEvent, FormEvent, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
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

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports

import { useRouter } from 'next/router'

// ** Types Imports

import axios from 'axios'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface UserData {
  name: string
  phone: string
  address: string
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
/*
const schema = yup.object().shape({
  direction: yup.string().required(),
  phone: yup
    .string()
    .typeError('')
    .min(10, obj => showErrors('Celular', obj.value.length, obj.min))
    .required(),
  name: yup
    .string()
    .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
    .required()
})
*/
const defaultValues = {
  name: '',
  phone: '',
  address: ''
}

const SidebarAddProvider = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle } = props
  const router = useRouter()

  // ** State
  const [plan, setPlan] = useState<string>('basic')
  const [role, setRole] = useState<string>('subscriber')
  const [asset, setAsset] = useState<UserData>({
    name: '',
    phone: '',
    address: ''
  })

  // ** Hooks
  const {
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const handleSave = async (asset: UserData) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/`, asset)
      .then(response => {
        console.log(response.data)
        toggle()
        reset()
      })
      .catch(error => {
        console.error(error)
      })
  }

  // const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()
  //   try {
  //     await axios.post(`https://falling-wildflower-5373.fly.dev/supplier/`, asset)
  //     console.log('asset', asset)
  //     toggle()
  //     reset()
  //     router.push('/proveedores/getprovider')
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  const handleClose = () => {
    setPlan('basic')
    setRole('subscriber')
    toggle()
    reset()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAsset({ ...asset, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/`, asset)
      console.log(asset)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 750 } } }}
    >
      <Header>
        <Typography variant='h6'>Agregar Proveedor</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.name}
                  label='Nombre'
                  placeholder='Juan'
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='phone'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.phone}
                  label='Celular'
                  placeholder='78906547'
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='address'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.address}
                  label='Dirección'
                  placeholder='Calle La Paz n°415'
                  error={Boolean(errors.address)}
                  helperText={errors.address?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleClose}>
              Aceptar
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancelar
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddProvider
