'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

type ExtendedUser = {
  name?: string
  email?: string
  _id?: string
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

  // ⬇️ Forzamos el tipo para que TypeScript reconozca _id
  const user = session?.user as ExtendedUser | undefined

  return (
    <AuthContext.Provider value={{ user: user ?? null, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
