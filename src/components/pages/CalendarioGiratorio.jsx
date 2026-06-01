import React, { useEffect, useState, useRef } from 'react';
import { getImagePath } from '../funtions/funtions';

const CalendarioGiratorio = ({ tonalliDiaMeza, veintenaMeza, ritualDay }) => {
    const [isSpinning, setIsSpinning] = useState(true);

    useEffect(() => {
        if (tonalliDiaMeza && veintenaMeza && ritualDay) {
            setIsSpinning(false);
        } else {
            setIsSpinning(true);
        }
    }, [tonalliDiaMeza, veintenaMeza, ritualDay]);

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
    // 365.png: Gira a la derecha (CW). 365 días.
    //const angle365 = ritualDay ? (ritualDay - 1) * (360 / 365) : 0;

    // veintenas.png: Gira a la izquierda (CCW). Detiene en el punto de partida (0°).
    const angleVeintenas = 0;
    // veintenas.png: Gira a la derecha (CW).
    //const angleVeintenas = ritualDay ? (ritualDay - 1) * (360 / 365) : 0;

    // Engrane 13: Gira a la derecha (CW). 195px.
    const numberM = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]

    const numeroT = tonalliDiaMeza ? tonalliDiaMeza.numeroT.español : "1";
    const numeroIndex = numberM.indexOf(numeroT)
    // Calibración final corregida: Base 356.8° (Ajustado para nueva posición (69,45) y Tonalli 12-Lagartija)
    //const angle13 = tonalliDiaMeza ? 243.8 - (parseInt(numeroT) - 1) * (360 / 13) : 0;
    const angle13 = tonalliDiaMeza ? 352.5 + (numeroIndex * (360 / 13)) : 0;

    //const angle13 = tonalliDiaMeza ? 301.4 - (parseInt(numeroT) - 1) * (360 / 13) : 0;

    // Engrane 20: Gira a la izquierda (CCW). 300px.
    const signos = [
        "Lagarto", "Viento", "Casa", "Lagartija", "Serpiente",
        "Muerte", "Venado", "Conejo", "Agua", "Perro",
        "Mono", "Hierba", "Caña", "Jaguar", "Águila",
        "Zopilote", "Movimiento", "Pedernal", "Lluvia", "Flor"
    ];
    const signoName = tonalliDiaMeza ? tonalliDiaMeza.signoT.español : "Lagarto";
    const signoIndex = signos.indexOf(signoName);
    // Calibración final corregida: Base 358.1° (Ajustado tras confirmación visual de desfase de 13 dientes)
    const angle20 = tonalliDiaMeza ? 364.5 - (signoIndex * (360 / 20)) : 0;
    // Calibración final corregida: Base 304.1° (Ajustado para nueva posición (69,45) y Tonalli 12-Lagartija)
    //const angle20 = tonalliDiaMeza ? 304.1 - (signoIndex * (360 / 20)) : 0;

    return (
        <div ref={containerRef} className="calendar-visual-container mt-4 p-2 p-md-4 rounded-5" style={{
            background: 'linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 100%)',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5), 0 20px 50px rgba(0,0,0,0.7)',
            border: '2px solid rgba(255, 255, 255, 0.05)',
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
                        {!isSpinning && tonalliDiaMeza && (
                            <div className="gear-center" style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                width: '80px', height: '80px', backgroundColor: 'rgba(0,0,0,0.7)',
                                borderRadius: '50%', border: '1px solid rgba(255,215,0,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                            }}>
                                <img src={tonalliDiaMeza.signTonalImage} alt="Sign" style={{ width: '85%' }} />
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
                        {!isSpinning && tonalliDiaMeza && (
                            <div className="gear-center" style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                width: '65px', height: '65px', backgroundColor: 'rgba(0,0,0,0.7)',
                                borderRadius: '50%', border: '1px solid rgba(255,215,0,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                            }}>
                                <img src={tonalliDiaMeza.numberTonalImage} alt="Num" style={{ width: '85%' }} />
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

                    <div className={`ring ring-365 ${isSpinning ? 'spinning-right' : ''}`} style={{
                        position: 'absolute', width: '100%', height: '100%',
                        transform: isSpinning ? '' : `rotate(${angle365}deg)`,
                        transition: 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)',
                        zIndex: 2
                    }}>
                        <img src={getImagePath('365-02.png')} alt="Ciclo 365" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    {/* <div className={`ring ring-veintenas ${isSpinning ? 'spinning-right' : ''}`} style={{ */}
                    <div className={`ring ring-veintenas ${isSpinning ? 'spinning-left' : ''}`} style={{
                        position: 'absolute', width: '88%', height: '88%',
                        transform: isSpinning ? '' : `rotate(${angleVeintenas}deg)`,
                        transition: 'transform 3.5s cubic-bezier(0.23, 1, 0.32, 1)',
                        zIndex: 3
                    }}>
                        <img src={getImagePath('veintenas-02.png')} alt="Veintenas" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                {!isSpinning && veintenaMeza ? (
                    <div className="p-3 rounded-pill" style={{
                        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 215, 0, 0.3)', boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    }}>
                        <span style={{ color: '#fff', marginLeft: '15px', opacity: 0.8 }}>Veintena: </span>
                        <span style={{ color: 'gold', fontWeight: 'bold', fontSize: '1.2rem' }}>{veintenaMeza}</span>
                        <span style={{ color: '#fff', marginLeft: '15px', opacity: 0.8 }}>Día {ritualDay} de 365</span>
                    </div>
                ) : (
                    <div className="spinning-status" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', fontSize: '0.9rem' }}>
                        RUEDA CALENDÁRICA BASADA EN LA CUENTA DE MEZA
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarioGiratorio;
