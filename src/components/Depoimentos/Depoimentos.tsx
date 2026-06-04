import { useEffect, useRef, useState } from 'react';
import styles from './Depoimentos.module.css';

const DEPOIMENTOS = [
  {
    video: '/videos/depoimentos/gigi_depoimento.mp4',
    text: 'Sou cliente, e vários empresários amam meus conteúdos e pedem o contato da Eleva.',
    author: 'VANEIDE SANTOS',
    role: 'Moda infantil',
    company: 'Dona Gigi',
  },
  {
    video: '/videos/depoimentos/karol-depoimento.mp4',
    text: 'Meu faturamento aumentou muito através dos conteúdos e tráfego.',
    author: 'KAROL FRANÇA',
    role: 'Roupa feminina',
    company: 'Karol Store',
  },
  {
    video: '/videos/depoimentos/joao_depoimento.mp4',
    text: 'Empresa que agrega e soma com a gente, temos resultados bastante significativos no tráfego, além de ser uma empresa humanizada.',
    author: 'JOÃO BRANDÃO',
    role: 'Loja de Veículos',
    company: 'HN Veículos',
  },
  {
    video: '/videos/depoimentos/day_depoimento.mp4',
    text: 'Depois que vocês entraram e reformularam todo instagram da DG Corretora, a minha empresa só cresceu.',
    author: 'DAYANNE FARIAS',
    role: 'Plano de saúde e empréstimos',
    company: 'DG Corretora',
  },
];

export default function Depoimentos() {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [soundIndex, setSoundIndex] = useState<number | null>(null);

  // Detecta card cujo início está alinhado com o snap point (borda esquerda + padding)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      const cards = Array.from(track!.children) as HTMLElement[];
      const paddingLeft = parseInt(getComputedStyle(track!).paddingLeft, 10);
      const snapEdge = track!.scrollLeft + paddingLeft;
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - snapEdge);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveIndex(closest);
    }

    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  // Ao trocar de card: toca o ativo, pausa os outros, reseta som
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    setSoundIndex(null);
  }, [activeIndex]);

  // Aplica mute/unmute via propriedade DOM
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      video.muted = i !== soundIndex;
    });
  }, [soundIndex]);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards[index]) return;
    const paddingLeft = parseInt(getComputedStyle(track).paddingLeft, 10);
    track.scrollTo({ left: cards[index].offsetLeft - paddingLeft, behavior: 'smooth' });
  }

  function toggleSound() {
    setSoundIndex(prev => prev === activeIndex ? null : activeIndex);
  }

  return (
    <section className={styles.depoimentos}>

      <div className={styles.header}>
        <span className={styles.label}>O QUE DIZEM NOSSOS CLIENTES</span>
        <h2 className={styles.title}>
          RESULTADOS <strong>REAIS</strong>
        </h2>
      </div>

      <div className={styles.track} ref={trackRef}>
        {DEPOIMENTOS.map((d, i) => (
          <div
            key={i}
            className={`${styles.card} ${i === activeIndex ? styles.cardActive : ''}`}
            onClick={() => { if (i !== activeIndex) goTo(i); }}
          >
            <div className={styles.videoWrap}>
              <video
                ref={(el) => { if (el) videoRefs.current[i] = el; }}
                src={d.video}
                autoPlay
                loop
                muted
                playsInline
                className={styles.video}
              />
              <div className={styles.videoOverlay} />

              {i === activeIndex && (
                <button
                  className={`${styles.soundBtn} ${soundIndex === i ? styles.soundBtnOn : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleSound(); }}
                  aria-label={soundIndex === i ? 'Silenciar' : 'Ativar som'}
                >
                  {soundIndex === i ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  )}
                </button>
              )}
            </div>

            <div className={styles.content}>
              <p className={styles.text}>"{d.text}"</p>
              <div className={styles.authorRow}>
                <div>
                  <p className={styles.author}>{d.author}</p>
                  <p className={styles.role}>{d.role} · {d.company}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {DEPOIMENTOS.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Depoimento ${i + 1}`}
          />
        ))}
      </div>

      <div className={styles.arrows}>
        <button
          className={styles.arrow}
          onClick={() => goTo(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
        >
          ←
        </button>
        <button
          className={styles.arrow}
          onClick={() => goTo(Math.min(DEPOIMENTOS.length - 1, activeIndex + 1))}
          disabled={activeIndex === DEPOIMENTOS.length - 1}
        >
          →
        </button>
      </div>

    </section>
  );
}
