// ** React Imports
import { ChangeEvent, FormEvent, useState } from 'react'
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports

import axios from 'axios'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface UserData {
  name: string
  description: string
  responsible: string
  price: number
  supplier: string
  location: string
  dateAcquisition: Date
  warrantyExpirationDate: Date
  file: string
  typeCategoryAsset: string //
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
  direction: yup.string().required(),
  responsible: yup.string().required(),
  supplier: yup.string().required(),
  location: yup.string().required(),
  typeCategoryAsset: yup.string().required(),
  dateAcquisition: yup.string().required(),
  warrantyExpirationDate: yup.string().required(),
  name: yup
    .string()
    .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
    .matches(/^[A-Za-z ]*$/, 'El nombre solo puede contener letras')
    .required(),
  price: yup.number().moreThan(0, 'El valor debe ser mayor que cero').required()
})

const defaultValues = {
  name: '',
  description: '',
  responsible: '',
  price: 0,
  supplier: '',
  location: '',
  dateAcquisition: '',
  warrantyExpirationDate: new Date('2023-07-27T15:10:58.870'),
  file: '',
  typeCategoryAsset: '' //
}

const SidebarAddProvider = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle } = props

  // const handleCategoriaChange = (e: ChangeEvent<{ value: unknown }>) => {
  //   setAsset({ ...asset, typeCategoryAsset: e.target.value as string })
  // }

  const [previewfile, setPreviewfile] = useState<string | null>(null)
  const [asset, setAsset] = useState<UserData>({
    name: '',
    description: '',
    responsible: '',
    supplier: '',
    location: '',
    price: 0,
    dateAcquisition: new Date('2023-06-27T15:10:58.870'),
    warrantyExpirationDate: new Date('2023-07-27T15:10:58.870'),
    typeCategoryAsset: '',
    file: ''
  })

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
    window.location.reload()
    toggle()
    reset()
  }

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setAsset({ ...asset, [e.target.name]: e.target.value })
  // }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAsset(prevAsset => ({ ...prevAsset, [name]: value }))
  }
  // const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {

  //     console.log(e.target.files)
  //     const selectedFile = e.target.files[0]
  //     const reader = new FileReader()

  //     reader.onload = () => {
  //       if (reader.readyState === 2) {
  //         const base64File = reader.result as string
  //         setAsset({ ...asset, file: base64File, dateacquisition: new Date().toISOString() })
  //         setPreviewfile(base64File)
  //       }
  //     }

  //     reader.readAsDataURL(selectedFile)
  //   }
  // }

  const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    reader.onload = function () {
      if (reader.readyState === 2) {
        const formattedDate = new Date().toISOString()
        setAsset({ ...asset, file: reader.result as string })
        setPreviewfile(reader.result as string)
      }
    }
    if (e.target.files && e.target.files.length > 0) {
      console.log(e.target.files)
      reader.readAsDataURL(e.target.files[0])
      console.log('' + previewfile)
    }
  }

  const handleSubmit = async () => {
    try {
      console.log(asset.warrantyExpirationDate)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/`, asset)
      console.log(asset.warrantyExpirationDate)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  // const handleCategoryChange = (e: ChangeEvent<{ value: unknown }>, child: React.ReactNode) => {
  //   setAsset({ ...asset, typeCategoryAsset: e.target.value as string })
  // }
  const handleCategoryChange = (e: ChangeEvent<{ value: unknown }>) => {
    setAsset({ ...asset, typeCategoryAsset: e.target.value as string })
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
        <Typography variant='h6'>Agregar Nuevo Activo</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <label htmlFor='file'>Imagen</label>
            <input type='file' id='file' name='file' onChange={handlefileChange} />
            <div style={{ textAlign: 'center' }}>
              {previewfile && <img src={previewfile} alt='Preview' style={{ maxWidth: '100%', maxHeight: '300px' }} />}
            </div>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.name}
                  label='Nombre'
                  placeholder='Nombre del Activo'
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
              name='description'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.description}
                  label='Descripcion'
                  placeholder='descripcion'
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='responsible'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.responsible}
                  label='Responsable'
                  placeholder='Responsable'
                  error={Boolean(errors.responsible)}
                  helperText={errors.responsible?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='supplier'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.supplier}
                  label='Proveedor'
                  placeholder=' '
                  error={Boolean(errors.supplier)}
                  helperText={errors.supplier?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='location'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.location}
                  label='Ubicacion'
                  placeholder=''
                  error={Boolean(errors.location)}
                  helperText={errors.location?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='price'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.price}
                  label='Precio'
                  placeholder=' '
                  error={Boolean(errors.price)}
                  helperText={errors.price?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>{' '}
          <Typography variant='body2' gutterBottom>
            Fecha de Adquisicion
          </Typography>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='dateAcquisition'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='datetime-local'
                  value={asset.dateAcquisition}
                  placeholder=' '
                  error={Boolean(errors.dateAcquisition)}
                  helperText={errors.dateAcquisition?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>
          <Typography variant='body2' gutterBottom>
            Fecha de expiración de la garantía
          </Typography>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='warrantyExpirationDate'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='datetime-local'
                  value={asset.warrantyExpirationDate}
                  placeholder=' '
                  error={Boolean(errors.warrantyExpirationDate)}
                  helperText={errors.warrantyExpirationDate?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='typeCategoryAsset'>Categoría</InputLabel>
            <Select
              labelId='typeCategoryAsset-label'
              id='typeCategoryAsset'
              value={asset.typeCategoryAsset}
              onChange={handleCategoryChange as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
              autoComplete='off'
            >
              <MenuItem value='Muebles y enseres de oficina'>Muebles y enseres de oficina</MenuItem>
              <MenuItem value='Equipos e instalaciones'>Equipos e instalaciones</MenuItem>
              <MenuItem value='Edificaciones'>Edificaciones</MenuItem>
              <MenuItem value='Maquinaria en general'>Maquinaria en general</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='outlined' sx={{ mr: 3 }}>
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
