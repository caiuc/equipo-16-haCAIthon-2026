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
          <h1>Bienvenido — Elige tu carrera</h1>
          <p className="lead">Descubre opciones según tus intereses y habilidades.</p>
          <button className="btn primary" onClick={scrollToInfo}>
            Empezar
          </button>
        </div>
      </section>

      <section id="info" className="section reveal">
        <div className="container">
          <h2>¿Cómo funciona?</h2>
          <p>
            Responde preguntas breves y te mostraremos carreras que se ajusten
            a tus intereses. Navega hacia abajo para ver más información.
          </p>
          <div className="cards">
            <article className="card">
              <h3>Explora</h3>
              <p>Obtén una lista de carreras según tus gustos.</p>
            </article>
            <article className="card">
              <h3>Compara</h3>
              <p>Compara requisitos, duración y salida laboral.</p>
            </article>
            <article className="card">
              <h3>Decide</h3>
              <p>Guía paso a paso para postular y prepararte.</p>
            </article>
          </div>
        </div>
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
