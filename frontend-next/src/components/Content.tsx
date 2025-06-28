"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Post from "./Post"
import { PostType } from "@/types/types"


type ContentProps = {
  query: string
  pattern?: string
  username?: string
  limit?: number
}

export default function Content({ query, pattern = "", username="",limit = 10 }: ContentProps) {
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    setError(null)

    try {
      const url = new URL(query)
      url.searchParams.set("pattern", pattern)
      url.searchParams.set("username", username)
      url.searchParams.set("limit", limit.toString())
      if (cursor) url.searchParams.set("cursor", cursor)

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error("Error al obtener posts")
      const data: PostType[] = await res.json()

      if (data.length === 0) {
        setHasMore(false)
      } else {
        setPosts(prev => [...prev, ...data])
        console.log(posts)
        setCursor(data[data.length - 1]._id)
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [query, pattern, limit, cursor, loading, hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchPosts()
      }
    }, {
      rootMargin: "200px"
    })

    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [fetchPosts, hasMore, loading])

  useEffect(() => {
    setPosts([])
    setCursor(null)
    setHasMore(true)
  }, [pattern])

  return (
    <div className="w-full min-h-[calc(100vh-50px)] h-100% p-4 text-text-light dark:text-text-dark">
      {posts.map((post) => <Post key={post._id} post={post} isNested={false}/>)}

      {error && (
        <div className="text-red-600 dark:text-red-400 font-semibold">{error}</div>
      )}

      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light dark:border-primary-dark" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center text-gray-400 py-4">No more posts.</div>
      )}
    </div>
  )
}
