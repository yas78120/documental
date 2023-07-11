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
import { addUser } from 'src/store/apps/user'

// ** Types Imports
import { AppDispatch } from 'src/store'
import axios from 'axios'
import React from 'react'
import { Chip } from '@mui/material'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface docData {
  title: string
  ciPersonal: string
  documentType: string
  stateDocument: string
  documentDestinations: string
  description: string
  file: string
}

interface departDestino {
  _id: string
  name: string
}
interface docType {
  _id: string
  typeName: string
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
  ciPersonal: yup.string().required(),
  documentType: yup.string().required(),
  stateDocument: yup.string().required(),
  documentDestinations: yup.string().required(),
  description: yup.string().required(),
  file: yup.mixed().required('Documento es requerido')
})

const defaultValues = {
  title: '',
  ciPersonal: '',
  documentType: '',
  stateDocument: '',
  documentDestinations: '',
  description: '',
  file: ''
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
    ciPersonal: '',
    digitalUbication: '',
    documentType: '',
    stateDocument: '',
    documentDestinations: '',
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
  const [groupDepart, setgroupDepart] = React.useState<departDestino[]>([])
  const [groupTypes, setgroupTypes] = React.useState<docType[]>([])

  const getDestino = async () => {
    try {
      const response = await axios.get<departDestino[]>(`http://10.10.214.219:8085/organization-chart`)
      console.log(response.data)
      setgroupDepart(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  const getTypeDoc = async () => {
    try {
      const response = await axios.get<docType[]>(`http://10.10.214.219:8085/documentation-type`)
      console.log(response.data)
      setgroupTypes(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getDestino()
    getTypeDoc()
  }, [])
  /*
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  const handleSelectChange = (event: SelectChangeEvent<string | string[]>) => {
    const selectedValues = Array.isArray(event.target.value) ? event.target.value : [event.target.value]

    setSelectedValues(selectedValues)
  }*/

  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [selectedValues2, setSelectedValues2] = useState<string[]>([])
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

  const convertFileToBase64 = (file: File) =>
    new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        resolve(reader.result)
      }

      reader.onerror = reject

      reader.readAsDataURL(file)
    })

  const onSubmit = async (data: docData) => {
    if (file) {
      const base64File = await convertFileToBase64(file)
      data.file = base64File as string
    }

    dispatch(addUser({ ...data }))
    console.log(data)

    toggle()
    reset()
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const [file, setFile] = useState<File | null>(null)
  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    console.log(setFile)
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)

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
                  autoComplete='off'
                />
              )}
            />
            {errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='ciPersonal'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label='Autor'
                  value={value}
                  onChange={onChange}
                  placeholder='Oliver'
                  error={Boolean(errors.ciPersonal)}
                  autoComplete='off'
                />
              )}
            />
            {errors.ciPersonal && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.ciPersonal.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            Tipo de Documento
            <Controller
              name='documentType'
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange } }) => (
                <Select
                  multiple
                  value={selectedValues2}
                  onChange={event => {
                    const selectedValues = event.target.value as string[]
                    const selectedValuesAsString = selectedValues.join(',')
                    setSelectedValues2(selectedValues)
                    onChange(selectedValuesAsString)
                    setIsOpen2(false)
                  }}
                  open={isOpen2}
                  onClose={() => setIsOpen2(false)}
                  error={Boolean(errors.documentDestinations)}
                  autoComplete='off'
                  onOpen={() => setIsOpen2(true)}
                >
                  {groupTypes.map(option => (
                    <MenuItem key={option._id} value={option.typeName}>
                      {option.typeName}
                    </MenuItem>
                  ))}
                </Select>
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
                  autoComplete='off'
                />
              )}
            />
            {errors.stateDocument && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.stateDocument.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            Destino
            <Controller
              name='documentDestinations'
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange } }) => (
                <Select
                  multiple
                  value={selectedValues}
                  onChange={event => {
                    const selectedValues = event.target.value as string[]
                    const selectedValuesAsString = selectedValues.join(',')
                    setSelectedValues(selectedValues)
                    onChange(selectedValuesAsString)
                    setIsOpen(false) // Cerrar el Select después de la selección
                  }}
                  open={isOpen}
                  onClose={() => setIsOpen(false)}
                  error={Boolean(errors.documentDestinations)}
                  autoComplete='off'
                  onOpen={() => setIsOpen(true)}
                >
                  {groupDepart.map(option => (
                    <MenuItem key={option._id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.documentDestinations && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.documentDestinations.message}</FormHelperText>
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
                  autoComplete='off'
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Button variant='outlined'>Seleccionar archivo</Button>
            </div>
            {file && <p>{file.name}</p>}
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
