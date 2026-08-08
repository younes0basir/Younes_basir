import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import TechStack from './TechStack'
import Projects from './Projects'
import Contact from './Contact'
import ComingSoonModal from './ComingSoonModal'
import BackToTopButton from './BackToTopButton'

export default function Home() {
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('theme-max')
      ? 'max'
      : 'neum'
  )
  const [scrolled, setScrolled] = useState(false)
  const [expandedProject, setExpandedProject] = useState(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [sweeping, setSweeping] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('theme-max', theme === 'max')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100
      setScrolled(scrolled)

      // Scroll progress for top bar
      const totalHeight = document.body.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setSweeping(true)
    setTimeout(() => {
      setTheme((t) => (t === 'neum' ? 'max' : 'neum'))
      setSweeping(false)
    }, 300)
  }

  return (
    <>
      {/* Whole-page theme sweep transition */}
      {sweeping && <div aria-hidden className="fixed inset-0 z-[70] pointer-events-none theme-sweep" />}

      {/* Global pattern layers (maximalism) */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none hidden max:block pattern-mesh" />
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none hidden max:block pattern-dots opacity-40 mix-blend-screen" />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 z-50 h-1.5 w-full bg-surface shadow-inset-sm transition-colors duration-500 max:h-2 max:bg-container/70">
        <div
          className="h-full bg-accent transition-all duration-300 max:animate-pulse-glow"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="relative min-h-screen bg-surface text-foreground transition-colors duration-500">
        {/* Navbar */}
        <Navbar theme={theme} onToggleTheme={toggleTheme} scrolled={scrolled} />

        {/* Hero Section */}
        <Hero />

        {/* Tech Stack Section */}
        <TechStack />

        {/* Projects Section */}
        <Projects
          expandedProject={expandedProject}
          setExpandedProject={setExpandedProject}
          setShowComingSoon={setShowComingSoon}
        />

        {/* Contact Section */}
        <Contact />

        {/* Back to Top Button */}
        <BackToTopButton scrolled={scrolled} />

        {/* Coming Soon Modal */}
        <ComingSoonModal
          show={showComingSoon}
          onClose={() => setShowComingSoon(false)}
        />
      </div>
    </>
  )
}
