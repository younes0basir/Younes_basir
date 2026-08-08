import React, { useState } from 'react'
import { Github, Linkedin, Menu, X, Layers, Sparkles } from 'lucide-react'

const navItems = ['Home', 'About', 'Projects', 'Contact']

export default function Navbar({ theme, onToggleTheme, scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={`fixed top-6 z-40 flex pointer-events-none transition-all duration-700 ${scrolled ? 'left-6 justify-start' : 'inset-x-0 justify-center'}`}>
      <div className={`pointer-events-auto transition-all duration-700 ${scrolled && !menuOpen ? 'scale-90 opacity-40 hover:opacity-100' : 'scale-100 opacity-100'} max:scale-100 max:opacity-100`}>
        <div className={`flex items-center gap-4 lg:gap-7 bg-surface shadow-extruded transition-all duration-700 ${scrolled ? 'px-5 py-2.5 rounded-base' : 'px-8 py-4 rounded-full'} max:bg-container/70 max:backdrop-blur-xl max:border-4 max:border-accent`}>
          {/* Logo */}
          <a href="#home" aria-label="Go to Home" className="focus-ring group">
            <div className="w-11 h-11 rounded-full bg-surface shadow-extruded-sm flex items-center justify-center font-display font-extrabold text-accent transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-extruded max:bg-container max:border-4 max:border-accent-3 max:bg-linear-to-br max:from-[#FF3AF2] max:via-[#7B2FFF] max:to-[#00F5D4] max:text-white max:shadow-extruded max:animate-pulse-glow">
              YB
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-2 font-medium">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="focus-ring px-4 py-2 rounded-base text-muted hover:text-foreground hover:bg-surface hover:shadow-inset-sm transition-all duration-300 max:uppercase max:tracking-widest max:text-sm max:font-bold max:hover:bg-container"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop Socials + Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="https://github.com/younes0basir" target="_blank" rel="noopener" aria-label="GitHub Profile" className="focus-ring w-11 h-11 rounded-full bg-surface shadow-extruded-sm flex items-center justify-center text-muted hover:text-accent hover:-translate-y-0.5 hover:shadow-extruded transition-all duration-300 max:border-4 max:border-accent-2">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/in/younes-basir" target="_blank" rel="noopener" aria-label="LinkedIn Profile" className="focus-ring w-11 h-11 rounded-full bg-surface shadow-extruded-sm flex items-center justify-center text-muted hover:text-accent hover:-translate-y-0.5 hover:shadow-extruded transition-all duration-300 max:border-4 max:border-accent-5">
              <Linkedin className="w-5 h-5" />
            </a>
            <button
              onClick={onToggleTheme}
              className="focus-ring inline-flex items-center gap-2 h-11 px-4 rounded-full bg-surface shadow-extruded-sm text-accent hover:-translate-y-0.5 hover:shadow-extruded transition-all duration-300 max:bg-container max:border-4 max:border-accent-3 max:hover:rotate-2"
              aria-label={theme === 'max' ? 'Switch to Soft UI theme' : 'Switch to Maximalism theme'}
              title={theme === 'max' ? 'Switch to Soft UI' : 'Switch to Maximalism'}
            >
              {theme === 'max' ? <Sparkles className="w-5 h-5 text-accent-3" /> : <Layers className="w-5 h-5" />}
              <span className="hidden sm:inline text-xs font-black uppercase tracking-widest text-muted max:text-white">
                {theme === 'max' ? 'Max' : 'Soft UI'}
              </span>
            </button>
          </div>

          {/* Mobile: Theme Toggle + Hamburger */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={onToggleTheme}
              className="focus-ring w-11 h-11 rounded-full bg-surface shadow-inset-sm flex items-center justify-center text-accent transition-all duration-300 max:bg-container max:border-4 max:border-accent-3"
              aria-label={theme === 'max' ? 'Switch to Soft UI theme' : 'Switch to Maximalism theme'}
            >
              {theme === 'max' ? <Sparkles className="w-5 h-5 text-accent-3" /> : <Layers className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus-ring w-11 h-11 rounded-full bg-surface shadow-inset-sm flex items-center justify-center text-foreground transition-all duration-300 max:bg-container max:border-4 max:border-accent"
              aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden mt-4 bg-surface shadow-extruded rounded-card p-6 space-y-1 max:bg-container/90 max:backdrop-blur-xl max:border-4 max:border-accent-3">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="focus-ring block px-4 py-3 rounded-base font-medium text-muted hover:text-foreground hover:bg-surface hover:shadow-inset-sm transition-all duration-300 max:uppercase max:tracking-widest max:font-bold max:hover:bg-container"
              >
                {item}
              </a>
            ))}
            <div className="flex gap-3 pt-4">
              <a href="https://github.com/younes0basir" target="_blank" rel="noopener" aria-label="GitHub Profile" className="focus-ring w-11 h-11 rounded-full bg-surface shadow-extruded-sm flex items-center justify-center text-muted hover:text-accent transition-all duration-300 max:border-4 max:border-accent-2">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/younes-basir" target="_blank" rel="noopener" aria-label="LinkedIn Profile" className="focus-ring w-11 h-11 rounded-full bg-surface shadow-extruded-sm flex items-center justify-center text-muted hover:text-accent transition-all duration-300 max:border-4 max:border-accent-5">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
