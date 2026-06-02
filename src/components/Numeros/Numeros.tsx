import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Numeros.module.css'

gsap.registerPlugin(ScrollTrigger)

const METRICS = [
  { number: '+DE 50', label: 'Marcas elevadas',                     suffix: '' },
  { number: '1.3M',   label: 'Em tráfego gerenciado',               suffix: '' },
  { number: '3',      label: 'Anos de experiência em marketing',     suffix: '' },
  { number: '94',     label: 'Taxa de renovação',                    suffix: '%' },
]

export default function Numeros() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Scoped ao section — nunca apanha items de outros componentes
      const items = section.querySelectorAll<HTMLElement>(`.${styles.item}`)

      // fromTo garante estado inicial mesmo se ScrollTrigger disparar imediatamente
      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        }
      )

      items.forEach((item) => {
        const numEl = item.querySelector<HTMLElement>(`.${styles.number}`)
        if (!numEl) return

        const raw = numEl.getAttribute('data-target') || numEl.textContent || ''
        const numeric = parseFloat(raw.replace(/[^0-9.]/g, ''))
        if (isNaN(numeric)) return

        const prefix      = raw.match(/^[^0-9]*/)?.[0]  ?? ''
        const letterSuffix = raw.match(/[A-Za-z]+$/)?.[0] ?? ''
        const obj = { val: 0 }

        // Inicia em 0 para não piscar o valor final antes da animação
        numEl.textContent = prefix + '0'

        gsap.to(obj, {
          val: numeric,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
          onUpdate() {
            const display = numeric % 1 === 0
              ? Math.round(obj.val)
              : obj.val.toFixed(1)
            // Reanexa o sufixo de letra (ex.: M) apenas quando chega ao final
            const atEnd = Math.round(obj.val) >= numeric
            numEl.textContent = prefix + display + (atEnd ? letterSuffix : '')
          },
          onComplete() {
            // Garante valor exato ao fim (evita arredondamento residual)
            numEl.textContent = prefix + numeric + letterSuffix
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.numeros} ref={sectionRef}>

      <div className={styles.header}>
        <span className={styles.headerLabel}>RESULTADOS REAIS</span>
        <h2 className={styles.headerTitle}>
          NÚMEROS QUE <strong>FALAM</strong>
        </h2>
      </div>

      <div className={styles.grid}>
        {METRICS.map((m, i) => (
          <div className={styles.item} key={i}>
            <div className={styles.numberWrap}>
              <span className={styles.number} data-target={m.number}>
                {m.number}
              </span>
              <span className={styles.suffix}>{m.suffix}</span>
            </div>
            <span className={styles.label}>{m.label}</span>
          </div>
        ))}
      </div>

    </section>
  )
}
