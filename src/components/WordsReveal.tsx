import { motion } from "framer-motion"

interface WordsRevealProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: "span" | "p" | "h2" | "h3"
  style?: React.CSSProperties
}

export default function WordsReveal({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  as = "span",
  style,
}: WordsRevealProps) {
  const words = text.split(" ")
  const Tag = as as "span"

  return (
    <Tag className={className} style={style} aria-label={text} role="text">
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom"
          aria-hidden
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "118%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{
              duration: 0.75,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  )
}