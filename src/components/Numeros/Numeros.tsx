import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Numeros.module.css'

gsap.registerPlugin(ScrollTrigger)

const METRICS = [
  { number: '+47',  label: 'Marcas elevadas',       suffix: '' },
  { number: 'R$2M', label: 'Em tráfego gerenciado', suffix: '+' },
  { number: '3',    label: 'Anos no mercado',        suffix: '' },
  { number: '98',   label: 'Taxa de renovação',      suffix: '%' },
]

export default function Numeros() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = document.querySelectorAll(`[class*="item_"]`)

      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      items.forEach((item) => {
        const numEl = item.querySelector(`[class*="number_"]`)
        if (!numEl) return
        const raw = numEl.textContent || ''
        const numeric = parseFloat(raw.replace(/[^0-9.]/g, ''))
        if (isNaN(numeric)) return

        const prefix = raw.match(/^[^0-9]*/)?.[0] || ''
        const obj = { val: 0 }

        gsap.to(obj, {
          val: numeric,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
          },
          onUpdate: () => {
            const display =
              numeric % 1 === 0
                ? Math.round(obj.val)
                : obj.val.toFixed(1)
            numEl.textContent = prefix + display
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
