'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useSession } from 'next-auth/react'

type ExtendedUser = {
  userid: string
  username: string
}

type AuthContextType = {
  user: ExtendedUser | null
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const value = useMemo(() => {
    const user = session?.user as ExtendedUser | undefined
    return {
      user: user ?? null,
      isAuthenticated: !!user,
      loading,
    }
  }, [session, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
