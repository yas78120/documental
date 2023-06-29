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
import SidebarProviderUser from './addprovider'
import SidebarAddProvider from './addprovider'
import SidebarEditProvider from './editprovider'

interface Provider {
  _id: string
  assetCategory: string
  usefulLife: number
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
      .get<Provider[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/`)
      .then(response => {
        setProvider(response.data)
      })
      .catch(error => {
        console.error(error)
      })
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
      <Button onClick={toggleAddproviderDrawer}>NUEVA DEPRECIACION</Button>
      <SidebarAddProvider open={addproviderOpen} toggle={toggleAddproviderDrawer} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
              <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                Nombre De Categoria
              </TableCell>
              <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                Vida Util
              </TableCell>
            </TableRow>
          </TableHead>
          {provider.map(provider => (
            <TableBody key={provider._id}>
              <TableRow>
                <TableCell style={{ width: '100px' }} sx={{ textAlign: 'center' }}>
                  {provider.assetCategory}
                </TableCell>
                <TableCell style={{ width: '100px' }} sx={{ textAlign: 'center' }}>
                  {provider.usefulLife}
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
