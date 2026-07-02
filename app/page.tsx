'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import Image from 'next/image'

export default function Home() {
  const [profile, setProfile] = useState<{name?: string, title?: string} | null>(null)

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
    }
  }

  const name = profile?.name?.split(' ')[0] || 'josh'
  const title = profile?.title || 'front end engineer'

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Header />
      <Navigation />
      <main className="bg-transparent w-full h-screen overflow-y-auto relative pb-10 overflow-hidden">
        <div className="bg-transparent w-[90%] min-w-screen h-screen relative">
          <h1 className="text-text-light text-center mt-[40vh] uppercase font-quicksand font-bold text-6xl animate-zoom-in">
            hi, i&apos;m {name}
          </h1>
          <span className="text-text-light font-quicksand font-bold text-center uppercase bg-transparent w-[80%] absolute left-[10%] leading-[2] animate-zoom-in">
            {title}
          </span>
          <i className="absolute h-[30px] top-[15%] left-[49%] block cursor-pointer animate-bounce-slow">
            <Image 
              src="/assets/down.png" 
              alt="down" 
              width={30} 
              height={30}
              className="brightness-100 contrast-100"
              unoptimized
            />
          </i>
        </div>
      </main>
    </div>
  )
}

