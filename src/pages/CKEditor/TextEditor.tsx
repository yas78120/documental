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
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
//import { deleteDoc } from 'src/store/apps/user'
import User, { deleteDoc, fetchData, fetchDataRecib, fetchDataRecibWorkflow } from 'src/store/apps/doc'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports

import TableHeader from 'src/pages/Peticiones/TableHeader'
import AddUserDrawer from 'src/pages/Peticiones/AddDocDrawer'
import EditDocDrawer from 'src/pages/Peticiones/EditDocDrawer'
import DocViewLeft from 'src/pages/Peticiones/DocViewLeft'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import Base64FileViewer from 'src/pages/Peticiones/Base64FileDownload'
import DocViewText from 'src/pages/Peticiones/DocViewText'
import AddForkflow from 'src/pages/Peticiones/AddForkflow'
import AddStep from 'src/pages/Peticiones/AddStep'
import Base64 from 'src/pages/Peticiones/Base64View'
import { truncate } from 'fs'
import DeriveFile from 'src/pages/Peticiones/DeriveFile'
import Base64Download from 'src/pages/Peticiones/Base64Download'
import ObservedFile from 'src/pages/Peticiones/ObservedFile'

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}
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
  bitacoraWithoutWorkflow?: {
    nameOficeUser: string
    idOfficeUserSend: string
  }[]
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

/*
    useEffect(() => {
      fetchData()
    }, [])

    const fetchData = () => {
      axios
        .get<Docu[]>(`${process.env.NEXT_PUBLIC_DOCUMENTAL}active`)
        .then(response => {
          setAssets(response.data)
        })
        .catch(error => {
          console.error(error)
        })
    }
    */

/*const handleDelete = (_id: string) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_DOCUMENTAL + _id}/inactive`)
      .then(response => {
        console.log('se elimino con exito' + response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }
  */
interface DocStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: Docu
}

const docStatusObj: DocStatusType = {
  DERIVADO: 'success',
  RECIBIDO: 'warning',
  OBSERVADO: 'primary'
}

/*const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))*/

// ** renders client column

const RowOptions = ({ id }: { id: string }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  // ** State
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
  /*const handleDelete = (_id: string) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_DOCUMENTAL + _id}/inactive`)
      .then(response => {
        console.log('se elimino con exito' + response.data)

      })
      .catch(error => {
        console.error(error)
      })
  }*/

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
  const [deriveFileOpen, setDeriveFileOpen] = useState(false)
  const [ObservedFileOpen, setObservedFileOpen] = useState(false)

  const [selectedDocId, setSelectedDocId] = useState<string>('')

  const handleDeriveButtonClick = (docId: string) => {
    setSelectedDocId(docId) // Guarda el ID del documento seleccionado
    setDeriveFileOpen(true)
  }

  const handleObservedButtonClick = (docId: string) => {
    setSelectedDocId(docId) // Guarda el ID del documento seleccionado
    setObservedFileOpen(true)
  }

  const columns: GridColDef[] = [
    {
      flex: 0.07,
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
      minWidth: 120,
      headerName: 'Remitente',
      field: 'userInfo',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography
              variant='body2'
              sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'capitalize' }}
            >
              {row.userInfo?.name}
            </Typography>
            <Typography
              variant='body2'
              sx={{ color: 'text.secondary', textTransform: 'lowercase', fontSize: '0.8rem' }}
            >
              {row.userInfo?.unity}
            </Typography>
          </Box>
        )
      }
    },
    /*
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Estado',
      field: 'stateDocumetUser',
      renderCell: ({ row }: CellType) => {
        const formattedState =
          row.stateDocumetUser.charAt(0).toUpperCase() + row.stateDocumetUser.slice(1).toLowerCase()

        return (
          <CustomChip
            skin='light'
            size='small'
            label={formattedState}
            color={docStatusObj[row.stateDocumetUser]}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
*/
    /*
    {
      field: 'action', // O el nombre que desees
      headerName: 'Derivar', // O el título que desees
      flex: 0.1,
      minWidth: 92,
      renderCell: ({ row }: CellType) => {
        if (row.stateDocumetUser !== 'DERIVADO' && row.bitacoraWithoutWorkflow?.length === 0) {
          return (
            <Button variant='text' color='primary' onClick={() => handleDeriveButtonClick(row._id)}>
              Derivar
            </Button>
          )
        } else {
          return (
            <Button variant='text' color='primary' disabled>
              Finalizado
            </Button>
          )
        }
      }
    },
    */
    {
      field: 'ObservarDocument',
      headerName: 'Observar',
      flex: 0.01,
      minWidth: 105,
      renderCell: ({ row }: CellType) => {
        if (row.stateDocumetUser !== 'DERIVADO' && row.bitacoraWithoutWorkflow?.length === 0) {
          return (
            <Button
              variant='text'
              color='primary'
              onClick={() => handleObservedButtonClick(row._id)}
              sx={{ color: 'red' }} // Establece el color del texto en rojo
            >
              Observar
            </Button>
          )
        } else {
          return (
            <Button variant='text' color='primary' disabled>
              Finalizado
            </Button>
          )
        }
      }
    },
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

  // ** State
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)

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

  //console.log(combinedData)
  //const combinedData = [...new Set([...fetchDataRecib, ...fetchDataRecibWorkflow])];

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {deriveFileOpen && (
          <DeriveFile
            open={deriveFileOpen}
            toggle={() => setDeriveFileOpen(false)} // Función para cerrar SendFile
            docId={selectedDocId} // Pasa el ID del documento seleccionado
          />
        )}
        {ObservedFileOpen && (
          <ObservedFile
            open={ObservedFileOpen}
            toggle={() => setObservedFileOpen(false)} // Función para cerrar SendFile
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

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export default DocList
