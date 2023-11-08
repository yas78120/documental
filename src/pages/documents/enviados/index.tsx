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
import Doc, { deleteDoc, fetchData, fetchDataSendWorkflow } from 'src/store/apps/doc'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports

import TableHeader from 'src/pages/Peticiones/TableHeader'
import AddDocDrawer from 'src/pages/Peticiones/AddDocDrawer'
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
  SelectChangeEvent,
  TextField
} from '@mui/material'
import Base64FileViewer from 'src/pages/Peticiones/Base64FileDownload'
import DocViewText from 'src/pages/Peticiones/DocViewText'
import AddForkflow from 'src/pages/Peticiones/AddForkflow'
import SendFile from 'src/pages/Peticiones/SendFileWorkflow'
import React from 'react'
import Base64 from 'src/pages/Peticiones/Base64View'
import Base64Download from 'src/pages/Peticiones/Base64Download'
import { fetchTypeDoc } from 'src/store/apps/docType'
import AddCredenciales from 'src/pages/Peticiones/AddCredenciales'

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
  bitacoraWorkflow?: {
    _id: string
    oficinaActual: string
    nameOficinaActual: string
    oficinasPorPasar?: {
      _id: string
      oficinaActual: string
      paso: string
      completado: boolean
    }
    receivedUsers?: {
      ciUser: string
      idOfUser: string
      _id: string
    }
  }
  userInfo?: {
    name: string
    unity: string
  }
  stateDocumentUserSend: string
  stateDocumetUser: string
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

interface docType {
  _id: string
  typeName: string
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
      flex: 0.08,
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
        const formattedTitle = row.title.charAt(0).toUpperCase() + row.title.slice(1).toLowerCase()

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
        const formattedDescription = row.description.charAt(0).toUpperCase() + row.description.slice(1).toLowerCase()

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
              {row.documentationType.typeName}
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Estado',
      field: 'stateDocumentUserSend',
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.stateDocumentUserSend}
            color={docStatusObj[row.stateDocumentUserSend]}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    /*
    {
      flex: 0.15,
      minWidth: 140,
      headerName: 'Oficina Actual',
      field: 'bitacoraWorkflow',
      renderCell: ({ row }: CellType) => {
        if (Array.isArray(row.bitacoraWorkflow) && row.bitacoraWorkflow.length > 0) {
          const of = row.bitacoraWorkflow.length
          const firstBitacora = row.bitacoraWorkflow[of - 1]
          if (firstBitacora?.nameOficinaActual) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography noWrap sx={{ color: 'text.secundary ', textTransform: 'capitalize' }}>
                  {firstBitacora.nameOficinaActual.charAt(0).toUpperCase() +
                    firstBitacora.nameOficinaActual.slice(1).toLowerCase()}
                </Typography>
              </Box>
            )
          }
        }
        return 'Envio Directo'
      }
    },
    /*
    {
      field: 'action', // O el nombre que desees
      headerName: 'Enviar', // O el título que desees
      flex: 0.01,
      minWidth: 110,
      renderCell: ({ row }: CellType) => (
        <Button variant='outlined' color='primary' onClick={() => handleSendButtonClick(row._id)}>
          Reenviar
        </Button>
      )
    },*/

    {
      field: 'viewDocument',
      headerName: 'Ver',
      flex: 0.01,
      minWidth: 55,
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
      minWidth: 70,
      renderCell: ({ row }) => {
        // Verificar si fileRegistrer está definido antes de acceder a la propiedad file

        if (row.fileRegister) {
          return <Base64Download id={row._id} fileName={row.title} />
        } else {
          return <div>No hay archivo adjunto</div>
        }
      }
    }
  ]

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

  const [addDocOpen, setAddDocOpen] = useState<boolean>(false)
  const [addCredenciales, setAddCredenciales] = useState<boolean>(false)

  // ** Hooks
  const [startDate, setStartDate] = useState('') // Declaración de startDate

  const [plan, setPlan] = useState<string>('')
  const [typeName, setTypeName] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  const [view, setView] = useState<string>('ENVIADOS')
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

  useEffect(() => {
    dispatch(fetchTypeDoc())
  }, [])

  const store = useSelector((state: RootState) => state.doc.data)
  console.log(store)
  const totalDocs = useSelector((state: RootState) => state.doc.total)
  const totalPages = useSelector((state: RootState) => state.doc.totalPages)

  const documentType = useSelector((state: RootState) => state.docType.data)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddCredenciales = () => setAddCredenciales(!addCredenciales)
  const toggleAddDocDrawer = () => setAddDocOpen(!addDocOpen)
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
        {sendFileOpen && (
          <SendFile
            open={sendFileOpen}
            toggle={() => setSendFileOpen(false)} // Función para cerrar SendFile
            docId={selectedDocId} // Pasa el ID del documento seleccionado
          />
        )}
        <Card>
          <CardHeader title='Buscar por Filtros' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='documentationType-select'>Tipo de documento</InputLabel>
                  <Select
                    fullWidth
                    value={typeName}
                    id='select-documentationType'
                    label='Tipo de documento'
                    labelId='documentationType-select'
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

          <DataGrid
            getRowId={row => row._id}
            autoHeight
            rows={store}
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
                    <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)} />
                  </Box>
                </>
              )
            }}
          />
        </Card>
      </Grid>
      <AddDocDrawer open={addDocOpen} toggle={toggleAddDocDrawer} />
    </Grid>
  )
}

export default DocList
