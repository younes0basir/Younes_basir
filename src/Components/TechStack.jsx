import React from 'react'
import { FileCode, Database, Code, BarChart3 } from 'lucide-react'

const accentCycles = [
  { border: 'max:border-accent', fill: 'bg-accent', text: 'text-accent' },
  { border: 'max:border-accent-2', fill: 'bg-accent-2', text: 'text-accent-2' },
  { border: 'max:border-accent-3', fill: 'bg-accent-3', text: 'text-accent-3' },
  { border: 'max:border-accent-4', fill: 'bg-accent-4', text: 'text-accent-4' },
  { border: 'max:border-accent-5', fill: 'bg-accent-5', text: 'text-accent-5' },
]

export default function TechStack() {
  const techStack = [
    { label: 'Python', icon: <FileCode className="w-7 h-7 text-accent" />, level: 70 },
    { label: 'SQL', icon: <Database className="w-7 h-7 text-accent" />, level: 65 },
    { label: 'Excel / Sheets', icon: <FileCode className="w-7 h-7 text-accent" />, level: 80 },
    { label: 'React', icon: <Code className="w-7 h-7 text-accent" />, level: 75 },
    { label: 'JavaScript', icon: <FileCode className="w-7 h-7 text-accent" />, level: 70 },
    { label: 'Git / GitHub', icon: <Code className="w-7 h-7 text-accent" />, level: 60 },
    { label: 'Pandas / NumPy', icon: <FileCode className="w-7 h-7 text-accent" />, level: 50 },
    { label: 'Data Visualization', icon: <BarChart3 className="w-7 h-7 text-accent" />, level: 45 },
  ]

  return (
    <div id="about" className="relative mt-32 py-12 reveal">
      {/* Massive background word */}
      <div aria-hidden className="hidden max:block absolute -left-4 top-1/2 -translate-y-1/2 font-display font-black leading-none text-[8rem] lg:text-[16rem] text-accent-5/15 select-none pointer-events-none">
        SKILLS
      </div>

      <h3 className="relative z-10 text-center text-lg font-semibold text-muted mb-12 uppercase tracking-widest text-shadow-sub max:font-black max:text-xl max:tracking-[0.3em] max:text-accent-2">
        Tech Stack & Tools I Love
      </h3>

      <div className="relative z-10 flex flex-wrap justify-center gap-8">
        {techStack.map((tech, index) => {
          const cycle = accentCycles[index % accentCycles.length]
          const rotate = index % 2 === 0 ? 'max:rotate-1' : 'max:-rotate-1'

          return (
            <div
              key={tech.label}
              className={`group flex items-center gap-4 bg-surface px-6 py-5 rounded-base shadow-extruded hover:-translate-y-1 hover:shadow-extruded-hover transition-all duration-300 max:bg-container/70 max:backdrop-blur-sm max:border-4 ${cycle.border} ${rotate} max:hover:rotate-0 max:hover:scale-[1.04]`}
            >
              <div className="w-12 h-12 rounded-base bg-surface shadow-inset-deep flex items-center justify-center shrink-0 max:bg-container max:border-4 max:border-dashed max:border-accent-3">
                {tech.icon}
              </div>
              <div className="flex-1 min-w-40">
                <p className="font-semibold mb-2 max:uppercase max:tracking-wider text-shadow-title">{tech.label}</p>
                <div className="w-full bg-surface shadow-inset-sm rounded-full h-2 max:bg-container/60 max:border-2 max:border-accent-2/40">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${cycle.fill} max:animate-pulse-glow`}
                    style={{ width: `${tech.level}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
