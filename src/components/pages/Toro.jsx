import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { pointsData, categoriasInfo, groupedData, framesData, getPointByDay } from '../data/toroData';
import { getImagePath } from '../funtions/funtions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Toro.css';


const Toro = () => {
    const [representation, setRepresentation] = useState('numeros');
    const [followMode, setFollowMode] = useState('cursor');
    const [selectedDay, setSelectedDay] = useState(null);
    const [speed, setSpeed] = useState(300);
    const plotRef = useRef(null);

    const getTextsForTraces = useCallback(() => {
        return categoriasInfo.map(cat => {
            const pts = groupedData[cat.key] || [];
            return pts.map(p => representation === 'numeros' ? p.labelNum : p.labelImg);
        });
    }, [representation]);

    const traces = useMemo(() => {
        const texts = getTextsForTraces();
        return categoriasInfo.map((cat, idx) => {
            const pts = groupedData[cat.key] || [];
            return {
                type: 'scatter3d',
                mode: 'markers+text',
                x: pts.map(p => p.X),
                y: pts.map(p => p.Y),
                z: pts.map(p => p.Z),
                text: texts[idx],
                textposition: 'top center',
                textfont: {
                    color: '#0F172A',
                    size: representation === 'numeros' ? 11 : 12,
                    family: 'Arial, sans-serif',
                },
                marker: {
                    size: cat.size,
                    color: cat.color,
                    symbol: cat.symbol,
                    line: {
                        color: cat.key === 'base' ? 'black' : 'white',
                        width: cat.key === 'base' ? 0.5 : 1,
                    },
                },
                hovertext: pts.map(p =>
                    `Día n: <b>${p.n}</b><br>Coordenadas: <b>(${p.q}, ${p.r})</b><br>Tipo: <b>${p.className}</b>`
                ),
                hoverinfo: 'text',
                customdata: pts.map(p => p.n),
                name: cat.name,
                showlegend: true,
            };
        });
    }, [representation, getTextsForTraces]);

    const trailTrace = {
        type: 'scatter3d',
        mode: 'lines',
        x: [pointsData[0]?.X || 0],
        y: [pointsData[0]?.Y || 0],
        z: [pointsData[0]?.Z || 0],
        line: { color: 'yellow', width: 4 },
        opacity: 0.8,
        name: 'Trayectoria',
        hoverinfo: 'skip',
    };

    const tracerTrace = {
        type: 'scatter3d',
        mode: 'markers+text',
        x: [pointsData[0]?.X || 0],
        y: [pointsData[0]?.Y || 0],
        z: [pointsData[0]?.Z || 0],
        text: ['(1,1)'],
        textposition: 'top center',
        textfont: {
            color: 'red',
            size: 12,
            family: 'Arial Black',
        },
        marker: {
            size: 10,
            color: 'red',
            symbol: 'circle',
            line: { color: 'black', width: 1 },
        },
        name: 'Generador Activo',
        hoverinfo: 'skip',
    };


    const frames = useMemo(() => {
        return framesData.map((f, idx) => {
            const trail = f.trail;
            const current = f.current;
            const label = representation === 'numeros' ? current.labelNum : current.labelImg;
            return {
                data: [
                    {
                        type: 'scatter3d',
                        mode: 'lines',
                        x: trail.map(p => p.X),
                        y: trail.map(p => p.Y),
                        z: trail.map(p => p.Z),
                    },
                    {
                        type: 'scatter3d',
                        mode: 'markers+text',
                        x: [current.X],
                        y: [current.Y],
                        z: [current.Z],
                        text: [label],
                    },
                ],
                traces: [traces.length, traces.length + 1],
                name: String(current.n),
            };
        });
    }, [representation, traces.length]);

    const layout = {
        scene: {
            xaxis: { visible: false },
            yaxis: { visible: false },
            zaxis: { visible: false },
            bgcolor: 'white',
            aspectmode: 'data',
        },
        paper_bgcolor: 'white',
        plot_bgcolor: 'white',
        margin: { l: 10, r: 220, b: 10, t: 90 },
        title: {
            text: 'Tonalpohualli - Modelo Toro Interactivo 3D: Z₁₃ ⊕ Z₂₀',
            font: { size: 18, color: '#0F172A', family: 'Arial' },
            x: 0.5,
            y: 0.95,
        },
        legend: {
            orientation: 'v',
            yanchor: 'middle',
            y: 0.5,
            xanchor: 'left',
            x: 1.02,
            font: { color: '#0F172A' },
        },
        updatemenus: [
            {
                type: 'buttons',
                buttons: [
                    {
                        label: '► Play',
                        method: 'animate',
                        args: [
                            null,
                            {
                                frame: { duration: speed, redraw: true },
                                fromcurrent: true,
                                transition: { duration: 0 },
                            },
                        ],
                    },
                    {
                        label: '⏸ Pause',
                        method: 'animate',
                        args: [
                            [null],
                            {
                                frame: { duration: 0, redraw: false },
                                mode: 'immediate',
                                transition: { duration: 0 },
                            },
                        ],
                    },
                ],
                direction: 'left',
                pad: { r: 10, t: 10 },
                showactive: false,
                x: 0.15,
                y: 1.12,
                xanchor: 'right',
                yanchor: 'top',
            },
            {
                type: 'buttons',
                buttons: [
                    {
                        label: 'Ocultar Coordenadas',
                        method: 'restyle',
                        args: [{ mode: 'markers' }, Array.from({ length: categoriasInfo.length }, (_, i) => i)],
                    },
                    {
                        label: 'Mostrar Solo Destacados',
                        method: 'restyle',
                        args: [
                            { mode: ['markers', 'markers', 'markers+text', 'markers+text', 'markers+text', 'markers+text'] },
                            Array.from({ length: categoriasInfo.length }, (_, i) => i),
                        ],
                    },
                    {
                        label: 'Mostrar Todas las Coordenadas',
                        method: 'restyle',
                        args: [{ mode: 'markers+text' }, Array.from({ length: categoriasInfo.length }, (_, i) => i)],
                    },
                ],
                direction: 'down',
                pad: { r: 10, t: 10 },
                showactive: true,
                x: 0.95,
                y: 1.12,
                xanchor: 'right',
                yanchor: 'top',
            },
        ],
        sliders: [
            {
                active: 0,
                yanchor: 'top',
                xanchor: 'left',
                currentvalue: {
                    font: { size: 14, color: '#0F172A' },
                    prefix: 'Día Actual (n): ',
                    visible: true,
                    xanchor: 'right',
                },
                transition: { duration: 0 },
                pad: { b: 10, t: 50 },
                len: 0.9,
                x: 0.05,
                y: 0,
                steps: pointsData.map((p, idx) => ({
                    args: [
                        [String(idx + 1)],
                        {
                            frame: { duration: 0, redraw: true },
                            mode: 'immediate',
                            transition: { duration: 0 },
                        },
                    ],
                    label: String(p.n),
                    method: 'animate',
                })),
            },
        ],
    };

    const allTraces = useMemo(() => [...traces, trailTrace, tracerTrace], [traces]);

    useEffect(() => {
        const plotDiv = plotRef.current?.el;
        if (!plotDiv) return;

        const handleHover = (event) => {
            if (followMode === 'cursor' && event.points.length > 0) {
                const day = event.points[0].customdata;
                if (day) setSelectedDay(day);
            }
        };

        const handleClick = (event) => {
            if (followMode === 'cursor' && event.points.length > 0) {
                const day = event.points[0].customdata;
                if (day) setSelectedDay(day);
            }
        };

        const handleSliderChange = (event) => {
            if (followMode === 'trayectoria' && event.slider && event.slider.active !== undefined) {
                const day = event.slider.active + 1;
                setSelectedDay(day);
            }
        };

        const handleAnimated = () => {
            if (followMode === 'trayectoria') {
                const layout = plotDiv.layout;
                if (layout?.sliders?.[0]) {
                    const active = layout.sliders[0].active;
                    if (active !== undefined) {
                        setSelectedDay(active + 1);
                    }
                }
            }
        };

        plotDiv.on('plotly_hover', handleHover);
        plotDiv.on('plotly_click', handleClick);
        plotDiv.on('plotly_sliderchange', handleSliderChange);
        plotDiv.on('plotly_animated', handleAnimated);

        return () => {
            plotDiv.removeListener('plotly_hover', handleHover);
            plotDiv.removeListener('plotly_click', handleClick);
            plotDiv.removeListener('plotly_sliderchange', handleSliderChange);
            plotDiv.removeListener('plotly_animated', handleAnimated);
        };
    }, [followMode]);

    useEffect(() => {
        if (plotRef.current) {
            const texts = getTextsForTraces();
            const fontSize = representation === 'numeros' ? 11 : 12;
            const traceIndices = Array.from({ length: categoriasInfo.length }, (_, i) => i);
            Plot.restyle(plotRef.current.el, {
                text: texts,
                'textfont.size': fontSize,
            }, traceIndices);
        }
    }, [representation, getTextsForTraces]);

    const renderSidebar = () => {
        const data = getPointByDay(selectedDay);
        if (!selectedDay || !data) {
            return (
                <div className="text-center text-muted py-5">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <br />
                    Pasa el cursor o haz clic sobre cualquier punto en el toro 3D para explorar su coordenada, día y glifo tradicional.
                </div>
            );
        }

        const classMap = {
            tlahuiztlanpa: 'bg-warning bg-opacity-25 text-warning border border-warning',
            huitztlanpa: 'bg-primary bg-opacity-25 text-primary border border-primary',
            cihuatlanpa: 'bg-danger bg-opacity-25 text-danger border border-danger',
            mictlanpa: 'bg-secondary bg-opacity-25 text-secondary border border-secondary',
            familia_q_1: 'bg-info bg-opacity-25 text-info border border-info',
            base: 'bg-light text-secondary border border-secondary',
        };
        const badgeClass = classMap[data.classKey] || 'bg-light';

        return (
            <>
                <div className="display-6 fw-bold mb-1">Día {data.n}</div>
                <div className={`badge ${badgeClass} px-3 py-2 mb-3 fs-6 fw-semibold`}>
                    {data.className}
                </div>

                {representation === 'numeros' ? (
                    <div className="d-flex justify-content-center gap-4">
                        <div className="border rounded-3 p-3 text-center bg-light bg-opacity-50" style={{ width: '110px' }}>
                            <div className="display-4 fw-bold text-danger">{data.q}</div>
                            <div className="text-muted small text-uppercase">módulo 13</div>
                        </div>
                        <div className="border rounded-3 p-3 text-center bg-light bg-opacity-50" style={{ width: '110px' }}>
                            <div className="display-4 fw-bold text-success">{data.r}</div>
                            <div className="text-muted small text-uppercase">módulo 20</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="d-flex justify-content-center gap-4 mb-3">
                            <div>
                                <div className="border rounded-3 p-2 bg-white" style={{ width: '110px', height: '110px' }}>
                                    <img
                                        src={getImagePath(`numerales/${data.numeral}.png`)}
                                        alt={`Numeral ${data.numeral}`}
                                        className="img-fluid"
                                        onError={(e) => { e.target.src = ''; e.target.alt = 'N/A'; }}
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                                <div className="mt-2 small fw-semibold">Numeral {data.numeral}</div>
                            </div>
                            <div>
                                <div className="border rounded-3 p-2 bg-white" style={{ width: '110px', height: '110px' }}>
                                    <img
                                        src={getImagePath(`simbolos/${data.symFile}`)}
                                        alt={`Símbolo ${data.symName}`}
                                        className="img-fluid"
                                        onError={(e) => { e.target.src = ''; e.target.alt = 'N/A'; }}
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                                <div className="mt-2 small fw-semibold">Signo: {data.symName}</div>
                            </div>
                        </div>
                        <div className="h5 fw-bold text-gradient-primary">
                            {data.numeral} - {data.symName}
                        </div>
                    </div>
                )}
            </>
        );
    };

    const style = `
    .text-gradient-primary {
      background: linear-gradient(135deg, #0F172A 0%, #2563EB 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .tracking-wider { letter-spacing: 0.05em; }
  `;

    return (
        <div className="container-fluid p-0 vh-100 d-flex flex-row">
            <style>{style}</style>

            <div className="col-9 position-relative" style={{ height: '100vh' }}>
                <Plot
                    ref={plotRef}
                    data={allTraces}
                    layout={layout}
                    frames={frames}
                    config={{ responsive: true }}
                    useResizeHandler
                    style={{ width: '100%', height: '100%' }}
                    className="w-100 h-100"
                />
            </div>

            <div className="col-3 bg-white bg-opacity-75 backdrop-blur-sm border-start shadow-sm p-4 d-flex flex-column overflow-auto" style={{ height: '100vh' }}>
                <h1 className="h4 fw-extrabold text-center mb-0" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Tonalpohualli
                </h1>
                <h1 className="h5 fw-extrabold text-center mt-0">Toro Interactivo 3D</h1>
                <div className="text-center text-muted small text-uppercase tracking-wider mb-3">Modelo Z₁₃ ⊕ Z₂₀</div>

                <div className="mb-2">
                    <div className="text-muted small fw-semibold mb-1">Representación</div>
                    <div className="btn-group w-100" role="group">
                        <button
                            className={`btn btn-outline-secondary ${representation === 'numeros' ? 'active bg-white border-primary text-dark' : ''}`}
                            onClick={() => setRepresentation('numeros')}
                        >
                            Números (q, r)
                        </button>
                        <button
                            className={`btn btn-outline-secondary ${representation === 'imagenes' ? 'active bg-white border-primary text-dark' : ''}`}
                            onClick={() => setRepresentation('imagenes')}
                        >
                            (Numeral, Glifo)
                        </button>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="text-muted small fw-semibold mb-1">Modo de Seguimiento</div>
                    <div className="btn-group w-100" role="group">
                        <button
                            className={`btn btn-outline-secondary ${followMode === 'cursor' ? 'active bg-white border-primary text-dark' : ''}`}
                            onClick={() => setFollowMode('cursor')}
                        >
                            Al Señalar
                        </button>
                        <button
                            className={`btn btn-outline-secondary ${followMode === 'trayectoria' ? 'active bg-white border-primary text-dark' : ''}`}
                            onClick={() => setFollowMode('trayectoria')}
                        >
                            Al Animar
                        </button>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="text-muted small fw-semibold mb-1">Velocidad de Animación</div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="small">Rápido</span>
                        <input
                            type="range"
                            className="form-range flex-grow-1"
                            min="100"
                            max="1500"
                            step="50"
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                        />
                        <span className="small">Lento</span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mt-1">
                        <span>100ms</span>
                        <span>{speed} ms</span>
                        <span>1500ms</span>
                    </div>
                </div>

                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center border rounded-3 p-4 bg-light bg-opacity-25 position-relative overflow-hidden">
                    <div className="position-absolute top-0 end-0 w-25 h-25 bg-primary bg-opacity-10 rounded-circle translate-middle" />
                    <div className="text-center w-100">
                        {renderSidebar()}
                    </div>
                </div>

                <div className="mt-3 text-center text-muted small">
                    Gira el Toro con el mouse para explorarlo en 3D.<br />
                    Usa el botón "Play" abajo a la izquierda para animar la trayectoria.
                </div>
            </div>
        </div>
    );
};
export default Toro;