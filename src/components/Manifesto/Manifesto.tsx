import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animateManifesto } from '../../utils/animations'
import styles from './Manifesto.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Manifesto() {
  const sectionRef   = useRef<HTMLElement>(null)
  const labelRef     = useRef<HTMLDivElement>(null)
  const text1Ref     = useRef<HTMLParagraphElement>(null)
  const text2Ref     = useRef<HTMLParagraphElement>(null)
  const signatureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = {
      label: labelRef.current,
      text1: text1Ref.current,
      text2: text2Ref.current,
      signature: signatureRef.current,
      section: sectionRef.current,
    }
    if (!el.label || !el.text1 || !el.text2 || !el.signature || !el.section) return

    const ctx = gsap.context(() => {
      animateManifesto(el.label!, [el.text1!, el.text2!], el.signature!, el.section!)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.manifesto} ref={sectionRef}>

      <div className={styles.labelRow} ref={labelRef}>
        <span className={styles.line} />
        <span className={styles.label}>NOSSA FILOSOFIA</span>
        <span className={styles.line} />
      </div>

      <div className={styles.inner}>
        <div className={styles.textCol}>
          <p className={styles.text} ref={text1Ref}>
            Enquanto a maioria segue a multidão, nossos clientes{' '}
            <strong>se destacam</strong> dela.
          </p>
          <p className={styles.text} ref={text2Ref}>
            Não entregamos serviços. Construímos{' '}
            <strong>marcas</strong>{' '}
            que o mercado para de ignorar.
          </p>
        </div>
        <div className={styles.imageCol}>
          <img
            src="/images/manifesto-equipe.jpeg"
            alt="Equipe Eleva em produção"
            className={styles.image}
          />
          <div className={styles.imagePlaceholder}>
            <span>manifesto-equipe.jpg</span>
          </div>
        </div>
      </div>

      <div className={styles.signature} ref={signatureRef}>
        <span className={styles.signatureText}>ELEVA MARKETING</span>
        <span className={styles.signatureLine} />
      </div>

    </section>
  )
}
