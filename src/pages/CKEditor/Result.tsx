// ** React Imports
import { useState, useEffect, MouseEvent, useCallback, Dispatch } from 'react'

// ** Next Imports
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
import Doc, { deleteDoc, fetchData, fetchDataObserved } from 'src/store/apps/doc'

// ** Third Party Components

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports

import TableHeader from 'src/pages/Peticiones/TableHeader'
import SendFileWorkflow from 'src/pages/Peticiones/SendFileWorkflow'
import EditDocDrawer from 'src/pages/Peticiones/EditDocDrawer'
import DocViewLeft from 'src/pages/Peticiones/DocViewLeft'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tooltip } from '@mui/material'
import Base64FileViewer from 'src/pages/Peticiones/Base64FileDownload'
import DocViewText from 'src/pages/Peticiones/DocViewText'
import AddForkflow from 'src/pages/Peticiones/AddForkflow'
import AddStep from 'src/pages/Peticiones/AddStep'
import AddDocDrawer from 'src/pages/Peticiones/AddDocDrawer'
import { fetchUser } from 'src/store/apps/user'
import SendFileUser from 'src/pages/Peticiones/SendFileUser'
import { FaEdit, FaEye, FaPaperPlane, FaRegTrashAlt } from 'react-icons/fa'
import Base64 from 'src/pages/Peticiones/Base64View'
import OptionsMenu from 'src/@core/components/option-menu'
import Base64Download from 'src/pages/Peticiones/Base64Download'
import Base64FileDownload from 'src/pages/Peticiones/Base64FileDownload'

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
  bitacoraWorkflow: {
    motivoBack: string
    nameOficinaActual: string
    oficinaActual: string
  }[]
  base64Template: string
  fileBase64: string
  stateDocumentUserSend: string
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

