const { defineConfig } = require('cypress')
const io = require('socket.io-client')
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      let socket
      let lastMessage

      on('task', {
        connect(name) {
          socket = io('http://localhost:3001')

          socket.emit('username', name, () => {
            return null
          })

          socket.on('chat message', (msg) => (lastMessage = msg))

          return null
        },
        send(message) {
          socket.emit('chat message', message)
          return null
        },
        getLastMessage() {
          return lastMessage || null
        },
        disconnect() {
          socket.disconnect()
          return null
        },
      })
    },
  },
})
