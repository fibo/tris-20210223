import { useEffect, useState } from 'react'

import './sass/index.scss'

import { publish, subscribe, unsubscribe } from './ably'
import TrisComponent from './components/Tris'

const NEW_USER = 'new user'
const UPDATE_USERS = 'update users'

export function App() {
  const [wantedNickname, setWantedNickname] = useState('')
  const [nickname, setNickname] = useState('')
  const [users, setUsers] = useState([])
  const [selectedCells, setSelectedCells] = useState([])

  useEffect(() => {
    if (nickname) {
      publish(NEW_USER, { nickname })
    }
  }, [nickname])

  useEffect(() => {
    subscribe(UPDATE_USERS, ({ data: { users: newUsers } }) => {
      console.log(UPDATE_USERS, newUsers)
      setUsers(newUsers)
    })

    return () => {
      unsubscribe(UPDATE_USERS)
    }
  }, [nickname])

  useEffect(() => {
    subscribe(NEW_USER, ({ data: { nickname: newNickname } }) => {
      console.log(NEW_USER, newNickname)

      if (newNickname === nickname) {
        setUsers([nickname])
      } else {
        if (users[0] === nickname) {
          publish(UPDATE_USERS, {
            users: [...new Set(users.concat(newNickname))]
          })
        }
      }
    })

    return () => {
      unsubscribe(NEW_USER)
    }
  }, [nickname, users])

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault()

          setNickname(wantedNickname)
        }}
        onReset={() => {
          setWantedNickname(nickname)
        }}
      >
        <input
          type='text'
          disabled={Boolean(nickname)}
          value={wantedNickname}
          onChange={(event) => {
            if (!nickname) {
              setWantedNickname(event.target.value)
            }
          }}
        />
        {!nickname && <input type='submit' />}
      </form>
      <ul>
        {users.map((user, i) => (
          <li key={i}>{user}</li>
        ))}
      </ul>

      <TrisComponent
        selectedCells={selectedCells}
        setSelectedCells={setSelectedCells}
      />
    </div>
  )
}
