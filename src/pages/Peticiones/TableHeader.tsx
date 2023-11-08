import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// Icon Imports
import Icon from 'src/@core/components/icon'

interface TableHeaderProps {
  value: string
  toggle: () => void
  toggle2: () => void

  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // Props
  const { handleFilter, toggle, value, toggle2 } = props

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <TextField
        size='small'
        value={value}
        sx={{ mr: 2 }}
        placeholder='Buscar Documento'
        onChange={e => handleFilter(e.target.value)}
      />
      <Button onClick={toggle} variant='contained'>
        Agregar
      </Button>
      <Button sx={{ ml: 'auto' }} onClick={toggle2} variant='contained'>
        Firma Digital
      </Button>
    </Box>
  )
}

export default TableHeader
