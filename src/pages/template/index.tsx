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
import DocumentViewer from 'src/pages/Peticiones/DocumentViewer'
import { Document, Page } from 'react-pdf'
import DocViewer from 'react-doc-viewer'

import { FaEdit } from 'react-icons/fa'
import EditorText from 'src/pages/Peticiones/EditorText'
import { Grid, Link } from '@mui/material'
import TextEditor from '../Peticiones/TextEditorDraft'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import PageHeader from 'src/@core/components/page-header'
import CardSnippet from 'src/@core/components/card-snippet'
import EditorControlled from './EditorControlled2'
import * as source from './EditorSourceCode2'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

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

  const getData = async () => {
    try {
      const response = await axios.get<Docu>(`${process.env.NEXT_PUBLIC_DOCUMENTAL}${docId}`)
      //console.log(response.data)
      // Extraer los campos necesarios de la respuesta
      const { _id, numberDocument, title, fileRegister, fileBase64, documentationType, description } = response.data
      // Crear un nuevo objeto con los campos extraídos
      const extractedDoc: Docu = {
        _id,
        numberDocument,
        fileBase64,
        title,
        fileRegister,
        documentationType,
        description
      }
      setDoc(extractedDoc)
      console.log(extractedDoc)
    } catch (error) {
      console.error(error)
    }
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

  const handleEditClickOpen = () => {
    toggleDrawer(false)
  }

  const handleEditClose = () => setOpenEdit(false)

  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false)

  return (
    <EditorWrapper>
      <Grid container spacing={6} className='match-height'>
        {/*<PageHeader
          title={
            <Typography variant='h5'>
              <Link href='https://jpuri.github.io/react-draft-wysiwyg/#/' target='_blank'>
                React Draft Wysiwyg
              </Link>
            </Typography>
          }
          subtitle={<Typography variant='body2'>A Wysiwyg Built on ReactJS and DraftJS</Typography>}
        />*/}

        <Grid item xs={12}>
          <CardSnippet
            sx={{ overflow: 'visible', textAlign: 'center' }}
            title='Editor Draft-Wysiwyg'
            code={{
              tsx: source.EditorControlledTSXCode,
              jsx: source.EditorControlledJSXCode
            }}
          >
            <EditorControlled />
          </CardSnippet>
        </Grid>
      </Grid>
    </EditorWrapper>
  )
}
export default DocViewLeft
