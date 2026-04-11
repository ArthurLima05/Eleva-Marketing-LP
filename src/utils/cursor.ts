import gsap from 'gsap';

/**
 * Aplica efeito magnético ao botão: o elemento se desloca até MAX_MOVE px
 * em direção ao cursor quando este está dentro de MAX_DISTANCE px do centro.
 * Usa gsap.quickTo para simular lerp suave (fator ≈ 0.3 por frame a 60fps).
 * Retorna função de cleanup para uso no useEffect.
 */
export function setupMagneticButton(button: HTMLElement): () => void {
  const MAX_DISTANCE = 80;
  const MAX_MOVE = 12;

  const xTo = gsap.quickTo(button, 'x', { duration: 0.4, ease: 'power2.out' });
  const yTo = gsap.quickTo(button, 'y', { duration: 0.4, ease: 'power2.out' });

  function onMouseMove(e: MouseEvent) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < MAX_DISTANCE && distance > 0) {
      // Move até MAX_MOVE px na direção do cursor, independente da distância
      const scale = Math.min(MAX_MOVE, distance) / distance;
      xTo(dx * scale);
      yTo(dy * scale);
    } else {
      // Retorna à origem com spring
      gsap.to(button, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    }
  }

  window.addEventListener('mousemove', onMouseMove);

  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    gsap.set(button, { x: 0, y: 0 });
  };
}
