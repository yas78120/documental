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
import WebSocketClient from 'websocket'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Actions Imports
//import { deleteDoc } from 'src/store/apps/Doc'
import { deleteDoc, fetchData } from 'src/store/apps/doc'

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
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Pagination,
  Select,
  TextField,
  Tooltip
} from '@mui/material'
import Base64FileDownload from 'src/pages/Peticiones/Base64FileDownload'
import DocViewText from 'src/pages/Peticiones/DocViewText'
import AddForkflow from 'src/pages/Peticiones/AddForkflow'
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
import { SelectChangeEvent } from '@mui/material/Select'
import { getTypeDoc } from 'src/pages/Peticiones/Consultas'
import { fetchTypeDoc } from 'src/store/apps/docType'
import React from 'react'

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
  stateDocumentUserSend: string
  active: boolean
  digitalSignatureDocument: {
    _id: string
    userDigitalSignature: string
  }[]
}
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}
interface docType {
  _id: string
  typeName: string
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
      field: 'createdAt',
      headerName: '',
      flex: 0.05,
      minWidth: 79,
      renderCell: ({ row }: CellType) => {
        // Suponiendo que createdAt es un campo con un formato de fecha válido
        const date = new Date(row.createdAt)
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const formattedDate = date.toLocaleDateString()

        return (
          <Box textAlign='center'>
            <Typography variant='body1'>{formattedTime}</Typography>
            <Typography variant='caption'>{formattedDate}</Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.01,
      minWidth: 60,
      field: 'actions',
      headerName: '',
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} title={row.title} />
    },

    {
      flex: 0.01,
      minWidth: 90,
      sortable: false,
      field: 'active',
      headerName: '',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'left' }}>
          <Tooltip title='Ver'>
            <IconButton size='small' sx={{ mr: 3 }}>
              <Base64 id={row._id} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Editar'>
            <IconButton size='small' sx={{ mr: 0.5 }}>
              <EditDocDrawer docId={row._id} />
            </IconButton>
          </Tooltip>
          {/*
          <Tooltip title='Eliminar documento'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => dispatch(deleteDoc(row._id))}>
              <FaRegTrashAlt size={20} />
            </IconButton>
          </Tooltip>

          <OptionsMenu
            iconProps={{ fontSize: 20 }}
            iconButtonProps={{ size: 'small' }}
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            options={[
              {
                text: 'Download',
                icon: <Icon icon='mdi:download' fontSize={20} />
              },
              {
                text: 'Edit',
                href: `/apps/invoice/edit/${row._id}`,
                icon: <Icon icon='mdi:pencil-outline' fontSize={20} />
              },
              {
                 text: 'Duplicate',
                icon: <Icon icon='mdi:content-copy' fontSize={20} />
              }
            ]}
          />  */}
        </Box>
      )
    },

    {
      field: 'eliminar',
      headerName: '',
      flex: 0.01,
      minWidth: 50,
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
    },

    {
      field: 'action',
      headerName: 'Enviar',
      flex: 0.1,
      minWidth: 100,
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
*/
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
      minWidth: 120,
      headerName: 'Referencia',
      field: 'documentationType',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.documentationType.typeName}
          </Typography>
        )
      }
    },
    {
      field: 'digitalSignature',
      headerName: 'Firma Digital',
      flex: 0.1,
      minWidth: 180,
      renderCell: ({ row }: CellType) => {
        return (
          <Button variant='text' color='primary' onClick={() => handleDigitalButtonClick(row._id)}>
            Añadir Firma Digital
          </Button>
        )

        {
          /*else {
          return
             <Button variant='text' color='primary'>
              Derivar
          </Button>*/
        }
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
      field: 'digitalSignatureDocument',
      headerName: 'Firma Digital',
      flex: 0.1,
      minWidth: 110,
      renderCell: ({ row }: CellType) => {
        if (row.digitalSignatureDocument.length !== 0) {
          return (
            <Button variant='text' color='success'>
              Con Firma
            </Button>
          )
        } else {
          return (
            <Button variant='text' color='error'>
              Sin Firma
            </Button>
          )
        }
      }
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
    },
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

  //const [pageSize, setPageSize] = useState<number>(10)

  const [groupTypes, setgroupTypes] = React.useState<docType[]>([])

  const getTypeDoc = async () => {
    try {
      const response = await axios.get<docType[]>(`${process.env.NEXT_PUBLIC_DOCUMENTATION_TYPE}active`)

      console.log(response.data)
      setgroupTypes(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getTypeDoc()
  }, [])

  const [groupDocumentType, setGroupDocumentType] = useState<docType | null[]>([])

  const [addDocOpen, setAddUserOpen] = useState<boolean>(false)
  const [addCredenciales, setAddCredenciales] = useState<boolean>(false)

  // ** Hooks
  const [startDate, setStartDate] = useState('') // Declaración de startDate

  const [plan, setPlan] = useState<string>('')
  const [typeName, setTypeName] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  const [view, setView] = useState<string>('EN ESPERA')
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

  const store = useSelector((state: RootState) => state.doc.data)
  console.log(store)
  const totalDocs = useSelector((state: RootState) => state.doc.total)
  //console.log(totalDocs)
  const totalpages = useSelector((state: RootState) => state.doc.totalPages)
  //console.log(totalpages)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddDocDrawer = () => setAddUserOpen(!addDocOpen)
  const toggleAddCredenciales = () => setAddCredenciales(!addCredenciales)

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

  const handleDocTypeChange = useCallback((e: SelectChangeEvent) => {
    setTypeName(e.target.value)
  }, [])

  const handlePlanChange = useCallback((e: SelectChangeEvent) => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setStatus(e.target.value)
  }, [])
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Buscar por Filtros' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='documentationType'>Tipo de documento</InputLabel>
                  <Select
                    fullWidth
                    value={typeName}
                    id='documentationType'
                    label='Tipo de documento'
                    labelId='documentationType'
                    onChange={handleDocTypeChange}
                    inputProps={{ placeholder: 'Seleccionar Tipo de documento' }}
                  >
                    <MenuItem value=''>Seleccione el tipo de documento</MenuItem>
                    {groupTypes.map(type => (
                      <MenuItem key={type._id} value={type.typeName}>
                        {type.typeName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='plan-select'>Con/Sin Firma Digital</InputLabel>
                  <Select
                    fullWidth
                    value={plan}
                    id='select-digitalSignature'
                    label='Con/Sin Firma Digital'
                    labelId='plan-select'
                    onChange={handlePlanChange}
                    inputProps={{ placeholder: 'Select Plan' }}
                  >
                    <MenuItem value=''>Select Plan</MenuItem>
                    <MenuItem value='basic'>Basic</MenuItem>
                    <MenuItem value='company'>Company</MenuItem>
                    <MenuItem value='enterprise'>Enterprise</MenuItem>
                    <MenuItem value='team'>Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <TextField
                    label='Filtrado por fecha'
                    type='date'
                    InputLabelProps={{
                      shrink: true
                    }}
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
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
          <DataGrid
            getRowId={row => row._id}
            autoHeight
            rows={store || []}
            columns={columns}
            pageSize={limit}
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
                      <Select value={limit} onChange={e => setLimit(Number(e.target.value))}>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                      </Select>
                    </FormControl>
                    <Pagination count={totalpages || 1} page={page} onChange={(event, value) => setPage(value)} />
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
