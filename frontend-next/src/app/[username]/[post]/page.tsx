// app/[username]/[postid]/page.tsx

import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { PostType } from '@/types/types'
import Post from '@/components/Post' // assuming you have one
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: {
    username: string
    post: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `${(await params).username}'s post`,
  }
}

export default async function PostView({ params }: PageProps) {
  const { username, post } = await params

  const res = await fetch(`http://localhost:5000/getprofilepost?username=${encodeURIComponent(username)}&postid=${encodeURIComponent(post)}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    notFound()
  }

  const postInfo: PostType = await res.json()

  return (
    <div>
      <Navbar />
      <div className="pt-[50px] flex flex-row justify-center">
        {/* center */}
        <div className="w-[700px] min-h-[calc(100vh-50px)]
        opacity-90 hover:opacity-95 transition-opacity duration-300
        border-l border-r border-primary-light dark:border-primary-dark
        bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark
        ">
          <div className="w-full mx-auto text-text-light dark:text-text-dark">
            <Post post={postInfo} isNested={false}/>
          </div>
        </div>

      </div>
      
    </div>
  )
}
