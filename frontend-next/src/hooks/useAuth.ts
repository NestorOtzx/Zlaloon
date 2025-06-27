'use client'

import { useSession } from 'next-auth/react'

export default function useAuth() {
  const { data: session, status } = useSession()

  const loading = status === 'loading'
  const user = session?.user

  return {
    user,
    isAuthenticated: !!user,
    loading
  }
}
