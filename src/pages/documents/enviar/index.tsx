// ** React Imports
import { useState, useEffect, MouseEvent, useCallback, Dispatch } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Actions Imports
//import { deleteDoc } from 'src/store/apps/Doc'
import Doc, { deleteDoc, fetchData } from 'src/store/apps/doc'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports

import TableHeader from 'src/pages/Peticiones/TableHeader'
import SendFile from 'src/pages/Peticiones/SendFileWorkflow'
import EditDocDrawer from 'src/pages/Peticiones/EditDocDrawer'
import DocViewLeft from 'src/pages/Peticiones/DocViewLeft'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import Base64FileViewer from 'src/pages/Peticiones/Base64FileViewer'
import DocViewText from 'src/pages/Peticiones/DocViewText'
import AddForkflow from 'src/pages/Peticiones/AddForkflow'
import AddStep from 'src/pages/Peticiones/AddStep'
import AddDocDrawer from 'src/pages/Peticiones/AddDocDrawer'

interface Docu {
  _id: string
  numberDocument: string
  title: string

  documentationType: {
    typeName: string
  }
  description: string
  fileRegister?: {
    _idFile: string
    filename: string
    size: number
    filePath: string
    status: string
    category: string
    extension: string
  }
  base64Template: string
  fileBase64: string
  stateDocument: string
  active: Boolean
}
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface DocStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: Docu
}

const docStatusObj: DocStatusType = {
  ENVIADO: 'success',
  REVISION: 'warning',
  OBSERVADO: 'primary'
}

const RowOptions = ({ id }: { id: string }) => {
  const dispatch = useDispatch<AppDispatch>()

  const [selectedId, setSelectedId] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setSelectedId(id)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteConfirmation = () => {
    setShowConfirmation(true)
  }

  const handleDeleteCancel = () => {
    setShowConfirmation(false)
  }

  const handleDelete = () => {
    dispatch(deleteDoc(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleRowOptionsClose}>
          <DocViewLeft docId={selectedId} />
        </MenuItem>

        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <EditDocDrawer docId={selectedId} />
        </MenuItem>
        <MenuItem onClick={handleDeleteConfirmation} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Eliminar
        </MenuItem>
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleRowOptionsClose}>
          <DocViewText docId={selectedId} />
        </MenuItem>
      </Menu>
      {showConfirmation && (
        <Dialog open={showConfirmation} onClose={handleDeleteCancel}>
          <DialogTitle>Esta seguro de eliminar el archivo?</DialogTitle>

          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancelar</Button>
            <Button onClick={handleDelete} autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
const DocList = () => {
  const [sendFileOpen, setSendFileOpen] = useState(false)
  const [selectedDocId, setSelectedDocId] = useState<string>('')

  const handleSendButtonClick = (docId: string) => {
    setSelectedDocId(docId) // Guarda el ID del documento seleccionado
    setSendFileOpen(true) // Muestra el componente SendFile
  }

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 60,
      field: 'actions',
      headerName: '',
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} />
    },
    {
      flex: 0.1,
      minWidth: 120,
      field: 'numberDocument',
      headerName: 'DOCUMENTO',
      renderCell: ({ row }: CellType) => {
        const { numberDocument } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
                {numberDocument}
              </Typography>
              <Typography noWrap variant='caption'></Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.2,
      field: 'title',
      minWidth: 120,
      headerName: 'Titulo',
      renderCell: ({ row }: CellType) => {
        const formattedTitle = row.title?.charAt(0).toUpperCase() + row.title?.slice(1).toLowerCase()

        return (
          <Box
            sx={{ display: 'flex', alignItems: 'center' }}
            title={formattedTitle} // Agrega el atributo title al contenedor
          >
            <Typography noWrap sx={{ color: 'text.secundary ', textTransform: 'capitalize' }}>
              {formattedTitle}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 210,
      headerName: 'Descripcion',
      field: 'description',
      renderCell: ({ row }: CellType) => {
        const formattedDescription = row.description?.charAt(0).toUpperCase() + row.description?.slice(1).toLowerCase()

        return (
          <Box
            sx={{ display: 'flex', alignItems: 'center' }}
            title={formattedDescription} // Agrega el atributo title al contenedor
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
                {formattedDescription}
              </Typography>
              <Typography noWrap variant='caption'></Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Referencia',
      field: 'documentationType',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.documentationType?.typeName}
            </Typography>
          </Box>
        )
      }
    },

    {
      field: 'action', // O el nombre que desees
      headerName: 'Enviar', // O el título que desees
      flex: 0.1,
      minWidth: 120,
      renderCell: ({ row }: CellType) => (
        <Button variant='contained' color='primary' onClick={() => handleSendButtonClick(row._id)}>
          Enviar
        </Button>
      )
    },

    {
      field: 'fileBase64',
      headerName: 'Archivo',
      flex: 0.2,
      minWidth: 140,
      renderCell: ({ row }) => {
        // Verificar si fileRegistrer está definido antes de acceder a la propiedad file

        if (row.fileRegister) {
          return <Base64FileViewer base64={row.fileBase64} />
        } else {
          return <div>No hay archivo adjunto</div>
        }
      }
    },
    {
      field: 'viewDocument',
      headerName: 'Ver Documento',
      flex: 0.1,
      minWidth: 100,
      renderCell: ({ row }: CellType) => (
        <a
          href={`data:application/pdf;base64,${row.fileBase64}`} // Ajusta el tipo MIME si es necesario
          target='_blank'
          rel='noopener noreferrer'
        >
          <Icon icon='nombre-del-icono' fontSize={20} />{' '}
          {/* Sustituye 'nombre-del-icono' por el nombre del icono que deseas utilizar */}
        </a>
      )
    }
  ]

  // ** State

  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addDocOpen, setAddUserOpen] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(
      fetchData({
        role
      })
    )
  }, [dispatch, role])

  const store = useSelector((state: RootState) => state.doc)
  const user = useSelector((state: RootState) => state.user)

  console.log(store)
  console.log(user)
  //console.log(apiData)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addDocOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
        {sendFileOpen && (
          <SendFile
            open={sendFileOpen}
            toggle={() => setSendFileOpen(false)} // Función para cerrar SendFile
            docId={selectedDocId} // Pasa el ID del documento seleccionado
          />
        )}
        <Card>
          <DataGrid
            getRowId={row => row._id}
            autoHeight
            rows={store.data}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>

        <Card>
          <AddForkflow />
        </Card>
        <Card>
          <AddStep />
        </Card>
      </Grid>
      <AddDocDrawer open={addDocOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export default DocList
