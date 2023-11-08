/*import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import axios from 'axios'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

interface Step {
  paso: number
  oficina: string
}

interface Office {
  id: number
  name: string
}

interface StepData {
  step: string
  descriptionStep: string
  pasos: Step[]
}

const CreateStepComponent = () => {
  const [stepData, setStepData] = useState<StepData>({
    step: '',
    descriptionStep: '',
    pasos: []
  })

  const [offices, setOffices] = useState<Office[]>([])

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_DOCUMENTAL_ORGANIGRAMA}`)
      .then(response => {
        setOffices(response.data)
        //console.log(response.data)
      })
      .catch(error => {
        console.error('Error al obtener la lista de oficinas:', error)
      })
  }, [])

  const handleStepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStepData({
      ...stepData,
      step: event.target.value
    })
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStepData({
      ...stepData,
      descriptionStep: event.target.value
    })
  }

  const handleOficinaChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const selectedOfficeId = event.target.value
    console.log('Selected Office ID:', selectedOfficeId)

    const newPasos = [...stepData.pasos]
    newPasos[index] = { ...newPasos[index], oficina: event.target.value }

    setStepData({
      ...stepData,
      pasos: newPasos
    })
  }

  //
  const handleAddPaso = () => {
    if (stepData.pasos.length < 10) {
      setStepData({
        ...stepData,
        pasos: [...stepData.pasos, { paso: stepData.pasos.length + 1, oficina: '' }]
      })
    }
  }

  const handleRemovePaso = (index: number) => {
    const newPasos = [...stepData.pasos]
    newPasos.splice(index, 1)

    for (let i = index; i < newPasos.length; i++) {
      newPasos[i].paso = i + 1
    }

    setStepData({
      ...stepData,
      pasos: newPasos
    })
  }
//
  const fetchStep = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_DOCUMENTAL_STEP}active`)
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleCreateStep = () => {
    console.log(stepData)
    axios
      .post(`${process.env.NEXT_PUBLIC_DOCUMENTAL_STEP}`, stepData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        fetchStep()
        console.log('Respuesta de la API:', response.data)
        setStepData({
          step: '',
          descriptionStep: '',
          pasos: []
        })
      })
      .catch(error => {
        console.error('Error al realizar la petición POST:', error)
      })
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '800px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Crear Pasos</h2>
        </div>
        <TextField label='Step' variant='outlined' fullWidth value={stepData.step} onChange={handleStepChange} />
        <TextField
          label='Descripción'
          variant='outlined'
          fullWidth
          value={stepData.descriptionStep}
          onChange={handleDescriptionChange}
        />
        {stepData.pasos.map((paso, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center' }}>
            <TextField
              label={`Paso ${paso.paso}`}
              variant='outlined'
              style={{ width: '100px' }}
              value={paso.paso.toString()}
              disabled
            />
            <TextField
              label='Oficina'
              variant='outlined'
              style={{ width: '300px' }}
              value={paso.oficina}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleOficinaChange(event, index)}
              select
              SelectProps={{ value: paso.oficina }}
            >
              {offices.map(office => (
                <MenuItem key={office.id} value={office.name}>
                  {office.name}
                </MenuItem>
              ))}
            </TextField>
            <Button variant='outlined' color='error' onClick={() => handleRemovePaso(index)}>
              Eliminar Paso
            </Button>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button variant='outlined' color='primary' style={{ width: '200px' }} onClick={handleAddPaso}>
            Agregar Paso
          </Button>
          <Button variant='contained' color='primary' style={{ width: '200px' }} onClick={handleCreateStep}>
            Crear Step
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateStepComponent*/
