'use client'

import { PostType } from "@/types/types"
import { useRouter } from "next/navigation"
import PostDate from './PostDate'
import Link from "next/link"
import { useState } from "react"
import useAuth from "@/hooks/useAuth"
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react"

export default function Post({ post, isNested }: { post: PostType; isNested: boolean }) {
  const router = useRouter()
  const [hoveringNested, setHoveringNested] = useState(false)
  const [likeActive, setLikeActive] = useState(false)
  const [dislikeActive, setDislikeActive] = useState(false)
  const [shareActive, setShareActive] = useState(false)

  const { user } = useAuth()

  const handleClick = () => {
    if (!hoveringNested) {
      router.push(`/${post.username}/${post._id}`)
    }
  }

  const sendAction = async (endpoint: string) => {
    if (!user?.name) return

    try {
      await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.name,
          postid: post._id,
        }),
        credentials: "include",
      })
    } catch (err) {
      console.error(`Error posting to ${endpoint}:`, err)
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLikeActive(true)
    setDislikeActive(false)
    await sendAction("addlike")
  }

  const handleDislike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setDislikeActive(true)
    setLikeActive(false)
    await sendAction("adddislike")
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setShareActive(true)
    await sendAction("addshare")
  }

  const containerClass = `
    w-full h-full
    border border-solid
    border-background-lightContrast1 dark:border-background-darkContrast1
    bg-background-lightContrast dark:bg-background-darkContrast
    p-4
    ${!hoveringNested ? 'cursor-pointer hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-[10ms]' : ''}
  `

  return (
    <div
      key={post._id}
      onClick={handleClick}
      className={containerClass}
    >
      <PostDate date={post.date} />

      <Link
        href={`/${post.username}`}
        onClick={(e) => e.stopPropagation()}
        className="font-bold text-lg text-primary-light dark:text-primary-dark hover:underline"
      >
        {post.username}
      </Link>

      {post.content?.message && (
        <div className="mt-2 text-text-light dark:text-text-dark">
          {post.content.message}
        </div>
      )}

      {post.post_type === "share" && post.content?.sharedpost && (
        <div
          className="mt-3"
          onMouseEnter={() => setHoveringNested(true)}
          onMouseLeave={() => setHoveringNested(false)}
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Shared from{" "}
            <Link
              href={`/${post.content.sharedpost.username}`}
              onClick={(e) => e.stopPropagation()}
              className="text-primary-light dark:text-primary-dark hover:underline"
            >
              {post.content.sharedpost.username}
            </Link>
          </div>
          <Post post={post.content.sharedpost} isNested={true} />
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleLike}
          className={`p-2 rounded-full hover:bg-background-lightContrast dark:hover:bg-background-darkContrast transition-colors ${
            likeActive ? 'text-primary-light dark:text-primary-dark' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <ThumbsUp size={18} />
        </button>

        <button
          onClick={handleDislike}
          className={`p-2 rounded-full hover:bg-background-lightContrast dark:hover:bg-background-darkContrast transition-colors ${
            dislikeActive ? 'text-primary-light dark:text-primary-dark' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <ThumbsDown size={18} />
        </button>

        <button
          onClick={handleShare}
          className={`p-2 rounded-full hover:bg-background-lightContrast dark:hover:bg-background-darkContrast transition-colors ${
            shareActive ? 'text-primary-light dark:text-primary-dark' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  )
}
