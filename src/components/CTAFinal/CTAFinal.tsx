import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animateSectionReveal } from '../../utils/animations'
import styles from './CTAFinal.module.css'

gsap.registerPlugin(ScrollTrigger)

const WHATSAPP_URL =
  'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20saber%20como%20a%20Eleva%20pode%20elevar%20minha%20marca'

export default function CTAFinal() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const btnRef      = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !headlineRef.current || !btnRef.current) return

    const ctx = gsap.context(() => {
      animateSectionReveal([headlineRef.current!, btnRef.current!], section, 0.18)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.ctafinal} ref={sectionRef}>
      <div className={styles.inner}>
        <hr className={styles.rule} />
        <h2 className={styles.headline} ref={headlineRef}>
          PRONTO PARA PARAR DE SER
          <strong className={styles.headlineHighlight}><span className={styles.headlineUnderline}>INVISÍVEL</span>?</strong>
        </h2>
        <a
          ref={btnRef}
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btn}
        >
          QUERO ELEVAR MINHA MARCA
        </a>
      </div>
    </section>
  )
}
