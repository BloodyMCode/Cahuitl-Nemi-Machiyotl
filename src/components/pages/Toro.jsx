import React, { useState, useEffect, useRef } from 'react';
import { getImagePath } from '../funtions/funtions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Toro.css';

// Parámetros de geometría del Toro
const R_major = 5;
const r_minor = 1.5;

// Mapeo por defecto de símbolos de Calendarios
const nombresSimbolosDefecto = {
    0: { name: "flor", file: "flor.png" },
    1: { name: "lagarto", file: "lagarto.png" },
    2: { name: "viento", file: "viento.png" },
    3: { name: "casa", file: "casa.png" },
    4: { name: "lagartija", file: "lagartija.png" },
    5: { name: "serpiente", file: "serpiente.png" },
    6: { name: "muerte", file: "muerte.png" },
    7: { name: "venado", file: "venado.png" },
    8: { name: "conejo", file: "conejo.png" },
    9: { name: "agua", file: "agua.png" },
    10: { name: "perro", file: "perro.png" },
    11: { name: "mono", file: "mono.png" },
    12: { name: "hierba", file: "hierba.png" },
    13: { name: "caña", file: "caña.png" }, // carrizo
    14: { name: "jaguar", file: "jaguar.png" },
    15: { name: "aguila", file: "aguila.png" },
    16: { name: "zopilote", file: "zopilote.png" },
    17: { name: "movimiento", file: "movimiento.png" },
    18: { name: "pedernal", file: "pedernal.png" },
    19: { name: "lluvia", file: "lluvia.png" }
};

// Función para mapear coordenadas (q, r) en la superficie 3D del Toro
function mapear(q, r) {
    const v_ang = 2 * Math.PI * (q / 13.0);
    const u_ang = 2 * Math.PI * (r / 20.0);
    const X = (R_major + r_minor * Math.cos(u_ang)) * Math.cos(v_ang);
    const Y = (R_major + r_minor * Math.cos(u_ang)) * Math.sin(v_ang);
    const Z = r_minor * Math.sin(u_ang);
    return [X, Y, Z];
}

