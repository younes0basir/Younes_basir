import React from 'react'
import { Building, BookOpen, Zap, Code, Server, Cloud, Mail, ChevronRight } from 'lucide-react'
import AvatarWithFallback from './AvatarWithFallback'
import photo from '../assets/younes.jpg'
import cvFile from '../assets/cv_younes_basir.pdf'

export default function Hero() {
  return (
    <section id="home" className="relative pt-36 pb-20 px-6 overflow-hidden">
      {/* Massive background word */}
      <div aria-hidden className="hidden max:block absolute -top-6 right-0 font-display font-black leading-none text-[10rem] lg:text-[18rem] text-accent/15 select-none pointer-events-none">
        HEY!
      </div>

      {/* Floating decorations */}
      <div aria-hidden className="hidden max:block absolute top-24 left-[8%] text-5xl animate-wiggle select-none">🚀</div>
      <div aria-hidden className="hidden max:block absolute top-[55%] left-[4%] text-4xl animate-float select-none text-accent-3">✦</div>
      <div aria-hidden className="hidden max:block absolute bottom-24 left-[30%] text-4xl animate-bounce-subtle select-none text-accent-secondary">⚡</div>
      <div aria-hidden className="hidden max:block absolute top-40 right-[12%] text-5xl animate-spin-slow select-none text-accent-5">💫</div>
      <div aria-hidden className="hidden max:block absolute bottom-16 right-[40%] text-4xl animate-float-reverse select-none text-accent-4">✨</div>

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="reveal inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-surface shadow-extruded-sm max:bg-container/60 max:border-4 max:border-accent-3 max:animate-pulse-glow">
              <span className="w-8 h-8 rounded-full bg-surface shadow-inset-sm flex items-center justify-center max:border-4 max:border-dashed max:border-accent">
                <Building className="w-4 h-4 text-accent" />
              </span>
              <span className="text-sm font-semibold text-muted max:uppercase max:tracking-widest">3rd Year Software Engineering Student • Seeking Data Internship</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight reveal reveal-delay-1 text-shadow-mega max:text-6xl max:md:text-9xl max:uppercase max:leading-none">
              Hey, I'm <span className="text-accent max:text-gradient-pop">Younes Basir</span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground leading-relaxed reveal reveal-delay-2 font-medium max:text-3xl">
              I'm passionate about turning <span className="font-semibold text-accent">data into insights</span> and building{' '}
              <span className="font-semibold text-accent">web applications</span> that solve real problems.
            </p>

            <p className="text-lg text-muted max-w-2xl reveal reveal-delay-3 leading-relaxed max:text-xl max:text-white/80">
              Currently in my 3rd year of Software Engineering, exploring the world of data analysis and eager to apply my skills in a professional setting.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 reveal reveal-delay-3">
              <div className="bg-surface rounded-card p-8 shadow-extruded hover:-translate-y-1 hover:shadow-extruded-hover transition-all duration-300 max:bg-container/70 max:backdrop-blur-sm max:border-4 max:border-accent-2 max:rotate-1 max:hover:rotate-2">
                <div className="flex items-center gap-3 mb-4 max:border-b-4 max:border-dashed max:border-accent-3 max:pb-4">
                  <div className="w-12 h-12 rounded-base bg-surface shadow-inset-deep flex items-center justify-center max:bg-container max:border-4 max:border-dashed max:border-accent">
                    <BookOpen className="w-5 h-5 text-accent" />
                  </div>
                  <h4 className="font-bold max:uppercase max:tracking-wider text-shadow-title">Currently Mastering</h4>
                </div>
                <div className="space-y-2 text-sm text-muted max:text-white/80">
                  <span className="block px-4 py-2 rounded-full bg-surface shadow-inset-sm max:bg-transparent max:border-2 max:border-accent-4/60">Data Analysis with Python</span>
                  <span className="block px-4 py-2 rounded-full bg-surface shadow-inset-sm max:bg-transparent max:border-2 max:border-accent-4/60">SQL for Data Querying</span>
                  <span className="block px-4 py-2 rounded-full bg-surface shadow-inset-sm max:bg-transparent max:border-2 max:border-accent-4/60">Data Visualization & Storytelling</span>
                </div>
              </div>

              <div className="bg-surface rounded-card p-8 shadow-extruded hover:-translate-y-1 hover:shadow-extruded-hover transition-all duration-300 max:bg-container/70 max:backdrop-blur-sm max:border-4 max:border-accent-3 max:-rotate-1 max:hover:-rotate-2">
                <h4 className="font-bold mb-4 flex items-center gap-3 max:border-b-4 max:border-dashed max:border-accent-2 max:pb-4 text-shadow-title max:uppercase max:tracking-wider">
                  <div className="w-12 h-12 rounded-base bg-surface shadow-inset-deep flex items-center justify-center max:bg-container max:border-4 max:border-dashed max:border-accent-3">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  Quick Stats
                </h4>
                <div className="space-y-3 text-sm max:text-white/80">
                  <div className="flex justify-between"><span className="text-muted max:text-white/80">Academic Projects</span><strong className="font-display">3</strong></div>
                  <div className="flex justify-between"><span className="text-muted max:text-white/80">Courses Completed</span><strong className="font-display">5+</strong></div>
                  <div className="flex justify-between"><span className="text-muted max:text-white/80">Ready to Learn</span><strong className="font-display">100%</strong></div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 pt-6 reveal reveal-delay-3">
              <a href="mailto:younes.basir@example.com" className="focus-ring inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-base text-lg font-semibold shadow-extruded transition-all duration-300 hover:-translate-y-1 hover:bg-accent-light hover:shadow-extruded-hover active:translate-y-0.5 active:shadow-inset-accent max:bg-linear-to-r max:from-[#FF3AF2] max:via-[#7B2FFF] max:to-[#00F5D4] max:border-4 max:border-[#FFE600] max:font-black max:uppercase max:tracking-widest max:hover:scale-110 max:hover:brightness-110 max:hover:bg-linear-to-br">
                <Mail className="w-6 h-6" />
                Get In Touch
              </a>
              <a href={cvFile} download="Younes_Basir_CV.pdf" className="focus-ring inline-flex items-center gap-3 bg-surface text-foreground px-8 py-4 rounded-base text-lg font-semibold shadow-extruded transition-all duration-300 hover:-translate-y-1 hover:shadow-extruded-hover active:translate-y-0.5 active:shadow-inset-sm max:bg-transparent max:border-4 max:border-dashed max:border-accent-3 max:font-black max:uppercase max:tracking-widest max:hover:border-solid max:hover:bg-accent-3 max:hover:text-[#0D0D1A]">
                Download CV <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Hero Card */}
          <div className="relative flex justify-center reveal reveal-delay-2">
            {/* Floating concentric decorations */}
            <div className="absolute -top-12 -right-8 w-40 h-40 rounded-full bg-surface shadow-inset-deep animate-float hidden md:block max:bg-container max:border-4 max:border-accent-2">
              <div className="absolute inset-5 rounded-full bg-surface shadow-extruded-sm max:bg-container max:border-4 max:border-dashed max:border-accent">
                <div className="absolute inset-4 rounded-full bg-accent" />
              </div>
            </div>
            <div className="absolute -bottom-10 -left-8 w-32 h-32 rounded-full bg-surface shadow-extruded-sm animate-float-delayed hidden md:block max:bg-container max:border-4 max:border-accent-4">
              <div className="absolute inset-6 rounded-full bg-surface shadow-inset-deep max:bg-container max:border-4 max:border-dashed max:border-accent-3">
                <div className="absolute inset-3 rounded-full bg-accent-secondary" />
              </div>
            </div>

            <div className="relative max-w-md w-full bg-surface rounded-card p-10 md:p-12 shadow-extruded transition-transform duration-500 hover:scale-[1.02] hover:shadow-extruded-hover max:bg-container/80 max:backdrop-blur-sm max:border-4 max:border-accent max:rotate-1 max:hover:rotate-2 max:hover:scale-[1.03]">
              <div className="text-center space-y-8">
                {/* Profile image - nested depth: inset well + extruded image */}
                <div className="relative w-44 h-44 mx-auto rounded-full bg-surface shadow-inset-deep p-2 max:bg-container max:border-4 max:border-accent-3">
                  <div className="w-full h-full rounded-full overflow-hidden shadow-extruded-sm max:border-4 max:border-accent-2">
                    <AvatarWithFallback src={photo} initials="YB" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-foreground text-shadow-title max:text-5xl max:uppercase max:tracking-wide">
                    Younes Basir
                  </h2>
                  <p className="text-sm text-accent font-semibold tracking-wide uppercase max:font-black max:tracking-widest max:text-base max:text-accent-3">
                    Aspiring Data Analyst
                  </p>

                  <div className="flex justify-center gap-10 pt-4">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-base bg-surface shadow-inset-deep flex items-center justify-center mb-3 mx-auto max:bg-container max:border-4 max:border-dashed max:border-accent-2">
                        <Code className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-xs font-bold text-muted uppercase tracking-tighter max:text-accent-2">Frontend</p>
                    </div>
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-base bg-surface shadow-inset-deep flex items-center justify-center mb-3 mx-auto max:bg-container max:border-4 max:border-dashed max:border-accent-3">
                        <Server className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-xs font-bold text-muted uppercase tracking-tighter max:text-accent-3">Backend</p>
                    </div>
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-base bg-surface shadow-inset-deep flex items-center justify-center mb-3 mx-auto max:bg-container max:border-4 max:border-dashed max:border-accent-4">
                        <Cloud className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-xs font-bold text-muted uppercase tracking-tighter max:text-accent-4">Data</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="bg-surface rounded-card p-6 shadow-inset-sm max:bg-container/60 max:border-2 max:border-accent-5/70">
                    <div className="text-4xl font-black text-accent font-display max:text-5xl max:text-accent-2">3</div>
                    <p className="text-xs font-bold text-muted uppercase mt-1 max:text-white/80">Live Projects</p>
                  </div>
                  <div className="bg-surface rounded-card p-6 shadow-inset-sm max:bg-container/60 max:border-2 max:border-accent-3/70">
                    <div className="text-4xl font-black text-accent font-display max:text-5xl max:text-accent-3">3.5+</div>
                    <p className="text-xs font-bold text-muted uppercase mt-1 max:text-white/80">Academic GPA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
