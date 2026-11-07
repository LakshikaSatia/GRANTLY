import { useEffect } from 'react'

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return undefined
    const timer = setTimeout(onDone, 2800)
    return () => clearTimeout(timer)
  }, [message, onDone])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {message && <div className="toast">{message}</div>}
    </div>
  )
}