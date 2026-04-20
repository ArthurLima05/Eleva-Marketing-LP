import { useState } from 'react';
import styles from './Servicos.module.css';

const SERVICES = [
  {
    name: 'Tráfego Pago',
    desc: 'Planejamos e gerenciamos campanhas estratégicas que conectam sua marca ao público certo, com segmentação inteligente e foco em resultado real. Cada anúncio é pensado para gerar posicionamento, oportunidades e elevar o seu faturamento com consistência e estratégia.',
    image: '/images/servicos/trafego.jpg',
  },
  {
    name: 'Produção de Vídeo',
    desc: 'Produzimos vídeos estratégicos que contam a história da sua marca com propósito e posicionamento. Do conceito à edição final, criamos conteúdos que geram conexão, fortalecem sua autoridade e elevam o impacto da sua comunicação no digital.',
    image: '/images/servicos/video.jpg',
  },
  {
    name: 'Design Gráfico',
    desc: 'Desenvolvemos identidades visuais e materiais estratégicos que fortalecem o posicionamento da sua marca e transmitem profissionalismo. Um design bem estruturado comunica valor, gera reconhecimento e eleva a percepção do seu negócio no mercado.',
    image: '/images/servicos/design.jpg',
  },
  {
    name: 'Gestão de Redes',
    desc: 'Planejamos, criamos e gerenciamos conteúdos estratégicos que fortalecem sua presença digital. Com posicionamento claro e constância, sua marca ganha relevância, gera conexão com o público e eleva seus resultados nas redes sociais.',
    image: '/images/servicos/gestao.jpg',
  },
  {
    name: 'Sites e Landing Pages',
    desc: 'Criamos páginas estratégicas e otimizadas para conversão, com foco em performance, experiência do usuário e resultados reais. Um site bem estruturado posiciona sua marca com autoridade e eleva suas oportunidades de venda no digital.',
    image: '/images/servicos/sites.jpg',
  },
  {
    name: 'Fotografia',
    desc: 'Produzimos imagens estratégicas que valorizam sua marca, destacam seus produtos e fortalecem seu posicionamento. Uma fotografia bem direcionada transmite credibilidade, gera conexão e eleva a percepção do seu negócio no mercado.',
    image: '/images/servicos/fotografia.jpg',
  },
  {
    name: 'Captação Aérea',
    desc: 'Produzimos vídeos e imagens aéreas estratégicas que ampliam a percepção da sua marca, destacam estruturas, eventos e empreendimentos sob um novo ângulo e geram impacto imediato. Uma captação aérea bem direcionada transmite grandeza, inovação e posicionamento elevado no mercado.',
    image: '/images/servicos/drone.jpg',
  },
];

export default function Servicos() {
  const [active, setActive] = useState<number>(0);

  return (
    <section className={styles.servicos}>

      {/* Cabeçalho */}
      <div className={styles.header}>
        <span className={styles.label}>O QUE ENTREGAMOS</span>
        <h2 className={styles.title}>
          NOSSOS <strong>SERVIÇOS</strong>
        </h2>
      </div>

      {/* Accordion desktop */}
      <div className={styles.accordion}>
        {SERVICES.map((s, i) => (
          <div
            key={s.name}
            className={`${styles.panel} ${i === active ? styles.panelActive : ''}`}
            onMouseEnter={() => setActive(i)}
          >
            {/* Imagem de fundo */}
            <div className={styles.panelMedia}>
              <img
                src={s.image}
                alt={s.name}
                className={styles.panelImg}
              />
              <div className={styles.panelOverlay} />
            </div>

            {/* Nome vertical — visível quando recolhido */}
            <span className={styles.panelNameVertical}>{s.name}</span>

            {/* Conteúdo — visível quando expandido */}
            <div className={styles.panelContent}>
              <h3 className={styles.panelName}>{s.name}</h3>
              <p className={styles.panelDesc}>{s.desc}</p>
            </div>

          </div>
        ))}
      </div>

      {/* Lista mobile — sempre visível */}
      <div className={styles.mobileList}>
        {SERVICES.map((s) => (
          <div className={styles.mobileCard} key={s.name}>
            <div className={styles.mobileMedia}>
              <img
                src={s.image}
                alt={s.name}
                className={styles.mobileImg}
              />
              <div className={styles.mobilePlaceholder} />
            </div>
            <div className={styles.mobileContent}>
              <h3 className={styles.mobileName}>{s.name}</h3>
              <p className={styles.mobileDesc}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
