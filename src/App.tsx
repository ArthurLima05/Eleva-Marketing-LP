import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Marquee from './components/Marquee/Marquee'
import Manifesto from './components/Manifesto/Manifesto'
import Numeros from './components/Numeros/Numeros'
import Problema from './components/Problema/Problema'
import ScrollScrubbing from './components/ScrollScrubbing/ScrollScrubbing'
import Servicos from './components/Servicos/Servicos'
import Processo from './components/Processo/Processo'
import Diferenciais from './components/Diferenciais/Diferenciais'
import Depoimentos from './components/Depoimentos/Depoimentos'
import ParaQuemE from './components/ParaQuemE/ParaQuemE'
import CTAFinal from './components/CTAFinal/CTAFinal'

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee theme="light" speed={25} />
      <Manifesto />
      <Numeros />
      <Problema />
      <ScrollScrubbing />
      <Servicos />
      <Marquee theme="dark" speed={35} />
      <Processo />
      <Diferenciais />
      <Depoimentos />
      <ParaQuemE />
      <CTAFinal />
    </>
  )
}
