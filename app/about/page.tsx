'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'
import Image from 'next/image'

interface Profile {
  name?: string
  title?: string
  education?: string
  profile_image?: string
  interests?: string[]
}

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null)

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

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Header />
      <Navigation />
      <main className="bg-transparent w-full h-screen overflow-y-auto relative pb-10 overflow-hidden">
        <div className="absolute top-[30%] left-[20%] w-[60%] h-[150px] flex items-center justify-center bg-transparent">
          <span className="text-text-light font-quicksand font-bold text-center uppercase bg-transparent w-[80%] text-5xl absolute top-[-90%] left-[10%] animate-zoom-in">
            about me
          </span>
        </div>
        <i className="absolute h-[30px] top-[21%] left-[49%] block cursor-pointer animate-bounce-slow">
          <Image 
            src="/assets/down.png" 
            alt="down" 
            width={30} 
            height={30}
            className="brightness-100 contrast-100"
            unoptimized
          />
        </i>
        <div className="bg-text-light w-full h-[1px] absolute top-[30%] left-0 shadow-[0_0_10px_#cccccc] animate-zoom-in"></div>
        
        <div className="bg-transparent h-[230px] min-w-screen absolute top-[30%] left-0 animate-zoom-in">
          <Image 
            id="circle-profile"
            src={profile?.profile_image || '/assets/a7c37f61-b29a-4304-920a-ce40bda43034.jpg'} 
            alt="circle-profile"
            width={112}
            height={112}
            className="w-[7vw] min-h-[12.3vh] h-[14.5vh] rounded-full absolute top-[5%] left-[30%]"
          />
          <span className="text-text-light font-quicksand font-bold flex items-center justify-center capitalize no-underline leading-[1.5] relative mt-5 text-4xl text-shadow-[0_0_10px_#cccccc]">
            {profile?.name || 'josh cabradilla'}
          </span>
          <small className="font-quicksand font-bold flex items-center justify-center capitalize no-underline leading-[1.5] relative">
            {profile?.title || 'aspiring front end engineer, fresh grad BSIT student'}
          </small>
        </div>

        <div className="bg-transparent w-full min-w-screen h-auto absolute top-[60%] left-[20%] animate-zoom-in">
          <span className="font-quicksand font-bold uppercase text-2xl">education</span>
          <small className="text-text-light absolute top-[130%] left-[5%] font-quicksand font-bold no-underline leading-[1.5] text-center">
            {profile?.education || 'Graduated as BSIT - Bachelor of Science in Information Technology at PCLU (Polytechnic College of La Union)'}
          </small>
        </div>

        <div className="bg-transparent w-full min-w-screen h-auto absolute top-[80%] left-[20%] animate-zoom-in">
          <span className="font-quicksand font-bold uppercase text-2xl text-text-light absolute top-[-50px]">
            other interests
          </span>
          <ul className="flex flex-col items-start gap-1 p-0 mt-[-20px] list-none max-h-[180px] overflow-y-auto">
            {(profile?.interests || ['music', 'photography', 'gaming (valorant)', 'coding', 'physical activities like going to gym']).map((interest, index) => (
              <li 
                key={index}
                className="text-xs text-text-light font-quicksand font-bold capitalize bg-black/20 py-2.5 px-6 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all text-left w-fit cursor-pointer hover:bg-header hover:text-text-dark hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
              >
                {interest}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}

