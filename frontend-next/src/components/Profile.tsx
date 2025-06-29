'use client'

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthProvider"
import { ProfileType } from "@/types/types"

export default function Profile({ profile }: { profile: ProfileType }) {
  const { user, isAuthenticated } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  const isOwnProfile = isAuthenticated && user?.name === profile.username
  const isOnProfilePage = pathname === `/${profile.username}`

  useEffect(() => {
    const checkFollow = async () => {
      try {
        const res = await fetch(`http://localhost:5000/getisfollowing?username=${user?.name}&profilename=${profile.username}`)
        const data = await res.json()
        setIsFollowing(data.isfollowing)
      } catch {
        setIsFollowing(false)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && !isOwnProfile) checkFollow()
  }, [user, isAuthenticated, profile.username, isOwnProfile])

  const toggleFollow = async () => {
    if (!user || !user._id || !profile._id) return
    try {
      const res = await fetch(`http://localhost:5000/${isFollowing ? 'unfollowprofile' : 'followprofile'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: user._id, profileid: profile._id }),
      })
      if (res.ok) setIsFollowing(!isFollowing)
    } catch (err) {
      console.error('Follow toggle failed', err)
    }
  }

  const handleNameClick = () => {
    if (!isOnProfilePage) router.push(`/${profile.username}`)
  }

  return (
    <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
      <div>
        <div
          onClick={handleNameClick}
          className={`font-bold text-lg text-primary-light dark:text-primary-dark ${!isOnProfilePage ? 'hover:underline cursor-pointer' : ''}`}
        >
          {profile.username}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</div>
      </div>

      {!loading && isAuthenticated && !isOwnProfile && (
        <button
          onClick={toggleFollow}
          className={`px-4 py-1 rounded ${isFollowing ? 'bg-secondary-light dark:bg-secondary-dark' : 'bg-primary-light dark:bg-primary-dark'} text-white`}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  )
}
