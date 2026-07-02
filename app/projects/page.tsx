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
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Header />
      <Navigation />
      <main className="bg-transparent w-full h-screen overflow-y-auto relative pb-10 overflow-hidden">
        <div id="projects-container" className="relative w-full h-full">
          {loading ? (
            <div className="bg-transparent h-[50px] w-[45%] flex justify-center items-center absolute top-[45%] left-[25%]">
              <span className="text-text-light font-quicksand font-bold animate-zoom-in">
                Loading projects...
              </span>
            </div>
          ) : projects.length > 0 ? (
            <>
              <span className="font-quicksand font-bold absolute text-5xl top-[20%] left-[45%] animate-zoom-in">
                Projects
              </span>
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="absolute top-[30%] left-[20%] w-[60%] p-5 bg-white/5 rounded-[10px] mb-5 animate-zoom-in"
                  style={{ top: `${30 + index * 15}%` }}
                >
                  <h3 className="text-text-light font-quicksand mb-2.5">{project.title}</h3>
                  {project.description && (
                    <p className="text-text-light mb-2.5">{project.description}</p>
                  )}
                  {project.technologies && (
                    <small className="text-text-light opacity-70">{project.technologies}</small>
                  )}
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-text-light block mt-2.5 hover:text-shadow-[0_0_10px_#cccccc] transition-all"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="bg-transparent h-[50px] w-[45%] flex justify-center items-center absolute top-[45%] left-[25%]">
              <span className="text-text-light font-quicksand font-bold animate-zoom-in">
                No projects available yet
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

