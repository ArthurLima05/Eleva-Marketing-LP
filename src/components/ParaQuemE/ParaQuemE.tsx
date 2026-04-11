import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animateSectionReveal } from '../../utils/animations'
import styles from './ParaQuemE.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function ParaQuemE() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const body1Ref    = useRef<HTMLParagraphElement>(null)
  const body2Ref    = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !headlineRef.current || !body1Ref.current || !body2Ref.current) return

    const ctx = gsap.context(() => {
      animateSectionReveal(
        [headlineRef.current!, body1Ref.current!, body2Ref.current!],
        section,
        0.15
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.paraqueme} ref={sectionRef}>
      <div className={styles.inner}>
        <h2 className={styles.headline} ref={headlineRef}>
          A <span className={styles.highlight}>ELEVA</span> É PARA QUEM JÁ ENTENDEU QUE{' '}
          <strong>MARKETING BARATO CUSTA CARO</strong>
        </h2>
        <div className={styles.divider} />
        <p className={styles.body} ref={body1Ref}>
          Para quem quer construir uma marca de verdade, não apenas aparecer nas redes.
        </p>
        <div className={styles.divider} />
        <p className={styles.body} ref={body2Ref}>
          Para quem está pronto para sair da invisibilidade e ocupar o espaço que merece no mercado.
        </p>
      </div>
    </section>
  )
}
