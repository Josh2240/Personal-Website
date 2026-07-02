'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import Image from 'next/image'

export default function Home() {
  const [profile, setProfile] = useState<{name?: string, title?: string, bio?: string} | null>(null)
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

  const name = profile?.name?.split(' ')[0] || 'josh'
  const title = profile?.title || 'aspiring front end engineer'
  const bio = profile?.bio || 'Crafting simple, elegant web experiences with clean UI and fast performance.'

  return (
    <div className="relative w-full min-h-screen bg-background text-text-light overflow-hidden">
      <Header />
      <Navigation />
      <main className="relative flex min-h-screen items-center justify-center px-4 py-24 sm:py-32 sm:px-6 w-full">
        <div className="relative max-w-5xl w-full rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <span className="text-sm uppercase tracking-[0.4em] text-[#9f9f9f]">front end portfolio</span>
          <h1 className="mt-6 text-5xl font-bold uppercase leading-tight tracking-[0.08em] sm:text-6xl">
            Hi, I&apos;m {name}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#cccccc] sm:text-lg">
            {title}. {bio}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/about" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.2em] text-text-light transition hover:border-transparent hover:bg-white/15 hover:text-white">
              About Me
            </Link>
            <Link href="/projects" className="inline-flex items-center justify-center rounded-full bg-text-light px-6 py-3 text-sm uppercase tracking-[0.2em] text-background transition hover:bg-white/90 hover:text-background">
              View Projects
            </Link>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-black/20">
              <p className="text-sm uppercase tracking-[0.25em] text-[#9f9f9f]">Experience</p>
              <p className="mt-4 text-2xl font-bold">Front-End Design</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-black/20">
              <p className="text-sm uppercase tracking-[0.25em] text-[#9f9f9f]">Focus</p>
              <p className="mt-4 text-2xl font-bold">Modern, clean UI</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-black/20">
              <p className="text-sm uppercase tracking-[0.25em] text-[#9f9f9f]">Goal</p>
              <p className="mt-4 text-2xl font-bold">Deliver polished experiences</p>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center gap-3 text-center text-sm text-[#9f9f9f]">
            <p>Scroll down to discover more</p>
            <div className="animate-bounce-slow rounded-full border border-white/20 bg-white/5 p-3">
              <Image src="/assets/down.png" alt="Scroll down" width={28} height={28} className="inline-block" unoptimized />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

