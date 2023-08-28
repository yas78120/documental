import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Button } from '@mui/material'
import axios from 'axios'

interface StepOption {
  _id: string
  step: string
  // Otros campos si los hay
}
interface workflow {
  nombre: string
  descriptionWorkflow: string
  stepName: string
  // Otros campos si los hay
}

const AddForkflow = () => {
  // Estado para el componente de entrada de texto
  const [nombre, setNombre] = useState('')
  const [descriptionWorkflow, setDescriptionWorkflow] = useState('')
  const [stepName, setStepName] = useState('')

  // Estado para controlar el menú abierto/cerrado
  const [menuOpen, setMenuOpen] = useState(false)

  // Estado para las opciones cargadas desde la API
  const [apiOptions, setApiOptions] = useState<StepOption[]>([])

  const handledescriptionWorkflowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionWorkflow(event.target.value)
  }

  // Manejadores de cambio para los componentes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(event.target.value)
  }

  const handleOptionChange = (event: SelectChangeEvent<string>) => {
    setStepName(event.target.value)
    setMenuOpen(false) // Cerrar el menú al seleccionar una opción
  }

  // Efecto para cargar las opciones desde la API
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_DOCUMENTAL_STEP}active`)
      .then(response => response.json())
      .then(data => {
        setApiOptions(data)
      })
      .catch(error => {
        console.error('Error al cargar las opciones:', error)
      })
  }, [])

  const handleSubmit = () => {
    const data: workflow = {
      nombre: nombre,
      descriptionWorkflow: descriptionWorkflow,
      stepName: stepName
      // Agregar otros campos si los hay
    }

    // Realizar la petición POST a la API
    console.log(data)
    axios
      .post(`${process.env.NEXT_PUBLIC_DOCUMENTAL_WORKFLOW}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Respuesta de la API:', response.data)
        // Realizar cualquier acción adicional después de la petición
        setNombre('')
        setDescriptionWorkflow('')
        setStepName('')
      })
      .catch(error => {
        console.error('Error al realizar la petición POST:', error)
      })
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '10vh' }}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '800px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Flujo de trabajo</h2>
        </div>
        {/* Componentes en una fila */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <TextField label='Nombre' variant='outlined' fullWidth value={nombre} onChange={handleInputChange} />
          <TextField
            label='Descripcion'
            variant='outlined'
            fullWidth
            value={descriptionWorkflow}
            onChange={handledescriptionWorkflowChange}
          />
          {/* Componente de selección única */}
          <FormControl variant='outlined' fullWidth>
            <InputLabel>Seleccionar Opción</InputLabel>
            <Select
              value={stepName}
              onChange={handleOptionChange}
              label='Seleccionar Step'
              open={menuOpen} // Controlar la apertura/cierre del menú
              onClose={() => setMenuOpen(false)} // Cerrar el menú cuando se hace clic fuera de él
              onOpen={() => setMenuOpen(true)} // Abrir el menú cuando se hace clic en él
            >
              {apiOptions.map(option => (
                <MenuItem key={option._id} value={option.step}>
                  {option.step}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant='contained' color='primary' onClick={handleSubmit}>
            Enviar
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddForkflow
