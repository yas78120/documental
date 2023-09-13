// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import axios from 'axios'
import { fetchData } from 'src/store/apps/doc'
import { Drawer } from '@mui/material'
import EditDocDrawer from './EditDocDrawer'

interface ColorsType {
  [key: string]: ThemeColor
}
interface Docu {
  _id: string
  numberDocument: string
  title: string
  fileRegister: {
    _id: string
    filename: string
    size: number
    filePath: string
    status: string
    category: string
    extension: string
  }
  documentType: string
  stateDocument: string
  description: string
  createdAt?: Date | null
  active: Boolean
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const roleColors: ColorsType = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const statusColors: ColorsType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

//const [docs, setdocs] = useState<Docu[]>([])

const DocViewLeft = (props: { docId: string }) => {
  // ** States
  const docId = props.docId

  const [doc, setDoc] = useState<Docu>({
    _id: '',
    numberDocument: '',
    title: '',

    fileRegister: {
      _id: '',
      filename: '',
      size: 0,
      filePath: '',
      status: '',
      category: '',
      extension: ''
    },
    documentType: '',
    stateDocument: '',
    description: '',
    createdAt: null,
    active: true
  })

  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openPlans, setOpenPlans] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)
  const [state, setState] = useState<boolean>(false)

  const getData = async () => {
    //console.log(docId)
    await axios
      .get<Docu>(`${process.env.NEXT_PUBLIC_DOCUMENTAL}${docId}`)
      .then(response => {
        setDoc(response.data)
        console.log(response.data)
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

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setState(open)
  }
  // Handle Edit dialog
  const handleEditClickOpen = () => {
    toggleDrawer(false)
  }
  const handleEditClose = () => setOpenEdit(false)

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false)
  if (doc) {
    return (
      <>
        <div onClick={toggleDrawer(true)}>
          <Icon icon='mdi:eye-outline' fontSize={20} />
          Ver
        </div>
        <Dialog
          open={state}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 680, p: [2, 4] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            {doc.numberDocument}
            <IconButton
              size='small'
              onClick={toggleDrawer(false)}
              sx={{
                position: 'absolute',
                top: 35,
                right: 35,
                color: 'text.primary'
              }}
            >
              <Icon icon='mdi:close' fontSize={20} />
            </IconButton>
          </DialogTitle>

          <CardContent>
            <Box sx={{ pt: 0, pb: 7 }}>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Titulo:</Typography>
                <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                  {doc.title}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                  Estado:
                </Typography>
                <CustomChip
                  skin='light'
                  size='small'
                  label={doc.stateDocument}
                  color={statusColors[doc.stateDocument]}
                  sx={{
                    height: 20,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    borderRadius: '5px',
                    textTransform: 'capitalize'
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Tipo de documento:</Typography>
                <Typography variant='body2'>{doc.documentType}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Descripcion:</Typography>
                <Typography variant='body2'>{doc.description}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Tamaño del Archivo:</Typography>
                <Typography variant='body2'>{doc.fileRegister ? doc.fileRegister.size : 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Extension:</Typography>
                <Typography variant='body2'>{doc.fileRegister ? doc.fileRegister.extension : 'N/E'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Fecha de creacion:</Typography>
                <Typography>{doc.createdAt?.toLocaleString()}</Typography>
              </Box>
            </Box>
          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button color='error' variant='outlined' onClick={toggleDrawer(false)}>
              Cancelar
            </Button>
          </CardActions>
        </Dialog>
      </>
    )
  } else {
    return null
  }
}
export default DocViewLeft

/*
<Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
              <EditDocDrawer docId={doc._id} />
            </Button>*/
