import React from 'react'
import { BookOpen, Briefcase, Server, ChevronRight, Github } from 'lucide-react'
import coursewardImage from '../assets/courseward.jpg'
import doctorImage from '../assets/YourDoctor.png'

const projectAccents = [
  { border: 'max:border-accent', hover: 'max:hover:border-accent-2' },
  { border: 'max:border-accent-3', hover: 'max:hover:border-accent-4' },
  { border: 'max:border-accent-2', hover: 'max:hover:border-accent-5' },
]

export default function Projects({ expandedProject, setExpandedProject, setShowComingSoon }) {
  const projects = [
    {
      id: 'courseward',
      title: 'CourseWard',
      description: 'Academic project: E-learning platform where I learned to work with databases and manage user data.',
      image: coursewardImage,
      icon: <BookOpen className="w-6 h-6 text-accent" />,
      features: [
        { color: 'bg-accent', text: 'Gestion des cours et authentification' },
        { color: 'bg-accent-2', text: 'API REST complète' },
        { color: 'bg-accent-3', text: 'Interface utilisateur moderne' },
      ],
      technologies: ['React', 'Vite', 'Tailwind CSS', 'Express.js', 'PostgreSQL', 'Render'],
      liveDemo: 'https://courseward-14va.onrender.com/',
      sourceCode: null, // Shows coming soon modal
    },
    {
      id: 'quincaillerie',
      title: 'Quincaillerie Fassi',
      description: 'Fully functional e-commerce website for a hardware store with product catalog and customer management.',
      image: 'https://via.placeholder.com/800x400/f97316/ffffff?text=Quincaillerie+Fassi',
      icon: <Briefcase className="w-6 h-6 text-accent" />,
      features: [
        { color: 'bg-accent-3', text: 'Product catalog with search and filtering' },
        { color: 'bg-accent-4', text: 'Shopping cart and checkout system' },
        { color: 'bg-accent-5', text: 'User authentication and admin dashboard' },
      ],
      technologies: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'MongoDB'],
      liveDemo: 'http://quincailleriefassi.ma/',
      sourceCode: 'https://github.com/younes1528/quincaillierie_fassi',
    },
    {
      id: 'doctor',
      title: 'Your Doctor',
      description: 'Team project: Medical platform that taught me about data modeling and CRUD operations.',
      image: doctorImage,
      icon: <Server className="w-6 h-6 text-accent" />,
      features: [
        { color: 'bg-accent-2', text: 'Prise de rendez-vous en ligne' },
        { color: 'bg-accent-5', text: 'Gestion des dossiers médicaux' },
        { color: 'bg-accent-4', text: 'Notifications automatiques' },
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Socket.io', 'JWT'],
      liveDemo: '#',
      sourceCode: null, // Shows coming soon modal
    },
  ]

  return (
    <section id="projects" className="relative mt-32 py-12">
      {/* Massive background word */}
      <div aria-hidden className="hidden max:block absolute -right-4 top-1/2 -translate-y-1/2 font-display font-black leading-none text-[9rem] lg:text-[16rem] text-accent/15 select-none pointer-events-none">
        PROJECTS
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-shadow-heading max:text-6xl max:md:text-7xl max:uppercase max:tracking-wide">
            Featured Projects
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto max:text-white/80 max:font-medium">
            Some of my recent work that I'm proud of
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 reveal">
          {projects.map((project, index) => {
            const accent = projectAccents[index % projectAccents.length]
            const rotate = index % 2 === 0 ? 'max:rotate-1' : 'max:-rotate-1'

            return (
              <div
                key={project.id}
                className={`group relative bg-surface rounded-card overflow-hidden shadow-extruded transition-all duration-500 cursor-pointer focus-ring max:bg-container/80 max:backdrop-blur-sm max:border-4 ${accent.border} ${accent.hover} ${rotate} max:hover:rotate-0 max:hover:scale-[1.02] ${expandedProject === project.id ? 'lg:col-span-2' : 'hover:-translate-y-2 hover:shadow-extruded-hover'}`}
                onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                role="button"
                tabIndex={0}
                aria-expanded={expandedProject === project.id}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setExpandedProject(expandedProject === project.id ? null : project.id)
                  }
                }}
              >
                {/* Project Image */}
                <div className={`relative overflow-hidden transition-all duration-500 ${expandedProject === project.id ? 'h-80' : 'h-64'}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
                  {/* Maximalism: neon wash + dashed frame on project art */}
                  <div aria-hidden className="hidden max:block absolute inset-0 bg-linear-to-br from-[#FF3AF2]/35 via-[#7B2FFF]/25 to-[#00F5D4]/35 mix-blend-screen" />
                  <div aria-hidden className="hidden max:block absolute inset-4 border-4 border-dashed border-white/40 rounded-3xl pointer-events-none" />

                  {/* Click indicator */}
                  <div className="absolute top-4 right-4 bg-surface px-3 py-1 rounded-full text-xs font-medium shadow-extruded-sm max:bg-container/90 max:border-2 max:border-accent-3">
                    {expandedProject === project.id ? 'Click to collapse' : 'Click to expand'}
                  </div>
                </div>

                <div className="relative p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4 max:border-b-4 max:border-dashed max:border-accent-3 max:pb-4">
                    <div className="w-12 h-12 rounded-base bg-surface shadow-inset-deep flex items-center justify-center shrink-0 max:bg-container max:border-4 max:border-dashed max:border-accent-2">
                      {project.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-shadow-title max:text-3xl max:uppercase max:tracking-wide">{project.title}</h3>
                  </div>

                  <p className="text-muted mb-4 text-sm leading-relaxed max:text-white/80 max:text-base">
                    {project.description}
                  </p>

                  {/* Key Features - Hidden by default, shown on click */}
                  <div className={`transition-all duration-500 overflow-hidden ${expandedProject === project.id ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                    <h4 className="font-semibold mb-3 text-foreground max:uppercase max:tracking-wider max:text-accent-2">Key Features:</h4>
                    <ul className="space-y-2 text-muted max:text-white/80">
                      {project.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className={`w-2 h-2 ${feature.color} rounded-full`}></div>
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-foreground max:uppercase max:tracking-wider max:text-accent-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-surface shadow-inset-sm text-muted rounded-full text-sm font-medium max:bg-transparent max:border-2 max:border-accent-4/60 max:text-white/90">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 flex-wrap">
                    <a href={project.liveDemo} target="_blank" rel="noopener" className="focus-ring inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-base font-semibold shadow-extruded transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-light hover:shadow-extruded-hover active:translate-y-0.5 active:shadow-inset-accent max:bg-linear-to-r max:from-[#FF3AF2] max:via-[#7B2FFF] max:to-[#00F5D4] max:border-4 max:border-[#FFE600] max:font-black max:uppercase max:tracking-widest max:hover:scale-105 max:hover:brightness-110 max:hover:bg-linear-to-br">
                      <ChevronRight className="w-4 h-4" />
                      Live Demo
                    </a>
                    {project.sourceCode ? (
                      <a href={project.sourceCode} target="_blank" rel="noopener" className="focus-ring inline-flex items-center gap-2 bg-surface text-foreground px-6 py-3 rounded-base font-semibold shadow-extruded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-extruded-hover active:translate-y-0.5 active:shadow-inset-sm max:bg-transparent max:border-4 max:border-dashed max:border-accent-3 max:font-black max:uppercase max:tracking-widest max:hover:border-solid max:hover:bg-accent-3 max:hover:text-[#0D0D1A]">
                        <Github className="w-4 h-4" />
                        Source Code
                      </a>
                    ) : (
                      <button onClick={() => setShowComingSoon(true)} className="focus-ring inline-flex items-center gap-2 bg-surface text-foreground px-6 py-3 rounded-base font-semibold shadow-extruded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-extruded-hover active:translate-y-0.5 active:shadow-inset-sm max:bg-transparent max:border-4 max:border-dashed max:border-accent-3 max:font-black max:uppercase max:tracking-widest max:hover:border-solid max:hover:bg-accent-3 max:hover:text-[#0D0D1A]">
                        <Github className="w-4 h-4" />
                        Source Code
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <a href="https://github.com/younes0basir" target="_blank" rel="noopener" className="focus-ring inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-base font-bold text-lg shadow-extruded transition-all duration-300 hover:-translate-y-1 hover:bg-accent-light hover:shadow-extruded-hover active:translate-y-0.5 active:shadow-inset-accent max:bg-linear-to-r max:from-[#FF3AF2] max:via-[#7B2FFF] max:to-[#00F5D4] max:border-4 max:border-[#FFE600] max:font-black max:uppercase max:tracking-widest max:hover:scale-110 max:hover:brightness-110 max:hover:bg-linear-to-br">
            <Github className="w-6 h-6" />
            View All Projects
          </a>
        </div>
      </div>
    </section>
  )
}
