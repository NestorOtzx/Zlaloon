// context/PostModalContext.tsx
'use client'

import { createContext, useContext, useState } from 'react'
import { PostType } from '@/types/types'

type PostModalContextType = {
  replyingTo: PostType | null
  setReplyingTo: (post: PostType | null) => void
  showModal: boolean
  setShowModal: (val: boolean) => void
}

const PostModalContext = createContext<PostModalContextType | undefined>(undefined)

export function PostModalProvider({ children }: { children: React.ReactNode }) {
  const [replyingTo, setReplyingTo] = useState<PostType | null>(null)
  const [showModal, setShowModal] = useState(false)

  return (
    <PostModalContext.Provider value={{ replyingTo, setReplyingTo, showModal, setShowModal }}>
      {children}
    </PostModalContext.Provider>
  )
}

export function usePostModal() {
  const ctx = useContext(PostModalContext)
  if (!ctx) throw new Error('usePostModal must be used within PostModalProvider')
  return ctx
}
