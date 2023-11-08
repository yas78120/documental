import { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { createCredenciales } from './Consultas'
import RecoverPin from './RecoverPin'
import { styled } from '@mui/material/styles'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface DigitalCredencials {
  password: string
  pin: string
}
const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const SidebarAddUser = (props: SidebarAddUserType) => {
  const { open, toggle } = props

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [recoverPinOpen, setRecoverPinOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pinError, setPinError] = useState('')

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const onChangePin = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value
    value = value.replace(/[^A-Z0-9]/g, '')
    /*
    if (value.length > 5) {
      value = value.slice(0, 5)
      setPinError('El PIN no debe exceder los 5 dígitos.')
    } else if (!/^[A-Z0-9]+$/.test(value)) {
      setPinError('El PIN solo debe contener letras mayúsculas.')
    } else {
      setPinError('')
    }
    */
    value = value.toUpperCase()
    setPin(value)
  }

  const handleSubmit = () => {
    const data: DigitalCredencials = {
      pin: pin,
      password: password
    }
    setPin('')
    setPassword('')
    toggle()
    dispatch(createCredenciales({ ...data }))
  }

  const handleClose = () => {
    toggle()
    setPin('')
    setPassword('')
  }

  const handleForgotPin = () => {
    setConfirmDialogOpen(true)
  }

  const handleRecoverPin = () => {
    setConfirmDialogOpen(false)
    setRecoverPinOpen(true)
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const getPasswordInputType = () => {
    return showPassword ? 'text' : 'password'
  }

  const dispatch = useDispatch<AppDispatch>()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 600, p: [2, 4], height: '60%', maxHeight: 700 } }}
    >
      <Header>
        <Typography variant='h6' sx={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}>
          Añadir Firma Digital
        </Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <DialogContent>
        <form>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              label='Contraseña'
              type={getPasswordInputType()}
              value={password}
              onChange={onChangePassword}
              autoComplete='off'
            />
            <IconButton
              onClick={toggleShowPassword}
              sx={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              label='Pin'
              value={pin}
              onChange={onChangePin}
              autoComplete='off'
              error={pinError !== ''}
              helperText={pinError}
            />
          </FormControl>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button size='large' variant='contained' sx={{ mr: 3 }} onClick={handleSubmit}>
              Enviar
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancelar
            </Button>
          </div>
          <Button color='primary' onClick={handleForgotPin}>
            ¿Has olvidado tu Pin?
          </Button>
        </form>
      </DialogContent>
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>¿Olvidaste tu Pin?</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Estás seguro de que deseas recuperar tu Pin?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color='primary'>
            Cancelar
          </Button>
          <Button onClick={handleRecoverPin} color='primary'>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      {recoverPinOpen && <RecoverPin open={recoverPinOpen} toggle={() => setRecoverPinOpen(false)} />}
    </Dialog>
  )
}

export default SidebarAddUser
