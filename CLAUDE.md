# CLAUDE.md — Eleva Marketing Landing Page

## Stack

- Vite + React 18 + TypeScript
- CSS Modules (zero Tailwind, zero styled-components)
- GSAP + ScrollTrigger para animações de scroll
- Sem estado global (sem Redux, sem Zustand) — props e context apenas se
  necessário

## Design System

- bg-primary: #0a0a0a
- bg-secondary: #111111
- text-primary: #ffffff
- text-muted: #888888
- Fonte: Proxima Nova via @font-face em global.css

## Convenção tipográfica (CRÍTICO — nunca alterar)

- Títulos: uppercase, font-style: italic, letter-spacing: 0.115em
- Palavra de destaque no título: font-style: normal, font-weight: 700,
  letter-spacing: 0.001em, text-decoration: underline
- Subtítulos: uppercase, italic, letter-spacing: 0.07em
- Parágrafos: lowercase, letter-spacing: 0, line-height: 1.1

## Estrutura de componentes

- 1 pasta por seção em src/components/
- Cada pasta: ComponentName.tsx + ComponentName.module.css
- Hooks reutilizáveis em src/hooks/
- Nenhuma lógica de animação dentro do .tsx — vai em utils/animations.ts e é
  chamada no useEffect do componente

## Regras obrigatórias para o Claude

- NUNCA reescrever o componente inteiro para um ajuste pequeno
- NUNCA instalar dependência nova sem perguntar primeiro
- SEMPRE usar CSS Modules — zero inline styles, zero className com string
  concatenada
- Animações GSAP: sempre retornar cleanup no useEffect (return () =>
  ctx.revert())
- useEffect com GSAP: sempre usar gsap.context() para escopo correto
- Imagens do scroll scrubbing ficam em /public/frames/ e são referenciadas como
  strings, nunca importadas como módulo

## Seções (ordem)

1. Hero — fundo preto, título fullscreen, split text ao carregar
2. Manifesto — texto grande com reveal por cor no scroll
3. Numeros — 4 métricas com contador animado ao entrar na tela
4. Problema — 3 dores, fundo #111, reveal por linha
5. ScrollScrubbing — frame scrubbing do vídeo (~180 frames)
6. Servicos — grid de cards com border animada no hover
7. Processo — 4 passos com linha conectora que se desenha no scroll
8. Depoimentos — cards de prova social
9. ParaQuemE — filtro de cliente ideal
10. CTAFinal — fundo preto, 1 botão WhatsApp

## Ordem de implementação por sessão

Sempre: HTML estático → CSS → animação. Nunca pule etapas.
