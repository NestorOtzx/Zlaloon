// app/providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/context/AuthProvider'
import { PostModalProvider } from '@/context/PostModalContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>
    <AuthProvider>
      <PostModalProvider>
        {children}
      </PostModalProvider>
    </AuthProvider>
  </SessionProvider>
}
