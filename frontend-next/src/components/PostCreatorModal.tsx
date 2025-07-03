'use client'

import { Dialog } from '@headlessui/react'
import { usePostModal } from '@/context/PostModalContext'
import PostCreator from './PostCreator'

export default function PostCreatorModal() {
  const { showModal, setShowModal, replyingTo } = usePostModal()

  return (
    <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/70" onClick={() => setShowModal(false)} />
      <div className="relative z-50 w-full max-w-lg p-4">
        <div onClick={(e) => e.stopPropagation()}>
          <PostCreator replyingTo={replyingTo} />
        </div>
      </div>
    </Dialog>
  )
}
