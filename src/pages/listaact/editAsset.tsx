//** React Imports
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react'

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
// import * as yup from 'yup'
// import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import axios from 'axios'
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

interface UserData {
  _id: string
  name: string
  description: string
  responsible: string
  supplier: string
  location: string
  price: number
  dateAcquisition: Date
  warrantyExpirationDate: Date
  typeCategoryAsset: string
  file: string
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

// const schema = yup.object().shape({
//   direction: yup.string().required(),
//   phone: yup
//     .string()
//     .typeError('')
//     .min(10, obj => showErrors('Celular', obj.value.length, obj.min))
//     .required(),
//   name: yup
//     .string()
//     .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
//     .required()
// })

const defaultValues = {
  _id: '',
  name: '',
  description: '',
  responsible: '',
  supplier: '',
  location: '',
  price: 0,
  dateAcquisition: new Date('2023-06-27T15:10:58.870'),
  warrantyExpirationDate: new Date('2023-06-27T15:10:58.870'),
  file: '',
  typeCategoryAsset: ''
}

const SidebarEditAsset = (props: { providerId: string }) => {
  // ** Props
  // ** State
  const [image, setImage] = useState<File | null>(null)

  const [state, setState] = useState<boolean>(false)
  const [previewfile, setPreviewfile] = useState<string | null>(null)
  const providerId = props.providerId
  const [asset, setAsset] = useState<UserData>({
    _id: '',
    name: '',
    description: '',
    responsible: '',
    supplier: '',
    location: '',
    price: 0,
    dateAcquisition: new Date('2023-06-27T15:10:58.870'),
    warrantyExpirationDate: new Date('2023-06-27T15:10:58.870'),
    file: '',
    typeCategoryAsset: ''
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
    mode: 'onChange'
    //resolver: yupResolver(schema)
  })

  // const handleClose = () => {
  //   window.location.reload()
  //   reset()
  // }
  const getData = async () => {
    await axios
      .get<UserData>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/${providerId}`)
      .then(response => {
        console.log('edit data' + response.data)
        setAsset(response.data)
        console.log('edit data2' + asset)
      })
      .catch(error => {
        console.error(error)
      })
  }

  useEffect(() => {
    getData()
  }, [])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setAsset({ ...asset, [e.target.name]: e.target.value })
  }

  //VIZUALIZAR IMAGENES
  const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    reader.onload = function () {
      if (reader.readyState === 2) {
        const formattedDate = new Date().toISOString()

        setAsset
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
    //console.log(file)
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/${asset._id}`, {
        name: asset.name,
        description: asset.description,
        responsible: asset.responsible,
        supplier: asset.supplier,
        location: asset.location,
        price: asset.price,
        dateAcquisition: asset.dateAcquisition,
        warrantyExpirationDate: asset.warrantyExpirationDate,
        file: asset.file,
        typeCategoryAsset: asset.typeCategoryAsset
      })
      console.log(asset)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  function handleCategoryChange(event: SelectChangeEvent<string>, child: ReactNode): void {
    setAsset({ ...asset, typeCategoryAsset: event.target.value as string })
  }

  // const handleCategoryChange = (e: ChangeEvent<{ value: unknown }>) => {
  //   setAsset({ ...asset, typeCategoryAsset: e.target.value as string })
  // }
  const convertBase64ToImageUrl = (base64String: string) => {
    return `data:image/png;base64,${base64String}`
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
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 800, lg: 1000 } } }}
      >
        <Header>
          <Typography variant='h6'>Editar Activo</Typography>
          <IconButton size='small' onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 6 }} style={{ borderRadius: '50%', textAlign: 'center' }}>
              <Controller
                name='file'
                control={control}
                render={({ field }) => (
                  <div>
                    <img
                      src={convertBase64ToImageUrl(asset.file)}
                      alt='Imagen actual del activo'
                      width={200}
                      height={200}
                      style={{ borderRadius: '50%', textAlign: 'center' }}
                    />
                  </div>
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <label htmlFor='file'>Imagen</label>
              <input type='file' id='file' name='file' onChange={handlefileChange} />
              <div style={{ textAlign: 'center' }}>
                {previewfile && (
                  <img src={previewfile} alt='Preview' style={{ maxWidth: '100%', maxHeight: '300px' }} />
                )}
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
                    placeholder=''
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
                    label='Descripción'
                    placeholder=' '
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
                    placeholder=' '
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
                    label='Ubicación'
                    placeholder=' '
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
            </FormControl>
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
                onChange={handleCategoryChange}
                autoComplete='off'
              >
                <MenuItem value='Muebles y enseres de oficina'>Muebles y enseres de oficina</MenuItem>
                <MenuItem value='Equipos e instalaciones'>Equipos e instalaciones</MenuItem>
                <MenuItem value='Edificaciones'>Edificaciones</MenuItem>
                <MenuItem value='Maquinaria en general'>Maquinaria en general</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                Aceptar
              </Button>
              <Button size='large' variant='outlined' color='secondary'>
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  )
}

export default SidebarEditAsset
