import io from 'socket.io-client'

// Conectarse al servidor del WebSocket (reemplaza la URL con tu URL del servidor)
const socket = io('http://localhost:3501') // Cambia la URL según tu configuración

// Manejar eventos del servidor
socket.on('connect', () => {
  console.log('Conectado al servidor WebSocket')
})

socket.on('new_message', message => {
  console.log('Nuevo mensaje del servidor:', message)
})

// Enviar mensajes al servidor
const room = 'mi_sala'
const message = 'Hola, servidor!'
socket.emit('event_join', room) // Unirse a una sala
socket.emit('event_message', { room, message }) // Enviar un mensaje

// Cuando ya no necesites la conexión, puedes desconectarte
socket.disconnect()