const RowOptions = ({ id, title }: { id: string; title: string }) => {
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
          <Base64FileDownload id={selectedId} fileName={title} />
        </MenuItem>

        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleRowOptionsClose}>
          <DocViewText docId={selectedId} />
        </MenuItem>
      </Menu>
    </>
  )
}
const DocList = () => {
  const [SendFileUserOpen, setSendFileUserOpen] = useState(false)
  const [SendFileWorkflowOpen, setSendFileWorkflowOpen] = useState(false)
  const [selectedDocId, setSelectedDocId] = useState<string>('')

  const handleSendButtonClick = (docId: string) => {
    setSelectedDocId(docId) // Guarda el ID del documento seleccionado
  }

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedOption, setSelectedOption] = useState<string>('')

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    handleMenuClose()
    if (option === 'flujoTrabajo') {
      setSendFileWorkflowOpen(true)
    }
    if (option === 'usuario') {
      setSendFileUserOpen(true)
    }
  }

  const [showConfirmation, setShowConfirmation] = useState(false)

  const columns: GridColDef[] = [
    {
      flex: 0.06,
      minWidth: 60,
      field: 'actions',
      headerName: '',
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} title={row.title} />
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
      flex: 0.1,
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
    /*
    {
      flex: 0.1,
      minWidth: 210,
      headerName: 'Motivo de Observacion',
      field: 'Observed',
      renderCell: ({ row }: CellType) => {
        let a = row.bitacoraWorkflow?.length
        const formattedDescription = row.bitacoraWorkflow[a - 1].motivoBack

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
    /*
    {
      flex: 0.1,
      minWidth: 140,
      headerName: 'Referencia',
      field: 'documentationType',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.documentationType.typeName}
          </Typography>
        )
      }
    },*/
    {
      field: 'action',
      headerName: 'Enviar',
      flex: 0.1,
      minWidth: 110,
      renderCell: ({ row }: CellType) => (
        <>
          <Button
            variant='outlined'
            color='primary'
            onClick={event => {
              handleSendButtonClick(row._id) // Pasa la ID del documento a la función
              handleMenuOpen(event) // Abre el menú
            }}
          >
            Enviar
          </Button>
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleOptionSelect('usuario')}>A un Usuario</MenuItem>
            <MenuItem onClick={() => handleOptionSelect('unidad')}>A una Unidad</MenuItem>
            <MenuItem onClick={() => handleOptionSelect('flujoTrabajo')}>Flujo de Trabajo</MenuItem>
          </Menu>
        </>
      )
    },
    /*
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Estado',
      field: 'stateDocument',
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.stateDocument}
            color={docStatusObj[row.stateDocument]}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
*/

    {
      field: 'viewDocument',
      headerName: 'Ver',
      flex: 0.01,
      minWidth: 60,
      renderCell: ({ row }: CellType) => {
        if (row.fileRegister) {
          return <Base64 id={row._id} />
        } else {
          return <div>No hay archivo adjunto</div>
        }
      }
    },

    {
      field: 'fileBase64',
      headerName: '',
      flex: 0.01,
      minWidth: 45,
      renderCell: ({ row }) => {
        // Verificar si fileRegistrer está definido antes de acceder a la propiedad file

        if (row.fileRegister) {
          return <Base64Download id={row._id} fileName={row.title} />
        } else {
          return <div>No hay archivo adjunto</div>
        }
      }
    },

    {
      field: 'eliminar',
      headerName: '',
      flex: 0.01,
      minWidth: 70,
      renderCell: ({ row }: CellType) => (
        <>
          <IconButton
            color='primary'
            onClick={() => {
              setShowConfirmation(true)
              setSelectedDocId(row._id) // Guarda el ID del documento seleccionado
            }}
          >
            <FaRegTrashAlt size={20} /> {/* Aquí puedes usar el icono que desees */}
          </IconButton>
          <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)}>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>¿Estás seguro de que deseas eliminar este documento?</DialogContent>
            <DialogActions>
              <Button onClick={() => setShowConfirmation(false)} color='primary'>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  // Eliminar el documento aquí
                  dispatch(deleteDoc(selectedDocId))
                  setShowConfirmation(false)
                }}
                color='primary'
              >
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )
    }
    /*
    {
      field: 'viewDocument',
      headerName: 'Ver',
      flex: 0.01,
      minWidth: 60,
      renderCell: ({ row }: CellType) => {
        if (row.fileRegister) {
          return <Base64 base64={row.fileBase64} />
        } else {
          return <div>No hay archivo adjunto</div>
        }
      }
    },*/
    /*
    {
      field: 'base64Template',
      headerName: 'Template',
      flex: 0.01,
      minWidth: 80,
      renderCell: ({ row }: CellType) => {
        if (row.fileRegister) {
          return <Base64 base64={row.base64Template} />
        } else {
          return <div>No hay archivo adjunto</div>
        }
      }
    }*/
  ]

  // ** State

  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addDocOpen, setAddUserOpen] = useState<boolean>(false)

  // ** Hooks
  const [typeName, setTypeName] = useState<string>('')
  const [view, setView] = useState<string>('RECIBIDOS')
  const [active, setActive] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(
      fetchData({
        view,
        active,
        page,
        limit,
        typeName
      })
    )
  }, [dispatch, view, active, page, limit, typeName])

  const store = useSelector((state: RootState) => state.doc)

  //console.log(store)

  //console.log(apiData)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddDocDrawer = () => setAddUserOpen(!addDocOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {SendFileWorkflowOpen && (
          <SendFileWorkflow
            open={SendFileWorkflowOpen}
            toggle={() => setSendFileWorkflowOpen(false)} // Función para cerrar SendFileWorkflow
            docId={selectedDocId} // Pasa el ID del documento seleccionado
          />
        )}
        {SendFileUserOpen && (
          <SendFileUser
            open={SendFileUserOpen}
            toggle={() => setSendFileUserOpen(false)} // Función para cerrar SendFileWorkflow
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
      </Grid>
      <AddDocDrawer open={addDocOpen} toggle={toggleAddDocDrawer} />
    </Grid>
  )
}

export default DocList
