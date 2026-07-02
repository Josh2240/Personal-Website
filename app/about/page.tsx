'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import Image from 'next/image'

interface Profile {
  name?: string
  title?: string
  bio?: string
  education?: string
  profile_image?: string
  interests?: string[]
}

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api'
      const response = await fetch(`${apiUrl}/profile.php`)
      const result = await response.json()
      if (result.success && result.data) {
        setProfile(result.data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const interests = profile?.interests || ['music', 'photography', 'gaming (valorant)', 'coding', 'physical activities like going to gym']

  return (
    <div className="w-full min-h-screen bg-background text-text-light overflow-hidden">
      <Header />
      <Navigation />
      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-10 sm:gap-14 px-4 py-24 sm:px-6 lg:px-10 w-full">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <span className="text-sm uppercase tracking-[0.4em] text-[#9f9f9f]">About Me</span>
          <div className="mt-8 grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)] items-start">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
              <Image
                src={profile?.profile_image || '/assets/a7c37f61-b29a-4304-920a-ce40bda43034.jpg'}
                alt={profile?.name || 'Profile'}
                width={320}
                height={320}
                className="h-full w-full rounded-[24px] object-cover"
                unoptimized
              />
            </div>
            <div className="space-y-6 text-[#d9d9d9]">
              <div>
                <h2 className="text-4xl font-bold uppercase tracking-[0.08em]">{profile?.name || 'josh cabradilla'}</h2>
                <p className="mt-3 text-lg text-[#cccccc]">{profile?.title || 'aspiring front end engineer, fresh grad BSIT student'}</p>
              </div>
              <div className="space-y-4">
                <p className="leading-8 text-[#d4d4d4]">
                  {loading ? 'Loading profile details...' : profile?.bio || 'I build clean and polished user interfaces that feel modern and easy to use. My goal is to create meaningful digital experiences with strong visual design and fast performance.'}
                </p>
                <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                  <p className="uppercase tracking-[0.3em] text-[#9f9f9f]">Education</p>
                  <p className="mt-4 text-base leading-7 text-[#e8e8e8]">
                    {profile?.education || 'Graduated as BSIT - Bachelor of Science in Information Technology at PCLU (Polytechnic College of La Union)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-sm uppercase tracking-[0.4em] text-[#9f9f9f]">Interests</span>
              <h2 className="mt-4 text-3xl font-bold uppercase tracking-[0.08em]">What I enjoy</h2>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {interests.map((interest, index) => (
              <span key={index} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-text-light transition hover:border-white/20 hover:bg-white/10">
                {interest}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

