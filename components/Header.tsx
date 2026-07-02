export default function Header() {
  return (
    <header className="bg-transparent w-full min-w-screen h-[90px] fixed flex items-center justify-center">
      <span className="text-text-light font-quicksand font-bold uppercase absolute top-[20%] left-[5%] animate-zoom-in">
        personal website
      </span>
      <div className="bg-header w-full min-w-screen h-[3px] absolute top-[60%] left-0 shadow-[0_0_10px_#f3f3f3f3]"></div>
    </header>
  )
}

