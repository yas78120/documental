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
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

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

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

// ** Custom Table Components Imports

import TableHeader from 'src/pages/Peticiones/TableHeader'
import AddDocDrawer from 'src/pages/Peticiones/AddDocDrawer'
import EditDocDrawer from 'src/pages/Peticiones/EditDocDrawer'

interface DocRoleType {
  [key: string]: { icon: string; color: string }
}
interface Docu {
  _id: string
  numberDocument: string
  title: string
  documentationType: {
    typeName: string
  }
  documentDestinations: {
    name: string
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

const AssetList: React.FC = () => {
  const [assets, setAssets] = useState<Docu[]>([])
  const [editedAsset, setEditedAsset] = useState<Docu | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [switchValue, setSwitchValue] = useState(false)

  const fetchData = () => {
    axios
      .get<Docu[]>(`${process.env.NEXT_PUBLIC_DOCUMENTAL}inactive`)
      .then(response => {
        setAssets(response.data)
        console.log(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

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
  const handleSwitchToggle = (id: string) => {
    const updatedAssets = assets.map(asset => {
      if (asset._id === id) {
        return { ...asset, active: !asset.active }
      }
      return asset
    })
    setAssets(updatedAssets)
  }

  const RowOptions = ({ id, onSwitchToggle }: { id: string; onSwitchToggle: (id: string) => void }) => {
    const dispatch = useDispatch()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [switchValue, setSwitchValue] = useState(false)

    const handleSwitchToggle = () => {
      setDialogOpen(true)
    }

    const handleDialogConfirm = async () => {
      setDialogOpen(false)
      onSwitchToggle(id)

      const response = await axios.put(`${process.env.NEXT_PUBLIC_DOCUMENTAL}active/${id}`)
      console.log(response + 'se agrego con exito')
      fetchData()
    }

    const handleDialogCancel = () => {
      setDialogOpen(false)
      // Revert switch state if necessary
      setSwitchValue(false)
    }

    return (
      <div>
        <FormControlLabel control={<Switch checked={switchValue} onChange={handleSwitchToggle} />} label='Activar' />

        <Dialog open={dialogOpen} onClose={handleDialogCancel}>
          <DialogTitle>Confirmacion</DialogTitle>
          <DialogContent>
            <Typography>Estas seguro de activar el documento?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogCancel}>Cancelar</Button>
            <Button onClick={handleDialogConfirm} variant='contained' color='primary'>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  // ** renders client column

  const columns = [
    {
      flex: 0.06,
      minWidth: 100,
      field: 'numberDocument',
      headerName: 'DOCUMENTO',
      renderCell: ({ row }: CellType) => {
        const { numberDocument } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href='/apps/Doc/view/overview/'>{numberDocument}</StyledLink>
              <Typography noWrap variant='caption'></Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      field: 'title',
      minWidth: 160,
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
      flex: 0.13,
      minWidth: 200,
      headerName: 'Descripcion',
      field: 'currentPlan',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
            {row.description}
          </Typography>
        )
      }
    },
    {
      flex: 0.06,
      minWidth: 90,
      field: 'status',
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
      flex: 0.08,
      minWidth: 110,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} onSwitchToggle={handleSwitchToggle} />
    }
  ]

  // ** State

  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addDocOpen, setAddDocOpen] = useState<boolean>(false)

  // ** Hooks

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddDocDrawer = () => setAddDocOpen(!addDocOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <DataGrid
            getRowId={row => row._id}
            autoHeight
            rows={assets}
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

      <AddDocDrawer open={addDocOpen} toggle={toggleAddDocDrawer} />
    </Grid>
  )
}

export default AssetList
