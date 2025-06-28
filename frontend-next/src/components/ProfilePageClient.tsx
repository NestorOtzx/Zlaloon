'use client'

import { useAuth } from '@/context/AuthProvider'
import PostCreator from './PostCreator'
import Content from './Content'
import { UserProfile } from '@/types/types'


export default function ProfilePageClient({ profile }: { profile: UserProfile }) {
  const { user, isAuthenticated, loading } = useAuth()

  const isOwnProfile = isAuthenticated && user?.name === profile.username

  return (
    <div className="flex flex-row justify-center">
      <div
        className="w-[700px] min-h-[calc(100vh-50px)] pt-[50px]
        opacity-90 hover:opacity-95 transition-opacity duration-300
        border-l border-r border-primary-light dark:border-primary-dark
        bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
      >
        <div className="px-4 py-3 border-b border-background-lightContrast dark:border-background-darkContrast">
          <h1 className="text-xl font-bold">@{profile.username}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
        </div>

        {isOwnProfile && (
            <PostCreator />
        )}

        <Content
          query="http://localhost:5000/getprofileposts"
          pattern=""
          username={profile.username}
          limit={5}
        />
      </div>
    </div>
  )
}
