import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const MenuLat = () => {
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)
    const isActive = (path) => location.pathname === path
    const menuItems = [
        { path: '/', label: 'Inicio' },
        { path: '/conversor', label: 'Conversor' },
        { path: '/inverso', label: 'Inverso' },
        { path: '/tablero', label: 'Tablero' },
        { path: '/toro', label: 'Toro' },
        { path: '/calculadora', label: 'Calculadora' }
    ]

    return (
        <>
            {/* Boton hamburguesa flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    zIndex: 1100, // Por encima del menú desplegado
                    backgroundColor: '#011b4aff',
                    color: '#F8FAFC',
                    border: '1px solid #011a4ac8',
                    borderRadius: '8px',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    transition: 'background-color 0.2s'
                }}
                title={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
                <span style={{ width: '22px', height: '2px', backgroundColor: '#F8FAFC', transition: '0.3s', transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
                <span style={{ width: '22px', height: '2px', backgroundColor: '#F8FAFC', transition: '0.3s', opacity: isOpen ? 0 : 1 }}></span>
                <span style={{ width: '22px', height: '2px', backgroundColor: '#F8FAFC', transition: '0.3s', transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
            </button>
            {/* Capa de fondo oscura (Overlay) opcional para cerrar al hacer clic fuera */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 999,
                        transition: 'opacity 0.3s'
                    }}
                />
            )}
            {/* Barra Lateral Navegación (Tema Dark) */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '280px',
                    height: '100%',
                    backgroundColor: '#011b4aff', // Slate 900 muy oscuro
                    borderRight: '1px solid #1E293B',
                    padding: '76px 16px 20px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    overflowY: 'auto',
                    boxShadow: isOpen ? '8px 0 24px rgba(0, 0, 0, 0.5)' : 'none',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(-280px)',
                    zIndex: 1000
                }}
            >
                <div style={{ marginBottom: '24px', paddingLeft: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#38BDF8', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Menú Principal</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)} // Cierra el menú al navegar
                            style={{
                                display: 'block',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: isActive(item.path) ? '700' : '500',
                                color: isActive(item.path) ? '#38BDF8' : '#e3e7ecff',
                                backgroundColor: isActive(item.path) ? '#29394fff' : 'transparent',
                                borderLeft: isActive(item.path) ? '4px solid #38BDF8' : '4px solid transparent',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.color = '#f7f7f7ff';
                                    e.currentTarget.style.backgroundColor = '#29394fff';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.color = '#e3e7ecff';
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    )
}

export default MenuLat