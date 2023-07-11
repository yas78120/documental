// ** React Imports
import React, { FormEvent, useEffect, useState } from 'react'

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
import { addUser, fetchData } from 'src/store/apps/user'

// ** Types Imports
import { AppDispatch } from 'src/store'
import { Direction } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import user from 'src/store/apps/user'
import { useDropzone } from 'react-dropzone'

interface docData {
  numberDocument: string
  title: string
  ciPersonal: string
  documentType: string
  stateDocument: string
  documentDestinations: string
  description: string
  file: string
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
  digitalUbication: yup.string().required(),
  documentType: yup.string().required(),
  stateDocument: yup.string().required(),
  documentDestinations: yup.string().required(),
  description: yup.string().required(),
  file: yup.string().required()
})

const SidebarEditUser = (props: { docId: string }) => {
  const [state, setState] = useState<boolean>(false)
  //console.log(props)
  const docId = props.docId
  //console.log(docId)

  const [doc, setDoc] = useState<docData>({
    numberDocument: '',
    title: '',
    ciPersonal: '',
    documentType: '',
    stateDocument: '',
    documentDestinations: '',
    description: '',
    file: ''
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

  const {
    reset,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const getData = async () => {
    //console.log(docId)
    await axios
      .get<docData>(`${process.env.NEXT_PUBLIC_DOCUMENTAL}${docId}`)
      .then(response => {
        setDoc(response.data)
        console.log(response)
      })
      .catch(error => {
        console.error(error)
      })
  }

  useEffect(() => {
    if (docId) {
      getData()
    }
  }, [docId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoc({ ...doc, [e.target.name]: e.target.value })
    console.log(doc)
  }

  const dispatch = useDispatch()

  const convertFileToBase64 = (file: File) =>
    new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        resolve(reader.result)
      }

      reader.onerror = reject

      reader.readAsDataURL(file)
    })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      if (file) {
        const base64File = await convertFileToBase64(file)
        doc.file = base64File as string
      }
      console.log(doc)
      const response = await axios.put(`${process.env.NEXT_PUBLIC_DOCUMENTAL}${docId}`, doc)
      console.log(response)
      toggleDrawer(false)

      //console.log(response)
    } catch (error) {
      console.error(error)
    }
  }
  const [file, setFile] = useState<File | null>(null)
  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  // ** Hooks

  return (
    <>
      <div onClick={toggleDrawer(true)}>
        <Icon icon='mdi:pencil-outline' fontSize={20} onClick={toggleDrawer(true)} />
        Editar
      </div>

      <Drawer
        style={{ border: '2px solid white', margin: 'theme.spacing(2)' }}
        open={state}
        onClose={toggleDrawer(false)}
        anchor='right'
        variant='temporary'
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 800 } } }}
      >
        <Header>
          <Typography variant='h6'>{doc.numberDocument}</Typography>
          <IconButton size='small' onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='title'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Titulo'
                    onChange={handleChange}
                    value={doc.title}
                    error={Boolean(errors.title)}
                    autoComplete='off'
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='ciPersonal'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Author'
                    onChange={handleChange}
                    value={doc.ciPersonal}
                    error={Boolean(errors.ciPersonal)}
                    autoComplete='off'
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='documentType'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Extension'
                    value={doc.documentType}
                    onChange={handleChange}
                    error={Boolean(errors.documentType)}
                    autoComplete='off'
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='stateDocument'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Estado'
                    value={doc.stateDocument}
                    onChange={handleChange}
                    error={Boolean(errors.stateDocument)}
                    autoComplete='off'
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='documentDestinations'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Nivel de acceso'
                    onChange={handleChange}
                    value={doc.documentDestinations}
                    error={Boolean(errors.documentDestinations)}
                    autoComplete='off'
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='description'
                control={control}
                rules={{ required: false }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Descripcion'
                    onChange={handleChange}
                    value={doc.description}
                    error={Boolean(errors.description)}
                    autoComplete='off'
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button variant='outlined'>Seleccionar archivo</Button>
              </div>
              {file && <p>{file.name}</p>}
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button size='large' type='submit' variant='contained' onClick={toggleDrawer(false)} sx={{ mr: 6 }}>
                Aceptar
              </Button>
              <Button size='large' variant='outlined' color='secondary' onClick={toggleDrawer(false)}>
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  )
}

export default SidebarEditUser
