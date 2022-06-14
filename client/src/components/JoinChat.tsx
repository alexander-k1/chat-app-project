import React from 'react'

interface Props {
  joinChat: (username: string) => void
}

function JoinChat({ joinChat }: Props) {
  const [username, setUsername] = React.useState('')
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    joinChat(username)
    setUsername('')
  }
  return (
    <section className='joinChat'>
      <form onSubmit={(e) => handleSubmit(e)} className='joinChatForm'>
        <input
          required
          type='text'
          className='joinChatInput'
          placeholder='choose your username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type='submit' className='joinChatBtn'>
          join chat
        </button>
      </form>
    </section>
  )
}

export default JoinChat
