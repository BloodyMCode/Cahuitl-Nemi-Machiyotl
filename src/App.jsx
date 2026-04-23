import { useState } from 'react'
import reactLogo from './assets/react.svg'
/* import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png' */
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'
import Menu from './components/pages/Menu'
import Conversor from './components/pages/Conversor'
import Inverso from './components/pages/Inverso'
import Tablero from './components/pages/Tablero'
import Engranajes from './components/pages/Engranajes'
import Calculadora from './components/pages/Calculadora'
import { getImagePath } from './components/funtions/funtions'

function App() {
  /* const [count, setCount] = useState(0) */

  return (
    <>
      <Router>
        <div style={{ display: 'flex', width: '100%', margin: 0, padding: '5px 0', backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' }}>
          {/* <img src={new URL('./components/images/logo-tlacua.png', import.meta.url).href} alt="Logo TLACUATZIN" style={{ width: '100%', maxWidth: '120px', minWidth: '30px', height: 'auto', objectFit: 'contain', objectPosition: 'right' }} /> */}
          <img src={getImagePath('prueba2.png')} alt="Barra decorativa" style={{ width: '100%', maxWidth: '2000px', minWidth: '100px', height: 'auto', objectFit: 'contain', objectPosition: 'left'/* , marginLeft: '15px'  */ }} />
        </div>
        <Menu />
        <Routes>
          <Route path="/" element={<Conversor />} />
          <Route path="/inverso" element={<Inverso />} />
          <Route path="/tablero" element={<Tablero />} />
          <Route path="/engranajes" element={<Engranajes />} />
          <Route path="/calculadora" element={<Calculadora />} />
        </Routes>
        <footer className="text-center mt-5 p-4" style={{ borderTop: '1px solid #334155', color: '#94a3b8', fontSize: '0.9rem' }}>
          <p className="mb-0">Creditos. © 2026 TLACUATZIN CODEX LAB Investigación Transdisciplinaria de la Matemática en los Códices Prehispánicos de México. Todos los derechos reservados.</p>
        </footer>
      </Router>
      {/* <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section> */}
    </>
  )
}

export default App
