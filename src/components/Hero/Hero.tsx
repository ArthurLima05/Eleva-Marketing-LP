import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  animateHeroTitleIn,
  animateFadeIn,
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

  const line1Refs = useRef<HTMLSpanElement[]>([]);
  const line2HighlightRefs = useRef<HTMLSpanElement[]>([]);

  const [shutterOpen, setShutterOpen] = useState(false);

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
      () => setShutterOpen(true),
      () => setShutterOpen(false)
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

    const safetyTimer = setTimeout(() => setShutterOpen(true), 2500);

    // ── Flash branco + transição do body ──────────────────────────────
    const flashSt = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * 0.85),
      onUpdate: (self) => {
        const scrollProgress = self.progress;

        if (flashRef.current) {
          const flashStart = 0.75;
          const flashProgress = Math.max(
            0,
            Math.min(1, (scrollProgress - flashStart) / (1 - flashStart))
          );
          flashRef.current.style.opacity = String(flashProgress);
        }

        if (scrollProgress >= 0.98) {
          document.body.style.backgroundColor = '#ffffff';
          document.body.style.transition = 'background-color 0.3s ease';
        } else {
          document.body.style.backgroundColor = '#0a0a0a';
        }
      },
    });

    return () => {
      cleanupScrub();
      cleanupColorTransition();
      cleanupIndicator();
      flashSt.kill();
      clearTimeout(safetyTimer);
      document.body.style.backgroundColor = '#0a0a0a';
      document.body.style.transition = '';
    };
  }, []);

  // ─── Animação de entrada do texto quando o obturador abre ───────────
  const hasTitleBeenShownRef = useRef(false);

  useEffect(() => {
    const allWords = [
      ...line1Refs.current,
      ...line2HighlightRefs.current,
    ].filter(Boolean) as HTMLElement[];

    const fadeTargets = [subtitleRef.current, ctaRef.current].filter(
      Boolean
    ) as HTMLElement[];

    if (!shutterOpen) {
      // Ao voltar para a hero, restaura visibilidade (após ctx.revert do cleanup)
      if (hasTitleBeenShownRef.current) {
        gsap.set([...allWords, ...fadeTargets], { opacity: 1, y: '0px' });
      }
      return;
    }

    hasTitleBeenShownRef.current = true;

    const ctx = gsap.context(() => {
      animateHeroTitleIn(allWords);
      if (fadeTargets.length) animateFadeIn(fadeTargets, 0.75);
    });

    return () => ctx.revert();
  }, [shutterOpen]);

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

        {/* Logo topo esquerdo */}
        <div className={styles.logo}>
          <img
            src="/src/assets/logo/eleva-logo.png"
            alt="Eleva Marketing"
            className={styles.logoImg}
          />
        </div>

        {/* Camada 3 — conteúdo centralizado */}
        <div className={styles.content}>
          <div className={styles.titleBlock}>

            <p className={styles.titleLine1}>
              {LINE_1_WORDS.map((word, i) => (
                <span
                  key={word}
                  ref={(el) => { if (el) line1Refs.current[i] = el; }}
                  className={styles.word}
                >
                  {word}
                </span>
              ))}
            </p>

            <p className={styles.titleLine2}>
              {LINE_2_HIGHLIGHT.map((word, i) => (
                <span
                  key={word}
                  ref={(el) => { if (el) line2HighlightRefs.current[i] = el; }}
                  className={styles.wordHighlight}
                >
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
