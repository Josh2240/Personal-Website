'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import Image from 'next/image'

interface Social {
  id: number
  platform: string
  url: string
  icon?: string
}

const fallbackSocials: Social[] = [
  { id: 1, platform: 'github', url: 'https://github.com/Josh2240', icon: '/assets/github.png' },
  { id: 2, platform: 'instagram', url: 'https://www.instagram.com/enji_adachi/', icon: '/assets/instagram.png' },
  { id: 3, platform: 'facebook', url: 'https://www.facebook.com/joshua.cabradilla.946/', icon: '/assets/facebook.png' },
]

export default function Socials() {
  const [socials, setSocials] = useState<Social[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSocials()
  }, [])

  const fetchSocials = async () => {
    try {
      const response = await fetch('/api/socials')
      const result = await response.json()
      if (result.success && result.data) {
        setSocials(result.data)
      } else {
        setSocials(fallbackSocials)
      }
    } catch (error) {
      console.error('Error loading socials:', error)
      setSocials(fallbackSocials)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background text-text-light overflow-hidden">
      <Header />
      <Navigation />
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-5 sm:gap-6 md:gap-8 lg:gap-12 px-4 py-24 sm:px-6 lg:px-10 w-full">
        <section className="rounded-[28px] sm:rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#9f9f9f]">Connect</p>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold uppercase tracking-[0.06em] sm:tracking-[0.08em]">Social Profiles</h1>
          <p className="mt-4 text-sm leading-7 text-[#d4d4d4] max-w-2xl mx-auto">
            Follow me or send a message through any of these channels. I&apos;m always open to new opportunities and collaborations.
          </p>
        </section>

        {loading ? (
          <section className="rounded-[28px] sm:rounded-[32px] border border-white/10 bg-white/5 p-8 sm:p-10 text-center text-base sm:text-lg text-text-light shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            Loading socials...
          </section>
        ) : (
          <section className="grid gap-4 sm:gap-5 md:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-[20px] sm:rounded-[24px] md:rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8 text-center transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
              >
                <div className="mx-auto mb-4 sm:mb-5 md:mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full border border-white/10 bg-black/20">
                  <Image
                    src={social.icon || `/assets/${social.platform}.png`}
                    alt={social.platform}
                    width={32}
                    height={32}
                    className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8"
                    unoptimized
                  />
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold capitalize text-text-light">{social.platform}</h2>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-[#bbbbbb]">Click to visit</p>
              </a>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

