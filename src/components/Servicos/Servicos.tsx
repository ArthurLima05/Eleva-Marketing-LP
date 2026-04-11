import styles from './Servicos.module.css'

const SERVICES = [
  {
    name: 'Criação de Conteúdo',
    desc: 'Produzimos vídeos estratégicos que contam a história da sua marca com propósito e posicionamento. Do conceito à edição final, criamos conteúdos que geram conexão, fortalecem sua autoridade e elevam o impacto da sua comunicação no digital.',
    image: '/images/servicos/captacao.jpg',
  },
  {
    name: 'Tráfego Pago',
    desc: 'Planejamos e gerenciamos campanhas estratégicas que conectam sua marca ao público certo, com segmentação inteligente e foco em resultado real. Cada anúncio é pensado para gerar posicionamento, oportunidades e elevar o seu faturamento com consistência e estratégia.',
    image: '/images/servicos/trafego.jpg',
  },
  {
    name: 'Gestão de Redes',
    desc: 'Planejamos, criamos e gerenciamos conteúdos estratégicos que fortalecem sua presença digital. Com posicionamento claro e constância, sua marca ganha relevância, gera conexão com o público e eleva seus resultados nas redes sociais.',
    image: '/images/servicos/gestao.jpg',
  },
  {
    name: 'Identidade Visual',
    desc: 'Uma marca que o mercado reconhece, lembra e escolhe — do logo ao manual completo.',
    image: '/images/servicos/identidade.jpg',
  },
  {
    name: 'Sites e Landing Pages',
    desc: 'Criamos páginas estratégicas e otimizadas para conversão, com foco em performance, experiência do usuário e resultados reais. Um site bem estruturado posiciona sua marca com autoridade e eleva suas oportunidades de venda no digital.',
    image: '/images/servicos/sites.jpg',
  },
]

export default function Servicos() {
  return (
    <section className={styles.servicos}>
      <div className={styles.inner}>
        <p className={styles.sectionLabel}>O QUE ENTREGAMOS</p>
        <h2 className={styles.sectionTitle}>
          NOSSOS <strong>SERVIÇOS</strong>
        </h2>
        <div className={styles.list}>
          {SERVICES.map((s) => (
            <div className={styles.card} key={s.name}>
              {/* Imagem de fundo — revelada no hover */}
              <div className={styles.cardMedia}>
                <img src={s.image} alt={s.name} className={styles.cardImg} />
                <div className={styles.cardOverlay} />
              </div>
              {/* Conteúdo empilhado verticalmente */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardName}>{s.name}</h3>
                <p className={styles.cardDesc}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
