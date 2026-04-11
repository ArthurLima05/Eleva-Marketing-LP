import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animateDepoimentosCards } from '../../utils/animations'
import styles from './Depoimentos.module.css'

gsap.registerPlugin(ScrollTrigger)

const depoimentos = [
  {
    text: 'A Eleva transformou completamente como nosso público nos percebe. Em menos de 3 meses, dobramos o engajamento e as vendas aumentaram 40%. Profissionalismo e resultados reais.',
    author: 'MARINA SOUZA',
    role: 'Fundadora — Boutique Alma',
  },
  {
    text: 'Antes da Eleva eu gastava em tráfego sem retorno. Hoje cada real investido tem destino certo. Minha marca finalmente tem voz e presença onde meu cliente está.',
    author: 'RICARDO FONSECA',
    role: 'CEO — Studio RF Arquitetura',
  },
]

export default function Depoimentos() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs   = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      animateDepoimentosCards(cardRefs.current.filter(Boolean), sectionRef.current!)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.depoimentos} ref={sectionRef}>
      <div className={styles.grid}>
        {depoimentos.map((d, i) => (
          <div
            key={d.author}
            className={styles.card}
            ref={(el) => { if (el) cardRefs.current[i] = el }}
          >
            <div className={styles.quote}>&ldquo;</div>
            <p className={styles.text}>{d.text}</p>
            <p className={styles.author}>{d.author}</p>
            <p className={styles.role}>{d.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
