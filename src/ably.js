const ABLY_API_KEY = process.env.REACT_APP_ABLY_API_KEY

const ably = new window.Ably.Realtime(ABLY_API_KEY)

function channel() {
  return ably.channels.get('game')
}

export function publish(eventName, data) {
  channel().publish(eventName, data)
}

export function subscribe(eventName, callback) {
  channel().subscribe(eventName, callback)
}

export function unsubscribe(eventName) {
  channel().subscribe(eventName)
}
