// src/hooks/useAuthState.ts
import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, loading }
}
