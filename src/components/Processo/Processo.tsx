import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animateProcesso } from '../../utils/animations'
import styles from './Processo.module.css'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  { num: '01', name: 'BRIEFING', desc: 'Entendemos sua marca, mercado e objetivos.' },
  { num: '02', name: 'ESTRATÉGIA', desc: 'Planejamos o caminho mais direto ao resultado.' },
  { num: '03', name: 'EXECUÇÃO', desc: 'Entregamos com consistência e qualidade.' },
  { num: '04', name: 'CRESCIMENTO', desc: 'Ajustamos, escalamos e crescemos juntos.' },
]

export default function Processo() {
  const sectionRef    = useRef<HTMLElement>(null)
  const connectorRef  = useRef<HTMLDivElement>(null)
  const stepRefs      = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const section   = sectionRef.current
    const connector = connectorRef.current
    if (!section || !connector) return

    const ctx = gsap.context(() => {
      animateProcesso(connector, stepRefs.current.filter(Boolean), section)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.processo} ref={sectionRef}>
      <div className={styles.inner}>
        <p className={styles.sectionLabel}>COMO TRABALHAMOS</p>
        <h2 className={styles.sectionTitle}>
          MÉTODO <strong>ELEVA</strong>
        </h2>
        <div className={styles.steps}>
          <div className={styles.connector} ref={connectorRef} />
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={styles.step}
              ref={(el) => { if (el) stepRefs.current[i] = el }}
            >
              <span className={styles.stepNum}>{s.num}</span>
              <div className={styles.stepDot} />
              <p className={styles.stepName}>{s.name}</p>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
