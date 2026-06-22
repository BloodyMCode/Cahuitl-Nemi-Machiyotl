import React, { useState, useEffect, useRef, useCallback } from 'react';
// Importa plotly.js y la función factory
/* import * as Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);
import toroData from '../data/toroData.json'; */
// Importar el archivo Python como texto plano usando '?raw' de Vite
import pythonCode from '../python/toro_animacion_3d_v3.6.py?raw';
import { getImagePath } from '../funtions/funtions';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Toro.css';

const Toro = () => {

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