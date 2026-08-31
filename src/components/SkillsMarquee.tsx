const SKILLS = [
  "Python",
  "SQL",
  "React",
  "TypeScript",
  "Node.js",
  "Express",
  "PostgreSQL",
  "MongoDB",
  "Tailwind CSS",
  "Data Visualization",
];

function SkillList({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {SKILLS.map((skill) => (
        <span key={skill} className="flex items-center">
          <span className="px-6 text-xs tracking-[0.2em] whitespace-nowrap text-gray-400 uppercase sm:px-8 sm:text-sm">
            {skill}
          </span>
          <span className="text-primary/40 text-[10px]">*</span>
        </span>
      ))}
    </div>
  );
}

export default function SkillsMarquee() {
  return (
    <section
      aria-label="Skills and technologies"
      className="relative overflow-hidden border-y border-white/5 bg-black py-5"
    >
      <div className="marquee-track flex w-max">
        <SkillList />
        <SkillList ariaHidden />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent sm:w-28" />
    </section>
  );
}
