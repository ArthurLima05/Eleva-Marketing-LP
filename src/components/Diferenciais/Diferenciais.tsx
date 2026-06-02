import { useEffect } from 'react';
import styles from './Diferenciais.module.css';

const DIFERENCIAIS = [
  {
    num: '01',
    title: 'Agência 360°',
    desc: 'Estratégia, conteúdo, tráfego, branding e site, tudo integrado sob uma única direção. Você tem um time completo focado no crescimento da sua marca, sem precisar coordenar fornecedores ou reexplicar o posicionamento da sua empresa.',
  },
  {
    num: '02',
    title: 'Captação presencial',
    desc: 'Realizamos visitas presenciais para captar conteúdos reais da sua empresa. Nada de imagens genéricas — mostramos sua marca com autenticidade, proximidade e estratégia.',
  },
  {
    num: '03',
    title: 'Drone próprio incluso',
    desc: 'Captação aérea profissional sem custo adicional. A maioria das agências cobra à parte ou terceiriza. Na Eleva já está no pacote.',
  },
  {
    num: '04',
    title: 'Relatórios e reuniões estratégicas',
    desc: 'Apresentamos análises de desempenho, métricas e direcionamentos estratégicos para otimizar os resultados das campanhas. Além dos relatórios, realizamos reuniões de alinhamento para acompanhar a evolução da marca e definir os próximos passos com clareza e estratégia.',
  },
  {
    num: '05',
    title: 'Atendimento estratégico',
    desc: 'Acompanhamento próximo, comunicação rápida e decisões alinhadas com o objetivo da sua marca. Aqui, sua empresa não é só mais um cliente na agenda.',
  },
];

export default function Diferenciais() {
  useEffect(() => {
    const items = document.querySelectorAll(
      '[class*="item_"]'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add(styles.visible);
            }, i * 120);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.diferenciais}>

      {/* Fundo opaco com a foto da equipe */}
      <div className={styles.bgWrap} aria-hidden="true">
        <img
          src="/images/diferenciais-equipe.jpg"
          alt=""
          className={styles.bgImg}
        />
      </div>

      <div className={styles.inner}>

        {/* Coluna esquerda — título sticky */}
        <div className={styles.left}>
          <span className={styles.label}>POR QUE A ELEVA</span>
          <h2 className={styles.title}>
            O QUE NOS <strong>DIFERENCIA</strong>
          </h2>
          <p className={styles.subtitle}>
            Enquanto outras agências entregam serviços,
            a Eleva constrói uma parceria estruturada
            para crescimento real.
          </p>
        </div>

        {/* Coluna direita — lista */}
        <div className={styles.right}>
          {DIFERENCIAIS.map((d) => (
            <div className={styles.item} key={d.num} data-num={d.num}>
              <span className={styles.num}>{d.num}</span>
              <div className={styles.itemContent}>
                <h3 className={styles.itemTitle}>{d.title}</h3>
                <p className={styles.itemDesc}>{d.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
