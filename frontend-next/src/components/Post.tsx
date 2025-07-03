'use client'

import { PostType } from "@/types/types"
import { useRouter } from "next/navigation"
import PostDate from './PostDate'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from '@/context/AuthProvider'
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from "lucide-react"
import ImagePreviewModal from './ImagePreviewModal'
import { MessageCircle } from "lucide-react"
import { usePostModal } from "@/context/PostModalContext"

export default function Post({ post, isNested }: { post: PostType; isNested: boolean }) {
  const { setReplyingTo, setShowModal } = usePostModal()
  const router = useRouter()
  const [hoveringNested, setHoveringNested] = useState(false)
  const [likeActive, setLikeActive] = useState(false)
  const [dislikeActive, setDislikeActive] = useState(false)
  const [shareActive, setShareActive] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [likeCount, setLikeCount] = useState(post.stats?.likes || 0)
  const [dislikeCount, setDislikeCount] = useState(post.stats?.dislikes || 0)
  const [shareCount, setShareCount] = useState(post.stats?.shares || 0)
  const [showMenu, setShowMenu] = useState(false)
  console.log("posts:", post)
  const { user } = useAuth()

  useEffect(() => {
    setLikeActive(post.viewerInteraction?.liked || false)
    setDislikeActive(post.viewerInteraction?.disliked || false)
    setShareActive(post.viewerInteraction?.shared || false)
  }, [post.viewerInteraction])

  const handleClick = () => {
    if (!hoveringNested) {
      router.push(`/${post.username}/${post._id}`)
    }
  }

  const sendAction = async (endpoint: string) => {
    if (!user?.username) return
    try {
      await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          postid: post._id,
        }),
        credentials: "include",
      })
    } catch (err) {
      console.error(`Error posting to ${endpoint}:`, err)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch('http://localhost:5000/deletepost', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user?.username,
          userid: user?.userid,
          postid: post._id
        }),
        credentials: 'include'
      })
      if (!res.ok) throw new Error("Failed to delete post")
      window.location.reload()
    } catch (err) {
      console.error("Delete error:", err)
      alert("Failed to delete post")
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user?.username) return
    if (likeActive) {
      await sendAction("removelike")
      setLikeActive(false)
      setLikeCount(prev => prev - 1)
    } else {
      await sendAction("addlike")
      setLikeActive(true)
      setLikeCount(prev => prev + 1)
      if (dislikeActive) {
        setDislikeActive(false)
        setDislikeCount(prev => prev - 1)
      }
    }
  }

  const handleDislike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user?.username) return
    if (dislikeActive) {
      await sendAction("removedislike")
      setDislikeActive(false)
      setDislikeCount(prev => prev - 1)
    } else {
      await sendAction("adddislike")
      setDislikeActive(true)
      setDislikeCount(prev => prev + 1)
      if (likeActive) {
        setLikeActive(false)
        setLikeCount(prev => prev - 1)
      }
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user?.username) return
    if (shareActive) {
      await sendAction("removeshare")
      setShareActive(false)
      setShareCount(prev => prev - 1)
    } else {
      await sendAction("addshare")
      setShareActive(true)
      setShareCount(prev => prev + 1)
    }
  }

  const profileImage = post.profilepicture && post.profilepicture.trim() !== ''
    ? post.profilepicture
    : '/defaults/nopp.png'

  const images: string[] = Array.isArray(post.content?.images) ? post.content.images : []

  const getImageGridClass = (count: number) => {
    switch (count) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'grid-cols-2'
      case 3:
      case 4:
        return 'grid-cols-2'
      default:
        return ''
    }
  }

  const containerClass = `
    w-full h-full
    border border-solid
    border-background-lightContrast1 dark:border-background-darkContrast1
    bg-background-lightContrast dark:bg-background-darkContrast
    p-4 relative
    ${!hoveringNested ? 'cursor-pointer hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-[10ms]' : ''}
  `

  return (
    <>
      <div key={post._id} onClick={handleClick} className={containerClass}>

        {/* Mostrar post respondido */}
        {post.post_type === "reply" && (
          <div
            className=""
            onMouseEnter={() => setHoveringNested(true)}
            onMouseLeave={() => setHoveringNested(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              
              { post.content?.replyTo && 
                <div className="mb-1">
                  <Post post={post.content.replyTo} isNested={true} />
                </div>
              }
              <div className="text-sm text-gray-500 dark:text-gray-400 pb-1">
                Replying to a post
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between mb-2 pb-1">
          <div className="flex items-center gap-3">
            <img
              src={profileImage}
              alt="profile"
              className="w-10 h-10 rounded-md object-cover border-[3px] border-primary-light dark:border-primary-dark"
            />
            <div className="flex flex-col">
              <PostDate date={post.date} />
              <Link
                href={`/${post.username}`}
                onClick={(e) => e.stopPropagation()}
                className="font-bold text-lg text-primary-light dark:text-primary-dark hover:underline"
              >
                {post.username}
              </Link>
            </div>
          </div>

          {!isNested && user?.username === post.username && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(prev => !prev)
                }}
                className="p-2 rounded-full hover:bg-background-lightContrast dark:hover:bg-background-darkContrast"
              >
                <MoreHorizontal size={20} />
              </button>
              {showMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-32 bg-background-lightContrast dark:bg-background-darkContrast border border-background-lightContrast1 dark:border-background-darkContrast1 shadow-lg rounded-md z-10"
                >
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400"
                  >
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {post.content?.message && (
          <div className="mt-2 text-text-light dark:text-text-dark">
            {post.content.message}
          </div>
        )}

        {images.length > 0 && (
          <div
            className={`mt-3 grid gap-2 ${getImageGridClass(images.length)}`}
            onMouseEnter={() => setHoveringNested(true)}
            onMouseLeave={() => setHoveringNested(false)}
          >
            {images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`post-img-${idx}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setPreviewImage(url)
                }}
                className={`w-full h-auto max-h-96 object-cover rounded-md cursor-pointer ${
                  images.length === 1 ? '' : 'aspect-square'
                }`}
              />
            ))}
          </div>
        )}

        {post.post_type === "share" && (
          <div
            className="mt-3"
            onMouseEnter={() => setHoveringNested(true)}
            onMouseLeave={() => setHoveringNested(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <div className="text-sm text-gray-500 dark:text-gray-400 pb-2">
                Shared a post
              </div>
              {post.content?.sharedpost ? (
                <Post post={post.content.sharedpost} isNested={true} />
              ) : (
                isNested ? (
                  <div className="w-full p-4 border border-dashed border-background-lightContrast dark:border-background-darkContrast1 text-center text-text-light dark:text-text-dark">
                    ...
                  </div>
                ) : (
                  <div className="w-full p-4 border border-dashed text-center text-gray-500 dark:text-gray-400">
                    Unavailable post
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {!isNested && (
          <div className="mt-4 flex space-x-4 text-sm items-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setReplyingTo(post)
                setShowModal(true)
              }}
              className="flex items-center gap-1 p-2 rounded-full hover:bg-background-lightContrast dark:hover:bg-background-darkContrast transition-colors text-gray-500 dark:text-gray-400"
            >
              <MessageCircle size={18} />
              <span>{post.stats?.replies || 0}</span>
            </button>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 p-2 rounded-full hover:bg-background-lightContrast dark:hover:bg-background-darkContrast transition-colors ${
                likeActive ? 'text-primary-light dark:text-primary-dark' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <ThumbsUp size={18} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={handleDislike}
              className={`flex items-center gap-1 p-2 rounded-full hover:bg-background-lightContrast dark:hover:bg-background-darkContrast transition-colors ${
                dislikeActive ? 'text-primary-light dark:text-primary-dark' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <ThumbsDown size={18} />
              <span>{dislikeCount}</span>
            </button>

            <button
              onClick={handleShare}
              className={`flex items-center gap-1 p-2 rounded-full hover:bg-background-lightContrast dark:hover:bg-background-darkContrast transition-colors ${
                shareActive ? 'text-primary-light dark:text-primary-dark' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Share2 size={18} />
              <span>{shareCount}</span>
            </button>
          </div>
        )}
      </div>

      {previewImage && (
        <ImagePreviewModal imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </>
  )
}
