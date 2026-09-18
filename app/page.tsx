"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, MapPin, Menu, Phone, X } from "lucide-react";
import { LivingPainting } from "@/components/living-painting";

const DELIVERY = "https://deliverydireto.com.br/vangogh/vangogh";
const links = [
  ["inicio", "Início"], ["cardapio", "Cardápio"], ["sobre", "Sobre"], ["contato", "Contato"],
] as const;
const highlights = [
  { name: "Pizza de Camarão", description: "Camarão rosa; mussarela ou catupiry, com cebola, salsinha e azeitonas." },
  { name: "Happy Hour Van Gogh", description: "A partir das 17h: cornicciones, pizzetas e outros aperitivos." },
  { name: "Adega", description: "Vinhos para acompanhar a refeição, com orientação de um sommelier." },
];
export default function Home() {
  const scene = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
    links.forEach(([id]) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", escape);
    return () => { observer.disconnect(); document.removeEventListener("keydown", escape); };
  }, []);

  return (
    <>
      <a className="skip-link" href="#inicio">Pular para o conteúdo</a>
      <LivingPainting scene={scene} />
      <header className="site-header">
        <a className="wordmark" href="#inicio" onClick={() => setMenuOpen(false)} aria-label="Van-Gogh Pizzaria — início">
          <span>Van-Gogh</span><small>Pizzaria</small>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}>{label}</a>)}
        </nav>
        <a className="header-order" href={DELIVERY} target="_blank" rel="noopener noreferrer">Pedir online <ArrowUpRight size={16} /></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Navegação móvel" hidden={!menuOpen}>
          {links.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} aria-current={active === id ? "location" : undefined}>{label}<ArrowUpRight size={18} /></a>)}
        </nav>
      </header>
      <main>
        <div className="painted-journey" ref={scene}>
          <section className="hero page-width" id="inicio" aria-labelledby="hero-title">
            <div className="hero-copy">
              <h1 id="hero-title">Van-Gogh <span>Pizzaria</span></h1>
              <h2>Restaurante e Pizzaria em Santos</h2>
              <p>Receitas tradicionais com toques contemporâneos.<br />No José Menino, em Santos.</p>
              <div className="hero-actions">
                <a className="button button-gold" href={DELIVERY} target="_blank" rel="noopener noreferrer">Pedir online <ArrowUpRight size={18} /></a>
                <a className="quiet-link" href="#cardapio">Conhecer o cardápio</a>
              </div>
            </div>
            <a href="#cardapio" className="scroll-cue"><span>Descubra mais</span><ArrowDown size={20} /></a>
          </section>
          <div className="landscape-passage" aria-hidden="true" />
          <section className="menu-section page-width" id="cardapio" aria-labelledby="menu-title">
            <div className="glass-panel menu-panel">
              <h2 id="menu-title">Sugestões do Chef</h2>
              <div className="highlights">
                {highlights.map(item => <article key={item.name}>
                  <div><h3>{item.name}</h3><p>{item.description}</p></div>
                  <a href={DELIVERY} target="_blank" rel="noopener noreferrer" aria-label={`Consultar ${item.name} no cardápio oficial`}><ArrowUpRight size={23} /></a>
                </article>)}
              </div>
              <a className="quiet-link full-menu" href={DELIVERY} target="_blank" rel="noopener noreferrer">Ver cardápio completo e preços <ArrowUpRight size={18} /></a>
            </div>
          </section>
        </div>
        <div className="restaurant-details">
          <section className="about-section page-width" id="sobre" aria-labelledby="about-title">
            <p className="eyebrow">A casa</p>
            <div className="about-layout">
              <h2 id="about-title">À mesa,<br /><em>em Santos.</em></h2>
              <div className="about-copy">
                <p>A Van Gogh reúne pizzas, massas, risotos, saladas e pratos de carnes, peixes e camarões em seu restaurante no José Menino.</p>
                <p>O cardápio inclui opções de pizzas doces e sem lactose, além de entradas como burratas e carpaccios. A carta de vinhos acompanha a experiência.</p>
                <a className="quiet-link" href={DELIVERY + "/pages/sobre-nos"} target="_blank" rel="noopener noreferrer">Conheça o restaurante <ArrowUpRight size={18} /></a>
              </div>
            </div>
          </section>
          <section className="contact-section page-width" id="contato" aria-labelledby="contact-title">
            <div className="contact-intro"><p className="eyebrow">José Menino · Santos</p><h2 id="contact-title">Venha à<br /><em>Van-Gogh.</em></h2></div>
            <div className="contact-info">
              <h3><MapPin size={19} /> Localização</h3>
              <address>Av. Mal. Floriano Peixoto, 314<br />José Menino, Santos – SP</address>
              <a className="quiet-link" href="https://www.google.com/maps/search/?api=1&query=Van+Gogh+Av+Mal+Floriano+Peixoto+314+Santos" target="_blank" rel="noopener noreferrer">Traçar rota <ArrowUpRight size={17} /></a>
              <h3><Phone size={18} /> Fale com a casa</h3>
              <a className="phone-link" href="tel:+551332253636">(13) 3225-3636</a>
              <a className="phone-link" href="tel:+551332053636">(13) 3205-3636</a>
              <a className="email-link" href="mailto:contato@vangoghpizza.com.br">contato@vangoghpizza.com.br</a>
              <a className="button button-gold" href={DELIVERY} target="_blank" rel="noopener noreferrer">Consultar horários e pedir <ArrowUpRight size={17} /></a>
            </div>
          </section>
          <footer className="site-footer page-width">
            <a className="wordmark" href="#inicio"><span>Van-Gogh</span><small>Pizzaria</small></a>
            <p>Conceito independente de design.<br /><a href="https://www.vangoghpizza.com.br/" target="_blank" rel="noopener noreferrer">Visitar site oficial</a></p>
          </footer>
        </div>
      </main>
    </>
  );
}
