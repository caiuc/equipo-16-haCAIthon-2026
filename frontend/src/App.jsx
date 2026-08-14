import { useEffect } from 'react'
import './App.css'
import Diagram from './components/diagram'

function App() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.15 }
    )
    reveals.forEach((r) => io.observe(r))
    return () => io.disconnect()
  }, [])

  function scrollToInfo() {
    const el = document.getElementById('info')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  function scrollToNextSection() {
    const el = document.getElementById('info')
    if (!el) return
    const next = el.nextElementSibling
    if (next) next.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="page">
      <div className="starfield">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div></div>
      </div>
      <section id="intro" className="section hero">
        <div className="layer" />
        <div className="container">
          <div className="hero-header">
            <h1 className="hero-title">
              <span className="hero-title-main">Bienvenido a Only<span className="hero-us">Us</span></span>
            </h1>
            <h2 className="hero-title-sub">Elige tu carrera</h2>
            <p className="lead">Descubre opciones según tus intereses y habilidades.</p>
          </div>
          <button className="button" onClick={scrollToInfo} aria-label="Empezar">
            <svg
              className="button-cosm"
              fill="#000000"
              width="128"
              height="128"
              viewBox="0 0 256 256"
              id="Flat"
            >
              <path
                d="M243.07324,157.43945c-1.2334-1.47949-23.18847-27.34619-60.46972-41.05859-1.67579-17.97412-8.25293-34.36328-18.93653-46.87158C149.41309,52.8208,128.78027,44,104,44,54.51074,44,22.10059,88.57715,20.74512,90.4751a3.99987,3.99987,0,0,0,6.50781,4.65234C27.5625,94.6958,58.68359,52,104,52c22.36816,0,40.89648,7.85107,53.584,22.70508,8.915,10.437,14.65625,23.9541,16.65528,38.894A133.54185,133.54185,0,0,0,136,108c-25.10742,0-46.09473,6.48486-60.69434,18.75391-12.65234,10.63379-19.91015,25.39355-19.91015,40.49463a43.61545,43.61545,0,0,0,12.69336,31.21923C76.98438,207.3208,89.40234,212,104,212c23.98047,0,44.37305-9.4668,58.97461-27.37744,12.74512-15.6333,20.05566-37.145,20.05566-59.01953,0-.1128-.001-.22559-.001-.33838,33.62988,13.48486,53.62207,36.96631,53.89746,37.2959a4.00015,4.00015,0,0,0,6.14648-5.1211ZM104,204c-27.89746,0-40.60449-19.05078-40.60449-36.75146C63.39551,142.56592,86.11621,116,136,116a124.37834,124.37834,0,0,1,38.97266,6.32617q.05712,1.63038.05761,3.27686C175.03027,177.07129,139.29785,204,104,204Z"
              ></path>
            </svg>
            <svg
              className="highlight"
              viewBox="0 0 144.75738 77.18431"
              preserveAspectRatio="none"
            >
              <g transform="translate(-171.52826,-126.11624)">
                <g
                  fill="none"
                  strokeWidth="17"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                >
                  <path
                    d="M180.02826,169.45123c0,0 12.65228,-25.55115 24.2441,-25.66863c6.39271,-0.06479 -5.89143,46.12943 4.90937,50.63857c10.22345,4.2681 24.14292,-52.38336 37.86455,-59.80493c3.31715,-1.79413 -5.35094,45.88889 -0.78872,58.34589c5.19371,14.18125 33.36934,-58.38221 36.43049,-56.91633c4.67078,2.23667 -0.06338,44.42744 5.22574,47.53647c6.04041,3.55065 19.87185,-20.77286 19.87185,-20.77286"
                  ></path>
                </g>
              </g>
            </svg>
            Empezar
          </button>
          {/* Inline SVG filters needed by the button visual effects */}
          <svg height="0" width="0" style={{ position: 'absolute' }} aria-hidden>
            <filter id="handDrawnNoise">
              <feTurbulence result="noise" numOctaves="8" baseFrequency="0.1" type="fractalNoise" />
              <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale="3" in2="noise" in="SourceGraphic" />
            </filter>
            <filter id="handDrawnNoise2">
              <feTurbulence result="noise" numOctaves="8" baseFrequency="0.1" seed="1010" type="fractalNoise" />
              <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale="3" in2="noise" in="SourceGraphic" />
            </filter>

            <filter id="handDrawnNoiset">
              <feTurbulence result="noise" numOctaves="8" baseFrequency="0.1" type="fractalNoise" />
              <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale="6" in2="noise" in="SourceGraphic" />
            </filter>
            <filter id="handDrawnNoiset2">
              <feTurbulence result="noise" numOctaves="8" baseFrequency="0.1" seed="1010" type="fractalNoise" />
              <feDisplacementMap yChannelSelector="G" xChannelSelector="R" scale="6" in2="noise" in="SourceGraphic" />
            </filter>
          </svg>
        </div>
      </section>

      <section id="info" className="section reveal">
        <div className="container">
          <h2>¿Cómo funciona?</h2>
          <p className="info-lead">
            Responde preguntas breves y te mostraremos carreras que se ajusten a
            tus intereses.
          </p>
          <div className="cards">
            <p className="u-browser-warning">If this looks wonky to you it's because this browser doesn't support the CSS property 'aspect-ratio'.</p>

            <div className="u-stack">
              <div className="u-card">
                <div className="u-image">
                  <svg className="u-icon" viewBox="0 0 24 24" aria-hidden>
                    <circle cx="11" cy="11" r="6" strokeWidth="1.5" stroke="#000" fill="none" />
                    <line x1="20" y1="20" x2="16.5" y2="16.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <h3 className="u-card-title">EXPLORA</h3>
                  <p className="u-card-desc">Obtén una lista de carreras según tus gustos.</p>
                </div>
              </div>
            </div>

            <div className="u-stack">
              <div className="u-card">
                <div className="u-image">
                  <svg className="u-icon" viewBox="0 0 24 24" aria-hidden>
                    <circle cx="9" cy="10" r="2.2" stroke="#000" strokeWidth="1.5" fill="none" />
                    <circle cx="15" cy="9" r="2.2" stroke="#000" strokeWidth="1.5" fill="none" />
                    <path d="M6 14h4M14 14h4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <h3 className="u-card-title">COMPARA</h3>
                  <p className="u-card-desc">Compara requisitos, duración y salida laboral.</p>
                </div>
              </div>
            </div>

            <div className="u-stack">
              <div className="u-card">
                <div className="u-image">
                  <svg className="u-icon" viewBox="0 0 24 24" aria-hidden>
                    <path d="M2 8l10-5 10 5-10 5L2 8z" stroke="#000" strokeWidth="1.5" fill="none" />
                    <path d="M12 13v4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M7 18c1 1 3 2 5 2s4-1 5-2" stroke="#000" strokeWidth="1.2" fill="none" />
                  </svg>
                  <h3 className="u-card-title">DECIDE</h3>
                  <p className="u-card-desc">Guía paso a paso para postular y prepararte.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="info-sub">
            Navega hacia abajo para ver más información.
          </p>

        </div>

        <button className="down-arrow" onClick={scrollToNextSection} aria-label="Ir a siguiente sección">
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
            <path d="M6 9l6 6 6-6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </section>

      <section className="section reveal">
        <div className="container">
          <h2>Test rápido</h2>
          <p>
            En unos minutos sabrás qué áreas te motivan más y qué estudiar.
          </p>
        </div>
      </section>
    </div>
  )
}

export default App
