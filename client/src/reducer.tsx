import { initialState, Message, User } from './App'

type Action =
  | { type: 'JOIN_CHAT'; payload: string }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'REMOVE_USER'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | {
      type: 'NOTIFICATION'
      payload: { username: string; action: 'left' | 'joined' }
    }
  | { type: 'TYPING'; payload: string }
  | { type: 'STOPPED_TYPING'; payload: string }
  | { type: 'GET_USERLIST'; payload: User[] }

export const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'JOIN_CHAT':
      return { ...state, username: action.payload, hasJoinedChat: true }
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'ADD_USER':
      console.log('add user: ' + action.payload)

      return { ...state, users: [...state.users, action.payload] }
    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      }
    case 'NOTIFICATION':
      const username = action.payload.username
      console.log('new user reducer')

      switch (action.payload.action) {
        case 'joined':
          return {
            ...state,
            messages: [
              ...state.messages,
              {
                username: username,
                notification: 'joined',
              },
            ],
          }
        case 'left':
          return {
            ...state,
            messages: [
              ...state.messages,
              {
                username: username,
                notification: 'left',
              },
            ],
          }

        default:
          throw new Error('Unexpected action type')
      }
    case 'TYPING':
      return {
        ...state,
        users: state.users.map((user) => {
          if (user.id === action.payload) {
            return { ...user, isTyping: true }
          } else {
            return user
          }
        }),
      }
    case 'STOPPED_TYPING':
      return {
        ...state,
        users: state.users.map((user) => {
          if (user.id === action.payload) {
            return { ...user, isTyping: false }
          } else {
            return user
          }
        }),
      }
    case 'GET_USERLIST':
      console.log('get userlist: ' + action.payload)

      return { ...state, users: action.payload }
    default:
      throw new Error('Unexpected action type')
  }
}
