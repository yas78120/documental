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
interface Provider {
  _id: string
  assetCategory: string
  usefulLife: number
  asset: boolean
}

const ProviderList: React.FC = () => {
  const [provider, setProvider] = useState<Provider[]>([])

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

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
              <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                CATEGORIA DE ACTIVOS
              </TableCell>
              <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                VIDA UTIL
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
