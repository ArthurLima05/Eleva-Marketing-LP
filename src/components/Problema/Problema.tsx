import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animateProblemaLines } from '../../utils/animations'
import styles from './Problema.module.css'

gsap.registerPlugin(ScrollTrigger)

const dores = [
  { ordinal: '01', text: 'Seu negócio existe há anos, mas ninguém lembra da sua marca.' },
  { ordinal: '02', text: 'Enquanto seus concorrentes aparecem todos os dias, a sua marca continua invisível.' },
  { ordinal: '03', text: 'Quem não é visto, dificilmente é escolhido. Sua empresa não precisa de mais posts. Precisa de estratégia.' },
]

export default function Problema() {
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs   = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      animateProblemaLines(itemRefs.current.filter(Boolean))
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.problema} ref={sectionRef}>
      <div className={styles.inner}>
        {dores.map((d, i) => (
          <div
            key={d.ordinal}
            className={styles.item}
            ref={(el) => { if (el) itemRefs.current[i] = el }}
          >
            <span className={styles.ordinal}>{d.ordinal}</span>
            <p className={styles.text}>{d.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
