// ** React Imports
import { useState, useEffect, MouseEvent, useCallback, Dispatch, SetStateAction } from 'react'

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
import WebSocketClient from 'websocket'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Actions Imports
//import { deleteDoc } from 'src/store/apps/Doc'
import Doc, { deleteDoc, fetchData, fetchDocPage } from 'src/store/apps/doc'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports

import TableHeader from 'src/pages/Peticiones/TableHeader'
import SendFileWorkflow from 'src/pages/Peticiones/SendFileWorkflow'
import EditDocDrawer from 'src/pages/Peticiones/EditDocDrawer'
import DocViewLeft from 'src/pages/Peticiones/DocViewLeft'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Pagination,
  Select,
  TextField,
  Tooltip
} from '@mui/material'
import Base64FileDownload from 'src/pages/Peticiones/Base64FileDownload'
import DocViewText from 'src/pages/Peticiones/DocViewText'
import AddForkflow from 'src/pages/Peticiones/AddForkflow'
import AddStep from 'src/pages/Peticiones/AddStep'
import AddDocDrawer from 'src/pages/Peticiones/AddDocDrawer'
import AddCredenciales from 'src/pages/Peticiones/AddCredenciales'
import { fetchUser } from 'src/store/apps/user'
import SendFileUser from 'src/pages/Peticiones/SendFileUser'
import { FaEdit, FaEye, FaPaperPlane, FaRegTrashAlt } from 'react-icons/fa'
import Base64 from 'src/pages/Peticiones/Base64View'
import OptionsMenu from 'src/@core/components/option-menu'
import DigitalSignature from 'src/pages/Peticiones/DigitalSignature'
import TextEditor from 'src/pages/CKEditor/TextEditor'
import Result from 'src/pages/CKEditor/Result'
import SendFileUnitys from 'src/pages/Peticiones/SendFileUnitys'

//import { SocketIO } from 'src/pages/Peticiones/SocketIO'

interface Docu {
  _id: string
  createdAt: Date
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
  active: boolean
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
  //console.log(selectedId)
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
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleRowOptionsClose}></MenuItem>

        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}></MenuItem>

        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleRowOptionsClose}></MenuItem>
      </Menu>
    </>
  )
}
const DocList = () => {
  const [SendFileUserOpen, setSendFileUserOpen] = useState(false)
  const [SendFileUnityOpen, setSendFileUnityOpen] = useState(false)
  const [SendFileWorkflowOpen, setSendFileWorkflowOpen] = useState(false)
  const [DigitalSignatureOpen, setDigitalSignatureOpen] = useState(false)

  const [selectedDocId, setSelectedDocId] = useState<string>('')

  const handleSendButtonClick = (docId: string) => {
    setSelectedDocId(docId) // Guarda el ID del documento seleccionado
  }

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [storeData, setStoreData] = useState<Docu[]>([])

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
    if (option === 'unidad') {
      setSendFileUnityOpen(true)
    }
  }

  const handleDigitalButtonClick = (docId: string) => {
    setSelectedDocId(docId) // Guarda el ID del documento seleccionado
    setDigitalSignatureOpen(true)
  }

  const [showConfirmation, setShowConfirmation] = useState(false)

  const columns: GridColDef[] = [
    {
      flex: 0.07,
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
      flex: 0.1,
      minWidth: 200,
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
      field: 'eliminar',
      headerName: '',
      flex: 0.01,
      minWidth: 70,
      renderCell: ({ row }: CellType) => (
        <>
          <IconButton
            color='primary'
            onClick={() => {
              dispatch(deleteDoc(row._id))
              // Guarda el ID del documento seleccionado
            }}
          >
            <FaRegTrashAlt size={20} /> {/* Aquí puedes usar el icono que desees */}
          </IconButton>
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
  const [addCredenciales, setAddCredenciales] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [dataDoc, setDataDoc] = useState([])

  const fetchDataFromServer = async () => {
    console.log(currentPage)
    try {
      const response = await axios.get(
        `http://localhost:3501/documents/paginacion?page=${currentPage}&limit=${pageSize}`
      )
      setDataDoc(response.data.data)
      // Calcula el número total de páginas
      setTotalPages(Math.ceil(response.data.total / pageSize))
    } catch (error) {
      console.error('Error al obtener los datos del servidor', error)
    }
  }
  useEffect(() => {
    fetchDataFromServer()
  }, [currentPage, pageSize])

  useEffect(() => {
    fetchDataFromServer()
  }, [currentPage, pageSize])

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  /*useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])
  const user = useSelector((state: RootState) => state.user.user)
  const roles: string[] = user.rolUser
  console.log(user)*/
  const [page, setPage] = useState(1)

  const store = useSelector((state: RootState) => state.doc)
  console.log(dataDoc)

  /*const sortedData = data.slice().sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return dateB - dateA
  })*/

  //console.log(data)

  //console.log(store)

  //console.log(apiData)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddDocDrawer = () => setAddUserOpen(!addDocOpen)
  const toggleAddCredenciales = () => setAddCredenciales(!addCredenciales)

  const [totalPages, setTotalPages] = useState(0)

  function CustomLoadingOverlay() {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        <CircularProgress color='inherit' />
      </div>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableHeader
          value={value}
          handleFilter={handleFilter}
          toggle={toggleAddDocDrawer}
          toggle2={toggleAddCredenciales}
        />
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
        {SendFileUnityOpen && (
          <SendFileUnitys
            open={SendFileUnityOpen}
            toggle={() => setSendFileUnityOpen(false)} // Función para cerrar SendFileWorkflow
            docId={selectedDocId} // Pasa el ID del documento seleccionado
          />
        )}
        {DigitalSignatureOpen && (
          <DigitalSignature
            open={DigitalSignatureOpen}
            toggle={() => setDigitalSignatureOpen(false)} // Función para cerrar SendFileWorkflow
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
            sx={{
              '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
              '& .MuiDataGrid-window': { overflow: 'hidden' }
            }}
            components={{
              LoadingOverlay: CustomLoadingOverlay,
              Pagination: () => (
                <>
                  <Box display='flex' alignItems='center'>
                    <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
                      <Select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                      </Select>
                    </FormControl>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(event, value) => setCurrentPage(value)}
                    />
                  </Box>
                </>
              )
            }}
          />
        </Card>
      </Grid>
      <AddDocDrawer open={addDocOpen} toggle={toggleAddDocDrawer} />
      <AddCredenciales open={addCredenciales} toggle={toggleAddCredenciales} />
    </Grid>
  )
}

export default DocList
