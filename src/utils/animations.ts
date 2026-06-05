import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Anima as palavras do título com slide-up suave + fade.
 * Deve ser chamada dentro de um gsap.context() no useEffect.
 */
export function animateHeroTitleIn(words: HTMLElement[]): void {
  gsap.fromTo(
    words,
    { y: '30px', opacity: 0 },
    {
      y: '0px',
      opacity: 1,
      duration: 1.1,
      ease: 'power2.out',
      stagger: 0.09,
    }
  );
}

/**
 * Fade-in suave para subtítulo e CTA.
 * Deve ser chamada dentro de um gsap.context() no useEffect.
 */
export function animateFadeIn(els: HTMLElement[], delay = 0): void {
  gsap.fromTo(
    els,
    { opacity: 0, y: '12px' },
    { opacity: 1, y: '0px', duration: 0.9, ease: 'power2.out', delay }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas + frames scrubbing
// ─────────────────────────────────────────────────────────────────────────────

/** Desenha um frame simulando object-fit: cover no canvas. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  logicalW: number,
  logicalH: number
): void {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = logicalW / logicalH;
  let dw: number, dh: number, dx: number, dy: number;

  if (imgRatio > canvasRatio) {
    // imagem mais larga: ajusta pela altura
    dh = logicalH;
    dw = dh * imgRatio;
    dx = (logicalW - dw) / 2;
    dy = 0;
  } else {
    // imagem mais alta: ajusta pela largura
    dw = logicalW;
    dh = dw / imgRatio;
    dx = 0;
    dy = (logicalH - dh) / 2;
  }

  ctx.drawImage(img, dx, dy, dw, dh);
}

/** Caminho para o frame i (base-0). Ex.: i=0 → /frames/frame-0001.jpg */
function framePath(i: number): string {
  return `/frames/frame-${String(i + 1).padStart(4, '0')}.jpg`;
}

/**
 * Configura o scroll scrubbing da Hero via canvas + frames JPG pré-carregados.
 *
 * Estratégia de carga:
 *  - Primeiros EAGER_COUNT frames carregam imediatamente (obturador fechado visível)
 *  - Restantes carregam em background (o browser limita as conexões paralelas)
 *
 * Suavização:
 *  - ScrollTrigger fornece o progresso (0→1)
 *  - Um loop rAF lerpa o progresso, evitando saltos em scrolls rápidos
 *  - Math.round() no índice final (nunca Math.floor) para evitar bias
 *
 * @param canvas     Elemento canvas já no DOM
 * @param trigger    Elemento section (250vh) que delimita o scrub
 * @param totalFrames Número exato de frames em /public/frames/
 * @param onFullyOpen Callback quando obturador está ≥97% aberto
 * @param onClose     Callback quando obturador volta abaixo de 93%
 * @param onProgress  Callback opcional chamado a cada update com progress 0→1
 * @returns Função de cleanup para o useEffect
 */
export function setupCanvasScrollScrubbing(
  canvas: HTMLCanvasElement,
  trigger: HTMLElement,
  totalFrames: number,
  onFullyOpen: () => void,
  onClose: () => void,
  onProgress?: (progress: number) => void,
  frameStart = 0
): () => void {
  const ctx = canvas.getContext('2d')!;
  if (!ctx) return () => undefined;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const EAGER_COUNT = totalFrames;
  const LERP_FACTOR = 0.08; // suavização do progresso entre frames

  // Array de imagens pré-alocado — nunca cria new Image() durante o scroll
  const frames: HTMLImageElement[] = new Array(totalFrames);

  let targetProgress = 0;
  let lerpedProgress = 0;
  let openTriggered = false;
  let rafId = 0;
  let rafRunning = false;
  let currentFrameIdx = 0;

  // Dimensões cacheadas — evita layout thrashing no rAF
  let cachedW = 0;
  let cachedH = 0;

  // ── Redimensionar canvas para preencher o elemento (respeitando dpr) ────
  function resizeCanvas(): void {
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    if (W === 0 || H === 0) return;

    cachedW = W;
    cachedH = H;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    // setTransform permite usar coordenadas CSS nos drawImage calls
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Redesenha o frame atual após resize
    if (frames[currentFrameIdx]?.complete) {
      drawCover(ctx, frames[currentFrameIdx], cachedW, cachedH);
    }
  }

  // ── Loop rAF: lerpa progresso e desenha o frame correspondente ──────────
  function startRaf(): void {
    if (rafRunning) return;
    rafRunning = true;

    function loop(): void {
      const diff = targetProgress - lerpedProgress;
      if (Math.abs(diff) > 0.0003) {
        lerpedProgress += diff * LERP_FACTOR;
        const nextIdx = Math.round(frameStart + lerpedProgress * (totalFrames - 1 - frameStart));
        // Só redesenha se o frame mudou — evita drawImage desnecessário
        if (nextIdx !== currentFrameIdx || lerpedProgress !== targetProgress) {
          currentFrameIdx = nextIdx;
          const frame = frames[currentFrameIdx];
          if (frame?.complete && cachedW > 0) {
            drawCover(ctx, frame, cachedW, cachedH);
          }
        }
        rafId = requestAnimationFrame(loop);
      } else {
        lerpedProgress = targetProgress;
        rafRunning = false;
      }
    }

    rafId = requestAnimationFrame(loop);
  }

  // ── Carregamento de um frame individual ─────────────────────────────────
  function loadFrame(i: number, onLoad?: () => void): void {
    const img = new Image();
    img.onload = () => {
      frames[i] = img;
      if (onLoad) onLoad();
    };
    img.src = framePath(i);
  }

  // ── Preload dos primeiros EAGER_COUNT frames ─────────────────────────────
  let eagerLoaded = 0;

  function startBackgroundLoad(): void {
    // Browser gerencia as conexões paralelas (~6 simultâneas)
    for (let i = EAGER_COUNT; i < totalFrames; i++) {
      loadFrame(i);
    }
  }

  for (let i = 0; i < EAGER_COUNT; i++) {
    loadFrame(i, () => {
      eagerLoaded++;
      // Exibe o frame 0 (obturador fechado) assim que estiver pronto
      if (i === 0 && frames[0]?.complete) {
        resizeCanvas(); // garante dimensões antes do primeiro draw
        drawCover(ctx, frames[0], canvas.offsetWidth, canvas.offsetHeight);
      }
      // Quando os EAGER frames terminarem, inicia carga em background
      if (eagerLoaded === EAGER_COUNT) {
        startBackgroundLoad();
      }
    });
  }

  // ── ScrollTrigger: atualiza targetProgress e dispara callbacks ───────────
  const st = ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: () => '+=' + Math.round(window.innerHeight * 0.85),
    onUpdate: (self) => {
      targetProgress = self.progress;
      startRaf();

      if (onProgress) onProgress(self.progress);

      if (!openTriggered && self.progress >= 0.97) {
        openTriggered = true;
        onFullyOpen();
      }
      if (openTriggered && self.progress < 0.93) {
        openTriggered = false;
        onClose();
      }
    },
    onLeave: () => {
      if (onProgress) onProgress(1);
    },
    onLeaveBack: () => {
      if (onProgress) onProgress(0);
    },
  });

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  return () => {
    cancelAnimationFrame(rafId);
    st.kill();
    window.removeEventListener('resize', resizeCanvas);
  };
}

