import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const MenuLat = () => {
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'
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
                    backgroundColor: isDark ? '#011b4aff' : '#F1F5F9',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    border: isDark ? '1px solid #011a4ac8' : '1px solid #CBD5E1',
                    borderRadius: '8px',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                }}
                title={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
                <span style={{ width: '22px', height: '2px', backgroundColor: isDark ? '#F8FAFC' : '#0F172A', transition: '0.3s', transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
                <span style={{ width: '22px', height: '2px', backgroundColor: isDark ? '#F8FAFC' : '#0F172A', transition: '0.3s', opacity: isOpen ? 0 : 1 }}></span>
                <span style={{ width: '22px', height: '2px', backgroundColor: isDark ? '#F8FAFC' : '#0F172A', transition: '0.3s', transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
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
                        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(15, 23, 42, 0.2)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 999,
                        transition: 'opacity 0.3s'
                    }}
                />
            )}
            {/* Barra Lateral Navegación */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '280px',
                    height: '100%',
                    backgroundColor: isDark ? '#00205bc8' : '#FFFFFF',
                    borderRight: isDark ? '1px solid #1E293B' : '1px solid #E2E8F0',
                    padding: '76px 16px 20px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    overflowY: 'auto',
                    boxShadow: isOpen ? (isDark ? '8px 0 24px rgba(0, 0, 0, 0.5)' : '8px 0 24px rgba(0, 0, 0, 0.1)') : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isOpen ? 'translateX(0)' : 'translateX(-280px)',
                    zIndex: 1000
                }}
            >
                <div style={{ marginBottom: '24px', paddingLeft: '8px' }}>
                    <span style={{ fontSize: '10px', color: isDark ? '#38BDF8' : '#2563EB', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Menú Principal</span>
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
                                color: isActive(item.path) ? (isDark ? '#38BDF8' : '#2563EB') : (isDark ? '#e3e7ecff' : '#475569'),
                                backgroundColor: isActive(item.path) ? (isDark ? '#29394fff' : '#EFF6FF') : 'transparent',
                                borderLeft: isActive(item.path) ? (isDark ? '4px solid #38BDF8' : '4px solid #2563EB') : '4px solid transparent',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.color = isDark ? '#f7f7f7ff' : '#0F172A';
                                    e.currentTarget.style.backgroundColor = isDark ? '#29394fff' : '#F1F5F9';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.color = isDark ? '#e3e7ecff' : '#475569';
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Botón de cambio de tema al final de la barra lateral */}
                <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={toggleTheme}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
                            backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                            color: isDark ? '#F8FAFC' : '#0F172A',
                            fontWeight: '600',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontFamily: 'Arial, sans-serif'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? '#29394fff' : '#E2E8F0';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? '#1E293B' : '#F1F5F9';
                        }}
                    >
                        {isDark ? (
                            <>
                                <i className="bi bi-sun-fill" style={{ color: '#FBBF24' }}></i> Tema Claro
                            </>
                        ) : (
                            <>
                                <i className="bi bi-moon-stars-fill" style={{ color: '#4F46E5' }}></i> Tema Oscuro
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}

export default MenuLat