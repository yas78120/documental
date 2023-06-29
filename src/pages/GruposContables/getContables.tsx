import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Button,
  ThemeProvider,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  ButtonGroup,
  Paper
} from '@mui/material'
import TextField from '@mui/material/TextField'
import SidebarProviderUser from './addContables'
import SidebarAddProvider from './addContables'
import SidebarEditProvider from './editContables'

interface Provider {
  _id: string
  name: string
  categoria: string
  descripcion: string
  presupuesto: number
  asset: boolean
}

const ProviderList: React.FC = () => {
  const [provider, setProvider] = useState<Provider[]>([])
  const [providervider, setprovidervider] = useState<Provider | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const [addproviderOpen, setAddproviderOpen] = useState<boolean>(false)
  const toggleAddproviderDrawer = () => setAddproviderOpen(!addproviderOpen)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    console.log('fetchData')
    axios
      .get<Provider[]>(`https://falling-wildflower-5373.fly.dev/contables`)
      .then(response => {
        // setProvider(response.data)
        const filteredproviders = response.data.filter(provider => provider.asset)
        setProvider(filteredproviders)
        console.log(provider)
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleDelete = async (id: string) => {
    await axios
      .delete(`https://falling-wildflower-5373.fly.dev/contables/${id}`)
      .then(response => {
        console.log(response.data)
        fetchData()
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleEdit = (provider: Provider) => {
    setprovidervider(provider)
  }

  const handleCancel = () => {
    setprovidervider(null)
  }

  const handleInputChange = (e: React.ChangeEvent<{ name: string; value: string }>) => {
    if (providervider) {
      setprovidervider({ ...providervider, [e.target.name]: e.target.value })
    }
  }

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <>
      <Button onClick={toggleAddproviderDrawer}>NUEVO GRUPO CONTABLES</Button>
      <SidebarAddProvider open={addproviderOpen} toggle={toggleAddproviderDrawer} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
              <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                NOMBRE
              </TableCell>
              <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                CATEGORIA
              </TableCell>
              <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                DESCRIPCION
              </TableCell>
              <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                PRESUPUESTO
              </TableCell>
              <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHead>
          {provider.map(provider => (
            <TableBody key={provider._id}>
              <TableRow>
                <TableCell style={{ width: '100px' }} sx={{ textAlign: 'center' }}>
                  {provider.name}
                </TableCell>

                <TableCell style={{ width: '100px' }} sx={{ textAlign: 'center' }}>
                  {provider.categoria}
                </TableCell>
                <TableCell style={{ width: '100px' }} sx={{ textAlign: 'center' }}>
                  {provider.descripcion}
                </TableCell>
                <TableCell style={{ width: '100px' }} sx={{ textAlign: 'center' }}>
                  {provider.presupuesto}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <ButtonGroup size='small' aria-label='small outlined button group'>
                    <SidebarEditProvider providerId={provider._id}></SidebarEditProvider>
                    <Button
                      size='small'
                      color='secondary'
                      variant='outlined'
                      onClick={() => handleDelete(provider._id)}
                    >
                      Eliminiar
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>
      </TableContainer>
    </>
  )
}

export default ProviderList
