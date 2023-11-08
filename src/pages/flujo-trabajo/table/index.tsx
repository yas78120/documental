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
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
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

  function handleEditWorkflow(workflow: Workflow): void {
    throw new Error('Function not implemented.')
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Número de Pasos</TableCell>
              <TableCell align='center'>Pasos </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {workflows.map(workflow => (
              <TableRow key={workflow._id}>
                <TableCell>{workflow.nombre}</TableCell>
                <TableCell>{workflow.descriptionWorkflow}</TableCell>
                {/*<TableCell>{workflow.pasos?.length}</TableCell>*/}
                <TableCell>
                  {workflow && (
                    <div>
                      <Accordion
                        expanded={expandedStep === workflow._id}
                        onChange={() => handleStepExpand(workflow._id)}
                      >
                        <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>Pasos</AccordionSummary>{' '}
                        <AccordionDetails>
                          <ul>
                            {workflow.pasos?.map(paso => (
                              <li key={paso.paso}>
                                Paso {paso.paso}: {paso.oficina}
                              </li>
                            ))}
                          </ul>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    {/* Edit Button */}
                    <Button
                      variant='outlined'
                      color='primary'
                      startIcon={<EditIcon />}
                      onClick={() => handleEditWorkflow(workflow)}
                    >
                      Editar
                    </Button>
                    {/* Delete Button */}
                    <Button
                      variant='outlined'
                      color='secondary'
                      startIcon={<DeleteIcon />}
                      onClick={() => handleEditWorkflow(workflow)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default WorkflowsTable
