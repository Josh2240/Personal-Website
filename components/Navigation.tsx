'use client'

import { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/socials', label: 'Socials' },
  { href: '/projects', label: 'Projects' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed right-5 top-5 z-[1000]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white shadow-sm transition hover:bg-white/10 md:hidden"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <ul
          className={`absolute right-0 top-full mt-3 w-48 origin-top-right rounded-3xl border border-white/10 bg-black/90 p-4 backdrop-blur-xl shadow-xl transition-all duration-300 md:static md:mt-0 md:w-auto md:bg-transparent md:border-0 md:p-0 md:shadow-none ${
            isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          } md:opacity-100 md:pointer-events-auto md:flex md:flex-row md:items-center md:gap-8`}
        >
          {navItems.map((item) => (
            <li key={item.href} className="md:relative">
              <Link
                href={item.href}
                className="block rounded-full px-3 py-2 text-sm font-semibold text-text-light no-underline transition hover:text-white md:px-0 md:py-0"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

