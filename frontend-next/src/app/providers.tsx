// app/providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/context/AuthProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </SessionProvider>
}
