import styles from './Marquee.module.css';

interface MarqueeProps {
  theme?: 'dark' | 'light';
  speed?: number;
}

const ITEMS = [
  'CRIAÇÃO DE CONTEÚDO',
  'TRÁFEGO PAGO',
  'GESTÃO DE REDES',
  'IDENTIDADE VISUAL',
  'SITES & LANDING PAGES',
  'CAPTAÇÃO COM DRONE',
  'COPYWRITER',
];

export default function Marquee({ theme = 'dark', speed = 30 }: MarqueeProps) {
  return (
    <div
      className={styles.marquee}
      data-theme={theme}
      style={{ '--speed': `${speed}s` } as React.CSSProperties}
    >
      <div className={styles.track}>
        {[0, 1].map((block) => (
          <div className={styles.block} key={block} aria-hidden={block === 1}>
            {ITEMS.map((item) => (
              <span className={styles.item} key={item}>
                {item}
                <span className={styles.dot} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
