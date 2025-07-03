export type UserProfile = {
  _id: string
  username: string
  email: string
}

export type PostType = {
  _id: string
  username: string
  date: string
  post_type: "post" | "share" | "reply"
  postref_id?: string
  content: {
    message?: string
    images?: string[]
    sharedpost?: PostType | null  // ✅ post completo compartido
    replyTo?: PostType | null     // ✅ post completo respondido
  }
  profilepicture?: string | null
  viewerInteraction?: {
    liked: boolean
    disliked: boolean
    shared: boolean
  }
  stats?: {
    likes: number
    dislikes: number
    shares: number
    replies: number
  }
}


export type ProfileType = {
  _id: string
  username: string
  email: string
  profilepicture?: string
  backgroundimage?: string
}
