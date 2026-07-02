'use client'

import { useEffect, useState } from 'react'
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
    title: 'Portfolio Redesign',
    description: 'A polished showcase site with modern UI, clear navigation, and responsive layout.',
    link: 'https://github.com/Josh2240',
    technologies: 'Next.js, Tailwind CSS, React',
  },
  {
    id: 2,
    title: 'Interactive Profile',
    description: 'A profile page with dynamic content loading and a clean presentation layer.',
    technologies: 'JavaScript, PHP, MySQL',
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api'
      const response = await fetch(`${apiUrl}/projects.php`)
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
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 sm:gap-10 px-4 py-24 sm:px-6 lg:px-10 w-full">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-[#9f9f9f]">Projects</p>
              <h1 className="mt-4 text-4xl font-bold uppercase tracking-[0.08em]">Recent Work</h1>
            </div>
            <p className="max-w-md text-sm text-[#cccccc] sm:text-right">
              A collection of projects that show how I build clean, usable, and responsive experiences.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-lg text-text-light shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            Loading projects...
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.id} className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold">{project.title}</h2>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-[0.2em] text-[#9f9f9f] transition hover:text-text-light">
                      Visit
                    </a>
                  )}
                </div>
                <p className="mt-4 text-base leading-7 text-[#d4d4d4]">{project.description || 'A well-crafted project that demonstrates clean UI and strong responsive behavior.'}</p>
                <p className="mt-6 text-sm text-[#9f9f9f] uppercase tracking-[0.2em]">{project.technologies || 'HTML, CSS, JavaScript'}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

