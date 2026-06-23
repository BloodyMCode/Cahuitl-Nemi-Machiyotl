import React, { useState, useEffect, useRef, useCallback } from 'react';
import Plotly from 'plotly.js-dist-min';
import _reactPlotly from 'react-plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
// Cargar el JSON de datos geométricos
import toroData from '../data/toroData.json';
// Configuración del factory seguro para Plotly en Vite
const PlotComponent = _reactPlotly.default || _reactPlotly;
const Plot = typeof createPlotlyComponent === 'function'
    ? createPlotlyComponent(Plotly)
    : PlotComponent;
// Importa plotly.js y la función factory
/* import * as Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);
import toroData from '../data/toroData.json'; */
// Importar el archivo Python como texto plano usando '?raw' de Vite
//import pythonCode from '../python/toro_animacion_3d_v3.6.py?raw';
import { getImagePath } from '../funtions/funtions';
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../styles/Toro.css';

// Mapeo de colores estéticos por rumbo de Trecena para los trazos segmentados
const RUMBO_COLORS = {
    tlahuiztlanpa: '#F1C40F', // Oriente / Amarillo
    huitztlanpa: '#0984E3',    // Sur / Azul
    cihuatlanpa: '#D63031',    // Poniente / Rojo
    mictlanpa: '#7F8C8D',      // Norte / Gris
    base: '#475569'
};

