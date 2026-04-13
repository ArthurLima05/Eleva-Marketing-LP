import { useEffect, useRef, useState } from 'react';
import styles from './Depoimentos.module.css';

const DEPOIMENTOS = [
  {
    video: '/videos/depoimentos/cliente-01.mp4',
    text: 'Depoimento real do cliente aqui com resultado específico.',
    author: 'NOME DO CLIENTE',
    role: 'Tipo de negócio',
    company: 'Nome da empresa',
    result: '+40% de engajamento em 60 dias',
  },
  {
    video: '/videos/depoimentos/cliente-02.mp4',
    text: 'Depoimento real do segundo cliente.',
    author: 'NOME DO CLIENTE 2',
    role: 'Tipo de negócio',
    company: 'Nome da empresa 2',
    result: 'Custo por lead caiu 40%',
  },
];

export default function Depoimentos() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      const cardWidth = track!.firstElementChild?.clientWidth || 0;
      const index = Math.round(track!.scrollLeft / cardWidth);
      setActiveIndex(index);
    }

    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstElementChild?.clientWidth || 0;
    track.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
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
          <div className={styles.card} key={i}>

            {/* Vídeo em loop */}
            <div className={styles.videoWrap}>
              <video
                src={d.video}
                autoPlay
                loop
                muted
                playsInline
                className={styles.video}
              />
              <div className={styles.videoOverlay} />
              <span className={styles.resultTag}>{d.result}</span>
            </div>

            {/* Depoimento */}
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

      {/* Indicadores de posição */}
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

      {/* Setas — desktop apenas */}
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
