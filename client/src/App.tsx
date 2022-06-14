import React from 'react'
import './App.css'
import JoinChat from './components/JoinChat'
import Messages from './components/Messages'
import SendMessage from './components/SendMessage'
import Users from './components/Users'
import { reducer } from './reducer'
import { io } from 'socket.io-client'
import { IoIosChatbubbles } from 'react-icons/io'

export interface Message {
  username: string
  message?: string
  notification?: string
}
export interface User {
  username: string
  id: string
  isTyping: boolean
}
interface State {
  messages: Message[] | []
  users: User[] | []
  hasJoinedChat: boolean
  username: string
}
export const initialState: State = {
  messages: [],
  users: [],
  hasJoinedChat: false,
  username: '',
}

const App = React.memo(function () {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const typingRef = React.useRef(false)
  const socket = React.useMemo(() => io(), [])
  console.log('app rendered')

  React.useEffect(() => {
    socket.on('disconenct', () => {
      socket.connect()
    })
    socket.on('chat message', (message: Message) => {
      dispatch({ type: 'ADD_MESSAGE', payload: message })
    })
    socket.on('userlist', (userlist) => {
      dispatch({ type: 'GET_USERLIST', payload: userlist })
    })
    socket.on('user joined', (user: { username: string; id: string }) => {
      console.log('new user')
      dispatch({ type: 'ADD_USER', payload: { ...user, isTyping: false } })
      dispatch({
        type: 'NOTIFICATION',
        payload: { username: user.username, action: 'joined' },
      })
    })
    socket.on('user left', (user: { username: string; id: string }) => {
      dispatch({ type: 'REMOVE_USER', payload: user.id })
      if (user.username) {
        dispatch({
          type: 'NOTIFICATION',
          payload: { username: user.username, action: 'left' },
        })
      }
    })
    socket.on('user typing', (userId: string) => {
      dispatch({ type: 'TYPING', payload: userId })
    })
    socket.on('user stopped typing', (userId: string) => {
      dispatch({ type: 'STOPPED_TYPING', payload: userId })
    })
  }, [socket])
  React.useEffect(() => {
    let typingTimeout: ReturnType<typeof setTimeout>
    function handleKeyDown() {
      //handle
      if (typingTimeout) {
        window.clearTimeout(typingTimeout)
      }
      if (!typingRef.current) {
        socket.emit('typing', 'now')
        typingRef.current = true
      }
      typingTimeout = setTimeout(() => {
        typingRef.current = false
        socket.emit('stopped typing', 'now')
      }, 1000)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (typingTimeout) {
        window.clearTimeout(typingTimeout)
      }
    }
  }, [socket])

  const sendMessage = React.useCallback(
    (chatMessage: string) => {
      socket.emit('chat message', chatMessage)
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { username: 'You', message: chatMessage },
      })
    },
    [socket]
  )

  const joinChat = React.useCallback(
    (username: string) => {
      socket.emit('username', username, (response: any) => {
        console.log(response)

        dispatch({ type: 'JOIN_CHAT', payload: username })
      })
    },
    [socket]
  )
  return (
    <main className='app'>
      <header className='appHeader'>
        <h1>Chatty</h1>
        <IoIosChatbubbles className='headerIcon' />
      </header>
      <section className='titles'>
        <h2 className='usersTitle'>Users online</h2>
        <h2 className='messagesTitle'>Messages</h2>
      </section>
      <section className='usersAndMessages'>
        <Users users={state.users} />
        <Messages messages={state.messages} />
      </section>
      <section className='userInput'>
        {state.hasJoinedChat ? (
          <SendMessage sendMessage={sendMessage} />
        ) : (
          <JoinChat joinChat={joinChat} />
        )}
      </section>
    </main>
  )
})

export default App
