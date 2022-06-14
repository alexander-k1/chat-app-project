import React from 'react'
import { Message } from '../App'

interface Props {
  messages: Message[] | []
}
const Messages = React.memo(function ({ messages }: Props) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (messages.length < 1) {
    return (
      <section className='messages'>
        <p className='emptyList'>No new messages yet</p>
      </section>
    )
  }
  return (
    <section className='messages'>
      {/* <h2 className='messagesTitle'>Messages</h2> */}
      <ul className='messageList'>
        {messages.map((item, index) => {
          if (item.notification) {
            return (
              <li key={index} className='notification'>
                <span className='username'>{item.username} </span>
                <span className='notificationText'>
                  {item.notification === 'joined'
                    ? 'has joined the chat'
                    : item.notification === 'left'
                    ? 'has left the chat'
                    : null}
                </span>
              </li>
            )
          } else {
            return (
              <li key={index} className='message'>
                <span className='username'>{item.username}: </span>
                <span className='messageText'>{item.message}</span>
              </li>
            )
          }
        })}
      </ul>
      <div ref={scrollRef}></div>
    </section>
  )
})

export default Messages