const Toro = () => {
    const [plotlyLoaded, setPlotlyLoaded] = useState(false);
    const [representation, setRepresentation] = useState('numeros'); // 'numeros' | 'imagenes'
    const [followMode, setFollowMode] = useState('cursor'); // 'cursor' | 'trayectoria'
    const [speed, setSpeed] = useState(300); // ms
    const [hoveredDay, setHoveredDay] = useState(null);

    const plotDivRef = useRef(null);
    const followModeRef = useRef(followMode);
    const pointsDataRef = useRef({});

    // Sincronizar el followMode en la referencia para evitar recrear manejadores de eventos
    useEffect(() => {
        followModeRef.current = followMode;
    }, [followMode]);

    // Carga asíncrona de Plotly desde el CDN
    useEffect(() => {
        if (window.Plotly) {
            setPlotlyLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = "https://cdn.plot.ly/plotly-2.35.2.min.js";
        script.async = true;
        script.onload = () => {
            setPlotlyLoaded(true);
        };
        document.body.appendChild(script);

        return () => {
            // No eliminamos el script para evitar recargas si el usuario navega entre componentes,
            // pero mantenemos limpia la referencia.
        };
    }, []);

    // Preparación y estructuración de los datos del Toro 3D
    const categories = {
        base: { x: [], y: [], z: [], n: [], text_num: [], text_img: [], hover: [], color: '#4B5563', symbol: 'circle', size: 5, name: 'Día Regular (q, r)' },
        familia_q_1: { x: [], y: [], z: [], n: [], text_num: [], text_img: [], hover: [], color: '#00CEC9', symbol: 'circle', size: 8, name: 'Inicio de Veintena' },
        tlahuiztlanpa: { x: [], y: [], z: [], n: [], text_num: [], text_img: [], hover: [], color: '#F1C40F', symbol: 'diamond', size: 11, name: 'Inicio de Trecena Tlahuiztlanpa' },
        huitztlanpa: { x: [], y: [], z: [], n: [], text_num: [], text_img: [], hover: [], color: '#0984E3', symbol: 'diamond', size: 11, name: 'Inicio de Trecena Huitztlanpa' },
        cihuatlanpa: { x: [], y: [], z: [], n: [], text_num: [], text_img: [], hover: [], color: '#D63031', symbol: 'diamond', size: 11, name: 'Inicio de Trecena Cihuatlanpa' },
        mictlanpa: { x: [], y: [], z: [], n: [], text_num: [], text_img: [], hover: [], color: '#7F8C8D', symbol: 'diamond', size: 11, name: 'Inicio de Trecena Mictlanpa' }
    };

    const pointsData = {};

    for (let n = 1; n <= 260; n++) {
        const q = n % 13;
        const r = n % 20;
        const [X, Y, Z] = mapear(q, r);

        const numeral = q === 0 ? 13 : q;
        const symName = nombresSimbolosDefecto[r].name;
        const symFile = nombresSimbolosDefecto[r].file;

        const labelNum = `(${q},${r})`;
        const labelImg = `(${numeral}, ${symName.charAt(0).toUpperCase() + symName.slice(1)})`;
        const hoverInfo = `Día n: <b>${n}</b><br>Coordenadas: <b>(${q}, ${r})</b>`;

        let classKey = '';
        let className = '';

        if (q === 1) {
            if ([1, 53, 105, 157, 209].includes(n)) {
                classKey = 'tlahuiztlanpa';
                className = 'Inicio de Trecena Tlahuiztlanpa';
            } else if ([14, 66, 118, 170, 222].includes(n)) {
                classKey = 'huitztlanpa';
                className = 'Inicio de Trecena Huitztlanpa';
            } else if ([27, 79, 131, 183, 235].includes(n)) {
                classKey = 'cihuatlanpa';
                className = 'Inicio de Trecena Cihuatlanpa';
            } else if ([40, 92, 144, 196, 248].includes(n)) {
                classKey = 'mictlanpa';
                className = 'Inicio de Trecena Mictlanpa';
            } else {
                classKey = 'tlahuiztlanpa';
                className = 'Inicio de Trecena Tlahuiztlanpa';
            }
        } else if (r === 1) {
            classKey = 'familia_q_1';
            className = 'Inicio de Veintena';
        } else {
            classKey = 'base';
            className = 'Día Regular';
        }

        categories[classKey].x.push(X);
        categories[classKey].y.push(Y);
        categories[classKey].z.push(Z);
        categories[classKey].n.push(n);
        categories[classKey].text_num.push(labelNum);
        categories[classKey].text_img.push(labelImg);
        categories[classKey].hover.push(`${hoverInfo}<br>Tipo: <b>${className}</b>`);

        pointsData[n] = {
            q,
            r,
            numeral,
            symName,
            symFile,
            className,
            classKey
        };
    }

    pointsDataRef.current = pointsData;

    const traceKeys = ['base', 'familia_q_1', 'tlahuiztlanpa', 'huitztlanpa', 'cihuatlanpa', 'mictlanpa'];
    const textNumeros = traceKeys.map(key => categories[key].text_num);
    const textImagenes = traceKeys.map(key => categories[key].text_img);

    // Trayectoria completa para la animación (261 puntos para cerrar el ciclo completo)
    const X_traj = [];
    const Y_traj = [];
    const Z_traj = [];
    for (let n = 1; n <= 261; n++) {
        const q = n % 13;
        const r = n % 20;
        const [X, Y, Z] = mapear(q, r);
        X_traj.push(X);
        Y_traj.push(Y);
        Z_traj.push(Z);
    }

    // Inicializar y renderizar el gráfico Plotly 3D
    useEffect(() => {
        if (!plotlyLoaded || !plotDivRef.current || !window.Plotly) return;

        const Plotly = window.Plotly;
        const plotDiv = plotDivRef.current;

        // 1. Superficie del Toro estática (mesh 80x80)
        const u_toro = [];
        const v_toro = [];
        for (let i = 0; i < 80; i++) {
            u_toro.push((2 * Math.PI * i) / 79);
            v_toro.push((2 * Math.PI * i) / 79);
        }
        const X_surf = [];
        const Y_surf = [];
        const Z_surf = [];
        for (let i = 0; i < 80; i++) {
            const v = v_toro[i];
            const x_row = [];
            const y_row = [];
            const z_row = [];
            for (let j = 0; j < 80; j++) {
                const u = u_toro[j];
                const X = (R_major + r_minor * Math.cos(u)) * Math.cos(v);
                const Y = (R_major + r_minor * Math.cos(u)) * Math.sin(v);
                const Z = r_minor * Math.sin(u);
                x_row.push(X);
                y_row.push(Y);
                z_row.push(Z);
            }
            X_surf.push(x_row);
            Y_surf.push(y_row);
            Z_surf.push(z_row);
        }

        const data = [
            // Traza 0: Superficie
            {
                type: 'surface',
                x: X_surf,
                y: Y_surf,
                z: Z_surf,
                opacity: 0.20,
                colorscale: 'Blues',
                showscale: false,
                hoverinfo: 'skip',
                name: 'Toro'
            }
        ];

        // Trazas 1 a 6: Puntos por Categoría
        traceKeys.forEach(catKey => {
            const cat = categories[catKey];
            const line_dict = catKey !== 'base' ? { color: 'white', width: 1 } : { color: 'black', width: 0.5 };
            data.push({
                type: 'scatter3d',
                x: cat.x,
                y: cat.y,
                z: cat.z,
                mode: 'markers',
                marker: {
                    size: cat.size,
                    color: cat.color,
                    symbol: cat.symbol,
                    line: line_dict
                },
                text: representation === 'numeros' ? cat.text_num : cat.text_img,
                textposition: "top center",
                textfont: { color: '#0F172A', size: representation === 'numeros' ? 11 : 12, family: 'Arial, sans-serif' },
                hovertext: cat.hover,
                hoverinfo: 'text',
                customdata: cat.n,
                name: cat.name
            });
        });

        // Traza 7: Trail/Línea de Trayectoria animada
        data.push({
            type: 'scatter3d',
            x: [X_traj[0]],
            y: [Y_traj[0]],
            z: [Z_traj[0]],
            mode: 'lines',
            line: { color: 'yellow', width: 4 },
            opacity: 0.8,
            name: 'Trayectoria',
            hoverinfo: 'skip'
        });

        // Traza 8: Generador Activo (Punto Rojo)
        data.push({
            type: 'scatter3d',
            x: [X_traj[0]],
            y: [Y_traj[0]],
            z: [Z_traj[0]],
            mode: 'markers+text',
            marker: {
                size: 10,
                color: 'red',
                symbol: 'circle',
                line: { color: 'black', width: 1 }
            },
            text: ["(1,1)"],
            textposition: "top center",
            textfont: { color: 'red', size: 12, family: 'Arial Black' },
            name: 'Generador Activo',
            hoverinfo: 'skip'
        });

        // Generar frames para la animación (k de 1 a 260)
        const frames = [];
        for (let k = 1; k <= 260; k++) {
            const q = k % 13;
            const r = k % 20;
            frames.push({
                name: k.toString(),
                data: [
                    { x: X_traj.slice(0, k), y: Y_traj.slice(0, k), z: Z_traj.slice(0, k) }, // Traza 7
                    { x: [X_traj[k - 1]], y: [Y_traj[k - 1]], z: [Z_traj[k - 1]], text: [`(${q},${r})`] } // Traza 8
                ],
                traces: [7, 8]
            });
        }

        // Configuración de menús y sliders en el layout de Plotly
        const updatemenus = [
            {
                type: "buttons",
                buttons: [
                    {
                        label: "► Play",
                        method: "animate",
                        args: [null, {
                            frame: { duration: speed, redraw: true },
                            fromcurrent: true,
                            transition: { duration: 0 }
                        }]
                    },
                    {
                        label: "⏸ Pause",
                        method: "animate",
                        args: [[null], {
                            frame: { duration: 0, redraw: false },
                            mode: "immediate",
                            transition: { duration: 0 }
                        }]
                    }
                ],
                direction: "left",
                pad: { r: 10, t: 10 },
                showactive: false,
                x: 0.15,
                y: 1.12,
                xanchor: "right",
                yanchor: "top"
            },
            {
                type: "buttons",
                buttons: [
                    {
                        label: "Ocultar Coordenadas",
                        method: "restyle",
                        args: [{ mode: "markers" }, [1, 2, 3, 4, 5, 6]]
                    },
                    {
                        label: "Mostrar Solo Destacados",
                        method: "restyle",
                        args: [
                            { mode: ["markers", "markers", "markers+text", "markers+text", "markers+text", "markers+text"] },
                            [1, 2, 3, 4, 5, 6]
                        ]
                    },
                    {
                        label: "Mostrar Todas las Coordenadas",
                        method: "restyle",
                        args: [{ mode: "markers+text" }, [1, 2, 3, 4, 5, 6]]
                    }
                ],
                direction: "down",
                pad: { r: 10, t: 10 },
                showactive: true,
                x: 0.95,
                y: 1.12,
                xanchor: "right",
                yanchor: "top"
            }
        ];

        const sliders = [
            {
                active: 0,
                yanchor: "top",
                xanchor: "left",
                currentvalue: {
                    font: { size: 14, color: '#0F172A' },
                    prefix: "Día Actual (n): ",
                    visible: true,
                    xanchor: "right"
                },
                transition: { duration: 0 },
                pad: { b: 10, t: 50 },
                len: 0.9,
                x: 0.05,
                y: 0,
                steps: Array.from({ length: 260 }, (_, i) => {
                    const k = i + 1;
                    return {
                        args: [
                            [k.toString()],
                            {
                                frame: { duration: 0, redraw: true },
                                mode: "immediate",
                                transition: { duration: 0 }
                            }
                        ],
                        label: k.toString(),
                        method: "animate"
                    };
                })
            }
        ];

        const layout = {
            title: {
                text: 'Tonalpohualli - Modelo Toro Interactivo 3D: Z₁₃ ⊕ Z₂₀',
                font: { size: 18, color: '#0F172A', family: 'Arial' },
                x: 0.5, y: 0.95
            },
            scene: {
                xaxis: { visible: false },
                yaxis: { visible: false },
                zaxis: { visible: false },
                bgcolor: 'white',
                aspectmode: 'data'
            },
            paper_bgcolor: 'white',
            plot_bgcolor: 'white',
            margin: { l: 10, r: 20, b: 10, t: 90 },
            updatemenus: updatemenus,
            sliders: sliders,
            legend: {
                orientation: "h",
                yanchor: "bottom",
                y: -0.2,
                xanchor: "center",
                x: 0.5,
                font: { color: '#0F172A' }
            }
        };

        // Renderizar el gráfico
        Plotly.newPlot(plotDiv, data, layout, { responsive: true }).then(() => {
            Plotly.addFrames(plotDiv, frames);
        });

        // Manejador de eventos de interacción
        plotDiv.on('plotly_hover', function (eventData) {
            if (followModeRef.current === 'cursor') {
                const pt = eventData.points[0];
                if (pt && pt.customdata) {
                    setHoveredDay(pt.customdata);
                }
            }
        });

        plotDiv.on('plotly_click', function (eventData) {
            if (followModeRef.current === 'cursor') {
                const pt = eventData.points[0];
                if (pt && pt.customdata) {
                    setHoveredDay(pt.customdata);
                }
            }
        });

        plotDiv.on('plotly_sliderchange', function (eventData) {
            if (followModeRef.current === 'trayectoria' && eventData.step && eventData.step.label) {
                const day = parseInt(eventData.step.label);
                if (!isNaN(day)) {
                    setHoveredDay(day);
                }
            }
        });

        plotDiv.on('plotly_animated', function () {
            if (followModeRef.current === 'trayectoria') {
                if (plotDiv.layout && plotDiv.layout.sliders && plotDiv.layout.sliders[0]) {
                    const activeStep = plotDiv.layout.sliders[0].active || 0;
                    const day = activeStep + 1;
                    setHoveredDay(day);
                }
            }
        });

        return () => {
            // Limpieza al desmontar
            if (plotDiv) {
                Plotly.purge(plotDiv);
            }
        };
    }, [plotlyLoaded]);

    // Cambiar la representación en el gráfico Plotly en tiempo real
    const handleRepresentationChange = (mode) => {
        setRepresentation(mode);
        if (!plotlyLoaded || !plotDivRef.current || !window.Plotly) return;

        const Plotly = window.Plotly;
        const textArray = mode === 'numeros' ? textNumeros : textImagenes;
        const fontSize = mode === 'numeros' ? 11 : 12;

        Plotly.restyle(plotDivRef.current, {
            text: textArray,
            'textfont.family': 'Arial, sans-serif',
            'textfont.size': fontSize
        }, [1, 2, 3, 4, 5, 6]);
    };

    // Cambiar el modo de seguimiento (Hover vs Trayectoria/Animación)
    const handleFollowModeChange = (mode) => {
        setFollowMode(mode);
        if (mode === 'trayectoria') {
            const plotDiv = plotDivRef.current;
            if (plotDiv && plotDiv.layout && plotDiv.layout.sliders && plotDiv.layout.sliders[0]) {
                const activeStep = plotDiv.layout.sliders[0].active || 0;
                const day = activeStep + 1;
                setHoveredDay(day);
            }
        }
    };

    // Modificar la velocidad del play interval
    const handleSpeedChange = (e) => {
        const newSpeed = parseInt(e.target.value);
        setSpeed(newSpeed);

        if (!plotlyLoaded || !plotDivRef.current || !window.Plotly) return;

        window.Plotly.relayout(plotDivRef.current, {
            'updatemenus[0].buttons[0].args[1].frame.duration': newSpeed
        });
    };

    return (
        <div className="container-fluid toro-container">
            <h1 className="text-center mb-4">Tonalpohualli - Modelo Toro 3D</h1>

            <div className="row g-4 px-3 justify-content-center">
                {/* Área del Gráfico Plotly */}
                <div className="col-lg-8 col-md-12">
                    <div className="card shadow-lg p-2" style={{ height: '700px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        {!plotlyLoaded ? (
                            <div className="d-flex flex-column justify-content-center align-items-center h-100" style={{ color: '#0F172A' }}>
                                <div className="spinner-border mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                                <span>Cargando Plotly 3D Engine...</span>
                            </div>
                        ) : (
                            <div ref={plotDivRef} style={{ width: '100%', height: '100%' }}></div>
                        )}
                    </div>
                </div>

                {/* Sidebar de Control y Detalles */}
                <div className="col-lg-4 col-md-12">
                    <div className="toro-sidebar shadow-lg h-100">
                        <div className="toro-title">Tonalpohualli</div>
                        <div className="toro-title" style={{ fontSize: '18px', marginTop: '-2px' }}>Toro Interactivo 3D</div>
                        <div className="toro-subtitle">Modelo Z₁₃ ⊕ Z₂₀</div>

                        {/* Selector de Representación */}
                        <div className="toro-section-label">Representación</div>
                        <div className="toro-selector-container mb-3">
                            <button
                                className={`toro-selector-btn ${representation === 'numeros' ? 'active' : ''}`}
                                onClick={() => handleRepresentationChange('numeros')}
                            >
                                Números (q, r)
                            </button>
                            <button
                                className={`toro-selector-btn ${representation === 'imagenes' ? 'active' : ''}`}
                                onClick={() => handleRepresentationChange('imagenes')}
                            >
                                (Numeral, Glifo)
                            </button>
                        </div>

                        {/* Selector de Seguimiento */}
                        <div className="toro-section-label">Modo de Seguimiento</div>
                        <div className="toro-selector-container mb-3">
                            <button
                                className={`toro-selector-btn ${followMode === 'cursor' ? 'active' : ''}`}
                                onClick={() => handleFollowModeChange('cursor')}
                            >
                                Al Señalar
                            </button>
                            <button
                                className={`toro-selector-btn ${followMode === 'trayectoria' ? 'active' : ''}`}
                                onClick={() => handleFollowModeChange('trayectoria')}
                            >
                                Al Animar
                            </button>
                        </div>

                        {/* Velocidad de la Animación */}
                        <div className="toro-section-label">Velocidad de Animación</div>
                        <div className="mb-4" style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '12px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 600 }}>Intervalo:</span>
                                <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 800 }}>{speed} ms</span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="1500"
                                step="50"
                                value={speed}
                                onChange={handleSpeedChange}
                                style={{ width: '100%', cursor: 'pointer' }}
                            />
                            <div className="d-flex justify-content-between style-label" style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>
                                <span>Rápido (100ms)</span>
                                <span>Lento (1500ms)</span>
                            </div>
                        </div>

                        {/* Panel de Detalles */}
                        <div className={`toro-details-card ${hoveredDay !== null ? 'active' : ''}`}>
                            <div className="toro-card-bg-glow"></div>
                            {hoveredDay === null ? (
                                <div className="toro-placeholder-text">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                    <br />
                                    Pasa el cursor o haz clic sobre cualquier punto en el toro 3D para explorar su coordenada, día y glifo tradicional.
                                </div>
                            ) : (
                                <div>
                                    <div className="toro-day-badge">Día {hoveredDay}</div>
                                    <div className={`toro-class-badge class-${pointsDataRef.current[hoveredDay]?.classKey}`}>
                                        {pointsDataRef.current[hoveredDay]?.className}
                                    </div>

                                    {representation === 'numeros' ? (
                                        <div className="toro-visual-numeros">
                                            <div className="toro-number-box">
                                                <span className="val" style={{ color: '#f87171' }}>{pointsDataRef.current[hoveredDay]?.q}</span>
                                                <span className="label">módulo 13</span>
                                            </div>
                                            <div className="toro-number-box">
                                                <span className="val" style={{ color: '#34d399' }}>{pointsDataRef.current[hoveredDay]?.r}</span>
                                                <span className="label">módulo 20</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="toro-visual-imagenes">
                                            <div className="toro-image-row">
                                                <div className="toro-image-card">
                                                    <div className="toro-img-wrapper">
                                                        <img
                                                            src={getImagePath(`${pointsDataRef.current[hoveredDay]?.numeral}.png`)}
                                                            alt={`Numeral ${pointsDataRef.current[hoveredDay]?.q}`}
                                                            onError={(e) => { e.target.src = ''; e.target.alt = 'N/A'; }}
                                                        />
                                                    </div>
                                                    <span className="label">Numeral {pointsDataRef.current[hoveredDay]?.numeral}</span>
                                                </div>
                                                <div className="toro-image-card">
                                                    <div className="toro-img-wrapper">
                                                        <img
                                                            src={getImagePath(pointsDataRef.current[hoveredDay]?.symFile)}
                                                            alt={`Signo ${pointsDataRef.current[hoveredDay]?.symName}`}
                                                            onError={(e) => { e.target.src = ''; e.target.alt = 'N/A'; }}
                                                        />
                                                    </div>
                                                    <span className="label">Signo: {pointsDataRef.current[hoveredDay]?.symName}</span>
                                                </div>
                                            </div>
                                            <div className="toro-traditional-name">
                                                {pointsDataRef.current[hoveredDay]?.numeral} - {pointsDataRef.current[hoveredDay]?.symName}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="toro-footer-help">
                            Gira el Toro con el mouse para explorarlo en 3D.<br />
                            Usa el botón "Play" abajo a la izquierda en el gráfico para animar la trayectoria.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toro;