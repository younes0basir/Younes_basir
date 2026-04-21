import React, { useState, useEffect } from 'react'
import {
  Github,
  Linkedin,
  Mail,
  ChevronRight,
  Code,
  Server,
  Cloud,
  BookOpen,
  Building,
  Moon,
  Sun,
  Terminal,
  Zap,
  Trophy,
  Briefcase,
  FileCode,
  Database,
  Container,
  BarChart3
} from 'lucide-react'
import photo from '../assets/younes.jpg'
import coursewardImage from '../assets/courseward.jpg'
import doctorImage from '../assets/YourDoctor.png'
import cvFile from '../assets/cv_younes_basir.pdf'

function AvatarWithFallback({ src, initials, size = 160 }) {
  const [errored, setErrored] = useState(false)

  if (errored || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white font-bold text-5xl rounded-full bg-linear-to-br from-blue-600 to-purple-700">
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt="Younes Basir"
      onError={() => setErrored(true)}
      className="w-full h-full object-cover rounded-full"
      loading="lazy"
    />
  )
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expandedProject, setExpandedProject] = useState(null)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

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

  const techStack = [
    { label: 'Python', icon: <FileCode className="w-8 h-8 text-yellow-500" />, level: 70 },
    { label: 'SQL', icon: <Database className="w-8 h-8 text-blue-600" />, level: 65 },
    { label: 'Excel / Sheets', icon: <FileCode className="w-8 h-8 text-green-600" />, level: 80 },
    { label: 'React', icon: <Code className="w-8 h-8 text-blue-400" />, level: 75 },
    { label: 'JavaScript', icon: <FileCode className="w-8 h-8 text-yellow-400" />, level: 70 },
    { label: 'Git / GitHub', icon: <Code className="w-8 h-8 text-gray-600" />, level: 60 },
    { label: 'Pandas / NumPy', icon: <FileCode className="w-8 h-8 text-purple-500" />, level: 50 },
    { label: 'Data Visualization', icon: <BarChart3 className="w-8 h-8 text-pink-500" />, level: 45 },
  ]

  const experiences = [
    { year: "2025", title: "3rd Year Student", company: "Software Engineering", current: true },
    { year: "2024", title: "Built CourseWard & Your Doctor", company: "Academic Projects", desc: "Full-stack web applications" },
    { year: "2023", title: "Started Learning Data Analysis", company: "Self-Study", desc: "Python, SQL, Excel" },
    { year: "2022", title: "First Programming Course", company: "University", desc: "Python & Java fundamentals" },
  ]

  const achievements = [
    { icon: <Trophy className="w-6 h-6" />, title: "Academic Excellence", desc: "GPA 3.5+/4.0" },
    { icon: <Zap className="w-6 h-6" />, title: "Team Projects", desc: "Led 2 successful web applications" },
    { icon: <Terminal className="w-6 h-6" />, title: "Self-Learner", desc: "Completed online data analysis courses" },
  ]

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
        {/* Floating Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        {/* Modern Floating Pill Navbar */}
        <nav className={`fixed top-6 z-40 flex pointer-events-none transition-all duration-700 ${scrolled ? 'left-6 justify-start' : 'inset-x-0 justify-center'}`}>
          <div className={`pointer-events-auto transition-all duration-700 ${scrolled ? 'scale-90 opacity-30 hover:opacity-95' : 'scale-100 opacity-100'}`}>
            <div className={`bg-white/70 dark:bg-gray-950/80 backdrop-blur-2xl shadow-2xl border border-white/20 dark:border-white/10 flex items-center gap-12 transition-all duration-700 ${scrolled ? 'px-6 py-3 rounded-2xl' : 'px-10 py-5 rounded-full'}`}>
              {/* Glowing Logo */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-lg opacity-60 group-hover:opacity-90 transition duration-1000"></div>
                <div className="relative w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-2xl">
                  YB
                </div>
              </div>

              {/* Navigation Links */}
              <div className="hidden lg:flex items-center gap-10 font-medium">
                {['Home', 'About', 'Projects', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="relative py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-linear-to-r after:from-blue-600 after:to-purple-600 after:transition-all after:duration-500 hover:after:w-full"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-5">
                <a href="https://github.com/younes0basir" target="_blank" rel="noopener" className="hover:text-blue-600 transition">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/in/younes-basir" target="_blank" rel="noopener" className="hover:text-blue-600 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-full bg-gray-200 dark:bg-gray-800 hover:ring-4 hover:ring-purple-500/30 transition-all"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="relative pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
                  <Building className="w-5 h-5" />
                  <span>3rd Year Software Engineering Student • Seeking Data Internship</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Hey, I'm <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Younes Basir</span>
                </h1>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a href="mailto:younes@example.com" className="inline-flex items-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:scale-110 transition shadow-2xl">
                    <Mail className="w-7 h-7" />
                    Get In Touch
                  </a>
                  <a href={cvFile} download="Younes_Basir_CV.pdf" className="inline-flex items-center gap-3 border-2 border-gray-900 dark:border-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition">
                    Download CV <ChevronRight className="w-5 h-5" />
                  </a>
                </div>

                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  I'm passionate about turning <span className="font-bold text-blue-600">data into insights</span> and building{' '}
                  <span className="font-bold text-purple-600">web applications</span> that solve real problems.
                </p>

                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  Currently in my 3rd year of Software Engineering, exploring the world of data analysis and eager to apply my skills in a professional setting.
                </p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                  <div className="bg-linear-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                      <h4 className="font-bold">Currently Mastering</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <span className="block bg-white/70 dark:bg-gray-800/70 px-3 py-1 rounded-lg">Data Analysis with Python</span>
                      <span className="block bg-white/70 dark:bg-gray-800/70 px-3 py-1 rounded-lg">SQL for Data Querying</span>
                      <span className="block bg-white/70 dark:bg-gray-800/70 px-3 py-1 rounded-lg">Data Visualization & Storytelling</span>
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-purple-50 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 p-6 rounded-2xl border border-purple-200 dark:border-purple-800">
                    <h4 className="font-bold mb-4 flex items-center gap-3">
                      <Zap className="w-6 h-6 text-purple-600" /> Quick Stats
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span>Academic Projects</span><strong>2</strong></div>
                      <div className="flex justify-between"><span>Courses Completed</span><strong>5+</strong></div>
                      <div className="flex justify-between"><span>Ready to Learn</span><strong>100%</strong></div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-4 pt-6">
                  <a href="#projects"
                    className="group inline-flex items-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300">
                    <span>Explore My Work</span>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </a>

                  <a href="mailto:younes@example.com"
                    className="inline-flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all">
                    <Mail className="w-6 h-6" />
                    <span>Hire Me</span>
                  </a>
                </div>
              </div>

              {/* Hero Card */}
              <div className="relative flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition duration-1000"></div>
                  <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-2xl border border-gray-200 dark:border-gray-700">
                    <div className="text-center space-y-6">
                      <div className="w-48 h-48 mx-auto rounded-full overflow-hidden ring-8 ring-blue-500/20">
                        <AvatarWithFallback src={photo} initials="YB" />
                      </div>

                      <div>
                        <h2 className="text-3xl font-bold">Younes Basir</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Aspiring Data Analyst</p>
                        <div className="flex justify-center gap-8 mt-6">
                          <div className="text-center">
                            <Code className="w-8 h-8 mx-auto text-blue-600" />
                            <p className="text-xs mt-1">Frontend</p>
                          </div>
                          <div className="text-center">
                            <Server className="w-8 h-8 mx-auto text-green-600" />
                            <p className="text-xs mt-1">Backend</p>
                          </div>
                          <div className="text-center">
                            <Cloud className="w-8 h-8 mx-auto text-purple-600" />
                            <p className="text-xs mt-1">DevOps</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 text-center">
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                          <div className="text-3xl font-bold text-blue-600">2</div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Projects</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl">
                          <div className="text-3xl font-bold text-purple-600">3.5+</div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">GPA</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute -left-10 top-10 bg-yellow-100 dark:bg-yellow-800 p-4 rounded-2xl shadow-lg animate-float">
                  <p className="text-sm font-bold">Always Learning</p>
                </div>
                <div className="absolute -right-8 bottom-16 bg-pink-100 dark:bg-pink-900 p-4 rounded-2xl shadow-lg animate-float animation-delay-2000">
                  <p className="text-sm font-bold">Problem Solver</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 bg-green-100 dark:bg-green-900 p-4 rounded-2xl shadow-lg animate-bounce">
                  <p className="text-sm font-bold">Let's Build Something Great!</p>
                </div>
              </div>
            </div>

            {/* Rest of your sections (Tech Stack, Timeline, Achievements, CTA) */}
            {/* ... keep exactly as you had them — they’re already perfect! */}
            {/* I’ll just paste the Tech Stack part for completeness */}

            <div className="mt-24">
              <h3 className="text-center text-lg font-semibold text-gray-600 dark:text-gray-400 mb-8">Tech Stack & Tools I Love</h3>
              <div className="flex flex-wrap justify-center gap-6">
                {techStack.map((tech) => (
                  <div
                    key={tech.label}
                    className="group relative bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{tech.icon}</span>
                      <div>
                        <p className="font-semibold">{tech.label}</p>
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-linear-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${tech.level}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <section id="projects" className="mt-32">
              <div className="container mx-auto max-w-7xl px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Featured Projects
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Some of my recent work that I'm proud of
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* CourseWard Project */}
                  <div
                    className={`group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-500 cursor-pointer ${expandedProject === 'courseward' ? 'lg:col-span-2' : 'hover:shadow-3xl hover:-translate-y-2'
                      }`}
                    onClick={() => setExpandedProject(expandedProject === 'courseward' ? null : 'courseward')}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Project Image */}
                    <div className={`relative overflow-hidden transition-all duration-500 ${expandedProject === 'courseward' ? 'h-80' : 'h-64'
                      }`}>
                      <img
                        src={coursewardImage}
                        alt="CourseWard E-learning Platform"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>

                      {/* Click indicator */}
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full text-xs font-medium">
                        {expandedProject === 'courseward' ? 'Click to collapse' : 'Click to expand'}
                      </div>
                    </div>

                    <div className="relative p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold">CourseWard</h3>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                        Academic project: E-learning platform where I learned to work with databases and manage user data.
                      </p>

                      {/* Key Features - Hidden by default, shown on click */}
                      <div className={`transition-all duration-500 overflow-hidden ${expandedProject === 'courseward' ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'
                        }`}>
                        <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Key Features:</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Gestion des cours et authentification
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            API REST complète
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            Interface utilisateur moderne
                          </li>
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {['React', 'Vite', 'Tailwind CSS', 'Express.js', 'PostgreSQL', 'Render'].map((tech) => (
                            <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <a href="https://courseward-14va.onrender.com/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
                          <ChevronRight className="w-4 h-4" />
                          Live Demo
                        </a>
                        <button onClick={() => setShowComingSoon(true)} className="inline-flex items-center gap-2 border-2 border-gray-900 dark:border-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition">
                          <Github className="w-4 h-4" />
                          Source Code
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Your Doctor Project */}
                  <div
                    className={`group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-500 cursor-pointer ${expandedProject === 'doctor' ? 'lg:col-span-2' : 'hover:shadow-3xl hover:-translate-y-2'
                      }`}
                    onClick={() => setExpandedProject(expandedProject === 'doctor' ? null : 'doctor')}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-green-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Project Image */}
                    <div className={`relative overflow-hidden transition-all duration-500 ${expandedProject === 'doctor' ? 'h-80' : 'h-64'
                      }`}>
                      <img
                        src={doctorImage}
                        alt="Your Doctor Medical Platform"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>

                      {/* Click indicator */}
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full text-xs font-medium">
                        {expandedProject === 'doctor' ? 'Click to collapse' : 'Click to expand'}
                      </div>
                    </div>

                    <div className="relative p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-linear-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                          <Server className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold">Your Doctor</h3>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                        Team project: Medical platform that taught me about data modeling and CRUD operations.
                      </p>

                      {/* Key Features - Hidden by default, shown on click */}
                      <div className={`transition-all duration-500 overflow-hidden ${expandedProject === 'doctor' ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'
                        }`}>
                        <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Key Features:</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Prise de rendez-vous en ligne
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Gestion des dossiers médicaux
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            Notifications automatiques
                          </li>
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {['React', 'Node.js', 'MongoDB', 'Express', 'Socket.io', 'JWT'].map((tech) => (
                            <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <a href="#" className="inline-flex items-center gap-2 bg-linear-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
                          <ChevronRight className="w-4 h-4" />
                          Live Demo
                        </a>
                        <button onClick={() => setShowComingSoon(true)} className="inline-flex items-center gap-2 border-2 border-gray-900 dark:border-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition">
                          <Github className="w-4 h-4" />
                          Source Code
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-12">
                  <a href="https://github.com/younes0basir" target="_blank" rel="noopener" className="inline-flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition">
                    <Github className="w-6 h-6" />
                    View All Projects
                  </a>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="mt-32 pb-20">
              <div className="container mx-auto max-w-7xl px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Let's Connect
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Have a project in mind or want to collaborate? I'd love to hear from you!
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Contact Form */}
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                    <form className="space-y-6" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const name = formData.get('name');
                      const email = formData.get('email');
                      const message = formData.get('message');

                      // Create mailto link
                      const subject = encodeURIComponent(`New message from ${name}`);
                      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
                      window.location.href = `mailto:younes.basir@example.com?subject=${subject}&body=${body}`;
                    }}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Your Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Message
                        </label>
                        <textarea
                          name="message"
                          required
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                          placeholder="Tell me about your project..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition shadow-2xl flex items-center justify-center gap-3"
                      >
                        <Mail className="w-6 h-6" />
                        Send Message
                      </button>
                    </form>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-8">
                    <div className="bg-linear-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-3xl p-8 border border-blue-200 dark:border-blue-800">
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Mail className="w-8 h-8 text-blue-600" />
                        Get in Touch
                      </h3>
                      <div className="space-y-4">
                        <a
                          href="mailto:younes.basir@example.com"
                          className="block text-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                          younes.basir@example.com
                        </a>
                        <p className="text-gray-600 dark:text-gray-400">
                          I'll get back to you within 24 hours
                        </p>
                      </div>
                    </div>

                    <div className="bg-linear-to-br from-purple-50 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 rounded-3xl p-8 border border-purple-200 dark:border-purple-800">
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Github className="w-8 h-8 text-purple-600" />
                        Let's Collaborate
                      </h3>
                      <div className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300">
                          Actively seeking a data internship to apply my skills and learn from experienced professionals
                        </p>
                        <div className="flex gap-4">
                          <a
                            href="https://github.com/younes0basir"
                            target="_blank"
                            rel="noopener"
                            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
                          >
                            <Github className="w-5 h-5" />
                            GitHub
                          </a>
                          <a
                            href="https://linkedin.com/in/younes-basir"
                            target="_blank"
                            rel="noopener"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
                          >
                            <Linkedin className="w-5 h-5" />
                            LinkedIn
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700 transform scale-100 animate-fade-in">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Github className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                Coming Soon!
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Source code for this project will be available soon. I'm currently preparing the repository for public release.
              </p>

              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  In the meantime, check out my other projects on GitHub:
                </p>
                <a
                  href="https://github.com/younes0basir"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
                >
                  <Github className="w-5 h-5" />
                  View My GitHub
                </a>
              </div>

              <button
                onClick={() => setShowComingSoon(false)}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}