const path = require('path')
const express = require('express')
const PORT = process.env.PORT || 3001
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')))

app.get('/api', (req, res) => {
  res.json({ message: 'Hello universe!' })
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

io.on('connection', (socket) => {
  console.log('a user connected. id: ' + socket.id)

  //send the list of users on connection
  const sockets = io.of('/').sockets
  let userList = []
  for ([key, value] of sockets) {
    if (value.data.username) {
      userList.push({ username: value.data.username, id: value.id })
    }
  }
  console.log(userList)
  socket.emit('userlist', userList)

  socket.on('username', (username, callback) => {
    console.log('username: ' + username)
    socket.data.username = username
    io.emit('user joined', { username, id: socket.id })
    callback('username received')
  })

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg)
    socket.broadcast.emit('chat message', {
      username: socket.data.username,
      message: msg,
    })
  })
  socket.on('typing', (arg) => {
    console.log('typing: ' + socket.data.username)
    socket.broadcast.emit('user typing', socket.id)
  })
  socket.on('stopped typing', (arg) => {
    socket.broadcast.emit('user stopped typing', socket.id)
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user left', {
      username: socket.data.username,
      id: socket.id,
    })
    console.log('user disconnected. username: ' + socket.data.username)
  })
})

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
