import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Grid, TextField, ThemeProvider, Paper, Box } from '@mui/material'
import themeConfig from 'src/configs/themeConfig'

interface Docu {
  _id: string
  numberDocument: string
  title: string
  authorDocument: string
  digitalUbication: string
  documentType: string
  stateDocument: string
  nivelAcces: string
  description: string
  tags: []
  keywords: []
  expirationDate: string
}

const AssetList: React.FC = () => {
  const [assets, setAssets] = useState<Docu[]>([])
  const [editedAsset, setEditedAsset] = useState<Docu | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = () => {
    axios
      .get<Docu[]>('https://spring-water-3280.fly.dev/documents')
      .then(response => {
        setAssets(response.data)
        console.log(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleDelete = async (id: string) => {
    await axios
      .delete(`https://spring-water-3280.fly.dev/documents/${id}`)
      .then(response => {
        console.log(response.data)
        fetchData()
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleEdit = (asset: Docu) => {
    setEditedAsset(asset)
  }

  const handleSave = () => {
    if (editedAsset) {
      console.log(editedAsset)
      axios
        .patch(`https://spring-water-3280.fly.dev/documents/${editedAsset._id}`, editedAsset)
        .then(response => {
          console.log(response.data)
          setEditedAsset(null)
          fetchData()
        })
        .catch(error => {
          console.error(error)
        })
    }
  }

  const handleCancel = () => {
    setEditedAsset(null)
  }

  const handleInputChange = (e: React.ChangeEvent<{ name: string; value: string }>) => {
    if (editedAsset) {
      setEditedAsset({ ...editedAsset, [e.target.name]: e.target.value })
    }
  }

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeProvider theme={themeConfig}>
      <div>
        <h1>LISTA DE DOCUMENTOS</h1>
        <Grid container spacing={2}>
          {assets.map(asset => (
            <Grid item xs={12} key={asset._id}>
              {editedAsset && editedAsset._id === asset._id ? (
                <Paper elevation={3} sx={{ padding: '10px' }}>
                  
                  
                </Paper>
              ) : (
                <Paper elevation={3} sx={{ padding: '10px', marginBottom: '10px' }}>
                  <Box sx={{ marginBottom: '10px' }}>
                    <strong>Nombre:</strong> {asset.numberDocument}
                  </Box>
                  <Box sx={{ marginBottom: '10px' }}>
                    <strong>Titulo:</strong> {asset.title}
                  </Box>
                  <Box sx={{ marginBottom: '10px' }}>
                    <strong>Autor:</strong> {asset.authorDocument}
                  </Box>
                  <Box sx={{ marginBottom: '10px' }}>
                    <strong>Ubicacion:</strong> {asset.digitalUbication}
                  </Box>
                  <Box sx={{ marginBottom: '10px' }}>
                    <strong>Tipo de documento:</strong> {asset.documentType}
                  </Box>
                  <Box sx={{ marginBottom: '10px' }}>
                    <strong>Estado:</strong> {asset.stateDocument}
                  </Box>
                  <Box sx={{ marginBottom: '10px' }}>
                    <strong>Nivel de acceso:</strong> {asset.nivelAcces}
                  </Box>
                  <Box sx={{ marginBottom: '10px' }}>
                    <strong>Description:</strong> {asset.description}
                  </Box>
                  <Box sx={{ marginBottom: '10px' }}>
                    <strong>Etiquetas:</strong> {asset.tags}
                  </Box>
                  <Box sx={{ marginBottom: '10px' }}>
                    <strong>Claves:</strong> {asset.keywords}
                  </Box>
                  <Box sx={{ marginBottom: '10px' }}>
                    <strong>Fecha de Expiracion:</strong> {asset.expirationDate}
                  </Box>
                  <Button variant='contained' color='primary' onClick={() => handleEdit(asset)}>
                    Editar
                  </Button>
                  <Button variant='contained' color='error' onClick={() => handleDelete(asset._id)}>
                    Eliminar
                  </Button>
                </Paper>
              )}
            </Grid>
          ))}
        </Grid>
        <Button variant='contained' onClick={fetchData}>
          Refrescar
        </Button>
      </div>
      
    </ThemeProvider>
    
  )
}

export default AssetList
