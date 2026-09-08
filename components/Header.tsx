export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] text-text-light">personal website</span>
        <div className="hidden md:block h-px flex-1 bg-white/10 mx-4 lg:mx-6"></div>
        <span className="hidden sm:block text-xs sm:text-xs md:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.4em] text-[#aaaaaa]">josh cabradilla</span>
      </div>
    </header>
  )
}

