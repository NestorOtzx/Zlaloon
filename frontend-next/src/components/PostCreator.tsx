'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'
import ImageCropperModal from './ImageCropperModal'
import { Image as ImageIcon } from 'lucide-react'
import { Crop } from 'lucide-react'
import ImagePreviewModal from './ImagePreviewModal'
import { PostType } from '@/types/types'

type SelectedImage = {
  originalUrl: string
  croppedUrl?: string
  file?: File
  cropData?: any
}

type PostCreatorProps = {
  replyingTo?: PostType | null
  onClose?: () => void
}

export default function PostCreator({ replyingTo, onClose  }: PostCreatorProps) {
  const { user, isAuthenticated, loading } = useAuth()
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const router = useRouter()

  const [profilePicture, setProfilePicture] = useState('/defaults/nopp.png')
  const [username, setUsername] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<SelectedImage[]>([])
  const [cropIndex, setCropIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.username) return
      try {
        const res = await fetch(`http://localhost:5000/getprofilebyusername?username=${user.username}`)
        const data = await res.json()
        if (data) {
          setUsername(data.username)
          setProfilePicture(data.profilepicture || '/defaults/nopp.png')
        }
      } catch (err) {
        console.error('Error loading profile info', err)
      }
    }
    if (isAuthenticated) fetchUserProfile()
  }, [isAuthenticated, user?.username])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images];

    for (const file of files) {
      if (newImages.length >= 4) break;

      const reader = new FileReader();
      reader.onload = () => {
        newImages.push({
          originalUrl: reader.result as string,
          file: file,
        });
        setImages([...newImages]);
      };
      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCropComplete = (
    result: { file: File; previewUrl: string; cropData: any }
  ) => {
    if (cropIndex === null) return
    const updated = [...images]
    updated[cropIndex] = {
      ...updated[cropIndex],
      croppedUrl: result.previewUrl,
      file: result.file,
      cropData: result.cropData,
    }
    setImages(updated)
    setCropIndex(null)
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (content.trim().length < 1) {
      newErrors.content = 'Message is too short.'
    }
    if (content.length > 256) {
      newErrors.content = 'Message is too long.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const formData = new FormData()
    formData.append('username', user?.username || '')
    formData.append('date', new Date().toISOString())
    formData.append('post_type', replyingTo ? 'reply' : 'post')
    formData.append('content', JSON.stringify({ message: content }))

    if (replyingTo?._id) {
      formData.append('postref_id', replyingTo._id)
    }

    images.forEach((img) => {
      if (img.file) {
        formData.append('images', img.file)
      }
    })

    try {
      setSubmitting(true)
      const res = await fetch('http://localhost:5000/makepost', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const result = await res.json()
      if (!res.ok) {
        setErrors(result)
        return
      }

      setContent('')
      setImages([])
      if (onClose) 
      {
        onClose()
      }else{
        window.location.reload()
      }
    } catch (err) {
      console.error('Failed to create post:', err)
      alert('Could not submit post.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className="w-full bg-background-light dark:bg-background-darkContrast p-4 border-y border-primary-light dark:border-background-darkContrast1">
      {isAuthenticated ? (
        <>
          <div className="flex items-center gap-3 mb-3">
            <img
              src={profilePicture}
              alt="profile"
              className="w-10 h-10 rounded-md object-cover border-[3px] border-primary-light dark:border-primary-dark"
            />
            <span className="font-bold text-text-light dark:text-text-dark">{username}</span>
          </div>

          {replyingTo && (
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Replying to <span className="font-semibold">{replyingTo.username}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              name="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                setErrors((prev) => ({ ...prev, content: '' }))
              }}
              placeholder="Write something..."
              className="w-full h-24 resize-none rounded-md p-2 bg-background-lightContrast dark:bg-background-dark text-text-light dark:text-text-dark outline-none border border-background-lightContrast1 dark:border-background-darkContrast"
            />
            {errors.content && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.content}</p>
            )}

            {images.length > 0 && (
              <>
                <span className="text-xs text-gray-500 dark:text-gray-400">{images.length}/4 images selected</span>
                <div className="flex flex-wrap gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 group">
                      <img
                        src={img.croppedUrl || img.originalUrl}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover rounded-md cursor-pointer"
                        onClick={() => setPreviewIndex(index)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-80 hover:opacity-100"
                      >×</button>
                      <button
                        type="button"
                        onClick={() => setCropIndex(index)}
                        className="absolute bottom-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-80 hover:opacity-100"
                        title="Edit crop"
                      >
                        <Crop className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-md hover:bg-background-lightContrast dark:hover:bg-background-darkContrast text-primary-light dark:text-primary-dark"
                  title="Add Image"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-primary-light dark:bg-primary-dark text-white font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>

          {cropIndex !== null && images[cropIndex] && (
            <ImageCropperModal
              imageSrc={images[cropIndex].originalUrl}
              previousCropData={images[cropIndex].cropData}
              onClose={() => setCropIndex(null)}
              onCropComplete={handleCropComplete}
            />
          )}

          {previewIndex !== null && images[previewIndex] && (
            <ImagePreviewModal
              imageUrl={images[previewIndex].croppedUrl || images[previewIndex].originalUrl}
              onClose={() => setPreviewIndex(null)}
            />
          )}
        </>
      ) : (
        <div className="text-center text-text-light dark:text-text-dark">
          <p className="mb-2">You are not logged in.</p>
          <button
            onClick={() => router.push('/login')}
            className="text-primary-light dark:text-primary-dark underline hover:opacity-90"
          >
            Log In
          </button>
        </div>
      )}
    </div>
  )
}
