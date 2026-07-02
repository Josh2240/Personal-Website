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

export default function Socials() {
  const [socials, setSocials] = useState<Social[]>([])

  useEffect(() => {
    fetchSocials()
  }, [])

  const fetchSocials = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api'
      const response = await fetch(`${apiUrl}/socials.php`)
      const result = await response.json()
      if (result.success && result.data) {
        setSocials(result.data)
      }
    } catch (error) {
      console.error('Error loading socials:', error)
      // Fallback to default socials
      setSocials([
        { id: 1, platform: 'github', url: 'https://github.com/Josh2240', icon: '/assets/github.png' },
        { id: 2, platform: 'instagram', url: 'https://www.instagram.com/enji_adachi/', icon: '/assets/instagram.png' },
        { id: 3, platform: 'facebook', url: 'https://www.facebook.com/joshua.cabradilla.946/', icon: '/assets/facebook.png' },
      ])
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Header />
      <Navigation />
      <main className="bg-transparent w-full h-screen overflow-y-auto relative pb-10 overflow-hidden">
        <span className="font-quicksand font-bold absolute text-5xl top-[30%] left-[45%] flex items-center justify-center animate-zoom-in">
          socials
        </span>
        <i className="absolute h-[30px] top-[40%] left-[49%] block cursor-pointer animate-bounce-slow">
          <Image 
            src="/assets/down.png" 
            alt="down" 
            width={30} 
            height={30}
            className="brightness-100 contrast-100"
            unoptimized
          />
        </i>
        <div className="bg-transparent w-[25%] h-auto absolute top-[49%] left-[37.3%] flex items-center justify-center gap-5 cursor-pointer animate-zoom-in">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <Image
                src={social.icon || `/assets/${social.platform}.png`}
                alt={social.platform}
                width={40}
                height={40}
                className="icons"
              />
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}

