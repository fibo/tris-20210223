import { useEffect, useState } from 'react'
import ghAvatar from 'gh-avatar';
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
  const [avatars, setAvatars] = useState({})

  useEffect(() => {

    // const promiseAll = users.map((user) => ghAvatar(user));
    // Promise.all(promiseAll).then(() => {
    //
    // });
    //TODO
    // Se ho una lista posso fare una map ed usare Promise.all per eseguire delle chiamate di rete in parallelo
    // Come posso invece eseguirle in serie?
    if (nickname) {
      ghAvatar(nickname).then(avatar => {
        setAvatars(avatars => ({
          ...avatars,
          [nickname]: avatar
        }));
      });
    }
  }, [nickname])

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
          <li key={i}>{user}
            {avatars[user] && <img width='20px' height='20px' src={avatars[user]}/>}
          </li>
        ))}
      </ul>

      <TrisComponent
        selectedCells={selectedCells}
        setSelectedCells={setSelectedCells}
      />
    </div>
  )
}
