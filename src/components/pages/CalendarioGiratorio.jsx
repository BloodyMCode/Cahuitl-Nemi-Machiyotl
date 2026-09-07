import React, { useEffect, useState, useRef } from 'react';
import { getImagePath } from '../funtions/funtions';
import { useTheme } from '../../context/ThemeContext';

// 18 veintenas (20 días) + 1 Nemontemi (5 días) = 365 días en total
const SEGDATOS_VEINTENAS = [
    { id: 'Atlacahualo', dias: 20 },
    { id: 'Tlacaxipehualiztli', dias: 20 },
    { id: 'Tozoztontli', dias: 20 },
    { id: 'Ueitozoztli', dias: 20 },
    { id: 'Toxcatl', dias: 20 },
    { id: 'Etzalcualiztli', dias: 20 },
    { id: 'Tecuilhuitontli', dias: 20 },
    { id: 'Ueitecuilhuitl', dias: 20 },
    { id: 'Tlaxochimaco', dias: 20 },
    { id: 'Xocotl Uetzi', dias: 20 },
    { id: 'Ochpaniztli', dias: 20 },
    { id: 'Teotlehco', dias: 20 },
    { id: 'Tepeilhuitl', dias: 20 },
    { id: 'Quecholli', dias: 20 },
    { id: 'Panquetzaliztli', dias: 20 },
    { id: 'Atemoztli', dias: 20 },
    { id: 'Tititl', dias: 20 },
    { id: 'Izcalli', dias: 20 },
    { id: 'Nemontemi', dias: 5 },
];
// 18 veintenas (20 días) + 1 Nemontemi (5 días) = 365 días en total
const SEGDATOS_VEINTENASCaso = [
    { id: 'Izcalli', dias: 20 },
    { id: 'Atlacahualo', dias: 20 },
    { id: 'Tlacaxipehualiztli', dias: 20 },
    { id: 'Tozoztontli', dias: 20 },
    { id: 'Ueitozoztli', dias: 20 },
    { id: 'Toxcatl', dias: 20 },
    { id: 'Etzalcualiztli', dias: 20 },
    { id: 'Tecuilhuitontli', dias: 20 },
    { id: 'Ueitecuilhuitl', dias: 20 },
    { id: 'Tlaxochimaco', dias: 20 },
    { id: 'Xocotl Uetzi', dias: 20 },
    { id: 'Ochpaniztli', dias: 20 },
    { id: 'Teotlehco', dias: 20 },
    { id: 'Tepeilhuitl', dias: 20 },
    { id: 'Quecholli', dias: 20 },
    { id: 'Panquetzaliztli', dias: 20 },
    { id: 'Atemoztli', dias: 20 },
    { id: 'Tititl', dias: 20 },
    { id: 'Nemontemi', dias: 5 },
];
// Función matemática para describir los arcos de las máscaras interactivas
const describirArcoInteractivo = (x, y, radioInt, radioExt, anguloInicio, anguloFin) => {
    const gradRad = (g) => (g - 90) * Math.PI / 180.0;

    const extInicio = { x: x + radioExt * Math.cos(gradRad(anguloInicio)), y: y + radioExt * Math.sin(gradRad(anguloInicio)) };
    const extFin = { x: x + radioExt * Math.cos(gradRad(anguloFin)), y: y + radioExt * Math.sin(gradRad(anguloFin)) };

    const intInicio = { x: x + radioInt * Math.cos(gradRad(anguloInicio)), y: y + radioInt * Math.sin(gradRad(anguloInicio)) };
    const intFin = { x: x + radioInt * Math.cos(gradRad(anguloFin)), y: y + radioInt * Math.sin(gradRad(anguloFin)) };

    const grande = (anguloFin - anguloInicio) <= 180 ? "0" : "1";

    return [
        "M", extInicio.x, extInicio.y,
        "A", radioExt, radioExt, 0, grande, 1, extFin.x, extFin.y,
        "L", intFin.x, intFin.y,
        "A", radioInt, radioInt, 0, grande, 0, intInicio.x, intInicio.y,
        "Z"
    ].join(" ");
};
const CalendarioGiratorio = ({ tonalliDiaMeza, veintenaMeza, ritualDay, tonalliDia, veintenaCaso, tipo = 'meza' }) => {
    const isCaso = tipo === 'caso';

    // Determinar valores activos según el tipo de cuenta
    const activeTonalli = isCaso ? tonalliDia : tonalliDiaMeza;
    const activeVeintena = isCaso ? (veintenaCaso ? veintenaCaso.veintena : null) : veintenaMeza;
    const activeRitualDay = isCaso ? (veintenaCaso ? veintenaCaso.dia : null) : ritualDay;

    const [isSpinning, setIsSpinning] = useState(true);

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        if (!isCaso) {
            if (tonalliDiaMeza && veintenaMeza && ritualDay) {
                setIsSpinning(false);
            } else {
                setIsSpinning(true);
            }
        } else {
            if (tonalliDia && veintenaCaso && veintenaCaso.veintena && veintenaCaso.dia) {
                setIsSpinning(false);
            } else {
                setIsSpinning(true);
            }
        }
    }, [isCaso, tonalliDiaMeza, veintenaMeza, ritualDay, tonalliDia, veintenaCaso]);

    // Lógica para Responsividad por Escala
    const [scale, setScale] = useState(1);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                const newScale = Math.min(width / 550, 1);
                setScale(newScale);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 365.png: Gira a la derecha (CW). 365 días. Detiene en el punto de partida (0°).
    const angle365 = 0;

    // veintenas.png: Gira a la izquierda (CCW). Detiene en el punto de partida (0°).
    const angleVeintenas = 0;

    // Engrane 13: Gira a la derecha (CW). 195px.
    const numberM = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];

    const numeroT = isCaso
        ? (tonalliDia ? tonalliDia.numero.español : "1")
        : (tonalliDiaMeza ? tonalliDiaMeza.numeroT.español : "1");

    const numeroIndex = numberM.indexOf(numeroT);
    const angle13 = activeTonalli ? 352.5 + (numeroIndex * (360 / 13)) : 0;

    // Engrane 20: Gira a la izquierda (CCW). 300px.
    const signos = [
        "Lagarto", "Viento", "Casa", "Lagartija", "Serpiente",
        "Muerte", "Venado", "Conejo", "Agua", "Perro",
        "Mono", "Hierba", "Caña", "Jaguar", "Águila",
        "Zopilote", "Movimiento", "Pedernal", "Lluvia", "Flor"
    ];

    const signoName = isCaso
        ? (tonalliDia ? tonalliDia.simbolo.español : "Lagarto")
        : (tonalliDiaMeza ? tonalliDiaMeza.signoT.español : "Lagarto");

    const signoIndex = signos.indexOf(signoName);
    const angle20 = activeTonalli ? 364.5 - (signoIndex * (360 / 20)) : 0;

    const signImageSrc = isCaso
        ? (tonalliDia ? tonalliDia.symbolImage : null)
        : (tonalliDiaMeza ? tonalliDiaMeza.signTonalImage : null);

    const numberImageSrc = isCaso
        ? (tonalliDia ? tonalliDia.numberImage : null)
        : (tonalliDiaMeza ? tonalliDiaMeza.numberTonalImage : null);

    // --- CÁLCULO DE MÁSCARAS ---
    const centroSVG = 500; // Coordenada central interna (Vectorial 1000x1000)

    // Calibración inicial de ángulos (Ajusta este desfase en grados si los sectores no coinciden con las imágenes)
    const desfasamientoVeintenas = 106.5;
    const desfasamientoDias = 107;

    return (
        <div ref={containerRef} className="calendar-visual-container mt-4 p-2 p-md-4 rounded-5" style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            boxShadow: isDark ? '#1E293B' : '#FFFFFF',
            border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.5s ease',
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            overflow: 'hidden',
            minHeight: `${560 * scale}px`
        }}>
            {/* Título de Cuenta */}
            <h5 className="fw-bold mb-3" style={{ color: 'gold', zIndex: 20, textAlign: 'center' }}>
                {isCaso ? 'Cuenta de Caso' : 'Cuenta de Meza'}
            </h5>

            {/* Contenedor Escalable */}
            <div style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                width: '500px',
                height: '500px',
                position: 'relative',
                transition: 'transform 0.3s ease'
            }}>
                {/* Engranes Centrales - DETRÁS */}
                <div className="gears-container" style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    perspective: '1000px'
                }}>
                    {/* Engrane 20 - Derecha / Centro */}
                    <div className="gear-wrapper" style={{
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        top: '42.8%',
                        left: '67.5%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <div className={`gear gear-20-visual ${isSpinning ? 'spinning-left' : ''}`} style={{
                            width: '100%',
                            height: '100%',
                            transform: isSpinning ? '' : `rotate(${angle20}deg)`,
                            transition: 'transform 2.8s cubic-bezier(0.19, 1, 0.22, 1)',
                            position: 'relative'
                        }}>
                            <img src={getImagePath('engrane20-002-02.png')} alt="Gear 20" style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                opacity: 0.85
                            }} />
                        </div>
                        {!isSpinning && activeTonalli && signImageSrc && (
                            <div className="gear-center" style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                width: '80px', height: '80px', backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                borderRadius: '50%', border: isDark ? '1px solid rgba(255,215,0,0.5)' : '1px solid rgba(255,215,0,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                            }}>
                                <img src={signImageSrc} alt="Sign" style={{ width: '85%' }} />
                            </div>
                        )}
                    </div>

                    {/* Engrane 13 - Izquierda / Abajo */}
                    <div className="gear-wrapper" style={{
                        position: 'absolute',
                        width: '195px',
                        height: '195px',
                        top: '68%',
                        left: '30%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <div className={`gear gear-13-visual ${isSpinning ? 'spinning-right' : ''}`} style={{
                            width: '100%',
                            height: '100%',
                            transform: isSpinning ? '' : `rotate(${angle13}deg)`,
                            transition: 'transform 2.5s cubic-bezier(0.19, 1, 0.22, 1)',
                            position: 'relative'
                        }}>
                            <img src={getImagePath('engrane13-002-02.png')} alt="Gear 13" style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                opacity: 0.85
                            }} />
                        </div>
                        {!isSpinning && activeTonalli && numberImageSrc && (
                            <div className="gear-center" style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                width: '65px', height: '65px', backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                borderRadius: '50%', border: isDark ? '1px solid rgba(255,215,0,0.5)' : '1px solid rgba(255,215,0,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                            }}>
                                <img src={numberImageSrc} alt="Num" style={{ width: '85%' }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Anillos - DELANTE */}
                <div className="calendar-rings-wrapper" style={{
                    position: 'relative',
                    width: '500px',
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5
                }}>
                    <div style={{
                        position: 'absolute', width: '380px', height: '380px',
                        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
                        zIndex: 1
                    }}></div>
                    {/* ANILLO 1: Ciclo 365 (Imagen Exterior) */}
                    <div className={`ring ring-365 ${isSpinning ? 'spinning-right' : ''}`} style={{
                        position: 'absolute', width: '100%', height: '100%',
                        transform: isSpinning ? '' : `rotate(${angle365}deg)`,
                        transition: 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)',
                        zIndex: 2
                    }}>
                        <img src={getImagePath('365-02.png')} alt="Ciclo 365" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        {/* Máscara Vectorial Encima */}
                        <svg className="position-absolute top-0 start-0 w-100 h-100" viewBox="0 0 1000 1000" style={{ pointerEvents: 'none' }}>
                            <g>
                                {Array.from({ length: 365 }).map((_, index) => {
                                    const diaNumero = index + 1;
                                    const amplitudDia = 360 / 365;
                                    const anguloInicio = desfasamientoDias + (index * amplitudDia);
                                    const anguloFin = anguloInicio + amplitudDia;

                                    const pathData = describirArcoInteractivo(centroSVG, centroSVG, 460, 500, anguloInicio, anguloFin);
                                    const esDiaActivo = !isSpinning && Number(activeRitualDay) === diaNumero;

                                    return (
                                        <path
                                            key={`dia-${diaNumero}`}
                                            d={pathData}
                                            fill={esDiaActivo ? '#ebcc05de' : 'transparent'}
                                            opacity={esDiaActivo ? '1' : '0'}
                                            style={{
                                                mixBlendMode: 'hard-light',
                                                transition: 'opacity 0.3s ease, fill 0.3s ease'
                                            }}
                                        />
                                    );
                                })}
                            </g>
                        </svg>
                    </div>
                    {/* ANILLO 2: Veintenas (Imagen Interior) */}
                    <div className={`ring ring-veintenas ${isSpinning ? 'spinning-left' : ''}`} style={{
                        position: 'absolute', width: '88%', height: '88%',
                        transform: isSpinning ? '' : `rotate(${angleVeintenas}deg)`,
                        transition: 'transform 3.5s cubic-bezier(0.23, 1, 0.32, 1)',
                        zIndex: 3
                    }}>
                        <img src={getImagePath(isCaso ? 'veintenas-03.png' : 'veintenas-02.png')} alt="Veintenas" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        {/* Máscara Vectorial Encima */}
                        <svg className="position-absolute top-0 start-0 w-100 h-100" viewBox="0 0 1000 1000" style={{ pointerEvents: 'none' }}>
                            <g>
                                {(() => {
                                    let anguloAcum = desfasamientoVeintenas;
                                    const datosVeintenas = isCaso ? SEGDATOS_VEINTENASCaso : SEGDATOS_VEINTENAS;
                                    return datosVeintenas.map((seg) => {
                                        const deltaAngulo = (seg.dias / 365) * 360;
                                        const anguloInicio = anguloAcum;
                                        const anguloFin = anguloAcum + deltaAngulo;
                                        anguloAcum = anguloFin;

                                        const pathData = describirArcoInteractivo(centroSVG, centroSVG, 455, 500, anguloInicio, anguloFin);

                                        const esVeintenaActiva = !isSpinning && activeVeintena === seg.id;

                                        return (
                                            <path
                                                key={`veintena-${seg.id}`}
                                                d={pathData}
                                                fill={esVeintenaActiva ? '#ebcc05de' : 'transparent'}
                                                opacity={esVeintenaActiva ? '1' : '0'}
                                                style={{
                                                    mixBlendMode: 'hard-light',
                                                    transition: 'opacity 0.3s ease, fill 0.3s ease'
                                                }}
                                            />
                                        );
                                    });
                                })()}
                            </g>
                        </svg>
                    </div>

                    {!isSpinning && (
                        <div className="intersection-glow" style={{
                            position: 'absolute', top: '68%', left: '30%', width: '60px', height: '60px',
                            background: 'radial-gradient(circle, rgba(160, 142, 43, 0.6) 0%, transparent 50%)',
                            boxShadow: '0 0 60px gold', borderRadius: '50%', zIndex: 15,
                            transform: 'translate(-50%, -50%)', opacity: 0.5
                        }}></div>
                    )}
                </div>
            </div>

            {/* Info inferior */}
            <div className="mt-2 text-center" style={{ transform: `scale(${Math.max(scale, 0.8)})`, zIndex: 20 }}>
                {!isSpinning && activeVeintena ? (
                    <div className="p-3 rounded-pill" style={{
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 215, 0, 0.3)', boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    }}>
                        <span style={{ color: isDark ? '#F8FAFC' : '#0F172A', marginLeft: '15px', opacity: 0.8 }}>Veintena: </span>
                        <span style={{ color: 'gold', fontWeight: 'bold', fontSize: '1.2rem' }}>{activeVeintena}</span>
                        <span style={{ color: isDark ? '#F8FAFC' : '#0F172A', marginLeft: '15px', opacity: 0.8 }}>Día {activeRitualDay} de 365</span>
                    </div>
                ) : (
                    <div className="spinning-status" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', fontSize: '0.9rem' }}>
                        {isCaso ? "RUEDA CALENDÁRICA BASADA EN LA CUENTA DE CASO" : "RUEDA CALENDÁRICA BASADA EN LA CUENTA DE MEZA"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarioGiratorio;
