import React, { useState, useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import _reactPlotly from 'react-plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
// Cargar el JSON de datos geométricos
import toroData from '../data/toroData.json';
import MenuLat from './MenuLat';
import { useTheme } from '../../context/ThemeContext';
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
    base: '#64748B'            // Regular / Gris Base'
};
const TRACE_KEYS = ['base', 'familia_q_1', 'tlahuiztlanpa', 'huitztlanpa', 'cihuatlanpa', 'mictlanpa'];

// Generación estática de la superficie del Toro (Traza 0)
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
    opacity: 0.12,
    colorscale: 'Jet',
    showscale: false,
    hoverinfo: 'skip'
};

// Pasos estáticos para el slider inferior de Plotly
const slidersSteps = toroData.trajectory.map((_, i) => ({
    label: (i + 1).toString(),
    method: 'skip'
}));
// --- COMPONENTE LÓGICO CON CAMBIO DE COLOR EXACTO EN EL VÉRTICE ---
// --- NUEVA LOGICA: TRAZAS DE TRAYECTORIA SEPARADAS POR RUMBO (ELIMINA DEGRADADOS) ---
const getRumboSegments = (maxDay) => {
    const segments = { tlahuiztlanpa: [], huitztlanpa: [], cihuatlanpa: [], mictlanpa: [] };
    const activeTrajectory = toroData.trajectory.slice(0, maxDay);

    let currentRumbo = null;

    // 1. Encontrar el rumbo inicial real de la trayectoria activa
    for (let i = 0; i < activeTrajectory.length; i++) {
        const pt = toroData.points[activeTrajectory[i].n];
        if (pt && ['tlahuiztlanpa', 'huitztlanpa', 'cihuatlanpa', 'mictlanpa'].includes(pt.classKey)) {
            currentRumbo = pt.classKey;
            break;
        }
    }
    if (!currentRumbo) currentRumbo = 'tlahuiztlanpa';

    // 2. Construir trayectorias insertando rupturas nulas (null) para levantar el lápiz de Plotly
    for (let i = 0; i < activeTrajectory.length; i++) {
        const t = activeTrajectory[i];
        const pt = toroData.points[t.n];

        if (pt && ['tlahuiztlanpa', 'huitztlanpa', 'cihuatlanpa', 'mictlanpa'].includes(pt.classKey)) {

            // Si hay un cambio de rumbo auténtico
            if (pt.classKey !== currentRumbo) {
                // A) Cerramos de forma exacta el vértice en el rumbo anterior
                if (segments[currentRumbo] && segments[currentRumbo].length > 0) {
                    segments[currentRumbo].push(t);

                    // B) ¡SOLUCIÓN CRUCIAL!: Insertamos un nodo null en el rumbo que se apaga.
                    // Esto le dice a Plotly: "Cuando este color vuelva a abrirse en el futuro, NO lo unas con este punto".
                    segments[currentRumbo].push({ x: null, y: null, z: null, n: null });
                }

                // Cambiamos al nuevo rumbo
                currentRumbo = pt.classKey;
            }
        }

        // Añadimos el punto al rumbo que está corriendo actualmente
        if (segments[currentRumbo]) {
            segments[currentRumbo].push(t);
        }
    }

    return segments;
};

