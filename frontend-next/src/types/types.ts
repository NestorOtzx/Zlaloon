export type UserProfile = {
  _id: string
  username: string
  email: string
}

export type PostType = {
  _id: string
  username: string
  date: string
  post_type: string
  content: {
    message?: string
    sharedpost?: PostType | null
  }
}