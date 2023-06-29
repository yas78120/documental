// ** React Imports
import { useState } from 'react'

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
import { addUser } from 'src/store/apps/user'

// ** Types Imports
import { AppDispatch } from 'src/store'
import axios from 'axios'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface docData {
  title: string
  authorDocument: string
  digitalUbication: string
  documentType: string
  stateDocument: string
  nivelAcces: string
  description: string
  category: string
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
  authorDocument: yup.string().required(),
  digitalUbication: yup.string().required(),
  documentType: yup.string().required(),
  stateDocument: yup.string().required(),
  nivelAcces: yup.string().required(),
  description: yup.string().required(),
  category: yup.string().required()
})

const defaultValues = {
  title: '',
  authorDocument: '',
  digitalUbication: '',
  documentType: '',
  stateDocument: '',
  nivelAcces: '',
  description: '',
  category: ''
}

const SidebarAddUser = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle } = props

  // ** State
  /*
  const [plan, setPlan] = useState<string>('basic')
  const [role, setRole] = useState<string>('subscriber')
  const [asset, setAsset] = useState({
    title: '',
    authorDocument: '',
    digitalUbication: '',
    documentType: '',
    stateDocument: '',
    nivelAcces: '',
    description: ''
  })*/
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  /*
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAsset({ ...asset, [e.target.name]: e.target.value })
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(asset)
    axios
      .post(`${process.env.NEXT_PUBLIC_DOCUMENTAL}`, asset)
      .then(response => {
        console.log(response.data)

        // Realizar acciones adicionales después de enviar los datos exitosamente
      })
      .catch(error => {
        console.error(error)

        // Manejar el error en caso de que la solicitud falle
      })
    toggle()
    reset()
  }*/

  const onSubmit = (data: docData) => {
    //console.log(data)
    dispatch(addUser({ ...data }))

    toggle()
    reset()
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 800 } } }}
    >
      <Header>
        <Typography variant='h6'>Añadir Documento</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='title'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Titulo'
                  value={value}
                  onChange={onChange}
                  placeholder='Tarea 1'
                  error={Boolean(errors.title)}
                />
              )}
            />
            {errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='authorDocument'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Autor'
                  value={value}
                  onChange={onChange}
                  placeholder='Oliver'
                  error={Boolean(errors.authorDocument)}
                />
              )}
            />
            {errors.authorDocument && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.authorDocument.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='digitalUbication'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Ubicacion de archivo'
                  value={value}
                  onChange={onChange}
                  placeholder='/archivos/documento09.pdf'
                  error={Boolean(errors.digitalUbication)}
                />
              )}
            />
            {errors.digitalUbication && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.digitalUbication.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='documentType'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Extension'
                  value={value}
                  onChange={onChange}
                  placeholder='Word'
                  error={Boolean(errors.documentType)}
                />
              )}
            />
            {errors.documentType && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.documentType.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='stateDocument'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Estado'
                  value={value}
                  onChange={onChange}
                  placeholder='Aprobado'
                  error={Boolean(errors.stateDocument)}
                />
              )}
            />
            {errors.stateDocument && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.stateDocument.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='nivelAcces'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Acceso'
                  value={value}
                  onChange={onChange}
                  placeholder='Restringido'
                  error={Boolean(errors.nivelAcces)}
                />
              )}
            />
            {errors.nivelAcces && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.nivelAcces.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Descripcion'
                  value={value}
                  onChange={onChange}
                  placeholder='Esta en mi tarea ...'
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='category'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Category'
                  value={value}
                  onChange={onChange}
                  placeholder='Informes'
                  error={Boolean(errors.category)}
                />
              )}
            />
            {errors.category && <FormHelperText sx={{ color: 'error.main' }}>{errors.category.message}</FormHelperText>}
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddUser
