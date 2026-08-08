import Reveal from "./Reveal"
import WordsReveal from "./WordsReveal"

interface SectionHeadingProps {
  num: string
  label: string
  title: string
  accent?: string
}

export default function SectionHeading({
  num,
  label,
  title,
  accent,
}: SectionHeadingProps) {
  return (
    <div className="mb-16 md:mb-24">
      <Reveal>
        <div className="flex items-center gap-6 mb-8">
          <span className="eyebrow">{num}</span>
          <span className="h-px w-14 bg-line" />
          <span className="label">{label}</span>
        </div>
      </Reveal>
      <h2 className="font-serif text-5xl md:text-7xl font-light leading-[1.02] tracking-tight">
        <WordsReveal text={title} className="text-ivory" />
        {accent && (
          <em className="text-chrome italic font-normal">
            {" "}
            <WordsReveal text={accent} stagger={0.05} delay={0.25} />
          </em>
        )}
      </h2>
    </div>
  )
}