/**
 * Transição de cor do subtítulo e botão CTA de branco → preto, sincronizada
 * com o scroll scrubbing do canvas. A transição começa em `frameStart` e
 * termina no último frame, usando o mesmo trigger/end do canvas.
 *
 * @param subtitle    Elemento do subtítulo
 * @param ctaButton   Elemento do botão CTA
 * @param trigger     Elemento section (mesmo trigger do canvas)
 * @param totalFrames Número total de frames (ex.: 240)
 * @param frameStart  Frame a partir do qual a transição começa (ex.: 125)
 */
export function setupSubtitleCtaColorTransition(
  subtitle: HTMLElement,
  ctaButton: HTMLElement,
  trigger: HTMLElement,
  totalFrames: number,
  frameStart: number
): () => void {
const heroScrollHeight = trigger.scrollHeight - window.innerHeight;
const scrubEnd = heroScrollHeight;
const startOffset = Math.round(scrubEnd * (frameStart / (totalFrames - 1)));

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: `top+=${startOffset} top`,
      end: `bottom top`,
      scrub: true,
    },
  });

  tl.to(
    subtitle,
    { color: 'rgba(0,0,0,0.85)', textShadow: 'none', ease: 'none' },
    0
  );

  tl.to(
    ctaButton,
    { color: '#000000', borderColor: 'rgba(0,0,0,0.85)', ease: 'none' },
    0
  );

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Manifesto — reveal por cor no scroll (scrub)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Revela os textos do Manifesto conforme o scroll avança.
 * Label e signature fazem fade simples; parágrafos sobem com scrub.
 * Deve ser chamada dentro de gsap.context().
 */
