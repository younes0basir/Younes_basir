import React from 'react'
import { Github } from 'lucide-react'

export default function ComingSoonModal({ show, onClose }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 flex items-center justify-center p-4 max:bg-black/70" onClick={onClose}>
      <div className="bg-surface rounded-card p-8 md:p-10 max-w-md w-full shadow-extruded transform transition-all max:bg-container max:border-4 max:border-accent-3 max:rotate-1 max:animate-pulse-glow" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-surface shadow-inset-deep flex items-center justify-center mx-auto mb-6 max:bg-container max:border-4 max:border-dashed max:border-accent-2">
            <Github className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-shadow-title max:text-3xl max:uppercase max:tracking-wide">Coming Soon</h3>
          <p className="text-muted mb-6 max:text-white/80">
            The source code for this project will be available soon. Stay tuned for updates!
          </p>
          <button
            onClick={onClose}
            className="focus-ring w-full bg-accent text-white px-6 py-3.5 rounded-base font-semibold shadow-extruded transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-light hover:shadow-extruded-hover active:translate-y-0.5 active:shadow-inset-accent max:bg-linear-to-r max:from-[#FF3AF2] max:via-[#7B2FFF] max:to-[#00F5D4] max:border-4 max:border-[#FFE600] max:font-black max:uppercase max:tracking-widest max:hover:scale-105 max:hover:brightness-110 max:hover:bg-linear-to-br"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
