import React from 'react'
import { ChevronRight } from 'lucide-react'

export default function BackToTopButton({ scrolled }) {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`focus-ring fixed bottom-8 right-8 z-40 w-14 h-14 rounded-base bg-accent text-white shadow-extruded flex items-center justify-center transition-all duration-500 hover:-translate-y-1 hover:bg-accent-light hover:shadow-extruded-hover active:translate-y-0.5 active:shadow-inset-accent max:bg-linear-to-r max:from-[#FF3AF2] max:via-[#7B2FFF] max:to-[#00F5D4] max:border-4 max:border-[#FFE600] max:hover:scale-110 max:hover:brightness-110 max:hover:bg-linear-to-br max:animate-pulse-glow ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      aria-label="Back to Top"
    >
      <ChevronRight className="w-6 h-6 -rotate-90" />
    </button>
  )
}
