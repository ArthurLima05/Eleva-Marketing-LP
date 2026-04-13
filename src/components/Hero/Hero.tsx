import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  setupCanvasScrollScrubbing,
  setupScrollIndicatorHide,
  setupSubtitleCtaColorTransition,
} from '../../utils/animations';
import { setupMagneticButton } from '../../utils/cursor';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_URL =
  'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20elevar%20minha%20marca!';

// Ajustar para o número exato de frames em /public/frames/
const TOTAL_FRAMES = 240;

const LINE_1_WORDS = ['MARCAS', 'INVISÍVEIS', 'NÃO'];
const LINE_2_HIGHLIGHT = ['VENDEM'];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  // ─── Canvas scrubbing + scroll indicator ────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const indicator = scrollIndicatorRef.current;
    if (!canvas || !hero) return;

    const cleanupScrub = setupCanvasScrollScrubbing(
      canvas,
      hero,
      TOTAL_FRAMES,
      () => undefined,
      () => undefined,
      (progress: number) => {
        // Flash: começa em 80%, completo em 100%
        if (flashRef.current) {
          const flashStart = 0.80;
          const p = Math.max(0, Math.min(1,
            (progress - flashStart) / (1 - flashStart)
          ));
          flashRef.current.style.opacity = String(p);
        }

        // Fade do conteúdo: some entre 20% e 70%
        const content = document.querySelector('[class*="content_"]') as HTMLElement;
        if (content) {
          const fadeStart = 0.2;
          const fadeEnd = 0.7;
          const fadeProgress = Math.max(0, Math.min(1,
            (progress - fadeStart) / (fadeEnd - fadeStart)
          ));
          content.style.opacity = String(1 - fadeProgress);
        }

        // Body: branco só quando flash está completo
        if (progress >= 0.99) {
          document.body.style.backgroundColor = '#ffffff';
        } else if (progress < 0.75) {
          document.body.style.backgroundColor = '#0a0a0a';
        }
      }
    );

    const cleanupColorTransition =
      subtitleRef.current && ctaRef.current
        ? setupSubtitleCtaColorTransition(
            subtitleRef.current,
            ctaRef.current,
            hero,
            TOTAL_FRAMES,
            125
          )
        : () => undefined;

    const cleanupIndicator = indicator
      ? setupScrollIndicatorHide(indicator)
      : () => undefined;

    return () => {
      cleanupScrub();
      cleanupColorTransition();
      cleanupIndicator();
      if (flashRef.current) flashRef.current.style.opacity = '0';
      document.body.style.backgroundColor = '#0a0a0a';
      document.body.style.transition = '';
      const content = document.querySelector('[class*="content_"]') as HTMLElement;
      if (content) content.style.opacity = '1';
    };
  }, []);

  // ─── Cursor magnético — desktop apenas ──────────────────────────────
  useEffect(() => {
    const button = ctaRef.current;
    if (!button || window.innerWidth < 768) return;
    return setupMagneticButton(button);
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.heroSticky}>

        {/* Camada 1 — canvas controlado pelo scroll */}
        <canvas ref={canvasRef} className={styles.canvas} />

        {/* Camada 2 — overlay mínimo */}
        <div className={styles.overlay} />

        {/* Camada 2.5 — flash branco no final do scroll */}
        <div ref={flashRef} className={styles.flashOverlay} />

        {/* Camada 3 — conteúdo centralizado */}
        <div className={styles.content}>
          <div className={styles.titleBlock}>

            <p className={styles.titleLine1}>
              {LINE_1_WORDS.map((word) => (
                <span key={word} className={styles.word}>
                  {word}
                </span>
              ))}
            </p>

            <p className={styles.titleLine2}>
              {LINE_2_HIGHLIGHT.map((word) => (
                <span key={word} className={styles.wordHighlight}>
                  {word}
                </span>
              ))}
            </p>
          </div>

          <p ref={subtitleRef} className={styles.subtitle}>
            A ELEVA TRANSFORMA O SEU NEGÓCIO EM UMA MARCA
            <br />
            QUE O MERCADO RECONHECE E ESCOLHE
          </p>

          <button
            ref={ctaRef}
            className={styles.ctaButton}
            onClick={() =>
              window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')
            }
          >
            QUERO ELEVAR MINHA MARCA
          </button>
        </div>

        <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
          <div className={styles.scrollLine} />
          <span className={styles.scrollText}>SCROLL</span>
        </div>

      </div>
    </section>
  );
}
