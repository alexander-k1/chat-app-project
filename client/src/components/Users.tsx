import React from 'react'
import { User } from '../App'

interface Props {
  users: User[] | []
}
const Users = React.memo(function ({ users }: Props) {
  if (users.length < 1) {
    return (
      <section className='users'>
        <p className='emptyList'>No one has joined yet</p>
      </section>
    )
  }
  return (
    <section className='users'>
      {/* <h2 className='usersTitle'>Users online</h2> */}
      <ul className='userList'>
        {users.map((user) => {
          if (!user.username) return null
          return (
            <li className='user' key={user.id}>
              <span className='username'>{user.username}</span>
              {user.isTyping ? (
                <span className='typing'> typing...</span>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
})

export default Users
