import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ThemeColor } from 'src/@core/layouts/types';

export interface UserData {
  name: string;
  lastName: string;
  ci: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  unity: string;
  charge: string;
  schedule: string;
  file: any;
  _id: string;
  isActive: boolean;
}

interface UserState {
  data: UserData | null;
  list: UserData[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  data: null,
  list: [],
  status: 'idle',
  error: null
};

// Thunk para agregar usuario
export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData: UserData) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL}`, userData);
    return response.data;
  }
);

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (): Promise<UserData[]> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL}`);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list.push(action.payload);
        state.data = action.payload;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  }
});

export default userSlice.reducer;



/*// ** Next Imports
import Router, { useRouter } from 'next/router';

// ** MUI Imports
import Image from 'next/image'

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

// ** Custom Table Components Imports
import { Button, Dialog, TableCell, TextField, Tooltip } from '@mui/material'
import { blue } from '@mui/material/colors';
import Icon from 'src/@core/components/icon';
import { LayoutProps } from '../../../@core/layouts/types';

// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'
import user, { fetchUsers } from 'src/store/apps/user/index';


// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { AppDispatch } from 'src/redux/store';

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
// import { fetchData, deactivateUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeaderUser'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import SidebarEditUser from 'src/views/apps/user/list/EditUserDrawer'
import { rows } from 'src/@fake-db/table/static-data';

// Interfaces
interface Docu {
  _id: string;
  name: string;
  lastName: string;
  ci: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  unity: string;
  charge: string;
  schedule: string;
  file: string;
  isActive: boolean;
  avatarColor?: ThemeColor;
}


interface CellType {
  row: Docu
}

interface UserStatusType {
  [key: string]: ThemeColor
}

// Componente Principal
const UserList = () => {
  // ** State
  // const [data, setData] = useState<Docu[]>([])
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // const dispatch = useDispatch();
  const dispatch = useDispatch<AppDispatch>()
  const users: Docu[] = useSelector((state: RootState) => state.users.list);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);


  const userStatusObj: UserStatusType = {
    activo: 'success',
    inactivo: 'secondary'
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

  const convertBase64ToImageUrl = (base64String: string) => {
    return `data:image/png;base64,${base64String}`
  }

  const renderClient = (row: Docu) => {
    let imageSrc = convertBase64ToImageUrl(row.file);
    if (row.file) {
      return <CustomAvatar src={imageSrc} sx={{ mr: 3, width: 34, height: 34 }} />;
    } else {
      return (
        <CustomAvatar
          skin='light'
          color={row.avatarColor || 'primary'}
          sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
        >
          {getInitials(row.name ? row.name : '')}
        </CustomAvatar>
      )
    }
  }

  const RowOptions = ({ id }: { id: number | string }) => {
    // ** Hooks
    // const dispatch = useDispatch<AppDispatch>()

    // ** State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const handleDelete = () => {
      // dispatch(deactivateUser(id))
      handleRowOptionsClose()
    }

    const handleUpdate = (userId: string) => () => {
      setSelectedUserId(userId);
      setEditUserOpen(true);
    };

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

          <MenuItem onClick={handleUpdate(id.toString())} sx={{ '& svg': { mr: 2 } }}>
            Editar
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:delete-outline' fontSize={20} />
            Dar de Baja
          </MenuItem>
        </Menu>
      </>
    )
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const toggleEditUserDrawer = () => setEditUserOpen(!editUserOpen)
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'fullName',
      headerName: 'Usuario',
      renderCell: ({ row }: CellType) => {
        const { name, lastName } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/user/usuario/view/${row._id}/`}>{[name, ' ', lastName]}</StyledLink>
            </Box>
          </Box>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'ci',
      headerName: 'CI',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.ci}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.email}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'phone',
      headerName: 'Celular',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.phone}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'address',
      headerName: 'Direccion',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.address}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'nationality',
      headerName: 'Nacionalidad',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography title={row.nationality} noWrap variant='body2'>
            {row.nationality}
          </Typography>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Estado',
      renderCell: ({ row }: CellType) => {
        const status = row.isActive ? 'activo' : 'inactivo';
        return (
          <CustomChip
            skin='light'
            size='small'
            label={status}
            color={userStatusObj[status]}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} />
    }
  ]

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
            <DataGrid
              rowHeight={60}
              getRowId={row => row._id}
              autoHeight
              rows={users}
              columns={columns}
              // checkboxSelection
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              sx={{
                '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }, '& .MuiDataGrid-window': {
                  overflow: 'hidden'
                }
              }}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
            />
          </Card>
        </Grid>
        <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
        {selectedUserId && <SidebarEditUser userId={selectedUserId} open={editUserOpen} toggle={() => setEditUserOpen(false)} />}
      </Grid>
    </>
  )
}

export default UserList*/