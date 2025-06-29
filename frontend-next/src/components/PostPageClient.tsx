'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PostType } from '@/types/types'
import Post from '@/components/Post'
import useAuth from '@/hooks/useAuth'

export default function PostPageClient() {
  const { user } = useAuth()
  const params = useParams()
  const [postInfo, setPostInfo] = useState<PostType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const url = new URL('http://localhost:5000/getprofilepost')
        url.searchParams.set('username', params.username as string)
        url.searchParams.set('postid', params.post as string)
        if (user?.name) {
          url.searchParams.set('viewerUsername', user.name)
        }

        const res = await fetch(url.toString(), { cache: 'no-store' })
        if (!res.ok) throw new Error('No se pudo obtener el post')

        const data: PostType = await res.json()
        setPostInfo(data)
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchPost()
  }, [params.username, params.post, user?.name])

  if (error) return <div className="text-red-500">{error}</div>
  if (!postInfo) return <div className="text-gray-400">Cargando post...</div>

  return <Post post={postInfo} isNested={false} />
}
