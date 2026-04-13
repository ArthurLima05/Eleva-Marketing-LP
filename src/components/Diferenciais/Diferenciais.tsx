import { useEffect } from 'react';
import styles from './Diferenciais.module.css';

const DIFERENCIAIS = [
  {
    num: '01',
    title: 'Agência 360°',
    desc: 'Estratégia, conteúdo, tráfego, branding e site — tudo integrado sob uma única direção. Você não precisa coordenar múltiplos fornecedores nem reexplicar sua marca para cada um.',
  },
  {
    num: '02',
    title: 'Visita mensal presencial',
    desc: 'Nossa equipe vai até você todos os meses para captação real. Nada de banco de imagens ou conteúdo genérico — sua marca é mostrada com autenticidade.',
  },
  {
    num: '03',
    title: 'Drone próprio incluso',
    desc: 'Captação aérea profissional sem custo adicional. A maioria das agências cobra à parte ou terceiriza. Na Eleva já está no pacote.',
  },
  {
    num: '04',
    title: 'Relatório + reunião estratégica',
    desc: 'Todo mês: dados reais, análise de resultados e planejamento do próximo ciclo. Não entregamos relatório e sumimos — sentamos com você e ajustamos a rota.',
  },
  {
    num: '05',
    title: 'Sem fidelidade forçada',
    desc: 'Ficamos porque os resultados aparecem, não porque um contrato obriga. Nossa renovação de 98% é a prova disso.',
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
            <div className={styles.item} key={d.num}>
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
