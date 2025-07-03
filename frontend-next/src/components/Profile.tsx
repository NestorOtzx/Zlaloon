'use client'

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthProvider"
import { ProfileType } from "@/types/types"
import { Camera, Settings } from "lucide-react"
import { signOut } from "next-auth/react"
import ImagePreviewModal from "@/components/ImagePreviewModal"

type ProfileProps = {
  profile: ProfileType
  showLarge?: boolean
}

export default function Profile({ profile, showLarge = false }: ProfileProps) {
  const { user, isAuthenticated } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newProfilePic, setNewProfilePic] = useState<File | null>(null)
  const [newBackgroundPic, setNewBackgroundPic] = useState<File | null>(null)
  const [previewProfilePic, setPreviewProfilePic] = useState<string | null>(null)
  const [previewBackgroundPic, setPreviewBackgroundPic] = useState<string | null>(null)

  const [showSettings, setShowSettings] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null) // 🆕 para el modal

  const router = useRouter()
  const pathname = usePathname()

  const isOwnProfile = isAuthenticated && user?.username === profile.username
  const isOnProfilePage = pathname === `/${profile.username}`

  useEffect(() => {
    const checkFollow = async () => {
      try {
        const res = await fetch(`http://localhost:5000/getisfollowing?username=${user?.username}&profilename=${profile.username}`)
        const data = await res.json()
        setIsFollowing(data.isfollowing)
      } catch {
        setIsFollowing(false)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && !isOwnProfile) checkFollow()
  }, [user?.username, isAuthenticated, profile.username, isOwnProfile])

  const toggleFollow = async () => {
    if (!user?.username || !user.userid || !profile._id) return
    try {
      const res = await fetch(`http://localhost:5000/${isFollowing ? 'unfollowprofile' : 'followprofile'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: user.userid, profileid: profile._id }),
      })
      if (res.ok) setIsFollowing(!isFollowing)
    } catch (err) {
      console.error('Follow toggle failed', err)
    }
  }

  const handleNameClick = () => {
    if (!isOnProfilePage) router.push(`/${profile.username}`)
  }

  const profileImage = previewProfilePic || profile.profilepicture || "/defaults/nopp.png"
  let backgroundIndex = profile.username
    ? [...profile.username].reduce((sum, char) => sum + char.charCodeAt(0), 0)
    : 0
  backgroundIndex += 2
  backgroundIndex %= 5
  const backgroundImage = previewBackgroundPic || profile.backgroundimage || `/backgrounds/bg${backgroundIndex}.jpg`

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'background') => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        if (type === 'profile') {
          setNewProfilePic(file)
          setPreviewProfilePic(reader.result)
        } else {
          setNewBackgroundPic(file)
          setPreviewBackgroundPic(reader.result)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveImages = async () => {
    if (!user?.userid) return

    const formData = new FormData()
    if (newProfilePic) formData.append("profilepicture", newProfilePic)
    if (newBackgroundPic) formData.append("backgroundimage", newBackgroundPic)
    formData.append("userid", user.userid)

    try {
      const res = await fetch("http://localhost:5000/updateprofileimages", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert("Error saving images")
      }
    } catch (err) {
      console.error("Upload failed", err)
      alert("Upload failed")
    }
  }

  const handleDeleteAccount = async () => {
    if (!user?.username) return
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.")
    if (!confirmed) return

    try {
      const res = await fetch("http://localhost:5000/deleteaccount", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: profile.username, viewerUsername: user.username }),
        credentials: "include"
      })

      if (res.ok) {
        await signOut({ callbackUrl: "/" })
      } else {
        alert("Error deleting account")
      }
    } catch (err) {
      console.error("Delete account failed", err)
      alert("Delete account failed")
    }
  }

  return (
    <div className="border-b border-text-light dark:border-text-dark">
      {showLarge && (
        <div className="relative w-full h-48 mb-16">
          <img
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => !newBackgroundPic && setPreviewImage(backgroundImage)} // abrir modal
          />

          {isOwnProfile && (
            <label className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2 cursor-pointer hover:bg-opacity-75 transition-colors">
              <Camera className="text-white w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, 'background')}
              />
            </label>
          )}

          <div className="pl-8 absolute left-[64px] transform -translate-x-1/2 bottom-[-64px]">
            <div className="relative">
              <img
                src={profileImage}
                alt="Profile picture"
                className="w-32 h-32 rounded-md object-cover border-4 border-primary-light dark:border-primary-dark bg-white dark:bg-background-dark cursor-pointer"
                onClick={() => !newProfilePic && setPreviewImage(profileImage)} // abrir modal
              />
              {isOwnProfile && (
                <label className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 cursor-pointer hover:bg-opacity-75 transition-colors">
                  <Camera className="text-white w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, 'profile')}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {!showLarge && (
            <img
              src={profileImage}
              alt="Profile"
              className="w-12 h-12 object-cover cursor-pointer"
              onClick={() => !newProfilePic && setPreviewImage(profileImage)} // abrir modal
            />
          )}

          <div>
            <div
              onClick={handleNameClick}
              className={`font-bold text-lg text-primary-light dark:text-primary-dark ${!isOnProfilePage ? 'hover:underline cursor-pointer' : ''}`}
            >
              {profile.username}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</div>
          </div>
        </div>

        <div className="relative">
          {isOwnProfile && showLarge && (
            <button
              onClick={() => setShowSettings(prev => !prev)}
              className="p-2 rounded-full hover:bg-background-lightContrast dark:hover:bg-background-darkContrast"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          {showSettings && (
            <div className="absolute right-0 mt-2 w-40 bg-background-lightContrast dark:bg-background-darkContrast border border-background-lightContrast1 dark:border-background-darkContrast1 shadow-lg rounded-md z-10">
              <button
                onClick={handleDeleteAccount}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400"
              >
                Delete Account
              </button>
            </div>
          )}
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

      {isOwnProfile && showLarge && (newProfilePic || newBackgroundPic) && (
        <div className="px-4 pb-4">
          <button
            onClick={handleSaveImages}
            className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded hover:opacity-90"
          >
            Guardar cambios
          </button>
        </div>
      )}

      {previewImage && (
        <ImagePreviewModal imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </div>
  )
}
