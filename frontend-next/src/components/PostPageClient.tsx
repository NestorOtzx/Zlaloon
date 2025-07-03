'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PostType } from '@/types/types'
import Post from '@/components/Post'
import { useAuth } from '@/context/AuthProvider'
import PostCreator from './PostCreator'
import Content from './Content'

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
        if (user?.username) {
          url.searchParams.set('viewerUsername', user?.username)
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
  }, [params.username, params.post, user?.username])

  if (error) return <div className="text-red-500">{error}</div>

  if (!postInfo) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light dark:border-primary-dark" />
      </div>
    )
  }
  console.log("post info: ", postInfo)

  return <div>
    <Post post={postInfo} isNested={false} />
    <PostCreator replyingTo={postInfo}></PostCreator>
    <Content
      query="http://localhost:5000/getpostreplies"
      contentType="post"
      postId={postInfo._id}
    />

  </div> 
}
