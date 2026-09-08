'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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

interface Project {
  id: number
  title: string
  description?: string
  link?: string
  technologies?: string
  image_url?: string
}

interface Social {
  id: number
  platform: string
  url: string
  icon?: string
}

const fallbackProjects: Project[] = [
  {
    id: 1,
    title: 'CIT Pageant Tabulation System',
    description: 'Tabulation system exclusive for College of Information Technology, used for judging candidates on IT Day.',
    link: 'https://cit-pageant-tabulation-system.onrender.com/login',
    image_url: '/assets/projects/cit-pageant.svg',
    technologies: 'TypeScript',
  },
  {
    id: 2,
    title: 'Ministry Volunteer Scheduler',
    description: 'Volunteer scheduling system for Coastlight Church, helpful for organizing meetings and service rotations.',
    link: 'https://github.com/Josh2240/Ministry-Volunteer-Scheduler',
    image_url: '/assets/projects/ministry-volunteer.svg',
    technologies: 'TypeScript',
  },
  {
    id: 3,
    title: 'SSC Violation Auditing',
    description: 'Auditing system for tracking violations and violators.',
    link: 'https://ssc-violation-auditing-six.vercel.app/login',
    image_url: '/assets/projects/ssc-violation.svg',
    technologies: 'TypeScript',
  },
  {
    id: 4,
    title: 'Singing Tabulation System',
    description: 'Tabulation system designed for vocal contestants.',
    link: 'https://github.com/Josh2240/Singing-Tabulation-System',
    image_url: '/assets/projects/singing-tabulation.svg',
    technologies: 'TypeScript',
  },
  {
    id: 5,
    title: 'Dance Tabulation',
    description: 'Dance tabulation system for Polytechnic College of La Union.',
    link: 'https://dance-tabulation.onrender.com/login',
    image_url: '/assets/projects/dance-tabulation.svg',
    technologies: 'TypeScript',
  },
  {
    id: 6,
    title: 'Announcements & Suspension Alerts Dashboard',
    description: 'Dashboard for managing announcements and suspension alerts.',
    link: 'https://announcements-suspension-alerts-dashboard.onrender.com/',
    image_url: '/assets/projects/announcements-alerts.svg',
    technologies: 'JavaScript',
  },
  {
    id: 7,
    title: 'Student Billing System',
    description: 'Student billing and payment management system.',
    link: 'https://github.com/Josh2240/student-billing-system',
    image_url: '/assets/projects/student-billing.svg',
    technologies: 'TypeScript',
  },
]

