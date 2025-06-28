// app/[username]/page.tsx
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProfilePageClient from '@/components/ProfilePageClient'

type UserProfile = {
  _id: string
  username: string
  email: string
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const res = await fetch(`http://localhost:5000/getprofilebyusername?username=${encodeURIComponent((await params).username)}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    notFound()
  }

  const userProfile: UserProfile = await res.json()

  return (
    <>
      <Navbar />
      <ProfilePageClient profile={userProfile} />
    </>
  )
}
