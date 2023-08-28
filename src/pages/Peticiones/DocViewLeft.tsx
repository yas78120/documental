import React, { useEffect, useState } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import { ThemeColor } from 'src/@core/layouts/types'
import axios from 'axios'
import DocumentViewer from './DocumentViewer'
import { Document, Page } from 'react-pdf'
import DocViewer from 'react-doc-viewer'
import TextEditor from './TextEditor'

interface ColorsType {
  [key: string]: ThemeColor
}

interface Docu {
  _id: string
  numberDocument: string
  title: string
  fileRegister: {
    _idFile: string
    filename: string
    size: number
    filePath: string
    status: string
    category: string
    extension: string
  }
  documentationType: {
    _id: string
    typeName: string
  }
  stateDocument: string
  description: string

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

const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

const StyledDocumentViewer = styled(DocumentViewer)({
  marginTop: '1rem'
})

const DocViewLeft = (props: { docId: string }) => {
  const docId = props.docId

  const [doc, setDoc] = useState<Docu | null>(null)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openPlans, setOpenPlans] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)
  const [state, setState] = useState<boolean>(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get<Docu>(`${process.env.NEXT_PUBLIC_DOCUMENTAL}${docId}`)
        setDoc(response.data)
      } catch (error) {
        console.error(error)
      }
    }

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

  const handleEditClickOpen = () => {
    toggleDrawer(false)
  }

  const handleEditClose = () => setOpenEdit(false)

  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false)
  if (doc) {
    return (
      <>
        <div onClick={toggleDrawer(true)}>
          <Icon icon='mdi:eye-outline' fontSize={20} onClick={toggleDrawer(true)} />
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
                {doc.documentationType ? (
                  <Typography variant='body2'>{doc.documentationType.typeName}</Typography>
                ) : (
                  <Typography variant='body2'>Tipo no disponible</Typography>
                )}
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