export function animateManifesto(
  label: HTMLElement,
  texts: HTMLElement[],
  signature: HTMLElement,
  trigger: HTMLElement
): void {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 60%',
      end: 'center 25%',
      scrub: 1,
    },
  });

  tl.to(label, { opacity: 1, duration: 0.25 }, 0);
  texts.forEach((el, i) => {
    tl.to(el, { opacity: 1, y: 0, ease: 'none', duration: 0.45 }, 0.15 + i * 0.28);
  });
  tl.to(signature, { opacity: 1, duration: 0.25 }, 0.85);
}

// ─────────────────────────────────────────────────────────────────────────────
// Problema — reveal por linha
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cada item entra com slide-up + fade ao entrar na viewport.
 * Deve ser chamada dentro de gsap.context().
 */
export function animateProblemaLines(items: HTMLElement[]): void {
  items.forEach((item) => {
    gsap.fromTo(
      item,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
        },
      }
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Processo — linha conectora + steps
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Desenha a linha conectora com scrub e revela os steps em sequência.
 * Deve ser chamada dentro de gsap.context().
 */
export function animateProcesso(
  connector: HTMLElement,
  steps: HTMLElement[],
  trigger: HTMLElement
): void {
  const isMobile = window.innerWidth <= 768

  gsap.fromTo(
    connector,
    isMobile ? { scaleY: 0 } : { scaleX: 0 },
    {
      ...(isMobile ? { scaleY: 1 } : { scaleX: 1 }),
      ease: 'none',
      transformOrigin: isMobile ? 'top center' : 'left center',
      scrollTrigger: {
        trigger,
        start: 'top 80%',
        end: isMobile ? 'bottom 15%' : 'center 30%',
        scrub: 0.8,
      },
    }
  );

  gsap.fromTo(
    steps,
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: 'power3.out',
      stagger: 0.13,
      scrollTrigger: {
        trigger,
        start: 'top 75%',
      },
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Serviços — cards com stagger
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cards entram com stagger de baixo para cima.
 * Deve ser chamada dentro de gsap.context().
 */
export function animateServicosCards(cards: HTMLElement[], trigger: HTMLElement): void {
  gsap.fromTo(
    cards,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger,
        start: 'top 78%',
      },
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Depoimentos — cards com stagger
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cards entram com fade + slide com stagger.
 * Deve ser chamada dentro de gsap.context().
 */
export function animateDepoimentosCards(cards: HTMLElement[], trigger: HTMLElement): void {
  gsap.fromTo(
    cards,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger,
        start: 'top 80%',
      },
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reveal genérico — ParaQuemE, CTAFinal
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fade + slide genérico para seções simples.
 * Deve ser chamada dentro de gsap.context().
 */
export function animateSectionReveal(
  els: HTMLElement[],
  trigger: HTMLElement,
  stagger = 0.12
): void {
  gsap.fromTo(
    els,
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger,
      scrollTrigger: {
        trigger,
        start: 'top 82%',
      },
    }
  );
}

/**
 * Oculta o scroll indicator assim que o usuário começa a scrollar (> 30px).
 * Retorna função de cleanup.
 */
export function setupScrollIndicatorHide(indicator: HTMLElement): () => void {
  function onScroll() {
    if (window.scrollY > 30) {
      gsap.to(indicator, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      window.removeEventListener('scroll', onScroll);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}
