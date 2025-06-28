"use client"

import { useEffect, useState, useRef, useCallback } from "react"

type Post = {
  _id: string
  username: string
  date: string
  post_type: string
  content: {
    message?: string
    sharedpost?: Post | null
  }
}

type ContentProps = {
  query: string
  pattern?: string
  limit?: number
}

export default function Content({ query, pattern = "", limit = 10 }: ContentProps) {
  const [posts, setPosts] = useState<Post[]>([])
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
      url.searchParams.set("limit", limit.toString())
      if (cursor) url.searchParams.set("cursor", cursor)

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error("Error al obtener posts")
      const data: Post[] = await res.json()

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

  // Función para renderizar un post (normal o compartido)
  const renderPost = (post: Post, isNested = false) => {
    return (
      <div
        key={post._id}
        className={`
          ${isNested ? "mt-3" : "mb-4"}
          border ${isNested ? "border-dashed" : "border-solid"}
          border-background-lightContrast1 dark:border-background-darkContrast1
          bg-background-lightContrast dark:bg-background-darkContrast
          p-4 
        `}
      >
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(post.date).toLocaleString()}
        </div>
        <div className="font-bold text-lg text-primary-light dark:text-primary-dark">
          {post.username}
        </div>

        {post.content?.message && (
          <div className="mt-2 text-text-light dark:text-text-dark">
            {post.content.message}
          </div>
        )}

        {post.post_type === "share" && post.content?.sharedpost && (
          <div>
            <div className="text-sm mt-3 text-gray-500 dark:text-gray-400">
              Compartido de {post.content.sharedpost.username}
            </div>
            {renderPost(post.content.sharedpost, true)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full min-h-[calc(100vh-50px)] h-100% p-4 text-text-light dark:text-text-dark">
      {posts.map(post => renderPost(post))}

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
