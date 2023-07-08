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
import { DataGrid } from '@mui/x-data-grid'
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
import User, { deleteUser, fetchData } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports

import TableHeader from 'src/pages/Peticiones/TableHeader'
import AddUserDrawer from 'src/pages/Peticiones/AddUserDrawer'
import EditDocDrawer from 'src/pages/Peticiones/EditDocDrawer'
import DocViewLeft from 'src/pages/Peticiones/DocViewLeft'

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}
interface Docu {
  _id: string
  numberDocument: string
  title: string
  authorDocument: {
    name: string
    ci: string
    email: string
    phone: string
    nationality: string
  }
  documentationType: {
    typeName: string
  }
  documentDestinations: {
    nameOrganigrama: string
  }[]
  description: string
  fileRegistrer: {
    _id: string
    filename: string
    size: number
    filePath: string
    status: string
    category: string
    extension: string
  }

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
interface UserStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: Docu
}

const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// ** renders client column

const RowOptions = ({ id }: { id: string }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [selectedId, setSelectedId] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setSelectedId(id)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
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
    dispatch(deleteUser(id))
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
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
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
    minWidth: 120,
    field: 'authorDocument',
    headerName: 'Autor',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography variant='subtitle2' noWrap sx={{ textTransform: 'capitalize' }}>
          {row.authorDocument.name}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    field: 'title',
    minWidth: 120,
    headerName: 'Titulo',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.title}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 210,
    headerName: 'Descripcion',
    field: 'description',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.description}
        </Typography>
      )
    }
  },

  {
    flex: 0.2,
    minWidth: 130,
    headerName: 'Referencia',
    field: 'documentType',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.documentationType.typeName}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 130,
    headerName: 'Destino',
    field: 'documentDestinations',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.documentDestinations[0].nameOrganigrama}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'stateDocument ',
    headerName: 'Estado',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.stateDocument}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    }
  },

  {
    flex: 0.15,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row._id} />
  }
]

// ** State
const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(
      fetchData({
        role,
        status,
        q: value,
        currentPlan: plan
      })
    )
  }, [dispatch, plan, role, status, value])

  const store = useSelector((state: RootState) => state.user)
  console.log(store)
  //console.log(apiData)

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />

          <DataGrid
            getRowId={row => row._id}
            autoHeight
            rows={store.data}
            columns={columns}
            checkboxSelection
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

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL}active`)
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
