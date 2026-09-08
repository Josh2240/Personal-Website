'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'

interface Project {
  id: number
  title: string
  description?: string
  link?: string
  technologies?: string
  image_url?: string
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
    link: 'https://github.com/Josh2240/SSC_Violation_Auditing',
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
    link: 'https://github.com/Josh2240/Dance-Tabulation-',
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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

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
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background text-text-light overflow-hidden">
      <Header />
      <Navigation />
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-5 sm:gap-6 md:gap-8 lg:gap-10 px-4 py-24 sm:px-6 lg:px-10 w-full">
        <section className="rounded-[28px] sm:rounded-[32px] border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#9f9f9f]">Projects</p>
              <h1 className="mt-4 text-3xl sm:text-4xl font-bold uppercase tracking-[0.06em] sm:tracking-[0.08em]">Recent Work</h1>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-[#cccccc] sm:text-right">
              A collection of projects that show how I build clean, usable, and responsive experiences.
            </p>
          </div>
        </section>

        {loading ? (
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
      </main>
    </div>
  )
}

