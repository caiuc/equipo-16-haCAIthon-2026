import { useEffect, useState } from 'react'
import './App.css'
import './components/form.css'
import Diagram from './components/diagram'

const REQUIRED_FIELDS = ['nem', 'ranking', 'matematicas', 'lenguaje']
const OPTIONAL_FIELDS = ['ciencia', 'historia']

const FIELD_LABELS = {
  nem: 'NEM',
  ranking: 'Ranking',
  matematicas: 'Matemáticas',
  lenguaje: 'Lenguaje',
  ciencia: 'Ciencia',
  historia: 'Historia',
}

function App() {
  const [values, setValues] = useState({
    nem: '',
    ranking: '',
    matematicas: '',
    lenguaje: '',
    ciencia: '',
    historia: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)


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

  function validateField(name, value) {
    if (value === '') {
      return REQUIRED_FIELDS.includes(name) ? 'Este campo es obligatorio' : ''
    }
    const num = Number(value)
    if (!Number.isInteger(num)) {
      return 'Debe ser un número entero'
    }
    if (num < 1 || num > 1000) {
      return 'Debe estar entre 1 y 1000'
    }
    return ''
  }

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    // Clear the group error if either ciencia or historia is now filled
    if (name === 'ciencia' || name === 'historia') {
      if (value !== '' || values.ciencia !== '' || values.historia !== '') {
        setErrors((prev) => ({ ...prev, group: '' }))
      }
    }
    setSubmitted(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    for (const field of [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS]) {
      const err = validateField(field, values[field])
      if (err) newErrors[field] = err
    }
    // At least one of ciencia or historia must be filled
    if (values.ciencia === '' && values.historia === '') {
      newErrors.group = 'Debes completar al menos uno: Ciencia o Historia'
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true)
    }
  }

  function renderField(name) {
    const isRequired = REQUIRED_FIELDS.includes(name)
    return (
      <div className="form-group" key={name}>
        <label className="form-label" htmlFor={name}>
          {FIELD_LABELS[name]}
          {isRequired ? (
            <span className="required">*</span>
          ) : (
            <span className="optional">(opcional)</span>
          )}
        </label>
        <input
          id={name}
          name={name}
          type="number"
          min="1"
          max="1000"
          className={`form-input${errors[name] ? ' error' : ''}`}
          value={values[name]}
          onChange={handleChange}
          placeholder="1 - 1000"
          required={isRequired}
        />
        {errors[name] && <p className="form-error">{errors[name]}</p>}
      </div>
    )
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
          <a
            className="btn-glitch-fill"
            role="button"
            onClick={scrollToInfo}
          >
            <span className="text">Empezar</span>
            <span className="text-decoration"> _</span>
            <span className="decoration">⇒</span>
          </a>
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

      <section className="form-section">
        <div className="form-container">
          <h2 className="form-title">Ingresa tus puntajes</h2>
          <p className="form-subtitle">
            Los campos marcados con * son obligatorios. Valores entre 1 y 1000.
            Ciencia e Historia son opcionales, pero al menos uno debe completarse.
          </p>
          <form onSubmit={handleSubmit} noValidate>
            {[...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].map(renderField)}
            {errors.group && <p className="form-error">{errors.group}</p>}
            <button type="submit" className="form-submit">
              Enviar
            </button>
          </form>
          {submitted && (
            <div className="form-success">
              ¡Datos enviados correctamente!
            </div>
          )}
        </div>
      </section>
      {/* <Diagram
        nodeBackgroundColor="#ffffffff"
        nodeOpacity={0.6}
      ></Diagram> */}
    </div>
  )
}

export default App