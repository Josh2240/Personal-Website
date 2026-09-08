export interface Project {
  id: number
  title: string
  description?: string
  link?: string
  image_url?: string
  technologies?: string
  created_at: string
  updated_at: string
}

export interface Social {
  id: number
  platform: string
  url: string
  icon?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: number
  name: string
  title?: string
  bio?: string
  education?: string
  profile_image?: string
  interests?: string[]
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  username: string
  password_hash: string
  totp_secret?: string
  is_2fa_enabled: number
  created_at: string
  updated_at: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
