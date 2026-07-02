'use client'

import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="fixed top-5 right-5 z-[1000] text-text-light font-quicksand font-bold">
      <ul className="flex flex-row gap-8 list-none m-0 p-0 items-center">
        <li>
          <Link href="/" className="text-text-light no-underline hover:text-shadow-[0_0_10px_#cccccc] transition-all">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="text-text-light no-underline hover:text-shadow-[0_0_10px_#cccccc] transition-all">
            About
          </Link>
        </li>
        <li>
          <Link href="/socials" className="text-text-light no-underline hover:text-shadow-[0_0_10px_#cccccc] transition-all">
            Socials
          </Link>
        </li>
        <li>
          <Link href="/projects" className="text-text-light no-underline hover:text-shadow-[0_0_10px_#cccccc] transition-all">
            Projects
          </Link>
        </li>
      </ul>
    </nav>
  )
}

