import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animateProblemaLines } from '../../utils/animations'
import styles from './Problema.module.css'

gsap.registerPlugin(ScrollTrigger)

const dores = [
  { ordinal: '01', text: 'Seu negócio existe há anos, mas ninguém parece notar.' },
  { ordinal: '02', text: 'Você investe em redes sociais, mas os posts somem no feed sem resultado.' },
  { ordinal: '03', text: 'Já tentou de tudo — e nada mudou de verdade.' },
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
