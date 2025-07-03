'use client'

import { useEffect, useState, useRef, useCallback } from "react"
import Post from "./Post"
import Profile from "./Profile"
import { PostType, ProfileType } from "@/types/types"
import { useAuth } from '@/context/AuthProvider'

type ContentProps = {
  query: string
  contentType: "post" | "profile"
  pattern?: string
  username?: string
  limit?: number
  loadOnScroll?: boolean
  postId?: string // 👈 nuevo parámetro opcional
}

type GenericItem = PostType | ProfileType

export default function Content({
  query,
  contentType,
  pattern = "",
  username = "",
  limit = 10,
  loadOnScroll = true,
  postId // 👈 nuevo parámetro
}: ContentProps) {
  const [items, setItems] = useState<GenericItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)
  const [resetDone, setResetDone] = useState(false)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const viewerUsername = isAuthenticated && user?.username ? user.username : ""

  const fetchItems = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    setError(null)
    try {
      const url = new URL(query)
      url.searchParams.set("limit", limit.toString())
      if (cursor) url.searchParams.set("cursor", cursor)

      if (contentType === "post") {
        url.searchParams.set("pattern", pattern)
        url.searchParams.set("username", username)
        if (postId) url.searchParams.set("postId", postId)
        if (isAuthenticated && viewerUsername) {
          url.searchParams.set("viewerUsername", viewerUsername)
        }
      } else {
        url.searchParams.set("likename", pattern)
      }

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error(`Error fetching ${contentType}s`)
      const data: GenericItem[] = await res.json()

      if (data.length === 0) {
        setHasMore(false)
      } else {
        setItems(prev => {
          const existingIds = new Set(prev.map(p => p._id))
          const newItems = data.filter(p => !existingIds.has(p._id))
          return [...prev, ...newItems]
        })
        setCursor(data[data.length - 1]._id)
      }
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [query, pattern, username, viewerUsername, limit, cursor, hasMore, loading, contentType, isAuthenticated, postId])

  // Reset when params change
  useEffect(() => {
    setItems([])
    setCursor(null)
    setHasMore(true)
    setResetDone(false)
    const timeout = setTimeout(() => setResetDone(true), 0)
    return () => clearTimeout(timeout)
  }, [pattern, username, query, contentType, postId])

  // First fetch: esperar a que useAuth termine
  useEffect(() => {
    if (!resetDone || loading || items.length > 0 || authLoading) return
    if (isAuthenticated && !viewerUsername) return // 👈 evita fetch prematuro
    fetchItems()
  }, [resetDone, loading, items.length, fetchItems, authLoading, isAuthenticated, viewerUsername])

  // Scroll automático
  useEffect(() => {
    if (!loadOnScroll || !loaderRef.current) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchItems()
      }
    }, { rootMargin: "200px" })

    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [fetchItems, hasMore, loading, loadOnScroll])

  if (authLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light dark:border-primary-dark" />
      </div>
    )
  }

  return (
    <div className="w-full text-text-light dark:text-text-dark">
      {items.map((item) =>
        contentType === "post" ? (
          <Post key={item._id} post={item as PostType} isNested={false} />
        ) : (
          <Profile key={item._id} profile={item as ProfileType} />
        )
      )}

      {error && (
        <div className="text-red-600 dark:text-red-400 font-semibold text-center mt-4">{error}</div>
      )}

      {hasMore && loadOnScroll && (
        <div ref={loaderRef} className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light dark:border-primary-dark" />
        </div>
      )}

      {hasMore && !loadOnScroll && (
        <div className="flex justify-center mt-4">
          <button
            onClick={fetchItems}
            disabled={loading}
            className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="text-center text-gray-400 py-4">No more results.</div>
      )}
    </div>
  )
}