const fallbackSocials: Social[] = [
  { id: 1, platform: 'github', url: 'https://github.com/Josh2240', icon: '/assets/github.png' },
  { id: 2, platform: 'instagram', url: 'https://www.instagram.com/enji_adachi/', icon: '/assets/instagram.png' },
  { id: 3, platform: 'facebook', url: 'https://www.facebook.com/joshua.cabradilla.946/', icon: '/assets/facebook.png' },
]

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [socials, setSocials] = useState<Social[]>([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingSocials, setLoadingSocials] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchProjects()
    fetchSocials()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      const result = await response.json()
      if (result.success && result.data) {
        setProfile(result.data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoadingProfile(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const result = await response.json()
      if (result.success && result.data) {
        setProjects(result.data)
      } else {
        setProjects(fallbackProjects)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
      setProjects(fallbackProjects)
    } finally {
      setLoadingProjects(false)
    }
  }

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
      setLoadingSocials(false)
    }
  }

  const name = profile?.name?.split(' ')[0] || 'josh'
  const title = profile?.title || 'aspiring front end engineer'
  const bio = profile?.bio || 'Crafting simple, elegant web experiences with clean UI and fast performance.'

  return (
    <div className="relative w-full bg-background text-text-light overflow-x-hidden">
      <Header />
      <Navigation />

      <main>
        <section id="home" className="relative min-h-screen flex items-center justify-center px-4 py-20 sm:px-6 w-full">
          <div className="relative w-full max-w-4xl rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <span className="text-xs uppercase tracking-[0.4em] text-[#9f9f9f]">front end portfolio</span>
            <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight tracking-[0.06em] sm:tracking-[0.08em]">
              Hi, I&apos;m {name}
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-[#cccccc] sm:text-base sm:leading-8">
              {title}. {bio}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="#about" className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.2em] text-text-light transition hover:border-transparent hover:bg-white/15 hover:text-white">
                About Me
              </Link>
              <Link href="#projects" className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-text-light px-6 py-3 text-sm uppercase tracking-[0.2em] text-background transition hover:bg-white/90 hover:text-background">
                View Projects
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-lg shadow-black/20">
                <p className="text-xs uppercase tracking-[0.25em] text-[#9f9f9f]">Experience</p>
                <p className="mt-4 text-lg sm:text-xl font-bold">Front-End Design</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-lg shadow-black/20">
                <p className="text-xs uppercase tracking-[0.25em] text-[#9f9f9f]">Focus</p>
                <p className="mt-4 text-lg sm:text-xl font-bold">Modern, clean UI</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-lg shadow-black/20">
                <p className="text-xs uppercase tracking-[0.25em] text-[#9f9f9f]">Goal</p>
                <p className="mt-4 text-lg sm:text-xl font-bold">Deliver polished experiences</p>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center gap-3 text-center text-sm text-[#9f9f9f]">
              <p>Scroll down to discover more</p>
              <Link href="#about" className="animate-bounce-slow rounded-full border border-white/20 bg-white/5 p-3 inline-flex items-center justify-center">
                <Image src="/assets/down.png" alt="Scroll down" width={28} height={28} className="inline-block" unoptimized />
              </Link>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl flex flex-col gap-6 sm:gap-8 lg:gap-10 px-4 py-24 sm:px-6 lg:px-10 w-full">
          <div className="rounded-[28px] sm:rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <span className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#9f9f9f]">About Me</span>
            <div className="mt-6 sm:mt-8 grid gap-6 lg:gap-8 lg:grid-cols-[280px_minmax(0,1fr)] items-start">
              <div className="overflow-hidden rounded-[20px] sm:rounded-[24px] border border-white/10 bg-white/5 p-3 sm:p-4 md:p-5 shadow-lg shadow-black/20">
                <Image
                  src={profile?.profile_image || '/assets/a7c37f61-b29a-4304-920a-ce40bda43034.jpg'}
                  alt={profile?.name || 'Profile'}
                  width={320}
                  height={320}
                  className="h-auto w-full rounded-[16px] sm:rounded-[20px] object-cover"
                  unoptimized
                />
              </div>
              <div className="space-y-4 sm:space-y-5 text-[#d9d9d9]">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.06em] sm:tracking-[0.08em]">{profile?.name || 'josh cabradilla'}</h2>
                  <p className="mt-3 text-base sm:text-lg text-[#cccccc]">{profile?.title || 'aspiring front end engineer, fresh grad BSIT student'}</p>
                </div>
                <div className="space-y-4">
                  <p className="leading-7 sm:leading-8 text-[#d4d4d4] text-sm sm:text-base">
                    {loadingProfile ? 'Loading profile details...' : profile?.bio || 'I build clean and polished user interfaces that feel modern and easy to use. My goal is to create meaningful digital experiences with strong visual design and fast performance.'}
                  </p>
                  <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-black/20 p-4 sm:p-5 md:p-6">
                    <p className="uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#9f9f9f] text-xs sm:text-sm">Education</p>
                    <p className="mt-4 text-sm sm:text-base leading-7 text-[#e8e8e8]">
                      {profile?.education || 'Graduated as BSIT - Bachelor of Science in Information Technology at PCLU (Polytechnic College of La Union)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] sm:rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#9f9f9f]">Interests</span>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold uppercase tracking-[0.06em] sm:tracking-[0.08em]">What I enjoy</h2>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
              {(profile?.interests || ['music', 'photography', 'gaming (valorant)', 'coding', 'physical activities like going to gym']).map((interest, index) => (
                <span key={index} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm text-text-light transition hover:border-white/20 hover:bg-white/10">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-6xl flex flex-col gap-5 sm:gap-6 md:gap-8 lg:gap-10 px-4 py-24 sm:px-6 lg:px-10 w-full">
          <div className="rounded-[28px] sm:rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#9f9f9f]">Projects</p>
                <h1 className="mt-4 text-3xl sm:text-4xl font-bold uppercase tracking-[0.06em] sm:tracking-[0.08em]">Recent Work</h1>
              </div>
              <p className="max-w-md text-xs sm:text-sm text-[#cccccc] sm:text-right">
                A collection of projects that show how I build clean, usable, and responsive experiences.
              </p>
            </div>
          </div>

          {loadingProjects ? (
            <div className="rounded-[28px] sm:rounded-[32px] border border-white/10 bg-white/5 p-8 sm:p-10 text-center text-base sm:text-lg text-text-light shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              Loading projects...
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 md:gap-6 lg:gap-8 md:grid-cols-2">
              {projects.map((project) => (
                <article key={project.id} className="rounded-[20px] sm:rounded-[24px] md:rounded-[28px] border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 overflow-hidden">
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="block">
                      {project.image_url && (
                        <div className="relative h-28 sm:h-32 md:h-40 w-full bg-black/20">
                          <Image src={project.image_url} alt={project.title} fill className="object-contain p-4 sm:p-6" unoptimized />
                        </div>
                      )}
                      <div className="p-4 sm:p-5 md:p-6 lg:p-8">
                        <div className="flex items-center justify-between gap-4">
                          <h2 className="text-base sm:text-lg md:text-2xl font-bold">{project.title}</h2>
                          <span className="text-xs uppercase tracking-[0.2em] text-[#9f9f9f] transition hover:text-text-light whitespace-nowrap">Visit</span>
                        </div>
                        <p className="mt-3 sm:mt-4 text-sm leading-7 text-[#d4d4d4]">{project.description || 'A well-crafted project that demonstrates clean UI and strong responsive behavior.'}</p>
                        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-[#9f9f9f] uppercase tracking-[0.2em]">{project.technologies || 'HTML, CSS, JavaScript'}</p>
                      </div>
                    </a>
                  ) : (
                    <>
                      {project.image_url && (
                        <div className="relative h-28 sm:h-32 md:h-40 w-full bg-black/20">
                          <Image src={project.image_url} alt={project.title} fill className="object-contain p-4 sm:p-6" unoptimized />
                        </div>
                      )}
                      <div className="p-4 sm:p-5 md:p-6 lg:p-8">
                        <div className="flex items-center justify-between gap-4">
                          <h2 className="text-base sm:text-lg md:text-2xl font-bold">{project.title}</h2>
                        </div>
                        <p className="mt-3 sm:mt-4 text-sm leading-7 text-[#d4d4d4]">{project.description || 'A well-crafted project that demonstrates clean UI and strong responsive behavior.'}</p>
                        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-[#9f9f9f] uppercase tracking-[0.2em]">{project.technologies || 'HTML, CSS, JavaScript'}</p>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="socials" className="mx-auto max-w-5xl flex flex-col gap-5 sm:gap-6 md:gap-8 lg:gap-12 px-4 py-24 sm:px-6 lg:px-10 w-full">
          <div className="rounded-[28px] sm:rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#9f9f9f]">Connect</p>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold uppercase tracking-[0.06em] sm:tracking-[0.08em]">Social Profiles</h1>
            <p className="mt-4 text-sm leading-7 text-[#d4d4d4] max-w-2xl mx-auto">
              Follow me or send a message through any of these channels. I&apos;m always open to new opportunities and collaborations.
            </p>
          </div>

          {loadingSocials ? (
            <div className="rounded-[28px] sm:rounded-[32px] border border-white/10 bg-white/5 p-8 sm:p-10 text-center text-base sm:text-lg text-text-light shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              Loading socials...
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 md:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
