// ** React Imports
import { ChangeEvent, FormEvent, useState } from 'react'

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

import axios from 'axios'
import register from '../register'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface UserData {
  name: string
  categoria: string
  descripcion: string
  presupuesto: number
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
  descripcion: yup.string().required(),
  categoria: yup.string().required(),
  presupuesto: yup
    .number()
    .typeError('')
    .min(10, obj => showErrors('Presupuesto', String(obj.value).length, obj.min))
    .required(),
  name: yup
    .string()
    .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  name: '',
  categoria: '',
  descripcion: '',
  presupuesto: 0
}

const SidebarAddProvider = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle } = props
  const router = useRouter()
  const handleCategoriaChange = (e: SelectChangeEvent<string>) => {
    setAsset({ ...asset, categoria: e.target.value })
  }

  // ** State
  const [plan, setPlan] = useState<string>('basic')
  const [role, setRole] = useState<string>('subscriber')
  const [asset, setAsset] = useState<UserData>({
    name: '',
    categoria: '',
    descripcion: '',
    presupuesto: 0
  })

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UserData>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const handleSave = async (data: UserData) => {
    try {
      await axios.post(`https://falling-wildflower-5373.fly.dev/contables/`, data)
      console.log('Asset saved:', data)
      toggle()
      reset()
    } catch (error) {
      console.error(error)
    }
  }

  const handleClose = () => {
    setPlan('basic')
    setRole('subscriber')
    toggle()
    reset()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAsset({ ...asset, [e.target.name]: e.target.value })
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 800, lg: 1000 } } }}
    >
      <Header>
        <Typography variant='h6'>Agregar Contables</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(handleSave)}>
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
            <InputLabel id='categoria-label'>Categoría</InputLabel>
            <Select
              labelId='categoria-label'
              id='categoria'
              value={asset.categoria}
              onChange={handleCategoriaChange}
              autoComplete='off'
            >
              <MenuItem value='Propiedades'>Propiedades</MenuItem>
              <MenuItem value='Equipos y maquinaria'>Equipos y maquinaria</MenuItem>
              <MenuItem value='Inventarios'>Inventarios</MenuItem>
              <MenuItem value='Tecnología y sistemas'>Tecnología y sistemas</MenuItem>
              <MenuItem value='Propiedad intelectual'>Propiedad intelectual</MenuItem>
              <MenuItem value='Cuentas por cobrar'>Cuentas por cobrar</MenuItem>
              <MenuItem value='Inversiones'>Inversiones</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='descripcion'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.descripcion}
                  label='Dirección'
                  placeholder='Calle La Paz n°415'
                  error={Boolean(errors.descripcion)}
                  helperText={errors.descripcion?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='presupuesto'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.presupuesto}
                  label='Presupuesto'
                  error={Boolean(errors.presupuesto)}
                  helperText={errors.presupuesto?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
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
