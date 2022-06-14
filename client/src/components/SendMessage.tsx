import React from 'react'

interface Props {
  sendMessage: (chatMessage: string) => void
}
const SendMessage = React.memo(function ({ sendMessage }: Props) {
  const [message, setMessage] = React.useState('')
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(message)
    setMessage('')
  }
  return (
    <section className='sendMessage'>
      <form onSubmit={(e) => handleSubmit(e)} className='sendMessageForm'>
        <textarea
          className='sendMessageText'
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type='submit' className='sendMessageBtn'>
          send message
        </button>
      </form>
    </section>
  )
})

export default SendMessage
