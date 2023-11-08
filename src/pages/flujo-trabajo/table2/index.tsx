import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

interface Workflow {
  _id: string
  nombre: string
  descriptionWorkflow: string
  pasos: Array<{ paso: number; idOffice: string; oficina: string; completado: boolean }>
  oficinaActual: string
  createdAt: string
}

const WorkflowsTable: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [expandedStep, setExpandedStep] = useState<string | false>(false)

  useEffect(() => {
    // Simula la carga de datos desde una fuente externa (por ejemplo, una API)
    // Reemplaza esto con la lógica para cargar tus datos reales
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3501/workflow/active')
        const data = await response.json()
        setWorkflows(data)
      } catch (error) {
        console.error('Error al cargar datos: ', error)
      }
    }

    fetchData()
  }, [])

  const showWorkflowDetails = (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
  }

  const closeWorkflowDetails = () => {
    setSelectedWorkflow(null)
  }

  const handleStepExpand = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? false : stepId)
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Número de Pasos</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workflows.map(workflow => (
              <TableRow key={workflow._id}>
                <TableCell>{workflow.nombre}</TableCell>
                <TableCell>{workflow.descriptionWorkflow}</TableCell>
                {/*<TableCell>{workflow.pasos?.length}</TableCell>*/}
                <TableCell>{new Date(workflow.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant='contained' onClick={() => showWorkflowDetails(workflow)}>
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedWorkflow && (
        <div>
          <Accordion
            expanded={expandedStep === selectedWorkflow._id}
            onChange={() => handleStepExpand(selectedWorkflow._id)}
          >
            <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>Pasos</AccordionSummary>{' '}
            <AccordionDetails>
              <ul>
                {selectedWorkflow.pasos.map(paso => (
                  <li key={paso.paso}>
                    Paso {paso.paso}: {paso.oficina}
                  </li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
          <Button variant='contained' onClick={closeWorkflowDetails}>
            Cerrar Detalles
          </Button>
        </div>
      )}
    </div>
  )
}

export default WorkflowsTable
