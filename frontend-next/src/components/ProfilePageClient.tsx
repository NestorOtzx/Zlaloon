'use client'

import { useAuth } from '@/context/AuthProvider'
import PostCreator from './PostCreator'
import Content from './Content'
import Profile from './Profile'
import { UserProfile } from '@/types/types'

export default function ProfilePageClient({ profile }: { profile: UserProfile }) {
  const { user, isAuthenticated } = useAuth()
  console.log(user);

  const isOwnProfile = isAuthenticated && user?.username === profile.username

  return (
    <div className="flex flex-row justify-center min-h-[calc(100vh)]">
      <div
        className="w-[700px] min-h-[calc(100vh-50px)] pt-[50px]
        opacity-90 hover:opacity-95 transition-opacity duration-300
        border-l border-r border-primary-light dark:border-primary-dark
        bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
      >
        <Profile profile={profile} showLarge={true}/>

        {isOwnProfile && <PostCreator />}

        <Content
          query="http://localhost:5000/getprofileposts"
          pattern=""
          contentType="post"
          username={profile.username}
          limit={5}
        />
      </div>
    </div>
  )
}
