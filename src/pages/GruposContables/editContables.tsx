// ** React Imports
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

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

import axios from 'axios'

interface UserData {
  _id: string
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
  Categoria: yup.string().required(),
  presupuesto: yup
    .string()
    .typeError('')
    .min(10, obj => showErrors('Celular', obj.value.length, obj.min))
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

const SidebarEditProvider = (props: { providerId: string }) => {
  // ** Props
  // ** State
  const [state, setState] = useState<boolean>(false)
  const [plan, setPlan] = useState<string>('basic')
  const [role, setRole] = useState<string>('subscriber')
  const providerId = props.providerId
  const [asset, setAsset] = useState<UserData>({
    _id: '',
    name: '',
    categoria: '',
    descripcion: '',
    presupuesto: 0
  })

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setState(open)
  }

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

  const handleClose = () => {
    setPlan('basic')
    setRole('subscriber')
    reset()
  }
  const getData = async () => {
    await axios
      .get<UserData>(`https://falling-wildflower-5373.fly.dev/supplier/${providerId}`)
      .then(response => {
        console.log(response.data)
        setAsset(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }

  useEffect(() => {
    if (providerId) {
      getData()
    }
  }, [providerId])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAsset({ ...asset, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.put(`https://falling-wildflower-5373.fly.dev/supplier/${providerId}`, asset)
      console.log(asset)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Button style={{ backgroundColor: '#94bb68', color: 'white', borderRadius: '10px' }} onClick={toggleDrawer(true)}>
        EDITAR
      </Button>
      <Drawer
        open={state}
        anchor='right'
        variant='temporary'
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 800 } } }}
      >
        <Header>
          <Typography variant='h6'>Grupos contables</Typography>
          <IconButton size='small' onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
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
                name='descripcion'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={asset.descripcion}
                    label='Celular'
                    placeholder='78906547'
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
                    error={Boolean(errors.presupuesto)}
                    helperText={errors.presupuesto?.message}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='categoria'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={asset.categoria}
                    error={Boolean(errors.categoria)}
                    helperText={errors.categoria?.message}
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
    </>
  )
}

export default SidebarEditProvider
