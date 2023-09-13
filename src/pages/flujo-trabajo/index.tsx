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
import AddDocDrawer from 'src/pages/Peticiones/AddDocDrawer'
import EditDocDrawer from 'src/pages/Peticiones/EditDocDrawer'
import DocViewLeft from 'src/pages/Peticiones/DocViewLeft'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import Base64FileViewer from 'src/pages/Peticiones/Base64FileViewer'
import DocViewText from '../Peticiones/DocViewText'
import AddForkflow from '../Peticiones/AddForkflow'
import AddStep from '../Peticiones/AddStep'

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

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NGU3Yzc4N2VlYzEyNmQ2Y2I1NDI5NmUiLCJBcHAiOnsiMCI6eyJ1dWlkIjoiZjE0MTQ0N2EtZGRmMC00OTJhLWE0ZGItOWQ4M2UzYjdiYTkwIiwibmFtZSI6Imdlc3Rpb24tZG9jdW1lbnRhbCIsInVybCI6Imh0dHA6Ly8xMC4xMC4yMTQuMTY3OjMzMDAvaG9tZSJ9fSwicm9sZXMiOlsiNjRlNTA2NmM5OTNjYmI0ZDBhODUzM2NkIiwiNjRlNjU4OTQxNmE0Yjg4NGM2ZDg5NTVkIl0sImlhdCI6MTY5MzQ5MjI5NywiZXhwIjoxNjkzNTA2Njk3fQ.Y5ZGrgRDpeSHItVHZYisFRnF24HQ3SUzOzojhec7Y2I'
console.log(token)

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

const columns: GridColDef[] = [
  {
    flex: 0.0,
    minWidth: 100,
    field: 'actions',
    headerName: 'Opciones',
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

  {
    field: 'fileBase64',
    headerName: 'Archivo',
    flex: 0.2,
    minWidth: 150,
    renderCell: ({ row }) => {
      // Verificar si fileRegistrer está definido antes de acceder a la propiedad file

      if (row.fileRegister) {
        return <Base64FileViewer base64={row.fileBase64} />
      } else {
        return <div>No hay archivo adjunto</div>
      }
    }
  }
]

// ** State
const DocList = () => {
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addDocOpen, setAddDocOpen] = useState<boolean>(false)

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
  console.log(store)
  //console.log(apiData)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddDocDrawer = () => setAddDocOpen(!addDocOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <AddForkflow />
        </Card>
        <Card>
          <AddStep />
        </Card>
      </Grid>

      <AddDocDrawer open={addDocOpen} toggle={toggleAddDocDrawer} />
    </Grid>
  )
}

export default DocList
