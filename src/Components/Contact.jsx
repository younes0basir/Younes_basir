import React from 'react'
import { Mail, Github, Linkedin } from 'lucide-react'

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')

    // Create mailto link
    const subject = encodeURIComponent(`New message from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
    window.location.href = `mailto:younes.basir@example.com?subject=${subject}&body=${body}`
  }

  return (
    <section id="contact" className="relative mt-40 pb-20 reveal">
      {/* Massive background word */}
      <div aria-hidden className="hidden max:block absolute -left-4 bottom-4 font-display font-black leading-none text-[9rem] lg:text-[16rem] text-accent-3/15 select-none pointer-events-none">
        SAY HI
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-shadow-heading max:text-6xl max:md:text-7xl max:uppercase max:tracking-wide">
            Let's Connect
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto max:text-white/80 max:font-medium">
            Have a project in mind or want to collaborate? I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-surface rounded-card p-8 md:p-10 shadow-extruded max:bg-container/70 max:backdrop-blur-sm max:border-4 max:border-accent-3 max:rotate-1">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-muted mb-2 max:font-black max:uppercase max:tracking-widest max:text-accent-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="input-neumorphic"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-2 max:font-black max:uppercase max:tracking-widest max:text-accent-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="input-neumorphic"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-2 max:font-black max:uppercase max:tracking-widest max:text-accent-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="input-neumorphic resize-none max:rounded-2xl"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="focus-ring w-full bg-accent text-white px-8 py-4 rounded-base font-bold text-lg shadow-extruded transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-light hover:shadow-extruded-hover active:translate-y-0.5 active:shadow-inset-accent flex items-center justify-center gap-3 max:bg-linear-to-r max:from-[#FF3AF2] max:via-[#7B2FFF] max:to-[#00F5D4] max:border-4 max:border-[#FFE600] max:font-black max:uppercase max:tracking-widest max:hover:scale-[1.02] max:hover:brightness-110 max:hover:bg-linear-to-br"
              >
                <Mail className="w-6 h-6" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-surface rounded-card p-8 shadow-extruded max:bg-container/70 max:backdrop-blur-sm max:border-4 max:border-accent max:-rotate-1">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-shadow-title max:uppercase max:tracking-wide">
                <div className="w-12 h-12 rounded-base bg-surface shadow-inset-deep flex items-center justify-center max:bg-container max:border-4 max:border-dashed max:border-accent-2">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                Get in Touch
              </h3>
              <div className="space-y-4">
                <a
                  href="mailto:younes.basir@example.com"
                  className="focus-ring block text-lg text-foreground hover:text-accent transition max:font-bold"
                >
                  younes.basir@example.com
                </a>
                <p className="text-muted max:text-white/80">
                  I'll get back to you within 24 hours
                </p>
              </div>
            </div>

            <div className="bg-surface rounded-card p-8 shadow-extruded max:bg-container/70 max:backdrop-blur-sm max:border-4 max:border-accent-2 max:rotate-1">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-shadow-title max:uppercase max:tracking-wide">
                <div className="w-12 h-12 rounded-base bg-surface shadow-inset-deep flex items-center justify-center max:bg-container max:border-4 max:border-dashed max:border-accent-3">
                  <Github className="w-6 h-6 text-accent" />
                </div>
                Let's Collaborate
              </h3>
              <div className="space-y-4">
                <p className="text-foreground max:text-white/80">
                  Actively seeking a data internship to apply my skills and learn from experienced professionals
                </p>
                <div className="flex gap-4 flex-wrap">
                  <a
                    href="https://github.com/younes0basir"
                    target="_blank"
                    rel="noopener"
                    className="focus-ring inline-flex items-center gap-2 bg-surface text-foreground px-6 py-3 rounded-base font-semibold shadow-extruded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-extruded-hover active:translate-y-0.5 active:shadow-inset-sm max:bg-transparent max:border-4 max:border-dashed max:border-accent-3 max:font-black max:uppercase max:tracking-widest max:hover:border-solid max:hover:bg-accent-3 max:hover:text-[#0D0D1A]"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/younes-basir"
                    target="_blank"
                    rel="noopener"
                    className="focus-ring inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-base font-semibold shadow-extruded transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-light hover:shadow-extruded-hover active:translate-y-0.5 active:shadow-inset-accent max:bg-linear-to-r max:from-[#00F5D4] max:via-[#7B2FFF] max:to-[#FF3AF2] max:border-4 max:border-[#FF6B35] max:font-black max:uppercase max:tracking-widest max:hover:scale-105 max:hover:brightness-110 max:hover:bg-linear-to-br"
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
  )
}
