'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'

export default function PostCreator() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!user?.name) {
      newErrors.username = 'Invalid username. This should not happen.'
    }

    if (content.trim().length < 1) {
      newErrors.content = 'Message is too short.'
    }

    if (content.length > 256) {
      newErrors.content = 'Message is too long.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const postData = {
      username: user?.name,
      date: new Date().toISOString(),
      post_type: 'post',
      content: {
        message: content,
      },
    }

    try {
      setSubmitting(true)

      const res = await fetch('http://localhost:5000/makepost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(postData),
      })

      const result = await res.json()

      if (!res.ok) {
        setErrors(result)
        return
      }

      setContent('')
      window.location.reload()
    } catch (err: any) {
      console.error('Failed to create post:', err)
      alert('Could not submit post.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className="w-full bg-background-light dark:bg-background-darkContrast p-4 border-b border-t border-primary-light dark:border-background-darkContrast1">
      {isAuthenticated ? (
        <>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="https://placehold.co/400x400"
              alt="profile"
              className="w-10 h-10 rounded-full border border-background-lightContrast dark:border-background-darkContrast"
            />
            <span className="font-bold text-text-light dark:text-text-dark">
              {user?.name}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              name="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                setErrors(prev => ({ ...prev, content: '' }))
              }}
              placeholder="Write something..."
              className="w-full h-24 resize-none rounded-md p-2 bg-background-lightContrast dark:bg-background-dark text-text-light dark:text-text-dark outline-none border border-background-lightContrast1 dark:border-background-darkContrast"
            />
            {errors.content && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.content}</p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-primary-light dark:bg-primary-dark text-white font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center text-text-light dark:text-text-dark">
          <p className="mb-2">You are not logged in.</p>
          <button
            onClick={() => router.push('/login')}
            className="text-primary-light dark:text-primary-dark underline hover:opacity-90"
          >
            Log In
          </button>
        </div>
      )}
    </div>
  )
}
