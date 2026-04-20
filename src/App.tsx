import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Marquee from './components/Marquee/Marquee'
import Problema from './components/Problema/Problema'
import Manifesto from './components/Manifesto/Manifesto'
import Servicos from './components/Servicos/Servicos'
import Processo from './components/Processo/Processo'
import Numeros from './components/Numeros/Numeros'
import Depoimentos from './components/Depoimentos/Depoimentos'
import Diferenciais from './components/Diferenciais/Diferenciais'
import ParaQuemE from './components/ParaQuemE/ParaQuemE'
import CTAFinal from './components/CTAFinal/CTAFinal'

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee theme="light" speed={25} />
      <Problema />
      <Manifesto />
      <Servicos />
      <Processo />
      <Numeros />
      <Depoimentos />
      <Diferenciais />
      <ParaQuemE />
      <CTAFinal />
    </>
  )
}
