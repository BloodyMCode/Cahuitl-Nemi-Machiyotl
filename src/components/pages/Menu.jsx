import React, { useState } from 'react'
import { Button, Navbar, Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

const Menu = () => {
  const location = useLocation()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }
  //Funcion para determinar si un link esta activo
  const isActive = (path) => {
    return location.pathname === path
  }
  return (
    <>
      <Navbar className='navbar-purple custom-navbar' data-bs-theme='dark' expand='lg' expanded={isNavOpen} onToggle={toggleNav}>
        <div className="container-fluid">
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <Link class={`nav-link ${isActive('/') ? 'active' : ''}`} aria-current="page" to="/">Inicio{isActive('/') && <span class="visually-hidden">(actual)</span>}</Link>
                </li>
                <li class="nav-item">
                  <Link class={`nav-link ${isActive('/conversor') ? 'active' : ''}`} to="/conversor">Conversor{isActive('/conversor') && <span class="visually-hidden">(actual)</span>}</Link>
                </li>
                <li class="nav-item">
                  <Link class={`nav-link ${isActive('/inverso') ? 'active' : ''}`} to="/inverso">Inverso{isActive('/inverso') && <span class="visually-hidden">(actual)</span>}</Link>
                </li>
                <li class="nav-item">
                  <Link class={`nav-link ${isActive('/tablero') ? 'active' : ''}`} to="/tablero">Tablero{isActive('/tablero') && <span class="visually-hidden">(actual)</span>}</Link>
                </li>
                <li class="nav-item">
                  <Link class={`nav-link ${isActive('/toro') ? 'active' : ''}`} to="/toro">Toro{isActive('/toro') && <span class="visually-hidden">(actual)</span>}</Link>
                </li>
                <li class="nav-item">
                  <Link class={`nav-link ${isActive('/calculadora') ? 'active' : ''}`} to="/calculadora">Calculadora{isActive('/calculadora') && <span class="visually-hidden">(actual)</span>}</Link>
                </li>
              </ul>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  )
}

export default Menu