const Toro = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // --- ESTADOS ORIGINALES DE LA APLICACIÓN ---
    const [currentRepresentation, setCurrentRepresentation] = useState('numeros'); // 'numeros' | 'imagenes'
    const [followMode, setFollowMode] = useState('cursor'); // 'cursor' | 'trayectoria'
    const [speed, setSpeed] = useState(300); // ms por intervalo
    const [activeDayData, setActiveDayData] = useState(() => {
        const data = toroData.points[1];
        return data ? { day: 1, ...data } : null;
    });

    const plotRef = useRef(null);
    const plotAreaRef = useRef(null); // Referencia al contenedor principal del Plot
    const followModeRef = useRef('cursor');
    const representationRef = useRef('numeros');
    const [labelsVisibility, setLabelsVisibility] = useState('none'); // O 'none'/'all' según tu valor inicial por defecto
    // --- ESTADOS DE CONTROL CRÍTICOS (SIN RETRASOS) ---
    const currentDayRef = useRef(1); // Siempre inicia en el día 1 al montar por primera vez (cambios de menú)
    const isAnimatingRef = useRef(false);
    const animationIntervalRef = useRef(null);

    // Actualiza la barra lateral según el día actual activo del sistema
    const updateSidebar = (day) => {
        const data = toroData.points[day];
        if (data) {
            setActiveDayData({ day, ...data });
        }
    };
    // Guardamos la revisión de la interfaz para persistir la cámara
    //const [uiRevision, setUiRevision] = useState('true');
    // --- REFERENCIA PERSISTENTE PARA DETENER EL MOVIMIENTO DE CÁMARA DE PLOTLY ---
    const layout = useMemo(() => ({
        uirevision: 'toro-view', // Firma inmutable global
        paper_bgcolor: '#F8FAFC',
        plot_bgcolor: '#F8FAFC',
        margin: { l: 10, r: 10, b: 10, t: 10 }, // ↑ Aumentado de 70 a 120 para dar espacio arriba
        scene: {
            xaxis: { visible: false },
            yaxis: { visible: false },
            zaxis: { visible: false },
            bgcolor: '#FFFFFF',
            aspectmode: 'data',
            uirevision: 'toro-view', // Firma inmutable de la escena 3D
            camera: {} // Aquí Plotly almacenará dinámicamente tu rotación/zoom
        },
        showlegend: false,
        // Configuración de la barra
        modebar: {
            orientation: 'h',
            bgcolor: 'transparent', // Al hacerlo transparente, el diseño se vuelve más limpio con la nota flotante
            color: '#94A3B8',       // Color de iconos inactivos
            activecolor: '#383b44ff'   // Color azul al activarse
        },
        sliders: [{
            active: 0,
            yanchor: 'top', // ↑ Cambiado de 'top' a 'bottom' para alineación superior
            xanchor: 'left',
            currentvalue: { font: { size: 13, color: '#0284C7' }, prefix: 'Día Actual (n): ', visible: true, xanchor: 'right' },
            transition: { duration: 0 },
            pad: { b: 10, t: 10 }, // Ajustado el espaciado
            len: 0.9,
            x: 0.05,
            y: 0, // ↑ Cambiado de 0 a 1.12 para posicionarlo por encima del área de renderizado
            font: { color: '#475569', size: 10 }, bgcolor: '#E2E8F0', bordercolor: '#CBD5E1',
            steps: slidersSteps
        }]
    }), []);
    const layoutRef = useRef(layout);
    /* const layoutRef = useRef({
        uirevision: 'toro-view', // Firma inmutable global
        paper_bgcolor: '#F8FAFC',
        plot_bgcolor: '#F8FAFC',
        margin: { l: 10, r: 10, b: 10, t: 70 },
        scene: {
            xaxis: { visible: false },
            yaxis: { visible: false },
            zaxis: { visible: false },
            bgcolor: '#FFFFFF',
            aspectmode: 'data',
            uirevision: 'toro-view', // Firma inmutable de la escena 3D
            camera: {} // Aquí Plotly almacenará dinámicamente tu rotación/zoom
        },
        showlegend: false,
        sliders: [{
            active: 0,
            yanchor: 'top', xanchor: 'left',
            currentvalue: { font: { size: 13, color: '#0284C7' }, prefix: 'Día Actual (n): ', visible: true, xanchor: 'right' },
            transition: { duration: 0 },
            pad: { b: 10, t: 40 }, len: 0.9, x: 0.05, y: 0,
            font: { color: '#475569', size: 10 }, bgcolor: '#E2E8F0', bordercolor: '#CBD5E1',
            steps: slidersSteps
        }]
    }); */
    // Sincronizar la referencia del modo de seguimiento para los eventos nativos de Plotly
    useEffect(() => {
        followModeRef.current = followMode;
    }, [followMode]);

    useEffect(() => {
        representationRef.current = currentRepresentation;
    }, [currentRepresentation]);

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
        // REGLA: Al cambiar de pestaña de menú y regresar, inicia estrictamente en el Día 1
        currentDayRef.current = 1;
        // Limpieza de intervalos al desmontar el componente (salir de la pestaña del Toro)
        return () => {
            if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
        };
    }, []);

    // --- CORRECCIÓN: REDIMENSIONAMIENTO AUTOMÁTICO AL MOSTRAR LA VISTA ---
    useEffect(() => {
        const timer = setTimeout(() => {
            const plotDiv = plotRef.current?.el;
            if (plotDiv) {
                Plotly.Plots.resize(plotDiv);
            }
        }, 100);

        let resizeObserver;
        if (plotAreaRef.current) {
            resizeObserver = new ResizeObserver(() => {
                const plotDiv = plotRef.current?.el;
                if (plotDiv) {
                    Plotly.Plots.resize(plotDiv);
                }
            });
            resizeObserver.observe(plotAreaRef.current);
        }

        return () => {
            clearTimeout(timer);
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, []);

    // --- REFERENCIAS DE CONTROL DE ALTA VELOCIDAD Y RELOJ DE GPU ---
    const lastFrameTimeRef = useRef(0);
    const animationFrameIdRef = useRef(null);
    const isUserInteractingRef = useRef(false); // <-- Detecta si el usuario está moviendo el Toro
    // ============================================================================
    // 3. MOTOR NATIVO ULTRA FLUIDO CON PLOTLY.REACT (PRESERVA CÁMÁRA TOTAL)
    // ============================================================================
    const runFrameStep = (timestamp) => {
        if (!isAnimatingRef.current) return;

        const plotDiv = plotRef.current?.el;
        if (!plotDiv) {
            animationFrameIdRef.current = requestAnimationFrame(runFrameStep);
            return;
        }

        // ====================================================================
        // OPTIMIZACIÓN SUPREMA: SI EL USUARIO MUEVE EL MOUSE, LE DAMOS PRIORIDAD ABSOLUTA
        // ====================================================================
        if (isUserInteractingRef.current) {
            // No hacemos ningún cálculo matemático ni restyle, dejamos que WebGL rote a máxima velocidad
            lastFrameTimeRef.current = timestamp; // Reseteamos el reloj para que no dé un brinco al soltarlo
            animationFrameIdRef.current = requestAnimationFrame(runFrameStep);
            return;
        }

        if (!lastFrameTimeRef.current) lastFrameTimeRef.current = timestamp;
        const elapsed = timestamp - lastFrameTimeRef.current;

        if (elapsed >= speed) {
            lastFrameTimeRef.current = timestamp;

            const totalPoints = toroData.trajectory.length;
            if (currentDayRef.current >= totalPoints) {
                handlePause();
                return;
            }

            currentDayRef.current += 1;
            const targetDay = currentDayRef.current;

            const currentPt = toroData.trajectory[targetDay - 1];
            const ptMeta = toroData.points[currentPt.n];

            const textLabel = representationRef.current === 'numeros'
                ? `(${ptMeta.q},${ptMeta.r})`
                : `${ptMeta.numeral}-${ptMeta.symName}`;

            const segments = getRumboSegments(targetDay);

            // Capturar cámara actual para mantener consistencia
            const currentCamera = plotDiv._fullLayout?.scene?.camera || plotDiv.layout?.scene?.camera;
            if (currentCamera) {
                layoutRef.current.scene.camera = {
                    up: { x: currentCamera.up.x, y: currentCamera.up.y, z: currentCamera.up.z },
                    center: { x: currentCamera.center.x, y: currentCamera.center.y, z: currentCamera.center.z },
                    eye: { x: currentCamera.eye.x, y: currentCamera.eye.y, z: currentCamera.eye.z }
                };
            }

            // Inyección ultra rápida de coordenadas en VRAM
            Plotly.restyle(plotDiv, {
                x: [
                    segments.tlahuiztlanpa.map(s => s.x),
                    segments.huitztlanpa.map(s => s.x),
                    segments.cihuatlanpa.map(s => s.x),
                    segments.mictlanpa.map(s => s.x),
                    [currentPt.x]
                ],
                y: [
                    segments.tlahuiztlanpa.map(s => s.y),
                    segments.huitztlanpa.map(s => s.y),
                    segments.cihuatlanpa.map(s => s.y),
                    segments.mictlanpa.map(s => s.y),
                    [currentPt.y]
                ],
                z: [
                    // segments.tlahuiztlanpa.map(s => s.z),
                    segments.tlahuiztlanpa.map(s => s.z),
                    segments.huitztlanpa.map(s => s.z),
                    segments.cihuatlanpa.map(s => s.z),
                    segments.mictlanpa.map(s => s.z),
                    [currentPt.z]
                ],
                text: [null, null, null, null, [textLabel]],
                // AGREGA ESTA LÍNEA para el tamaño del texto del marcador rojo en movimiento:
                'textfont.size': [null, null, null, null, [representationRef.current === 'numeros' ? 13 : 18]]
            }, [7, 8, 9, 10, 11]);

            layoutRef.current.sliders[0].active = targetDay - 1;
            Plotly.relayout(plotDiv, {
                'sliders[0].active': targetDay - 1,
                'scene.camera': layoutRef.current.scene.camera
            });

            if (followModeRef.current === 'trayectoria') {
                updateSidebar(targetDay);
            }
        }

        animationFrameIdRef.current = requestAnimationFrame(runFrameStep);
    };

    const handlePlay = () => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        lastFrameTimeRef.current = 0;
        animationFrameIdRef.current = requestAnimationFrame(runFrameStep);
    };

    const handlePause = () => {
        isAnimatingRef.current = false;
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }

        // Al pausar, sincronizamos forzadamente el slider en su posición exacta final
        const plotDiv = plotRef.current?.el;
        if (plotDiv) {
            layoutRef.current.sliders[0].active = currentDayRef.current - 1;
            Plotly.relayout(plotDiv, { 'sliders[0].active': currentDayRef.current - 1 });
        }
    };
    /*  const runFrameStep = () => {
         const plotDiv = plotRef.current?.el;
         if (!plotDiv) return;
 
         const totalPoints = toroData.trajectory.length;
         if (currentDayRef.current >= totalPoints) {
             handlePause();
             return;
         }
 
         currentDayRef.current += 1;
         const targetDay = currentDayRef.current;
 
         const currentPt = toroData.trajectory[targetDay - 1];
         const ptMeta = toroData.points[currentPt.n];
 
         const textLabel = representationRef.current === 'numeros'
             ? `(${ptMeta.q},${ptMeta.r})`
             : `${ptMeta.numeral}-${ptMeta.symName}`;
 
         const segments = getRumboSegments(targetDay);
 
         // EXTRAER LA CÁMARA ACTUAL MODIFICADA POR EL USUARIO (EVITA EL RESETEO)
         if (plotDiv.layout && plotDiv.layout.scene && plotDiv.layout.scene.camera) {
             layoutRef.current.scene.camera = plotDiv.layout.scene.camera;
         }
 
         // Actualizar la posición del slider nativo en la referencia
         layoutRef.current.sliders[0].active = targetDay - 1;
 
         // Clonamos superficialmente las trazas actuales en memoria de Plotly
         const updatedData = [...plotDiv.data];
 
         // Reemplazo directo de vectores WebGL (Trazas de trayectoria 7 a 10 y tracer 11)
         updatedData[7] = { ...updatedData[7], x: segments.tlahuiztlanpa.map(s => s.x), y: segments.tlahuiztlanpa.map(s => s.y), z: segments.tlahuiztlanpa.map(s => s.z) };
         updatedData[8] = { ...updatedData[8], x: segments.huitztlanpa.map(s => s.x), y: segments.huitztlanpa.map(s => s.y), z: segments.huitztlanpa.map(s => s.z) };
         updatedData[9] = { ...updatedData[9], x: segments.cihuatlanpa.map(s => s.x), y: segments.cihuatlanpa.map(s => s.y), z: segments.cihuatlanpa.map(s => s.z) };
         updatedData[10] = { ...updatedData[10], x: segments.mictlanpa.map(s => s.x), y: segments.mictlanpa.map(s => s.y), z: segments.mictlanpa.map(s => s.z) };
         updatedData[11] = { ...updatedData[11], x: [currentPt.x], y: [currentPt.y], z: [currentPt.z], text: [textLabel] };
 
         // Plotly.react refresca las coordenadas WebGL respetando la posición exacta guardada en layoutRef
         Plotly.react(plotDiv, updatedData, layoutRef.current);
 
         if (isAnimatingRef.current || followModeRef.current === 'trayectoria') {
             updateSidebar(targetDay);
         }
     };
 
     const handlePlay = () => {
         if (isAnimatingRef.current) return;
         isAnimatingRef.current = true;
         // Bucle de temporización de alta precisión basado en la velocidad (speed) seleccionada
         animationIntervalRef.current = setInterval(runFrameStep, speed);
     };
 
     const handlePause = () => {
         isAnimatingRef.current = false;
         if (animationIntervalRef.current) {
             clearInterval(animationIntervalRef.current);
             animationIntervalRef.current = null;
         }
     }; */

    // --- ESCUCHA DE EVENTOS NATIVOS MEJORADA ---
    // Vincular detectores de eventos nativos de Plotly.js para interactividad sin lag
    const bindPlotlyEvents = (el) => {
        el.removeAllListeners?.('plotly_hover');
        el.removeAllListeners?.('plotly_click');
        el.removeAllListeners?.('plotly_sliderchange');
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
            if (data.step && data.step.label && !isAnimatingRef.current) {
                const day = parseInt(data.step.label);
                if (!isNaN(day)) {
                    currentDayRef.current = day;
                    updateSidebar(day);

                    const currentPt = toroData.trajectory[day - 1];
                    const ptMeta = toroData.points[currentPt.n];
                    const textLabel = representationRef.current === 'numeros' ? `(${ptMeta.q},${ptMeta.r})` : `${ptMeta.numeral}-${ptMeta.symName}`;
                    const segments = getRumboSegments(day);

                    if (el.layout && el.layout.scene && el.layout.scene.camera) {
                        layoutRef.current.scene.camera = el.layout.scene.camera;
                    }
                    layoutRef.current.sliders[0].active = day - 1;

                    const updatedData = [...el.data];
                    updatedData[7] = { ...updatedData[7], x: segments.tlahuiztlanpa.map(s => s.x), y: segments.tlahuiztlanpa.map(s => s.y), z: segments.tlahuiztlanpa.map(s => s.z) };
                    updatedData[8] = { ...updatedData[8], x: segments.huitztlanpa.map(s => s.x), y: segments.huitztlanpa.map(s => s.y), z: segments.huitztlanpa.map(s => s.z) };
                    updatedData[9] = { ...updatedData[9], x: segments.cihuatlanpa.map(s => s.x), y: segments.cihuatlanpa.map(s => s.y), z: segments.cihuatlanpa.map(s => s.z) };
                    updatedData[10] = { ...updatedData[10], x: segments.mictlanpa.map(s => s.x), y: segments.mictlanpa.map(s => s.y), z: segments.mictlanpa.map(s => s.z) };
                    updatedData[11] = {
                        ...updatedData[11], x: [[currentPt.x]], y: [[currentPt.y]], z: [[currentPt.z]], text: [[textLabel]],
                        // AGREGA ESTA PROPIEDAD:
                        textfont: { ...updatedData[11].textfont, size: representationRef.current === 'numeros' ? 13 : 18 }
                    };

                    Plotly.react(el, updatedData, layoutRef.current);
                }
            }
        });
        // === CAPTURA DE INTERACCIÓN DE ALTA SENSIBILIDAD ===
        const glContainer = el.querySelector('.glcontainer');
        if (glContainer) {
            // Captura inicio de rotación o arrastre
            glContainer.onmousedown = () => {
                isUserInteractingRef.current = true;
            };

            // Captura zoom con la rueda del mouse de forma inmediata
            glContainer.onwheel = () => {
                isUserInteractingRef.current = true;
                // Pequeño timeout para volver a habilitar la animación cuando dejes de usar la rueda
                clearTimeout(glContainer.wheelTimeout);
                glContainer.wheelTimeout = setTimeout(() => {
                    isUserInteractingRef.current = false;
                }, 150);
            };

            // Liberación del control
            glContainer.onmouseup = () => {
                isUserInteractingRef.current = false;
            };
            glContainer.onmouseleave = () => {
                isUserInteractingRef.current = false;
            };
        }
    };
    // ============================================================================
    // 4. CONSTRUCCIÓN DE LAS TRAZAS ESTRUCTURALES DEL ENTORNO
    // ============================================================================
    const catContainers = {
        base: { x: [], y: [], z: [], text_num: [], text_img: [], hover: [], n: [], size: 5, color: '#94A3B8', symbol: 'circle', name: 'Día Regular' },
        familia_q_1: { x: [], y: [], z: [], text_num: [], text_img: [], hover: [], n: [], size: 7, color: '#00B5B5', symbol: 'diamond', name: 'Inicio Veintena' },
        tlahuiztlanpa: { x: [], y: [], z: [], text_num: [], text_img: [], hover: [], n: [], size: 9, color: RUMBO_COLORS.tlahuiztlanpa, symbol: 'circle', name: 'Tlahuiztlanpa (Oriente)' },
        huitztlanpa: { x: [], y: [], z: [], text_num: [], text_img: [], hover: [], n: [], size: 9, color: RUMBO_COLORS.huitztlanpa, symbol: 'circle', name: 'Huitztlanpa (Sur)' },
        cihuatlanpa: { x: [], y: [], z: [], text_num: [], text_img: [], hover: [], n: [], size: 9, color: RUMBO_COLORS.cihuatlanpa, symbol: 'circle', name: 'Cihuatlanpa (Poniente)' },
        mictlanpa: { x: [], y: [], z: [], text_num: [], text_img: [], hover: [], n: [], size: 9, color: RUMBO_COLORS.mictlanpa, symbol: 'circle', name: 'Mictlanpa (Norte)' }
    };

    // Distribuir la data geométrica dentro de las 6 categorías estructurales
    toroData.trajectory.forEach((t) => {
        const pt = toroData.points[t.n];
        const container = catContainers[pt.classKey] || catContainers.base;
        container.x.push(t.x); container.y.push(t.y); container.z.push(t.z); container.n.push(t.n);
        container.text_num.push(`(${pt.q},${pt.r})`);
        container.text_img.push(`${pt.numeral}-${pt.symName}`);
        container.hover.push(`Día n=${t.n}<br>Tonal: ${pt.numeral} ${pt.symName}<br>Coord: (${pt.q},${pt.r})`);
    });

    const categoryTraces = TRACE_KEYS.map((cat_key) => {
        const cat = catContainers[cat_key];
        const isBase = cat_key === 'base';
        // Asignación dinámica del modo de marcadores
        // 1. El modo SIEMPRE tiene texto asignado para mantener los búferes de la GPU listos
        const traceMode = 'markers+text';
        // 2. Controlamos la visibilidad mediante el COLOR (Transparente o Visible)
        let textColor = 'rgba(0,0,0,0)'; // Por defecto invisible / transparente
        if (labelsVisibility === 'all') {
            textColor = '#334155'; // Visible para todos
        } else if (labelsVisibility === 'highlights') {
            // Visible solo para los 4 rumbos destacados (excluyendo base y familia_q_1)
            textColor = ['base', 'familia_q_1'].includes(cat_key) ? 'rgba(0,0,0,0)' : '#334155';
        }
        return {
            type: 'scatter3d',
            x: cat.x, y: cat.y, z: cat.z,
            mode: traceMode,
            marker: {
                size: cat.size, color: cat.color, symbol: cat.symbol,
                line: { color: isBase ? '#E2E8F0' : '#0F172A', width: isBase ? 0.5 : 1 }
            },
            // Mantiene la consistencia inicial o al redibujar
            text: currentRepresentation === 'numeros' ? cat.text_num : cat.text_img,
            textposition: 'top center',
            textfont: {
                color: textColor,
                //size: 11,
                size: currentRepresentation === 'numeros'
                    ? (['base', 'familia_q_1'].includes(cat_key) ? 13 : 13)
                    : (['base', 'familia_q_1'].includes(cat_key) ? 18 : 18),
                family: 'Arial, sans-serif'
            },
            hovertext: cat.hover,
            customdata: cat.n,
            name: cat.name
        };
    });

    // --- TRAZO 7: RASTRO (TRAIL) ANIMADO ---
    // CORRECCIÓN: Garantizar que tengan arrays con el origen inicial estructurado desde el día 1
    // --- CONFIGURACIÓN DE TRAZA DE RECORRIDO MULTICOLOR ---
    // Carga inicial estática de las 4 trazas independientes de rumbo
    const initialSegments = getRumboSegments(currentDayRef.current);
    const initialPt = toroData.trajectory[currentDayRef.current - 1] || toroData.trajectory[0];
    const initialMeta = toroData.points[initialPt.n];

    const trailTraces = [
        { type: 'scatter3d', mode: 'lines', name: 'Trayectoria Oriente', hoverinfo: 'skip', opacity: 1.0, x: initialSegments.tlahuiztlanpa.map(s => s.x), y: initialSegments.tlahuiztlanpa.map(s => s.y), z: initialSegments.tlahuiztlanpa.map(s => s.z), line: { color: RUMBO_COLORS.tlahuiztlanpa, width: 5.5 } },
        { type: 'scatter3d', mode: 'lines', name: 'Trayectoria Sur', hoverinfo: 'skip', opacity: 1.0, x: initialSegments.huitztlanpa.map(s => s.x), y: initialSegments.huitztlanpa.map(s => s.y), z: initialSegments.huitztlanpa.map(s => s.z), line: { color: RUMBO_COLORS.huitztlanpa, width: 5.5 } },
        { type: 'scatter3d', mode: 'lines', name: 'Trayectoria Poniente', hoverinfo: 'skip', opacity: 1.0, x: initialSegments.cihuatlanpa.map(s => s.x), y: initialSegments.cihuatlanpa.map(s => s.y), z: initialSegments.cihuatlanpa.map(s => s.z), line: { color: RUMBO_COLORS.cihuatlanpa, width: 5.5 } },
        { type: 'scatter3d', mode: 'lines', name: 'Trayectoria Norte', hoverinfo: 'skip', opacity: 1.0, x: initialSegments.mictlanpa.map(s => s.x), y: initialSegments.mictlanpa.map(s => s.y), z: initialSegments.mictlanpa.map(s => s.z), line: { color: RUMBO_COLORS.mictlanpa, width: 5.5 } }
    ];

    // --- TRAZO 8: GENERADOR ACTIVO (TRACER) ANIMADO ---
    const tracerTrace = {
        type: 'scatter3d',
        x: [initialPt.x], y: [initialPt.y], z: [initialPt.z],
        mode: 'markers+text',
        marker: { size: 10, color: '#EF4444', symbol: 'circle', line: { color: '#FFFFFF', width: 1.5 } },
        text: [currentRepresentation === 'numeros' ? `(${initialMeta.q},${initialMeta.r})` : `${initialMeta.numeral}-${initialMeta.symName}`],
        textposition: 'top center',
        textfont: { color: '#022249ff', size: 12, family: 'Arial, sans-serif' },
        name: 'Generador Activo',
        hoverinfo: 'skip'
    };

    // --- ACCIONES UI ---
    // Métodos dinámicos para acoplar selectores de HTML con los métodos nativos de Plotly Restyle
    const toggleLabelsRepresentation = (mode) => {
        setCurrentRepresentation(mode);
        const plotDiv = plotRef.current?.el;
        if (!plotDiv) return;

        const textMatrix = TRACE_KEYS.map((key) => catContainers[key][mode === 'numeros' ? 'text_num' : 'text_img']);

        // DEFINIR TAMAÑOS PERSONALIZADOS POR TRAZA (Índices del 1 al 6)
        // El orden corresponde a: [base, familia_q_1, tlahuiztlanpa, huitztlanpa,     cihuatlanpa, mictlanpa]
        const fontSizes = mode === 'numeros'
            ? [10, 10, 11, 11, 11, 11]  // Tamaños sutiles para números (q, r)
            : [12, 13, 16, 16, 16, 16]; // ¡Aquí le damos tamaño 16 a los 4 rumbos (inicios     de trecena)!

        // Cambiar etiquetas de fondo con sus respectivos tamaños
        Plotly.restyle(plotDiv, {
            text: textMatrix,
            'textfont.size': fontSizes
        }, [1, 2, 3, 4, 5, 6]);

        // Cambiar la etiqueta del generador dinámico actual (Tracer)
        const currentPtData = toroData.trajectory[currentDayRef.current - 1];
        if (currentPtData) {
            const currentMeta = toroData.points[currentPtData.n];
            if (currentMeta) {
                const updatedLabel = mode === 'numeros' ? `(${currentMeta.q},${currentMeta.r})` : `${currentMeta.numeral}-${currentMeta.symName}`;
                Plotly.restyle(plotDiv, {
                    text: [[updatedLabel]],
                    'textfont.size': mode === 'numeros' ? 13 : 18
                }, [11]);
            }
        }
    };
    /* const toggleLabelsRepresentation = (mode) => {
        setCurrentRepresentation(mode);
        const plotDiv = plotRef.current?.el;
        if (!plotDiv) return;

        const textMatrix = TRACE_KEYS.map((key) => catContainers[key][mode === 'numeros' ? 'text_num' : 'text_img']);
        // Cambiar etiquetas de fondo
        Plotly.restyle(plotDiv, { text: textMatrix, 'textfont.size': mode === 'numeros' ? 10 : 13 }, [1, 2, 3, 4, 5, 6]);
        // Cambiar la etiqueta del generador dinámico actual inmediatamente sin frenar el intervalo
        const currentPtData = toroData.trajectory[currentDayRef.current - 1];
        const currentMeta = toroData.points[currentPtData.n];
        const updatedLabel = mode === 'numeros' ? `(${currentMeta.q},${currentMeta.r})` : `${currentMeta.numeral}-${currentMeta.symName}`;
        Plotly.restyle(plotDiv, { text: [[updatedLabel]] }, [11]);
    }; *//*  */

    const toggleLabelsVisibility = (visibilityMode) => {
        setLabelsVisibility(visibilityMode); // Guarda el estado en React para el select

        const plotDiv = plotRef.current?.el;
        if (!plotDiv) return;

        // Índices exactos de tus 6 categoryTraces en el array de Plotly
        const targetIndices = [1, 2, 3, 4, 5, 6];

        if (visibilityMode === 'none') {
            // Oculta el texto de todas las trazas volviéndolo transparente al instante
            Plotly.restyle(plotDiv, { 'textfont.color': 'rgba(0,0,0,0)' }, targetIndices);
        }
        else if (visibilityMode === 'highlights') {
            // Índices 1 y 2 (Base e inicio veintena) invisibles. Índices 3, 4, 5 y 6 visibles.
            const colorsArray = ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', '#334155', '#334155', '#334155', '#334155'];
            Plotly.restyle(plotDiv, { 'textfont.color': colorsArray }, targetIndices);
        }
        else if (visibilityMode === 'all') {
            // Regresa el color gris a todas las etiquetas sin alterar WebGL
            Plotly.restyle(plotDiv, { 'textfont.color': '#334155' }, targetIndices);
        }
    };

    /* const toggleLabelsVisibility = (visibilityMode) => {
        setLabelsVisibility(visibilityMode); // <-- Añade esto para actualizar el estado del select
        const plotDiv = plotRef.current?.el;
        if (!plotDiv) return;

        // Determinamos el modo string único en lugar de un array para inyectarlo directo en     bloque
        let targetMode = 'markers';
        let targetIndices = [1, 2, 3, 4, 5, 6]; // Índices de tus categoryTraces

        if (visibilityMode === 'all') {
            targetMode = 'markers+text';
        } else if (visibilityMode === 'highlights') {
            // Para "Destacados", separamos la ejecución en dos operaciones atómicas rápidas:
            // Traza 1 y 2 (Base e Inicio Veintena) van sin texto.
            Plotly.restyle(plotDiv, { mode: 'markers' }, [1, 2]);
            // Traza 3, 4, 5 y 6 (Los 4 rumbos) van con texto.
            Plotly.restyle(plotDiv, { mode: 'markers+text' }, [3, 4, 5, 6]);
            return; // Salimos temprano ya que cubrimos ambos casos
        }

        // Al pasar un valor plano (ej: 'markers') y la lista de índices, 
        // Plotly lo aplica en VRAM a todas las trazas en paralelo en un solo ciclo de reloj.
        Plotly.restyle(plotDiv, { mode: targetMode }, targetIndices);
    }; */

    /* const toggleLabelsVisibility = (visibilityMode) => {
        const plotDiv = plotRef.current?.el;
        if (!plotDiv) return;
        let modesArray = [];
        if (visibilityMode === 'none') modesArray = Array(6).fill('markers');
        else if (visibilityMode === 'highlights') modesArray = ['markers', 'markers', 'markers+text', 'markers+text', 'markers+text', 'markers+text'];
        else modesArray = Array(6).fill('markers+text');
        Plotly.restyle(plotDiv, { mode: modesArray }, [1, 2, 3, 4, 5, 6]);
    }; */

    const updatePlaySpeed = (val) => {
        const newSpeed = parseInt(val);
        setSpeed(newSpeed);
        if (isAnimatingRef.current) {
            // Si está reproduciendo, reinicia el intervalo al vuelo con el nuevo tiempo para evitar cortes
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = setInterval(runFrameStep, newSpeed);
        }
    };
    // CORRECCIÓN: Manejar el cambio de modo asegurando la conmutación de estado en React
    /*  const handleFollowModeChange = (mode) => {
         setFollowMode(mode);
         if (mode === 'trayectoria') {
             const plotDiv = plotRef.current?.el;
             if (plotDiv?.layout?.sliders?.[0]) {
                 const activeStep = plotDiv.layout.sliders[0].active || 0;
                 updateSidebar(activeStep + 1);
             }
         }
     };
  */
    return (
        <div id="app-container" style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: isDark ? '#0F172A' : '#F8FAFC', color: isDark ? '#F8FAFC' : '#0F172A', fontFamily: 'Arial, sans-serif', overflow: 'hidden', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
            {/* INYECCIÓN DEL MENÚ NAVEGACIÓN FLOTANTE IZQUIERDO          */}
            <MenuLat />
            {/* CANVAS INTERACTIVO CLARO */}
            <div id="plot-area" style={{ flex: 1, height: '100%', position: 'relative', backgroundColor: '#F8FAFC' }}>
                <div style={{
                    position: 'absolute',
                    top: '10px',         // Alineado con la altura por defecto del ModeBar
                    right: '240px',      // Ajusta esta distancia según el ancho de los botones de             tu ModeBar
                    zIndex: 10,          // Por encima del canvas de WebGL
                    fontSize: '11px',
                    color: '#64748B',    // Color Slate intermedio
                    fontWeight: '300',
                    fontFamily: 'Arial, sans-serif',
                    pointerEvents: 'none', // Permite que los clics pasen a través del texto si es             necesario
                    backgroundColor: 'rgba(248, 250, 252, 0.85)', // Fondo sutil para que no se             pierda con el toro detrás
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <span style={{ color: '#2563EB' }}>🛈</span> Usa estas herramientas para manipular la cámara 3D cuando la reproducción del gráfico este en pausa→
                </div>
                <Plot
                    ref={plotRef}
                    data={[surfaceTrace, ...categoryTraces, ...trailTraces, tracerTrace]}
                    //layout={layoutRef.current} // Pasamos la referencia persistente directa
                    layout={layout} // Pasamos la referencia reactiva segura
                    config={{
                        responsive: true,
                        displayModeBar: true,
                        displaylogo: false,
                        modeBarButtonsToAdd: ['orbitRotation', 'turntableRotation', 'pan3d', 'zoom3d', 'resetCameraDefault']
                    }}
                    style={{ width: '100%', height: '100%' }}
                    onInitialized={(figure, el) => bindPlotlyEvents(el)}
                    onUpdate={(figure, el) => bindPlotlyEvents(el)}
                />
            </div>

            {/* SIDEBAR TEMA DINÁMICO */}
            <div id="sidebar" style={{
                width: '22%',
                minWidth: '280px',
                maxWidth: '380px',
                height: '100%',
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderLeft: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
                padding: '1.5vh 1.2vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1vh',
                boxSizing: 'border-box',
                overflowY: 'auto',
                transition: 'background-color 0.3s ease, border-color 0.3s ease'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ margin: '0', fontSize: 'clamp(1.7vw, 2.5vh, 24px)', fontWeight: 800, color: isDark ? '#F8FAFC' : '#0F172A', lineHeight: '1.2', transition: 'color 0.3s ease' }}>Tonalpohualli</h1>
                    <div className="subtitle" style={{ fontSize: 'clamp(0.7vw, 1.1vh, 10px)', color: '#64748B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>Toro Interactivo 3D - Modelo Z₁₃ ⊕ Z₂₀</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="section-label" style={{ fontSize: 'clamp(9px, 1.2vh, 11px)', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#475569', marginBottom: '0.4vh', transition: 'color 0.3s ease' }}>Controles de Reproducción</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={handlePlay} style={{ flex: 1, padding: 'clamp(0.9vw, 0.8vh, 8px)', backgroundColor: '#10B981', color: '#0F172A', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: 'clamp(10px, 1.3vh, 12px)' }}>► Play</button>
                        <button onClick={handlePause} style={{ flex: 1, padding: 'clamp(0.9vw, 0.8vh, 8px)', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: 'clamp(10px, 1.3vh, 12px)' }}>⏸ Pause</button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="section-label" style={{ fontSize: 'clamp(9px, 1.2vh, 11px)', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#475569', marginBottom: '0.4vh', transition: 'color 0.3s ease' }}>Representación</div>
                    <div className="selector-container" style={{ display: 'flex', backgroundColor: isDark ? '#0F172A' : '#F1F5F9', borderRadius: '8px', padding: '3px', transition: 'background-color 0.3s ease' }}>
                        <button className={`selector-btn ${currentRepresentation === 'numeros' ? 'active' : ''}`} onClick={() => toggleLabelsRepresentation('numeros')} style={{ flex: 1, padding: 'clamp(0.9vw, 0.7vh, 7px) 3px', fontSize: 'clamp(9px, 1.2vh, 11px)', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: currentRepresentation === 'numeros' ? (isDark ? '#38BDF8' : '#2563EB') : 'transparent', color: currentRepresentation === 'numeros' ? (isDark ? '#0F172A' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'), transition: 'all 0.3s ease' }}>
                            Números (q, r)
                        </button>
                        <button className={`selector-btn ${currentRepresentation === 'imagenes' ? 'active' : ''}`} onClick={() => toggleLabelsRepresentation('imagenes')} style={{ flex: 1, padding: 'clamp(0.9vw, 0.7vh, 7px) 3px', fontSize: 'clamp(9px, 1.2vh, 11px)', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: currentRepresentation === 'imagenes' ? (isDark ? '#38BDF8' : '#2563EB') : 'transparent', color: currentRepresentation === 'imagenes' ? (isDark ? '#0F172A' : '#FFFFFF') : (isDark ? '#94A3B8' : '#64748B'), transition: 'all 0.3s ease' }}>
                            (Numeral, Glifo)
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="section-label" style={{ fontSize: 'clamp(9px, 1.2vh, 11px)', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#475569', marginBottom: '0.4vh', transition: 'color 0.3s ease' }}>Modo de Seguimiento</div>
                    <div className="selector-container" style={{ display: 'flex', backgroundColor: isDark ? '#0F172A' : '#F1F5F9', borderRadius: '8px', padding: '3px', transition: 'background-color 0.3s ease' }}>
                        <button className={`selector-btn ${followMode === 'cursor' ? 'active' : ''}`} onClick={() => setFollowMode('cursor')} style={{ flex: 1, padding: 'clamp(0.9vw, 0.7vh, 7px) 3px', fontSize: 'clamp(9px, 1.2vh, 11px)', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: followMode === 'cursor' ? (isDark ? '#2563EB' : '#1D4ED8') : 'transparent', color: followMode === 'cursor' ? '#F8FAFC' : (isDark ? '#94A3B8' : '#64748B'), transition: 'all 0.3s ease' }}>
                            Al Señalar
                        </button>
                        <button className={`selector-btn ${followMode === 'trayectoria' ? 'active' : ''}`} onClick={() => setFollowMode('trayectoria')} style={{ flex: 1, padding: 'clamp(0.9vw, 0.7vh, 7px) 3px', fontSize: 'clamp(9px, 1.2vh, 11px)', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: followMode === 'trayectoria' ? (isDark ? '#2563EB' : '#1D4ED8') : 'transparent', color: followMode === 'trayectoria' ? '#F8FAFC' : (isDark ? '#94A3B8' : '#64748B'), transition: 'all 0.3s ease' }}>
                            Al Animar
                        </button>
                    </div>
                </div>

                <div id="details-card" style={{
                    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                    borderRadius: '16px',
                    padding: '1.5vh 1.2vw',
                    border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
                    flex: '1 1 28%',
                    minHeight: '135px',
                    maxHeight: '220px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                }}>
                    {activeDayData ? (
                        <div id="details-content" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8vh' }}>
                                <span style={{ fontSize: 'clamp(0.6vw, 1.2vh, 11px)', fontWeight: 800, backgroundColor: isDark ? '#334155' : '#E2E8F0', padding: '2px 10px', borderRadius: '12px', color: isDark ? '#38BDF8' : '#2563EB', fontFamily: 'monospace', transition: 'all 0.3s ease' }}>Día {activeDayData.day}</span>
                                <span style={{ fontSize: 'clamp(0.6vw, 1.1vh, 9px)', fontWeight: 700, textTransform: 'uppercase', padding: '2px 9px', borderRadius: '12px', color: '#0F172A', backgroundColor: RUMBO_COLORS[activeDayData.classKey] || '#FFF' }}>{activeDayData.className}</span>
                            </div>

                            {currentRepresentation === 'numeros' ? (
                                <div className="visual-numeros" style={{ display: 'flex', gap: '8px', flexGrow: 1, alignItems: 'center' }}>
                                    <div style={{ flex: 1, backgroundColor: isDark ? '#1E293B' : '#FFFFFF', border: isDark ? '1px solid #334155' : '1px solid #E2E8F0', borderRadius: '8px', padding: '0.6vh 2px', display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                                        <span style={{ fontSize: 'clamp(3vw, 3.5vh, 28px)', fontWeight: 800, color: isDark ? '#F87171' : '#DC2626', lineHeight: '1.1', transition: 'color 0.3s ease' }}>{activeDayData.q}</span>
                                        <span style={{ fontSize: 'clamp(8px, 1.1vh, 10px)', color: isDark ? '#adb7c6ff' : '#64748B', textTransform: 'uppercase', marginTop: '2px', transition: 'color 0.3s ease' }}>módulo 13</span>
                                    </div>
                                    <div style={{ flex: 1, backgroundColor: isDark ? '#1E293B' : '#FFFFFF', border: isDark ? '1px solid #334155' : '1px solid #E2E8F0', borderRadius: '8px', padding: '0.6vh 2px', display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                                        <span style={{ fontSize: 'clamp(3vw, 3.5vh, 28px)', fontWeight: 800, color: isDark ? '#34D399' : '#16A34A', lineHeight: '1.1', transition: 'color 0.3s ease' }}>{activeDayData.r}</span>
                                        <span style={{ fontSize: 'clamp(8px, 1.1vh, 10px)', color: isDark ? '#adb7c6ff' : '#64748B', textTransform: 'uppercase', marginTop: '2px', transition: 'color 0.3s ease' }}>módulo 20</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="visual-imagenes" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '100%', flexGrow: 1, alignItems: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%' }}>
                                            <div style={{ width: '100%', height: '10vh', minHeight: '35px', maxHeight: '1000px', backgroundColor: isDark ? '#334155' : '#F1F5F9', border: isDark ? '1px solid #606772ff' : '1px solid #CBD5E1', borderRadius: '8px', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', transition: 'all 0.3s ease' }}>
                                                <img src={getImagePath(activeDayData.q === 0 ? '13.png' : `${activeDayData.q}.png`)} alt={`Numeral ${activeDayData.numeral}`} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <span style={{ fontSize: 'clamp(11px, 1.1vh, 10px)', color: isDark ? '#adb7c6ff' : '#475569', marginTop: '2px', textAlign: 'center', whiteSpace: 'nowrap', transition: 'color 0.3s ease' }}>Num. {activeDayData.numeral}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%' }}>
                                            <div style={{ width: '100%', height: '10vh', minHeight: '35px', maxHeight: '100px', backgroundColor: isDark ? '#334155' : '#F1F5F9', border: isDark ? '1px solid #606772ff' : '1px solid #CBD5E1', borderRadius: '8px', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', transition: 'all 0.3s ease' }}>
                                                <img src={getImagePath(activeDayData.symFile)} alt={`Signo ${activeDayData.symName}`} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <span style={{ fontSize: 'clamp(11px, 1.1vh, 10px)', color: isDark ? '#adb7c6ff' : '#475569', marginTop: '2px', textAlign: 'center', whiteSpace: 'nowrap', transition: 'color 0.3s ease' }}>Signo: {activeDayData.symName}</span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 'clamp(15px, 1.5vh, 14px)', fontWeight: 700, color: isDark ? '#38BDF8' : '#2563EB', marginTop: '2px', textTransform: 'capitalize', textAlign: 'center', transition: 'color 0.3s ease' }}>{activeDayData.numeral} - {activeDayData.symName}</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: 'clamp(10px, 1.3vh, 12px)', textAlign: 'center', transition: 'color 0.3s ease' }}>
                            Usa los controles o interactúa con el modelo 3D para ver su recorrido.
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="section-label" style={{ fontSize: 'clamp(9px, 1.2vh, 11px)', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#475569', marginBottom: '0.4vh', transition: 'color 0.3s ease' }}>Velocidad de Animación</div>
                    <div style={{ backgroundColor: isDark ? '#0F172A' : '#F8FAFC', border: isDark ? '1px solid #334155' : '1px solid #E2E8F0', borderRadius: '12px', padding: 'clamp(6px, 1vh, 10px) 10px', transition: 'all 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4vh' }}>
                            <span style={{ fontSize: 'clamp(9px, 1.2vh, 11px)', color: '#64748B', fontWeight: 600 }}>Intervalo:</span>
                            <span style={{ fontSize: 'clamp(9px, 1.2vh, 11px)', color: isDark ? '#38BDF8' : '#2563EB', fontWeight: 800, transition: 'color 0.3s ease' }}>{speed} ms</span>
                        </div>
                        <input type="range" id="speed-slider" min="50" max="1000" step="50" value={speed} onChange={(e) => updatePlaySpeed(e.target.value)} style={{ width: '100%', cursor: 'pointer', accentColor: isDark ? '#38BDF8' : '#2563EB' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="section-label" style={{ fontSize: 'clamp(9px, 1.2vh, 11px)', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94A3B8' : '#475569', marginBottom: '0.4vh', transition: 'color 0.3s ease' }}>Etiquetas de Coordenadas</div>
                    <div>
                        <select
                            value={labelsVisibility}
                            onChange={(e) => toggleLabelsVisibility(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 'clamp(4px, 0.7vh, 7px) 8px',
                                fontSize: 'clamp(9px, 1.2vh, 11px)',
                                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                                color: isDark ? '#F8FAFC' : '#0F172A',
                                border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                outline: 'none',
                                fontFamily: 'Arial, sans-serif',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <option value="none" style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#94A3B8' : '#475569' }}>Ocultar Coordenadas</option>
                            <option value="highlights" style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#94A3B8' : '#475569' }}>Mostrar Solo Destacados</option>
                            <option value="all" style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#94A3B8' : '#475569' }}>Mostrar Todas</option>
                        </select>
                    </div>
                </div><br />
            </div>
        </div>
    );
};


export default Toro;