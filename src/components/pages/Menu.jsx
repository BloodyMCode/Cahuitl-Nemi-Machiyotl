import React, { useState } from 'react'
import { Button, Navbar, Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useTheme } from '../../context/ThemeContext'

const Menu = () => {
  const location = useLocation()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }
  //Funcion para determinar si un link esta activo
  const isActive = (path) => {
    return location.pathname === path
  }
  return (
    <>
      <Navbar className='navbar-purple custom-navbar' data-bs-theme={theme} expand='lg' expanded={isNavOpen} onToggle={toggleNav}>
        <div className="container-fluid">
          <Navbar.Toggle aria-controls='basic-navbar-nav' className="ms-auto" />
          <Navbar.Collapse id='basic-navbar-nav' className="custom-navbar-collapse">
            <div className="d-none d-lg-block navbar-left-spacer"></div>
            <Nav className='mx-auto text-center'>
              <ul className="navbar-nav justify-content-center mb-2 mb-lg-0 text-center">
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} aria-current="page" to="/">Inicio{isActive('/') && <span className="visually-hidden">(actual)</span>}</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/conversor') ? 'active' : ''}`} to="/conversor">Conversor{isActive('/conversor') && <span className="visually-hidden">(actual)</span>}</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/inverso') ? 'active' : ''}`} to="/inverso">Inverso{isActive('/inverso') && <span className="visually-hidden">(actual)</span>}</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/tablero') ? 'active' : ''}`} to="/tablero">Tablero{isActive('/tablero') && <span className="visually-hidden">(actual)</span>}</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/toro') ? 'active' : ''}`} to="/toro">Toro{isActive('/toro') && <span className="visually-hidden">(actual)</span>}</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/calculadora') ? 'active' : ''}`} to="/calculadora">Calculadora{isActive('/calculadora') && <span className="visually-hidden">(actual)</span>}</Link>
                </li>
              </ul>
            </Nav>
            <Nav className='navbar-right-button justify-content-center justify-content-lg-end align-items-center my-2 my-lg-0'>
              <Button
                variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
                onClick={toggleTheme}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                {theme === 'dark' ? (
                  <>
                    <i className="bi bi-sun-fill" style={{ color: '#F59E0B' }}></i> Claro
                  </>
                ) : (
                  <>
                    <i className="bi bi-moon-stars-fill" style={{ color: '#4F46E5' }}></i> Oscuro
                  </>
                )}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  )
}

export default Menu
