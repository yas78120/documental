import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import { Autocomplete, Button } from '@mui/material'
import axios from 'axios'
import { fetchData } from 'src/store/apps/doc'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { addWorkflow } from 'src/store/apps/workflow'

interface Workflow {
  nombre: string
  descriptionWorkflow: string
  pasos: {
    paso: number
    oficina: string
  }[]
}

interface Office {
  id: number
  name: string
}

const AddWorkflow = () => {
  const [nombre, setNombre] = useState('')
  const [descriptionWorkflow, setDescriptionWorkflow] = useState('')
  const [offices, setOffices] = useState<Office[]>([])
  const [workflowSteps, setWorkflowSteps] = useState<{ paso: number; oficina: string }[]>([])
  const [selectedOffices, setSelectedOffices] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch<AppDispatch>()

  const fetchOffice = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DOCUMENTAL_ORGANIGRAMA}`)
      setOffices(response.data)
    } catch (error) {
      console.error('Error al obtener la lista de oficinas:', error)
    }
  }

  useEffect(() => {
    fetchOffice()
    const defaultSteps = [
      { paso: 1, oficina: '' },
      { paso: 2, oficina: '' }
    ]
    setWorkflowSteps(defaultSteps)
  }, [])

  const handleAddStep = () => {
    const newStep = {
      paso: workflowSteps.length + 1,
      oficina: ''
    }
    setWorkflowSteps([...workflowSteps, newStep])
  }

  const handleRemoveStep = (index: number) => {
    const updatedSteps = [...workflowSteps]
    updatedSteps.splice(index, 1)

    // Remove the selected office from the selectedOffices array
    const removedOffice = selectedOffices[index]
    const updatedSelectedOffices = selectedOffices.filter(office => office !== removedOffice)
    setSelectedOffices(updatedSelectedOffices)

    // Renumber the remaining steps
    /*
    for (let i = index; i < updatedSteps.length; i++) {
      updatedSteps[i].paso = i + 1
    }
*/
    setWorkflowSteps(updatedSteps)
  }

  const handleOfficeChange = (event: React.ChangeEvent<{}>, value: string | null, index: number) => {
    if (value === null) {
      return
    }

    const selectedOffice = value

    // Check if the selected office is already selected in other steps
    if (selectedOffices.includes(selectedOffice)) {
      alert('Esta oficina ya ha sido seleccionada en otro paso. Por favor, elija una oficina diferente.')
      return
    }

    const updatedSteps = [...workflowSteps]
    updatedSteps[index].oficina = selectedOffice
    setWorkflowSteps(updatedSteps)

    // Update the selectedOffices array
    setSelectedOffices([...selectedOffices.slice(0, index), selectedOffice, ...selectedOffices.slice(index + 1)])

    // Clear the search term when an office is selected
    setSearchTerm('')
  }

  const handleSubmit = async () => {
    const data: Workflow = {
      nombre: nombre,
      descriptionWorkflow: descriptionWorkflow,
      pasos: workflowSteps
    }
    console.log(data)
    dispatch(addWorkflow({ ...data }))

    setNombre('')
    setDescriptionWorkflow('')
    setWorkflowSteps([])

    const defaultSteps = [
      { paso: 1, oficina: '' },
      { paso: 2, oficina: '' }
    ]
    setWorkflowSteps(defaultSteps)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '10vh' }}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '800px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Flujo de trabajo</h2>
        </div>
        <TextField
          label='Nombre'
          variant='outlined'
          fullWidth
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <TextField
          label='Descripción'
          variant='outlined'
          fullWidth
          value={descriptionWorkflow}
          onChange={e => setDescriptionWorkflow(e.target.value)}
        />
        <div style={{ textAlign: 'left' }}>
          <h3>Pasos que debe seguir el workflow</h3>
        </div>
        {workflowSteps.map((paso, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              alignItems: 'center'
            }}
          >
            <TextField
              label={`Paso`}
              variant='outlined'
              style={{ width: '100px', textAlign: 'center' }}
              value={paso.paso.toString()}
              disabled
            />
            <Autocomplete
              options={offices
                .filter(office => !selectedOffices.includes(office.name))
                .filter(office => office.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(office => office.name)}
              value={paso.oficina || undefined}
              onChange={(event, value) => handleOfficeChange(event, value, index)}
              disableClearable
              renderInput={params => (
                <TextField
                  {...params}
                  label='Oficina'
                  variant='outlined'
                  style={{ width: '300px' }}
                  InputProps={{
                    ...params.InputProps
                  }}
                />
              )}
            />
            <Button variant='outlined' color='error' onClick={() => handleRemoveStep(index)}>
              Eliminar Paso
            </Button>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button variant='outlined' color='primary' style={{ width: '200px' }} onClick={handleAddStep}>
            Agregar Paso
          </Button>
          <Button variant='contained' color='primary' style={{ width: '200px' }} onClick={handleSubmit}>
            Crear Workflow
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddWorkflow
