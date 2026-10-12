import { useState } from 'react'
import reactLogo from './assets/react.svg'
/* import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png' */
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import './App.css'
import Menu from './components/pages/Menu'
import Inicio from './components/pages/Inicio'
import Conversor from './components/pages/Conversor'
import Inverso from './components/pages/Inverso'
import Tablero from './components/pages/Tablero'
import Toro from './components/pages/Toro'
import Calculadora from './components/pages/Calculadora'
import { getImagePath } from './components/funtions/funtions'
import { ThemeProvider, useTheme } from './context/ThemeContext'


function AppContent() {
  // 1. Creamos un componente interno para poder usar el hook useLocation
  const location = useLocation();
  const esPaginaToro = location.pathname === '/toro';
  const { theme } = useTheme();

  // Render de la barra de imagen decorativa
  const BarraDecorativa = (
    <div style={{ display: 'flex', width: '100%', margin: 0, padding: '5px 0', backgroundColor: theme === 'dark' ? '#121212' : '#ffffff', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s ease' }}>
      {/* <img src={new URL('./components/images/logo-tlacua.png', import.meta.url).href} alt="Logo TLACUATZIN" style={{ width: '100%', maxWidth: '120px', minWidth: '30px', height: 'auto', objectFit: 'contain', objectPosition: 'right' }} /> */}
      {/* <img src={getImagePath('prueba2.png')} alt="Barra decorativa" style={{ width: '100%', maxWidth: '2000px', minWidth: '100px', height: 'auto', objectFit: 'contain', objectPosition: 'left'/* , marginLeft: '15px'  * /> */}
      <img src={getImagePath('prueba2.png')} alt="Barra decorativa" style={{ width: '100%', maxWidth: '2000px', minWidth: '100px', height: 'auto', objectFit: 'contain', objectPosition: 'center'/* , marginLeft: '15px'  */ }} />
    </div>
  );

  return (
    <>
      {/* SI NO es la página de Toro, la barra decorativa aparece ARRIBA */}
      {!esPaginaToro && BarraDecorativa}

      {/* SI NO es la página de Toro, se muestra el menú superior normal */}
      {!esPaginaToro && <Menu />}

      {/* Contenedor principal de las vistas (páginas normales) */}
      <div className={esPaginaToro ? "layout-toro-container" : ""}>
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path="/conversor" element={<Conversor />} />
          <Route path="/inverso" element={<Inverso />} />
          <Route path="/tablero" element={<Tablero />} />
          {/* La ruta /toro ahora usa el Toro pre-montado de abajo (display: none/block) */}
          <Route path="/toro" element={null} />
          <Route path="/calculadora" element={<Calculadora />} />
        </Routes>
      </div>

      {/*
        Toro se monta únicamente cuando la ruta activa es /toro.
        Al desmontarse en otras páginas, se liberan los observadores de cambio de tamaño (ResizeObserver) 
        y el hilo de renderizado 3D/WebGL de Plotly, evitando congelamientos en la aplicación.
      */}
      {esPaginaToro && (
        <div className="layout-toro-container">
          <Toro />
        </div>
      )}

      {/* SI SÍ es la página de Toro, la barra decorativa aparece ABAJO */}
      {esPaginaToro && BarraDecorativa}
      <footer className="text-center mt-5 p-4" style={{ borderTop: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0', color: theme === 'dark' ? '#94a3b8' : '#475569', fontSize: '0.9rem', transition: 'all 0.3s ease' }}>
        <p className="mb-0">Creditos. © 2026 FLOR DE MARIA CRUZ REYES - RAMIRO CARRILLO CATALÁN. Todos los derechos reservados.</p>
        <p>⤟ TLACUATZIN CODEX LAB ⤠</p>
      </footer>
    </>
  )
}

function App() {
  /* const [count, setCount] = useState(0) */


  return (
    <>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </>
  )
}


export default App
