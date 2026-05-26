import { useEffect, useRef } from 'react';
import logoSrc from '../../assets/logo/eleva-logo.png';
import styles from './Navbar.module.css';

const WHATSAPP_URL =
  'https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20elevar%20minha%20marca!';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Muda a cor da navbar conforme o fundo da página
    // Preto na hero, branco nas seções claras
    function onScroll() {
      if (!navRef.current) return;
      const isDark = document.body.style.backgroundColor !== 'rgb(255, 255, 255)';
      navRef.current.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // roda uma vez ao montar
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav ref={navRef} className={styles.navbar} data-theme="dark">
      <div className={styles.inner}>

        {/* Logo */}
        <a href="#" className={styles.logoWrap} aria-label="Eleva Marketing">
          <img
            src={logoSrc}
            alt="Eleva Marketing"
            className={styles.logoImg}
          />
        </a>

        {/* CTA WhatsApp */}
        <button
          className={styles.ctaBtn}
          onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')}
        >
          FALAR COM A ELEVA
        </button>

      </div>
    </nav>
  );
}
