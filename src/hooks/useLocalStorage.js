import { useState, useEffect } from 'react'

// Works like useState, but remembers the value in the browser.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be blocked (private mode). The app still works without it.
    }
  }, [key, value])

  return [value, setValue]
}