import React, { useEffect, useState } from 'react';
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

    // 365.png: Gira a la derecha (CW). 365 días.
    const angle365 = ritualDay ? (ritualDay - 1) * (360 / 365) : 0;

    // veintenas2026.png: Gira a la izquierda (CCW).
    const angleVeintenas = ritualDay ? -(ritualDay - 1) * (360 / 365) : 0;

    // Engrane 13: Gira a la derecha (CW).
    const numeroT = tonalliDiaMeza ? tonalliDiaMeza.numeroT.español : 1;
    const angle13 = tonalliDiaMeza ? (parseInt(numeroT) - 1) * (360 / 13) : 0;

    // Engrane 20: Gira a la izquierda (CCW).
    const signos = [
        "Lagarto", "Viento", "Casa", "Lagartija", "Serpiente",
        "Muerte", "Venado", "Conejo", "Agua", "Perro",
        "Mono", "Hierba", "Caña", "Jaguar", "Águila",
        "Zopilote", "Movimiento", "Pedernal", "Lluvia", "Flor"
    ];
    const signoName = tonalliDiaMeza ? tonalliDiaMeza.signoT.español : "Lagarto";
    const signoIndex = signos.indexOf(signoName);
    const angle20 = tonalliDiaMeza ? -(signoIndex * (360 / 20)) : 0;

    return (
        <div className="calendar-visual-container mt-4 p-5 rounded-5" style={{
            background: 'linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 100%)',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5), 0 20px 50px rgba(0,0,0,0.7)',
            border: '2px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.5s ease',
            position: 'relative'
        }}>
            <div className="decorations" style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderLeft: '2px solid gold', borderTop: '2px solid gold', opacity: 0.3 }}></div>
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderRight: '2px solid gold', borderBottom: '2px solid gold', opacity: 0.3 }}></div>
            </div>

            <div className="calendar-rings-wrapper" style={{
                position: 'relative',
                width: '450px',
                height: '450px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>

                {/* Luz de fondo en el centro */}
                <div style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
                    zIndex: 0
                }}></div>

                {/* Anillo 365 - Gira Derecha */}
                <div className={`ring ring-365 ${isSpinning ? 'spinning-right' : ''}`} style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    transform: isSpinning ? '' : `rotate(${angle365}deg)`,
                    transition: 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)',
                    zIndex: 1,
                    filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))'
                }}>
                    <img src={getImagePath('365.png')} alt="Ciclo 365" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>

                {/* Anillo Veintenas - Gira Izquierda */}
                <div className={`ring ring-veintenas ${isSpinning ? 'spinning-left' : ''}`} style={{
                    position: 'absolute',
                    width: '78%',
                    height: '78%',
                    transform: isSpinning ? '' : `rotate(${angleVeintenas}deg)`,
                    transition: 'transform 3.5s cubic-bezier(0.23, 1, 0.32, 1)',
                    zIndex: 2,
                    filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.6))'
                }}>
                    <img src={getImagePath('veintenas2026.png')} alt="Veintenas" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>

                {/* Engranes Centrales */}
                <div className="gears-container" style={{
                    position: 'absolute',
                    width: '45%',
                    height: '45%',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    perspective: '1000px'
                }}>
                    {/* Engrane 13 - Gira Derecha */}
                    <div className="gear-wrapper" style={{ position: 'relative', width: '130px', height: '130px', marginRight: '-12px' }}>
                        <div className={`gear gear-13-visual ${isSpinning ? 'spinning-right' : ''}`} style={{
                            width: '100%',
                            height: '100%',
                            transform: isSpinning ? '' : `rotate(${angle13}deg)`,
                            transition: 'transform 2.5s cubic-bezier(0.19, 1, 0.22, 1)',
                            position: 'relative'
                        }}>
                            <img src={getImagePath('engrane13-20.png')} alt="Gear 13" style={{
                                width: '200%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'left',
                                borderRadius: '50%'
                            }} />
                        </div>
                        {/* Centro del engrane 13 */}
                        {!isSpinning && tonalliDiaMeza && (
                            <div className="gear-center" style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '50px',
                                height: '50px',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                borderRadius: '50%',
                                border: '1px solid gold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 4,
                                boxShadow: '0 0 15px gold'
                            }}>
                                <img src={tonalliDiaMeza.numberTonalImage} alt="Num" style={{ width: '80%' }} />
                            </div>
                        )}
                    </div>

                    {/* Engrane 20 - Gira Izquierda */}
                    <div className="gear-wrapper" style={{ position: 'relative', width: '170px', height: '170px', marginLeft: '-12px' }}>
                        <div className={`gear gear-20-visual ${isSpinning ? 'spinning-left' : ''}`} style={{
                            width: '100%',
                            height: '100%',
                            transform: isSpinning ? '' : `rotate(${angle20}deg)`,
                            transition: 'transform 2.8s cubic-bezier(0.19, 1, 0.22, 1)',
                            position: 'relative'
                        }}>
                            <img src={getImagePath('engrane13-20.png')} alt="Gear 20" style={{
                                width: '200%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'right',
                                borderRadius: '50%'
                            }} />
                        </div>
                        {/* Centro del engrane 20 */}
                        {!isSpinning && tonalliDiaMeza && (
                            <div className="gear-center" style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '60px',
                                height: '60px',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                borderRadius: '50%',
                                border: '1px solid gold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 4,
                                boxShadow: '0 0 15px gold'
                            }}>
                                <img src={tonalliDiaMeza.signTonalImage} alt="Sign" style={{ width: '80%' }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Marcador de intersección (opcional para visualización) */}
                {!isSpinning && (
                    <div className="intersection-glow" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '20px',
                        height: '20px',
                        background: 'radial-gradient(circle, white 0%, transparent 60%)',
                        boxShadow: '0 0 20px white',
                        borderRadius: '50%',
                        zIndex: 10,
                        transform: 'translate(-50%, -50%)',
                        opacity: 0.6
                    }}></div>
                )}
            </div>

            {/* Info inferior con estilo premium */}
            <div className="mt-4 text-center">
                {!isSpinning && veintenaMeza ? (
                    <div className="info-badge p-3 rounded-pill" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        animation: 'fadeIn 1s ease'
                    }}>
                        <span style={{ color: 'gold', fontWeight: 'bold', fontSize: '1.2rem' }}>{veintenaMeza}</span>
                        <span style={{ color: '#fff', marginLeft: '15px', opacity: 0.8 }}>Día {ritualDay} / 365</span>
                    </div>
                ) : (
                    <div className="spinning-status" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', fontSize: '0.9rem' }}>
                        CALENDARIO EN GIRO CONSTANTE
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            ` }} />
        </div>
    );
};

export default CalendarioGiratorio;