const Toro = () => {

    // --- ESTADOS ORIGINALES DE LA APLICACIÓN ---
    const [currentRepresentation, setCurrentRepresentation] = useState('numeros'); // 'numeros' | 'imagenes'
    const [followMode, setFollowMode] = useState('cursor'); // 'cursor' | 'trayectoria'
    const [speed, setSpeed] = useState(300); // ms por intervalo
    const [hoveredDay, setHoveredDay] = useState(null);
    const [activeDayData, setActiveDayData] = useState(null);

    const plotRef = useRef(null);
    const followModeRef = useRef('cursor');
    const isAnimatingRef = useRef(false);
    // Guarda el último día renderizado para que React no reinicie la animación al actualizar la UI
    const currentDayRef = useRef(1);
    // Sincronizar la referencia del modo de seguimiento para los eventos nativos de Plotly
    useEffect(() => {
        followModeRef.current = followMode;
    }, [followMode]);

    // --- PROPUESTA: SINCRONIZACIÓN PERFECTA (PRE-CACHÉ DE IMÁGENES) ---
    useEffect(() => {
        // Fuerza al navegador a descargar y almacenar en caché todas las imágenes 
        // de los glifos al montar el componente para eliminar el parpadeo en la animación.
        Object.keys(toroData.points).forEach((key) => {
            const data = toroData.points[key];
            // 1. Imagen del glifo
            const symImg = new Image();
            symImg.src = getImagePath(data.symFile);
            // 2. Imagen del numeral asociativo
            const numeralFile = data.q === 0 ? '13.png' : `${data.q}.png`;
            const numImg = new Image();
            numImg.src = getImagePath(numeralFile);
        });
        // Cargar por defecto el estado del día 1 en el panel lateral
        updateSidebar(1);
    }, []);
    // Actualiza la barra lateral según el día actual activo del sistema
    const updateSidebar = (day) => {
        currentDayRef.current = day;
        const data = toroData.points[day];
        if (data) {
            setActiveDayData({ day, ...data });
        }
    };
    // --- ESCUCHA DE EVENTOS NATIVOS MEJORADA ---
    // Vincular detectores de eventos nativos de Plotly.js para interactividad sin lag
    const bindPlotlyEvents = (el) => {
        el.removeAllListeners?.('plotly_hover');
        el.removeAllListeners?.('plotly_click');
        el.removeAllListeners?.('plotly_sliderchange');
        el.removeAllListeners?.('plotly_animated');
        el.on('plotly_hover', (data) => {
            if (followModeRef.current === 'cursor' && !isAnimatingRef.current) {
                const pt = data.points[0];
                if (pt && pt.customdata) updateSidebar(pt.customdata);
            }
        });
        el.on('plotly_click', (data) => {
            if (followModeRef.current === 'cursor') {
                const pt = data.points[0];
                if (pt && pt.customdata) updateSidebar(pt.customdata);
            }
        });
        // Sincronización precisa al arrastrar manualmente el Slider nativo
        el.on('plotly_sliderchange', (data) => {
            if (data.step && data.step.label) {
                const day = parseInt(data.step.label);
                if (!isNaN(day)) updateSidebar(day);
            }
        });

        // Sincroniza frame a frame mientras corre el Play o se detiene en Pause
        el.on('plotly_animated', (data) => {
            // Solo actualiza si está en modo trayectoria Y la animación sigue corriendo activa
            if (data && data.name) {
                const day = parseInt(data.name);
                if (!isNaN(day)) updateSidebar(day);
            } else {
                // Fallback de seguridad leyendo la propiedad del slider nativo
                const plotDiv = plotRef.current?.el;
                if (plotDiv?.layout?.sliders?.[0]) {
                    const activeStep = plotDiv.layout.sliders[0].active || 0;
                    updateSidebar(activeStep + 1);
                }
            }
        });
    };
    // --- CONSTRUCCIÓN DE LA MALLA GEOMÉTRICA (TRAZA 0) ---
    const R_major = 5;
    const r_minor = 1.5;
    const u_arr = Array.from({ length: 40 }, (_, i) => (2 * Math.PI * i) / 39);
    const v_arr = Array.from({ length: 40 }, (_, i) => (2 * Math.PI * i) / 39);

    let x_surf = [], y_surf = [], z_surf = [];
    for (let i = 0; i < v_arr.length; i++) {
        let x_row = [], y_row = [], z_row = [];
        for (let j = 0; j < u_arr.length; j++) {
            x_row.push((R_major + r_minor * Math.cos(u_arr[j])) * Math.cos(v_arr[i]));
            y_row.push((R_major + r_minor * Math.cos(u_arr[j])) * Math.sin(v_arr[i]));
            z_row.push(r_minor * Math.sin(u_arr[j]));
        }
        x_surf.push(x_row); y_surf.push(y_row); z_surf.push(z_row);
    }

    const surfaceTrace = {
        type: 'surface',
        x: x_surf, y: y_surf, z: z_surf,
        opacity: 0.08,
        colorscale: 'Jet',
        showscale: false,
        hoverinfo: 'skip'
    };

    // --- MAPEO DE LAS TRAZAS ESTÁTICAS DE PUNTOS POR CATEGORÍA (TRAZAS 1 A 6) ---
    const trace_keys = ['base', 'familia_q_1', 'tlahuiztlanpa', 'huitztlanpa', 'cihuatlanpa', 'mictlanpa'];

    // Diccionario de inicialización para segmentar por coordenadas
    const catContainers = {
        base: { x: [], y: [], z: [], text_num: [], text_img: [], hover: [], n: [], size: 5, color: '#334155', symbol: 'circle', name: 'Día Regular' },
        familia_q_1: { x: [], y: [], z: [], text_num: [], text_img: [], hover: [], n: [], size: 7, color: '#00CEC9', symbol: 'diamond', name: 'Inicio Veintena' },
        tlahuiztlanpa: { x: [], y: [], z: [], text_num: [], text_img: [], hover: [], n: [], size: 9, color: RUMBO_COLORS.tlahuiztlanpa, symbol: 'circle', name: 'Tlahuiztlanpa (Oriente)' },
        huitztlanpa: { x: [], y: [], z: [], text_num: [], text_img: [], hover: [], n: [], size: 9, color: RUMBO_COLORS.huitztlanpa, symbol: 'circle', name: 'Huitztlanpa (Sur)' },
        cihuatlanpa: { x: [], y: [], z: [], text_num: [], text_img: [], hover: [], n: [], size: 9, color: RUMBO_COLORS.cihuatlanpa, symbol: 'circle', name: 'Cihuatlanpa (Poniente)' },
        mictlanpa: { x: [], y: [], z: [], text_num: [], text_img: [], hover: [], n: [], size: 9, color: RUMBO_COLORS.mictlanpa, symbol: 'circle', name: 'Mictlanpa (Norte)' }
    };

    // Distribuir la data geométrica dentro de las 6 categorías estructurales
    toroData.trajectory.forEach((t) => {
        const pt = toroData.points[t.n];
        const container = catContainers[pt.classKey] || catContainers.base;

        container.x.push(t.x);
        container.y.push(t.y);
        container.z.push(t.z);
        container.n.push(t.n);
        container.text_num.push(`(${pt.q},${pt.r})`);
        container.text_img.push(`${pt.numeral}-${pt.symName}`);
        container.hover.push(`Día n=${t.n}<br>Tonal: ${pt.numeral} ${pt.symName}<br>Coord: (${pt.q},${pt.r})`);
    });

    const categoryTraces = trace_keys.map((cat_key) => {
        const cat = catContainers[cat_key];
        const isBase = cat_key === 'base';

        return {
            type: 'scatter3d',
            x: cat.x, y: cat.y, z: cat.z,
            mode: 'markers',
            marker: {
                size: cat.size,
                color: cat.color,
                symbol: cat.symbol,
                line: { color: isBase ? '#000000' : '#FFFFFF', width: isBase ? 0.5 : 1 }
            },
            text: currentRepresentation === 'numeros' ? cat.text_num : cat.text_img,
            textposition: 'top center',
            textfont: { color: '#94A3B8', size: 10, family: 'Arial, sans-serif' },
            hovertext: cat.hover,
            customdata: cat.n,
            name: cat.name
        };
    });

    // --- TRAZO 7: RASTRO (TRAIL) ANIMADO ---
    // CORRECCIÓN: Garantizar que tengan arrays con el origen inicial estructurado desde el día 1
    const currentSampleIndex = currentDayRef.current;
    const activeTrajectorySlice = toroData.trajectory.slice(0, currentSampleIndex);
    const lastActivePos = toroData.trajectory[currentSampleIndex - 1] || toroData.trajectory[0];
    const lastActiveMeta = toroData.points[lastActivePos.n];
    const trailTrace = {
        type: 'scatter3d',
        x: activeTrajectorySlice.map(s => s.x),
        y: activeTrajectorySlice.map(s => s.y),
        z: activeTrajectorySlice.map(s => s.z),
        mode: 'lines',
        line: { color: '#F1C40F', width: 4.5 }, // Amarillo de alta visibilidad continuo
        opacity: 0.9,
        name: 'Trayectoria',
        hoverinfo: 'skip'
    };

    // --- TRAZO 8: GENERADOR ACTIVO (TRACER) ANIMADO ---
    const tracerTrace = {
        type: 'scatter3d',
        x: [lastActivePos.x],
        y: [lastActivePos.y],
        z: [lastActivePos.z],
        mode: 'markers+text',
        marker: { size: 10, color: '#EF4444', symbol: 'circle', line: { color: 'black', width: 1.5 } },
        text: [currentRepresentation === 'numeros' ? `(${lastActiveMeta.q},${lastActiveMeta.r})` : `${lastActiveMeta.numeral}-${lastActiveMeta.symName}`],
        textposition: 'top center',
        textfont: { color: '#EF4444', size: 12, family: 'Arial Black' },
        name: 'Generador Activo',
        hoverinfo: 'skip'
    };

    // --- CONSTRUCCIÓN COMPLETA DE ANIMACIÓN DE FRAMES CON RASTRO MULTICOLOR ---
    const steps = [];
    const frames = [];
    const totalPoints = toroData.trajectory.length;

    for (let k = 1; k <= totalPoints; k++) {
        const currentSample = toroData.trajectory.slice(0, k);
        const currentPt = toroData.trajectory[k - 1];
        const ptMeta = toroData.points[currentPt.n];

        steps.push({
            label: k.toString(),
            method: 'animate',
            args: [[k.toString()], {
                frame: { duration: 0, redraw: false },
                mode: 'immediate',
                transition: { duration: 0 }
            }]
        });

        frames.push({
            name: k.toString(),
            data: [
                {
                    type: 'scatter3d',
                    x: currentSample.map(s => s.x),
                    y: currentSample.map(s => s.y),
                    z: currentSample.map(s => s.z),
                    line: { color: '#F1C40F', width: 4.5 } // Mantiene la consistencia del color durante el Play
                },
                {
                    type: 'scatter3d',
                    x: [currentPt.x], y: [currentPt.y], z: [currentPt.z],
                    text: [currentRepresentation === 'numeros' ? `(${ptMeta.q},${ptMeta.r})` : `${ptMeta.numeral}-${ptMeta.symName}`]
                }
            ],
            traces: [7, 8]
        });
    }
    // --- CONTROLES DE INTERFAZ INTEGRADOS DIRECTAMENTE AL CONTENEDOR LAYOUT DARK ---
    const layout = {
        paper_bgcolor: '#0F172A',
        plot_bgcolor: '#0F172A',
        margin: { l: 10, r: 10, b: 10, t: 70 },
        scene: {
            xaxis: { visible: false },
            yaxis: { visible: false },
            zaxis: { visible: false },
            bgcolor: '#0F172A',
            aspectmode: 'data'
        },
        updatemenus: [
            // 1. Botones nativos de Play/Pause alineados en zona izquierda superior
            {
                type: 'buttons',
                direction: 'left',
                pad: { r: 10, t: 10 },
                showactive: false,
                x: 0.15, y: 1.15, xanchor: 'right', yanchor: 'top',
                font: { color: '#E2E8F0', size: 12 },
                bgcolor: '#1E293B',
                bordercolor: '#334155',
                buttons: [
                    {
                        label: '► Play',
                        method: 'animate',
                        args: [null, {
                            frame: { duration: speed, redraw: false },
                            fromcurrent: true, // Crucial: continúa exactamente en el frame pausado
                            transition: { duration: 0 },
                            mode: 'immediate'
                        }]
                    },
                    {
                        label: '⏸ Pause',
                        method: 'animate',
                        args: [[null], {
                            frame: { duration: 0, redraw: false },
                            mode: 'immediate',
                            transition: { duration: 0 }
                        }]
                    }
                ]
            }
        ],
        sliders: [{
            active: currentSampleIndex - 1,
            yanchor: 'top',
            xanchor: 'left',
            currentvalue: { font: { size: 13, color: '#38BDF8' }, prefix: 'Día Actual (n): ', visible: true, xanchor: 'right' },
            transition: { duration: 0 },
            pad: { b: 10, t: 40 },
            len: 0.9,
            x: 0.05, y: 0,
            font: { color: '#94A3B8', size: 10 },
            bgcolor: '#1E293B',
            bordercolor: '#334155',
            steps: steps
        }]
    };
    // --- ACCIONES UI ---
    // Métodos dinámicos para acoplar selectores de HTML con los métodos nativos de Plotly Restyle
    const toggleLabelsRepresentation = (mode) => {
        setCurrentRepresentation(mode);
        const plotDiv = plotRef.current?.el;
        if (!plotDiv) return;

        const textMatrix = trace_keys.map((key) => catContainers[key][mode === 'numeros' ? 'text_num' : 'text_img']);
        Plotly.restyle(plotDiv, {
            text: textMatrix,
            'textfont.size': mode === 'numeros' ? 10 : 13
        }, [1, 2, 3, 4, 5, 6]);
    };

    const toggleLabelsVisibility = (visibilityMode) => {
        const plotDiv = plotRef.current?.el;
        if (!plotDiv) return;

        let modesArray = [];
        if (visibilityMode === 'none') {
            modesArray = Array(6).fill('markers');
        } else if (visibilityMode === 'highlights') {
            modesArray = ['markers', 'markers', 'markers+text', 'markers+text', 'markers+text', 'markers+text'];
        } else {
            modesArray = Array(6).fill('markers+text');
        }

        Plotly.restyle(plotDiv, { mode: modesArray }, [1, 2, 3, 4, 5, 6]);
    };

    const updatePlaySpeed = (val) => {
        const newSpeed = parseInt(val);
        setSpeed(newSpeed);
        const plotDiv = plotRef.current?.el;
        if (plotDiv) {
            Plotly.relayout(plotDiv, {
                'updatemenus[0].buttons[0].args[1].frame.duration': newSpeed
            });
        }
    };
    // CORRECCIÓN: Manejar el cambio de modo asegurando la conmutación de estado en React
    const handleFollowModeChange = (mode) => {
        setFollowMode(mode);
        if (mode === 'trayectoria') {
            const plotDiv = plotRef.current?.el;
            if (plotDiv?.layout?.sliders?.[0]) {
                const activeStep = plotDiv.layout.sliders[0].active || 0;
                updateSidebar(activeStep + 1);
            }
        }
    };

    return (
        <div id="app-container" style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>

            {/* ÁREA DEL GRÁFICO */}
            <div id="plot-area" style={{ flex: 1, height: '100%', position: 'relative', backgroundColor: '#0F172A' }}>
                <Plot
                    ref={plotRef}
                    data={[surfaceTrace, ...categoryTraces, trailTrace, tracerTrace]}
                    layout={layout}
                    frames={frames}
                    config={{ responsive: true, displayModeBar: false }}
                    style={{ width: '100%', height: '100%' }}
                    onInitialized={(figure, el) => bindPlotlyEvents(el)}
                    onUpdate={(figure, el) => bindPlotlyEvents(el)}
                    onStartAnimating={() => { isAnimatingRef.current = true; }}
                    onStopAnimating={() => { isAnimatingRef.current = false; }}
                />
            </div>

            {/* BARRA LATERAL */}
            <div id="sidebar" style={{ width: '340px', minWidth: '340px', height: '100%', backgroundColor: '#1E293B', borderLeft: '1px solid #334155', padding: '24px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowY: 'auto' }}>
                <h1 style={{ margin: '0 0 2px 0', fontSize: '26px', fontWeight: 800, color: '#F8FAFC' }}>Tonalpohualli</h1>
                <h1 style={{ margin: '2px 0 5px 0', fontSize: '20px', fontWeight: 600, color: '#38BDF8' }}>Toro Interactivo 3D</h1>
                <div className="subtitle" style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>Modelo Z₁₃ ⊕ Z₂₀</div>

                {/* REPRESENTACIÓN */}
                <div className="section-label" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', marginBottom: '6px', marginTop: '5px' }}>Representación</div>
                <div className="selector-container" style={{ display: 'flex', backgroundColor: '#0F172A', borderRadius: '8px', padding: '3px', marginBottom: '15px' }}>
                    <button className={`selector-btn ${currentRepresentation === 'numeros' ? 'active' : ''}`} onClick={() => toggleLabelsRepresentation('numeros')} style={{ flex: 1, padding: '8px 4px', fontSize: '12px', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: currentRepresentation === 'numeros' ? '#38BDF8' : 'transparent', color: currentRepresentation === 'numeros' ? '#0F172A' : '#94A3B8' }}>
                        Números (q, r)
                    </button>
                    <button className={`selector-btn ${currentRepresentation === 'imagenes' ? 'active' : ''}`} onClick={() => toggleLabelsRepresentation('imagenes')} style={{ flex: 1, padding: '8px 4px', fontSize: '12px', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: currentRepresentation === 'imagenes' ? '#38BDF8' : 'transparent', color: currentRepresentation === 'imagenes' ? '#0F172A' : '#94A3B8' }}>
                        (Numeral, Glifo)
                    </button>
                </div>

                {/* MODO DE SEGUIMIENTO */}
                <div className="section-label" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', marginBottom: '6px' }}>Modo de Seguimiento</div>
                <div className="selector-container" style={{ display: 'flex', backgroundColor: '#0F172A', borderRadius: '8px', padding: '3px', marginBottom: '15px' }}>
                    <button className={`selector-btn ${followMode === 'cursor' ? 'active' : ''}`} onClick={() => handleFollowModeChange('cursor')} style={{ flex: 1, padding: '8px 4px', fontSize: '12px', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: followMode === 'cursor' ? '#2563EB' : 'transparent', color: '#F8FAFC' }}>
                        Al Señalar
                    </button>
                    <button className={`selector-btn ${followMode === 'trayectoria' ? 'active' : ''}`} onClick={() => handleFollowModeChange('trayectoria')} style={{ flex: 1, padding: '8px 4px', fontSize: '12px', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: followMode === 'trayectoria' ? '#2563EB' : 'transparent', color: '#F8FAFC' }}>
                        Al Animar
                    </button>
                </div>

                {/* ETIQUETAS EN EL TORO */}
                <div className="section-label" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', marginBottom: '6px' }}>Etiquetas en el Toro</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '20px' }}>
                    <button className="btn-vis" onClick={() => toggleLabelsVisibility('none')} style={{ width: '100%', padding: '7px', fontSize: '11px', backgroundColor: '#0F172A', color: '#94A3B8', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', textAlign: 'left' }}>• Ocultar Coordenadas</button>
                    <button className="btn-vis" onClick={() => toggleLabelsVisibility('highlights')} style={{ width: '100%', padding: '7px', fontSize: '11px', backgroundColor: '#0F172A', color: '#38BDF8', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', textAlign: 'left' }}>• Mostrar Solo Destacados</button>
                    <button className="btn-vis" onClick={() => toggleLabelsVisibility('all')} style={{ width: '100%', padding: '7px', fontSize: '11px', backgroundColor: '#0F172A', color: '#F8FAFC', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', textAlign: 'left' }}>• Mostrar Todas</button>
                </div>

                {/* VELOCIDAD */}
                <div className="section-label" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', marginBottom: '6px' }}>Velocidad de Animación</div>
                <div style={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', padding: '12px', marginBottom: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Intervalo:</span>
                        <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 800 }}>{speed} ms</span>
                    </div>
                    <input type="range" id="speed-slider" min="100" max="1500" step="50" value={speed} onChange={(e) => updatePlaySpeed(e.target.value)} style={{ width: '100%', cursor: 'pointer', accentColor: '#38BDF8' }} />
                </div>

                {/* TARJETA DINÁMICA DE DETALLES */}
                <div id="details-card" style={{ backgroundColor: '#0F172A', borderRadius: '16px', padding: '20px', border: '1px solid #334155', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {activeDayData ? (
                        <div id="details-content" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 800, backgroundColor: '#334155', padding: '3px 9px', borderRadius: '12px', color: '#38BDF8', fontFamily: 'monospace' }}>Día {activeDayData.day}</span>
                                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', padding: '3px 9px', borderRadius: '12px', color: '#0F172A', backgroundColor: RUMBO_COLORS[activeDayData.classKey] || '#FFF' }}>{activeDayData.className}</span>
                            </div>

                            {currentRepresentation === 'numeros' ? (
                                <div className="visual-numeros" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                    <div style={{ flex: 1, backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '8px 4px', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                                        <span style={{ fontSize: '22px', fontWeight: 800, color: '#F87171' }}>{activeDayData.q}</span>
                                        <span style={{ fontSize: '9px', color: '#64748B', textTransform: 'uppercase' }}>módulo 13</span>
                                    </div>
                                    <div style={{ flex: 1, backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '8px 4px', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                                        <span style={{ fontSize: '22px', fontWeight: 800, color: '#34D399' }}>{activeDayData.r}</span>
                                        <span style={{ fontSize: '9px', color: '#64748B', textTransform: 'uppercase' }}>módulo 20</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="visual-imagenes" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '100%' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '75px' }}>
                                            <div style={{ width: '55px', height: '55px', backgroundColor: '#1E293B', borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src={getImagePath(activeDayData.q === 0 ? '13.png' : `${activeDayData.q}.png`)} alt={`Numeral ${activeDayData.numeral}`} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <span style={{ fontSize: '8px', color: '#64748B', marginTop: '4px' }}>Num. {activeDayData.numeral}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '75px' }}>
                                            <div style={{ width: '55px', height: '55px', backgroundColor: '#1E293B', borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src={getImagePath(activeDayData.symFile)} alt={`Signo ${activeDayData.symName}`} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <span style={{ fontSize: '8px', color: '#64748B', marginTop: '4px' }}>Signo: {activeDayData.symName}</span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#38BDF8', marginTop: '10px', textTransform: 'capitalize' }}>{activeDayData.numeral} - {activeDayData.symName}</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ color: '#475569', fontSize: '12px', textAlign: 'center' }}>
                            Pasa el cursor o haz clic sobre cualquier punto en el toro 3D para explorar su coordenada, día y glifo tradicional.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    /*  const [data, setData] = useState(null);
     const [loading, setLoading] = useState(true);
     const [currentDay, setCurrentDay] = useState(1);
     const [isPlaying, setIsPlaying] = useState(false);
     const [hoveredDay, setHoveredDay] = useState(null);
     const [repMode, setRepMode] = useState('numeros');
     const [followMode, setFollowMode] = useState('cursor');
     const [speed, setSpeed] = useState(300);
     const plotRef = useRef(null);
     const intervalRef = useRef(null);
     const isFirstRender = useRef(true);
 
     // Cargar datos
     useEffect(() => {
         if (toroData) {
             setData(toroData);
             setLoading(false);
         }
     }, []);
 
     // Manejar animación
     useEffect(() => {
         if (!data) return;
         if (isPlaying) {
             intervalRef.current = setInterval(() => {
                 setCurrentDay(prev => (prev % 260) + 1);
             }, speed);
         } else {
             clearInterval(intervalRef.current);
         }
         return () => clearInterval(intervalRef.current);
     }, [isPlaying, speed, data]);
 
     // Actualizar gráfico cuando cambia el día
     useEffect(() => {
         if (!data || !plotRef.current || isFirstRender.current) {
             isFirstRender.current = false;
             return;
         }
 
         const day = data.days.find(d => d.n === currentDay);
         if (!day) return;
 
         try {
             // Índices de las trazas:
             // 0: superficie
             // 1-6: categorías (base, familia_q_1, tlahuiztlanpa, huitztlanpa, cihuatlanpa, mictlanpa)
             // 7: trayectoria
             // 8: generador activo
             // Usamos índices 7 y 8
             const update = {
                 x: [[day.x]],
                 y: [[day.y]],
                 z: [[day.z]]
             };
             Plotly.restyle(plotRef.current, update, [8]); // Generador activo
 
             // Actualizar trayectoria (acumulada hasta el día actual)
             const trajPoints = data.days.slice(0, currentDay);
             const trajUpdate = {
                 x: [trajPoints.map(d => d.x)],
                 y: [trajPoints.map(d => d.y)],
                 z: [trajPoints.map(d => d.z)]
             };
             Plotly.restyle(plotRef.current, trajUpdate, [7]); // Trayectoria
 
             // Si está en modo trayectoria, actualizar panel lateral
             if (followMode === 'trayectoria') {
                 setHoveredDay(day);
             }
         } catch (e) {
             console.warn('Error al actualizar el gráfico:', e);
         }
     }, [currentDay, data, followMode]);
 
     // Preparar datos para Plotly
     const getPlotData = useCallback(() => {
         if (!data) return [];
 
         const { surface, days, textNumeros, textImagenes } = data;
 
         // 1. Superficie del toro
         const surfTrace = {
             type: 'surface',
             x: surface.x,
             y: surface.y,
             z: surface.z,
             colorscale: [
                 [0, 'rgb(247,251,255)'],
                 [0.125, 'rgb(222,235,247)'],
                 [0.25, 'rgb(198,219,239)'],
                 [0.375, 'rgb(158,202,225)'],
                 [0.5, 'rgb(107,174,214)'],
                 [0.625, 'rgb(66,146,198)'],
                 [0.75, 'rgb(33,113,181)'],
                 [0.875, 'rgb(8,81,156)'],
                 [1, 'rgb(8,48,107)']
             ],
             opacity: 0.2,
             showscale: false,
             hoverinfo: 'skip',
             name: 'Toro'
         };
 
         // Categorías (mismo orden que en el HTML)
         const categories = [
             { key: 'base', color: '#4B5563', size: 5, symbol: 'circle', line: { color: 'black', width: 0.5 }, name: 'Día Regular (q, r)' },
             { key: 'familia_q_1', color: '#00CEC9', size: 8, symbol: 'circle', line: { color: 'white', width: 1 }, name: 'Inicio de Veintena' },
             { key: 'tlahuiztlanpa', color: '#F1C40F', size: 11, symbol: 'diamond', line: { color: 'white', width: 1 }, name: 'Inicio de Trecena Tlahuiztlanpa' },
             { key: 'huitztlanpa', color: '#0984E3', size: 11, symbol: 'diamond', line: { color: 'white', width: 1 }, name: 'Inicio de Trecena Huitztlanpa' },
             { key: 'cihuatlanpa', color: '#D63031', size: 11, symbol: 'diamond', line: { color: 'white', width: 1 }, name: 'Inicio de Trecena Cihuatlanpa' },
             { key: 'mictlanpa', color: '#7F8C8D', size: 11, symbol: 'diamond', line: { color: 'white', width: 1 }, name: 'Inicio de Trecena Mictlanpa' }
         ];
 
         const textArray = repMode === 'numeros' ? textNumeros : textImagenes;
         const fontSize = repMode === 'numeros' ? 11 : 14;
 
         // Construir trazas para cada categoría
         const traces = categories.map((cat, idx) => {
             const catData = days.filter(d => d.classKey === cat.key);
             return {
                 type: 'scatter3d',
                 mode: 'markers+text',
                 x: catData.map(d => d.x),
                 y: catData.map(d => d.y),
                 z: catData.map(d => d.z),
                 marker: {
                     size: cat.size,
                     color: cat.color,
                     symbol: cat.symbol,
                     line: cat.line
                 },
                 text: textArray[idx] || catData.map(d => d.labelNum),
                 textposition: 'top center',
                 textfont: { color: '#0F172A', size: fontSize, family: 'Arial, sans-serif' },
                 hovertext: catData.map(d => d.hover),
                 hoverinfo: 'text',
                 customdata: catData.map(d => d.n),
                 name: cat.name
             };
         });
 
         // Trayectoria (línea) - inicialmente vacía
         const trajTrace = {
             type: 'scatter3d',
             mode: 'lines',
             x: [],
             y: [],
             z: [],
             line: { color: 'yellow', width: 4 },
             opacity: 0.8,
             name: 'Trayectoria',
             hoverinfo: 'skip'
         };
 
         // Generador activo (primer día)
         const firstDay = days[0];
         const activeTrace = {
             type: 'scatter3d',
             mode: 'markers+text',
             x: [firstDay.x],
             y: [firstDay.y],
             z: [firstDay.z],
             marker: {
                 size: 10,
                 color: 'red',
                 symbol: 'circle',
                 line: { color: 'black', width: 1 }
             },
             text: [firstDay.labelNum],
             textposition: 'top center',
             textfont: { color: 'red', size: 12, family: 'Arial Black' },
             name: 'Generador Activo',
             hoverinfo: 'skip'
         };
 
         return [surfTrace, ...traces, trajTrace, activeTrace];
     }, [data, repMode]);
 
     // Manejar eventos de hover
     const handleHover = (eventData) => {
         if (followMode !== 'cursor') return;
         if (!eventData || !eventData.points || eventData.points.length === 0) return;
 
         const pt = eventData.points[0];
         if (pt && pt.customdata) {
             const day = data.days.find(d => d.n === pt.customdata);
             if (day) setHoveredDay(day);
         }
     };
 
     // Manejar cambio de slider (cuando se mueve manualmente)
     const handleSliderChange = (eventData) => {
         if (followMode === 'trayectoria' && eventData.step && eventData.step.label) {
             const day = parseInt(eventData.step.label);
             if (!isNaN(day)) {
                 const found = data.days.find(d => d.n === day);
                 if (found) setHoveredDay(found);
             }
         }
     };
 
     // Cambiar representación (numérica o imágenes)
     const handleRepChange = (mode) => {
         if (mode === repMode) return;
         setRepMode(mode);
         // Actualizar etiquetas en el gráfico
         if (plotRef.current && data) {
             const textArray = mode === 'numeros' ? data.textNumeros : data.textImagenes;
             const fontSize = mode === 'numeros' ? 11 : 14;
             Plotly.restyle(plotRef.current, {
                 text: textArray,
                 'textfont.size': fontSize
             }, [1, 2, 3, 4, 5, 6]); // Índices de las trazas de categorías
         }
         // Forzar actualización del panel lateral si hay hover
         if (hoveredDay) {
             // No es necesario forzar, el estado se actualizará solo
         }
     };
 
     // Cambiar modo de seguimiento
     const handleFollowChange = (mode) => {
         setFollowMode(mode);
         if (mode === 'trayectoria' && data) {
             const day = data.days.find(d => d.n === currentDay);
             if (day) setHoveredDay(day);
         }
     };
 
     // Cambiar velocidad de animación
     const handleSpeedChange = (e) => {
         const val = parseInt(e.target.value);
         setSpeed(val);
         if (plotRef.current) {
             Plotly.relayout(plotRef.current, {
                 'updatemenus[0].buttons[0].args[1].frame.duration': val
             });
         }
     };
 
     // Renderizar panel lateral
     const renderSidebar = () => {
         const info = hoveredDay || data?.days.find(d => d.n === currentDay) || data?.days[0];
         if (!info) return <div className="placeholder-text">Selecciona un día</div>;
 
         const classStyle = `class-${info.classKey}`;
         const isNum = repMode === 'numeros';
 
         return (
             <div className="d-flex flex-column h-100">
                 <div className="day-badge">{info.n}</div>
                 <div className={`class-badge ${classStyle}`}>{info.className}</div>
                 {isNum ? (
                     <div className="visual-numeros d-flex justify-content-center">
                         <div className="number-box">
                             <span className="val" style={{ color: '#C0392B' }}>{info.q}</span>
                             <span className="label">módulo 13</span>
                         </div>
                         <div className="number-box">
                             <span className="val" style={{ color: '#0E6251' }}>{info.r}</span>
                             <span className="label">módulo 20</span>
                         </div>
                     </div>
                 ) : (
                     <div className="visual-imagenes">
                         <div className="image-row">
                             <div className="image-card">
                                 <div className="img-wrapper">
                                     <img src={getImagePath(`${info.numeral}.png`)} alt={`Numeral ${info.numeral}`} />
                                 </div>
                                 <span className="label">Numeral {info.numeral}</span>
                             </div>
                             <div className="image-card">
                                 <div className="img-wrapper">
                                     <img src={getImagePath(`${info.symFile}`)} alt={info.symName} />
                                 </div>
                                 <span className="label">Signo: {info.symName}</span>
                             </div>
                         </div>
                         <div className="traditional-name">{info.numeral} - {info.symName}</div>
                     </div>
                 )}
                 <div className="mt-auto text-muted small">
                     Coordenadas: ({info.q}, {info.r})
                 </div>
             </div>
         );
     };
 
     if (loading) {
         return (
             <div className="d-flex justify-content-center align-items-center vh-100">
                 <div className="spinner-border text-primary" role="status">
                     <span className="visually-hidden">Cargando datos del Toro...</span>
                 </div>
             </div>
         );
     }
 
     if (!data) {
         return <div className="alert alert-danger m-5">No se pudieron cargar los datos del toro.</div>;
     }
 
     // Layout de Plotly (similar al HTML)
     const layout = {
         title: {
             text: 'Tonalpohualli - Modelo Toro Interactivo 3D: Z₁₃ ⊕ Z₂₀',
             font: { size: 18, color: '#0F172A', family: 'Arial' },
             x: 0.5,
             y: 0.95
         },
         scene: {
             xaxis: { visible: false },
             yaxis: { visible: false },
             zaxis: { visible: false },
             bgcolor: 'white',
             aspectmode: 'data'
         },
         margin: { l: 10, r: 220, b: 10, t: 90 },
         legend: {
             font: { color: '#0F172A' },
             orientation: 'v',
             yanchor: 'middle',
             y: 0.5,
             xanchor: 'left',
             x: 1.02
         },
         paper_bgcolor: 'white',
         plot_bgcolor: 'white',
         updatemenus: [
             {
                 buttons: [
                     {
                         args: [null, { frame: { duration: speed, redraw: true }, fromcurrent: true, transition: { duration: 0 } }],
                         label: '▶ Play',
                         method: 'animate'
                     },
                     {
                         args: [[null], { frame: { duration: 0, redraw: false }, mode: 'immediate', transition: { duration: 0 } }],
                         label: '⏸ Pause',
                         method: 'animate'
                     }
                 ],
                 direction: 'left',
                 pad: { r: 10, t: 10 },
                 showactive: false,
                 type: 'buttons',
                 x: 0.15,
                 xanchor: 'right',
                 y: 1.12,
                 yanchor: 'top'
             },
             {
                 buttons: [
                     {
                         args: [{ mode: 'markers' }, [1, 2, 3, 4, 5, 6]],
                         label: 'Ocultar Coordenadas',
                         method: 'restyle'
                     },
                     {
                         args: [{ mode: ['markers', 'markers', 'markers+text', 'markers+text', 'markers+text', 'markers+text'] }, [1, 2, 3, 4, 5, 6]],
                         label: 'Mostrar Solo Destacados',
                         method: 'restyle'
                     },
                     {
                         args: [{ mode: 'markers+text' }, [1, 2, 3, 4, 5, 6]],
                         label: 'Mostrar Todas las Coordenadas',
                         method: 'restyle'
                     }
                 ],
                 direction: 'down',
                 pad: { r: 10, t: 10 },
                 showactive: true,
                 type: 'buttons',
                 x: 0.95,
                 xanchor: 'right',
                 y: 1.12,
                 yanchor: 'top'
             }
         ],
         sliders: [
             {
                 active: 0,
                 currentvalue: {
                     font: { color: '#0F172A', size: 14 },
                     prefix: 'Día Actual (n): ',
                     visible: true,
                     xanchor: 'right'
                 },
                 len: 0.9,
                 pad: { b: 10, t: 50 },
                 steps: data.days.map((d) => ({
                     args: [[`${d.n}`], { frame: { duration: 0, redraw: true }, mode: 'immediate', transition: { duration: 0 } }],
                     label: `${d.n}`,
                     method: 'animate'
                 })),
                 transition: { duration: 0 },
                 x: 0.05,
                 xanchor: 'left',
                 y: 0,
                 yanchor: 'top'
             }
         ]
     };
 
     return (
         <div className="container-fluid vh-100 d-flex p-0">
             <div className="col-9 position-relative" style={{ height: '100vh' }}>
                 <Plot
                     ref={plotRef}
                     data={getPlotData()}
                     layout={layout}
                     style={{ width: '100%', height: '100%' }}
                     onHover={handleHover}
                     onClick={handleHover}
                     onSliderChange={handleSliderChange}
                     useResizeHandler
                 />
             </div>
             <div className="col-3 bg-light border-start p-4 overflow-auto" style={{ height: '100vh' }}>
                 <h1 className="h4 text-center mb-3">Tonalpohualli</h1>
                 <div className="subtitle text-muted text-center">Toro Interactivo 3D</div>
 
                 <div className="section-label">Representación</div>
                 <div className="selector-container mb-3">
                     <button className={`selector-btn ${repMode === 'numeros' ? 'active' : ''}`} onClick={() => handleRepChange('numeros')}>Números (q, r)</button>
                     <button className={`selector-btn ${repMode === 'imagenes' ? 'active' : ''}`} onClick={() => handleRepChange('imagenes')}>(Numeral, Glifo)</button>
                 </div>
 
                 <div className="section-label">Modo de Seguimiento</div>
                 <div className="selector-container mb-3">
                     <button className={`selector-btn ${followMode === 'cursor' ? 'active' : ''}`} onClick={() => handleFollowChange('cursor')}>Al Señalar</button>
                     <button className={`selector-btn ${followMode === 'trayectoria' ? 'active' : ''}`} onClick={() => handleFollowChange('trayectoria')}>Al Animar</button>
                 </div>
 
                 <div className="section-label">Velocidad de Animación</div>
                 <div className="speed-control mb-3">
                     <div className="d-flex justify-content-between">
                         <span className="small text-muted">Intervalo:</span>
                         <span className="small fw-bold text-primary">{speed} ms</span>
                     </div>
                     <input type="range" className="form-range" min="100" max="1500" step="50" value={speed} onChange={handleSpeedChange} />
                     <div className="d-flex justify-content-between small text-muted">
                         <span>Rápido (100ms)</span>
                         <span>Lento (1500ms)</span>
                     </div>
                 </div>
 
                 <div className="section-label">Información del día</div>
                 <div className="card bg-white shadow-sm p-3 h-50">
                     {renderSidebar()}
                 </div>
                 <div className="footer-help text-center mt-3 small text-muted">
                     Gira el Toro con el mouse para explorarlo en 3D.
                 </div>
             </div>
         </div> */
    // );
    /* return (
        <div style={{ width: '100%', height: '100vh' }}>
            <iframe
                src="../../../public/toro_animacion_3d_v3.6html"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Tonalpohualli 3D"
            />
        </div>
    ); */
};


export default Toro;