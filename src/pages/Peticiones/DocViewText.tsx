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
import TextEditorDraft from './TextEditorDraft'
import WordDocumentViewer from './WordDocumentViewer'
import { FaEdit } from 'react-icons/fa'
import EditorText from './EditorText'

interface ColorsType {
  [key: string]: ThemeColor
}

interface Docu {
  _id: string
  numberDocument: string
  title: string
  fileRegister: {
    _idFile: string
    extension: string
  }
  fileBase64: string
  documentationType: {
    typeName: string
  }
  description: string
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
interface Base64 {
  idDocument: string
  fileBase64: string
}

const StyledDocumentViewer = styled(DocumentViewer)({
  marginTop: '1rem'
})

const DocViewLeft = (props: { docId: string }) => {
  const docId = props.docId
  //console.log(docId)

  const [doc, setDoc] = useState<Docu | null>(null)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openPlans, setOpenPlans] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)
  const [state, setState] = useState<boolean>(false)

  const [base64File, setBase64File] = React.useState<Base64 | null>(null)

  const fetchBase64File = async () => {
    if (docId) {
      try {
        const response = await axios.get<Base64>(`${process.env.NEXT_PUBLIC_DOCUMENTAL}get-base64-document/${docId}`)
        console.log(response.data)
        setBase64File(response.data)
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    fetchBase64File()
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
  if (base64File) {
    return (
      <>
        <div onClick={toggleDrawer(true)}>
          <FaEdit />
          Editor de Texto
        </div>
        <Dialog
          open={state}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 1000, minWidth: 600, p: [2, 4] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            Editor de texto
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

          <div style={{ width: '100%', height: '600px', overflow: 'scroll' }}>
            <TextEditorDraft base64={base64File.fileBase64} />
          </div>
        </Dialog>
      </>
    )
  } else {
    return null
  }
}
export default DocViewLeft
