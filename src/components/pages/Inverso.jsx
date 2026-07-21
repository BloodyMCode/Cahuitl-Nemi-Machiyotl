import React, { useState } from 'react'
import { tonalliSimbolos, xihuitlSimbolos, encuentraCoincidence, buscarXihuitl, buscarAmbos, buscarAnioCivil, formatDate } from '../funtions/funtions';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Estilos.css'

const Inverso = () => {
    // Modo de búsqueda: 'tonalli' | 'xihuitl' | 'ambos'
    const [modo, setModo] = useState('tonalli');

    // Estado para Tonalli
    const [numero, setNumero] = useState(1);
    const [simbolo, setSimbolo] = useState('Lagarto');
    const [selectedStartDate, setSelectedStartDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedEndDate, setSelectedEndDate] = useState(new Date().toISOString().split('T')[0])
    const [results, setResults] = useState([])
    const [tonalliMessage, setTonalliMessage] = useState("")

    // Estado para Xihuitl
    const [numeroX, setNumeroX] = useState(1);
    const [simboloX, setSimboloX] = useState('Caña');
    const [yearStart, setYearStart] = useState(new Date().getFullYear());
    const [yearEnd, setYearEnd] = useState(new Date().getFullYear());
    const [xihuitlResults, setXihuitlResults] = useState([])
    const [xihuitlMessage, setXihuitlMessage] = useState("")

    // Estado para el modo "ambos": buscar por fecha o por año
    // 'fecha' = fecha inicio / fecha fin | 'anio' = año inicio / año fin
    const [modoAmbos, setModoAmbos] = useState('fecha');

    // Resultados filtrados de la búsqueda "ambos" (tonalli + xihuitl combinados)
    const [ambosResults, setAmbosResults] = useState([])
    const [ambosMessage, setAmbosMessage] = useState("")

    // Estado para el modo civil
    const [civilResults, setCivilResults] = useState([])
    const [civilMessage, setCivilMessage] = useState("")

    // Mensaje de validación de campos
    const [validationMessage, setValidationMessage] = useState("")

    const [loading, setLoading] = useState(false);
    const [loadingX, setLoadingX] = useState(false);
    const [loadingAmbos, setLoadingAmbos] = useState(false);

    const resultsCaso = results.filter(r => r.matchCaso);
    const resultsMeza = results.filter(r => r.matchMeza);

    // Ordena de más actual (mayor fecha) a más antiguo (menor fecha)
    const sortDesc = (arr) => [...arr].sort((a, b) => new Date(b.date) - new Date(a.date));
    const sortDescYear = (arr) => [...arr].sort((a, b) => b.year - a.year);


    // Lógica del botón Buscar según el modo seleccionado
    const handleBuscar = () => {
        setValidationMessage("")

        if (modo === 'tonalli') {
            if (!selectedStartDate || !selectedEndDate) {
                setValidationMessage("Por favor rellena la Fecha inicial y la Fecha límite para la búsqueda de Tonalli.")
                return
            }
            setXihuitlResults([])
            setXihuitlMessage("")
            setAmbosResults([])
            setAmbosMessage("")
            //encuentraCoincidence(selectedStartDate, selectedEndDate, numero, simbolo, setResults, setTonalliMessage, setLoading)
            // Normalizar orden de fechas: siempre pasar la menor como inicio y la mayor como fin
            const fechaTonalliA = new Date(selectedStartDate + 'T00:00:00')
            const fechaTonalliB = new Date(selectedEndDate + 'T00:00:00')
            const tonalliStart = fechaTonalliA <= fechaTonalliB ? selectedStartDate : selectedEndDate
            const tonalliEnd = fechaTonalliA <= fechaTonalliB ? selectedEndDate : selectedStartDate
            encuentraCoincidence(tonalliStart, tonalliEnd, numero, simbolo, setResults, setTonalliMessage, setLoading)
        } else if (modo === 'xihuitl') {
            if (!yearStart || !yearEnd || isNaN(yearStart) || isNaN(yearEnd)) {
                setValidationMessage("Por favor rellena el Año inicial y el Año final para la búsqueda de Xihuitl.")
                return
            }
            setResults([])
            setTonalliMessage("")
            setAmbosResults([])
            setAmbosMessage("")
            //buscarXihuitl(yearStart, yearEnd, numeroX, simboloX, setXihuitlResults, setXihuitlMessage, setLoadingX)
            // Normalizar orden de años: siempre pasar el menor como inicio y el mayor como fin
            const xihuitlYearStart = Math.min(yearStart, yearEnd)
            const xihuitlYearEnd = Math.max(yearStart, yearEnd)
            buscarXihuitl(xihuitlYearStart, xihuitlYearEnd, numeroX, simboloX, setXihuitlResults, setXihuitlMessage, setLoadingX)
        } else if (modo === 'ambos') {
            if (modoAmbos === 'fecha') {
                if (!selectedStartDate || !selectedEndDate) {
                    setValidationMessage("Por favor rellena la Fecha inicial y la Fecha límite para la búsqueda combinada.")
                    return
                }
            } else {
                if (!yearStart || !yearEnd || isNaN(yearStart) || isNaN(yearEnd)) {
                    setValidationMessage("Por favor rellena el Año inicial y el Año final para la búsqueda combinada.")
                    return
                }
            }
            setResults([])
            setTonalliMessage("")
            setXihuitlResults([])
            setXihuitlMessage("")
            buscarAmbos(selectedStartDate, selectedEndDate, modoAmbos, yearStart, yearEnd, numero, simbolo, numeroX, simboloX, setAmbosResults, setAmbosMessage, setLoadingAmbos)
        } else if (modo === 'civil') {
            if (!yearStart || isNaN(yearStart)) {
                setValidationMessage("Por favor rellena el Año para la búsqueda Civil.")
                return
            }
            setResults([])
            setTonalliMessage("")
            setXihuitlResults([])
            setXihuitlMessage("")
            setAmbosResults([])
            setAmbosMessage("")
            setCivilMessage("")
            setCivilResults([])

            buscarAnioCivil(yearStart, setCivilResults, setCivilMessage, setLoading)
        }
    }

    // Limpiar todos los resultados y mensajes
    const handleLimpiar = () => {
        setResults([])
        setTonalliMessage("")
        setXihuitlResults([])
        setXihuitlMessage("")
        setAmbosResults([])
        setAmbosMessage("")
        setCivilResults([])
        setCivilMessage("")
        setValidationMessage("")
    }

    const isLoading = loading || loadingX || loadingAmbos;

    // Ordenar resultados de más actual a más antiguo para Tonalli y Xihuitl
    const resultsCasoDesc = sortDesc(resultsCaso);
    const resultsMezaDesc = sortDesc(resultsMeza);
    const xihuitlResultsDesc = sortDescYear(xihuitlResults);

    return (
        <div className="container-fluid py-4">
            <h1 className="text-center mb-5">Correlaciones Calendarícas Precoloniales</h1>

            {/* Selector de modo */}
            <div className="row justify-content-center mb-4 px-3">
                <div className="col-lg-10 col-xl-8">
                    <div className="card shadow-sm p-3">
                        <label className="form-label fw-bold mb-2">Tipo de búsqueda</label>
                        <select
                            id="modoBusqueda"
                            className="form-select"
                            value={modo}
                            onChange={(e) => {
                                setModo(e.target.value)
                                setValidationMessage("")
                            }}
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="tonalli">Buscar por Tonalli</option>
                            <option value="xihuitl">Buscar por Xihuitl</option>
                            <option value="ambos">Buscar por Tonalli y Xihuitl</option>
                            <option value="civil">Buscar Año civil</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Formulario dinámico según modo */}
            <div className="row g-4 justify-content-center px-3">

                {/* Bloque Tonalli — visible en modo 'tonalli' */}
                {modo === 'tonalli' && (
                    <div className="col-lg-6 p-4 card shadow-sm">
                        <h4 className="text-center mb-4" style={{ color: '#60a5fa' }}>Búsqueda por Tonalli</h4>

                        <div className="mb-3">
                            <label htmlFor="number" className="form-label fw-bold">Numeral Tonalli</label>
                            <select id="number" className="form-select" value={numero} onChange={(e) => setNumero(parseInt(e.target.value))} style={{ colorScheme: 'dark' }}>
                                {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (<option key={num} value={num}>{num}</option>))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="symbol" className="form-label fw-bold">Signo Tonalli</label>
                            <select id="symbol" className="form-select" value={simbolo} onChange={(e) => setSimbolo(e.target.value)} style={{ colorScheme: 'dark' }}>
                                {tonalliSimbolos.map((sim) => (<option key={sim.español} value={sim.español}>{sim.español}</option>))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Fecha inicial</label>
                            <div className="input-group">
                                <span className="input-group-text"><i className="bi bi-calendar-event"></i></span>
                                <input type="date" className="form-control" value={selectedStartDate} onChange={(e) => setSelectedStartDate(e.target.value)} style={{ colorScheme: 'dark' }} />
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="form-label fw-bold">Fecha límite</label>
                            <div className="input-group">
                                <span className="input-group-text"><i className="bi bi-calendar-check"></i></span>
                                <input type="date" className="form-control" value={selectedEndDate} onChange={(e) => setSelectedEndDate(e.target.value)} style={{ colorScheme: 'dark' }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Bloque Xihuitl — visible en modo 'xihuitl' */}
                {modo === 'xihuitl' && (
                    <div className="col-lg-6 p-4 card shadow-sm">
                        <h4 className="text-center mb-4" style={{ color: '#4ade80' }}>Búsqueda por Xihuitl</h4>

                        <div className="mb-3">
                            <label htmlFor="numberX" className="form-label fw-bold">Numeral Xihuitl</label>
                            <select id="numberX" className="form-select" value={numeroX} onChange={(e) => setNumeroX(parseInt(e.target.value))} style={{ colorScheme: 'dark' }}>
                                {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (<option key={num} value={num}>{num}</option>))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="symbolX" className="form-label fw-bold">Signo Xihuitl</label>
                            <select id="symbolX" className="form-select" value={simboloX} onChange={(e) => setSimboloX(e.target.value)} style={{ colorScheme: 'dark' }}>
                                {xihuitlSimbolos.map((sim) => (<option key={sim.español} value={sim.español}>{sim.español}</option>))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="yearStart" className="form-label fw-bold">Año inicial</label>
                            <input type="number" id="yearStart" className="form-control" value={yearStart} onChange={(e) => setYearStart(parseInt(e.target.value))} style={{ colorScheme: 'dark' }} />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="yearEnd" className="form-label fw-bold">Año final</label>
                            <input type="number" id="yearEnd" className="form-control" value={yearEnd} onChange={(e) => setYearEnd(parseInt(e.target.value))} style={{ colorScheme: 'dark' }} />
                        </div>
                    </div>
                )}

                {/* Bloque Ambos — visible en modo 'ambos' */}
                {modo === 'ambos' && (
                    <div className="col-lg-10 col-xl-9">
                        <div className="card shadow-sm p-4">
                            <h4 className="text-center mb-4" style={{ color: '#f59e0b' }}>Búsqueda por Tonalli y Xihuitl</h4>

                            {/* Selector modo fecha o año */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Tipo de periodo</label>
                                <div className="d-flex gap-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="modoFecha"
                                            name="modoAmbos"
                                            value="fecha"
                                            checked={modoAmbos === 'fecha'}
                                            onChange={() => setModoAmbos('fecha')}
                                        />
                                        <label className="form-check-label fw-bold" htmlFor="modoFecha">
                                            Por fecha completa
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="modoAnio"
                                            name="modoAmbos"
                                            value="anio"
                                            checked={modoAmbos === 'anio'}
                                            onChange={() => setModoAmbos('anio')}
                                        />
                                        <label className="form-check-label fw-bold" htmlFor="modoAnio">
                                            Por año
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3">
                                {/* Columna Tonalli */}
                                <div className="col-md-6">
                                    <div className="border rounded p-3" style={{ borderColor: '#60a5fa', borderWidth: '2px' }}>
                                        <h6 className="mb-3" style={{ color: '#60a5fa' }}>Tonalli</h6>
                                        <div className="mb-3">
                                            <label htmlFor="numberAmbos" className="form-label fw-bold">Numeral Tonalli</label>
                                            <select id="numberAmbos" className="form-select" value={numero} onChange={(e) => setNumero(parseInt(e.target.value))} style={{ colorScheme: 'dark' }}>
                                                {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (<option key={num} value={num}>{num}</option>))}
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="symbolAmbos" className="form-label fw-bold">Signo Tonalli</label>
                                            <select id="symbolAmbos" className="form-select" value={simbolo} onChange={(e) => setSimbolo(e.target.value)} style={{ colorScheme: 'dark' }}>
                                                {tonalliSimbolos.map((sim) => (<option key={sim.español} value={sim.español}>{sim.español}</option>))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Xihuitl */}
                                <div className="col-md-6">
                                    <div className="border rounded p-3" style={{ borderColor: '#4ade80', borderWidth: '2px' }}>
                                        <h6 className="mb-3" style={{ color: '#4ade80' }}>Xihuitl</h6>
                                        <div className="mb-3">
                                            <label htmlFor="numberXAmbos" className="form-label fw-bold">Numeral Xihuitl</label>
                                            <select id="numberXAmbos" className="form-select" value={numeroX} onChange={(e) => setNumeroX(parseInt(e.target.value))} style={{ colorScheme: 'dark' }}>
                                                {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (<option key={num} value={num}>{num}</option>))}
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="symbolXAmbos" className="form-label fw-bold">Signo Xihuitl</label>
                                            <select id="symbolXAmbos" className="form-select" value={simboloX} onChange={(e) => setSimboloX(e.target.value)} style={{ colorScheme: 'dark' }}>
                                                {xihuitlSimbolos.map((sim) => (<option key={sim.español} value={sim.español}>{sim.español}</option>))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Periodo */}
                                <div className="col-12">
                                    <div className="border rounded p-3 mt-1" style={{ borderColor: '#f59e0b', borderWidth: '2px' }}>
                                        <h6 className="mb-3" style={{ color: '#f59e0b' }}>
                                            {modoAmbos === 'fecha' ? 'Periodo (Fechas)' : 'Periodo (Años)'}
                                        </h6>
                                        {modoAmbos === 'fecha' ? (
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold">Fecha inicial</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="bi bi-calendar-event"></i></span>
                                                        <input type="date" className="form-control" value={selectedStartDate} onChange={(e) => setSelectedStartDate(e.target.value)} style={{ colorScheme: 'dark' }} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold">Fecha límite</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="bi bi-calendar-check"></i></span>
                                                        <input type="date" className="form-control" value={selectedEndDate} onChange={(e) => setSelectedEndDate(e.target.value)} style={{ colorScheme: 'dark' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label htmlFor="yearStartAmbos" className="form-label fw-bold">Año inicial</label>
                                                    <input type="number" id="yearStartAmbos" className="form-control" value={yearStart} onChange={(e) => setYearStart(parseInt(e.target.value))} style={{ colorScheme: 'dark' }} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="yearEndAmbos" className="form-label fw-bold">Año final</label>
                                                    <input type="number" id="yearEndAmbos" className="form-control" value={yearEnd} onChange={(e) => setYearEnd(parseInt(e.target.value))} style={{ colorScheme: 'dark' }} />
                                                </div>
                                            </div>
                                        )}
                                        {modoAmbos === 'anio' && (
                                            <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85em' }}>
                                                <i className="bi bi-info-circle me-1"></i>
                                                Se buscará desde el 1 de enero del año inicial hasta el 31 de diciembre del año final.
                                                El xihuitl considerará el año de cada fecha encontrada.
                                            </p>
                                        )}
                                        {modoAmbos === 'fecha' && (
                                            <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85em' }}>
                                                <i className="bi bi-info-circle me-1"></i>
                                                El xihuitl considerará el año de la fecha inicio y fecha fin. Se puede ingresar fecha inicio mayor a fecha fin.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Bloque Civil — visible en modo 'civil' */}
                {modo === 'civil' && (
                    <div className="col-lg-6 p-4 card shadow-sm">
                        <h4 className="text-center mb-4" style={{ color: '#4ade80' }}>Búsqueda Año civil</h4>
                        <div className="mb-3">
                            <label htmlFor="yearStart" className="form-label fw-bold">Introduce el año</label>
                            <input type="number" id="yearStart" className="form-control" value={yearStart} onChange={(e) => setYearStart(parseInt(e.target.value))} style={{ colorScheme: 'dark' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Botones Buscar y Limpiar */}
            <div className="row justify-content-center mt-4 px-3">
                <div className="col-lg-10 col-xl-8">
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            id="btnBuscar"
                            className="btn btn-primary flex-grow-1 shadow-sm"
                            onClick={handleBuscar}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? (<><span className="spinner-border spinner-border-sm me-2"></span>Calculando...</>)
                                : 'Buscar'}
                        </button>
                        <button
                            type="button"
                            id="btnLimpiar"
                            className="btn btn-secondary shadow-sm"
                            onClick={handleLimpiar}
                            disabled={isLoading}
                        >
                            Limpiar
                        </button>
                    </div>

                    {/* Mensaje de validación */}
                    {validationMessage && (
                        <div className="alert alert-danger mt-3 mb-0 text-center">
                            {validationMessage}
                        </div>
                    )}
                </div>
            </div>

            {/* Resultados Tonalli */}
            <div className="mt-5">
                {tonalliMessage && (
                    <div className="alert alert-warning text-center mx-auto" style={{ maxWidth: '800px' }}>
                        {tonalliMessage}
                    </div>
                )}

                {resultsMezaDesc.length > 0 && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-header text-white" style={{ backgroundColor: '#14532d' }}>
                            <h5 className="mb-0">Resultados Tonalli desde Meza: {numero} - {simbolo} ({resultsMezaDesc.length} coincidencias)</h5>
                        </div>
                        <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table className="table table-bordered  table-hover mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>#</th>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Fecha</th>
                                        <th className="col-divider" style={{ position: 'sticky', top: 0, zIndex: 1 }}>Calendario</th>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Tonalli (Meza)</th>
                                        <th className="col-divider" style={{ position: 'sticky', top: 0, zIndex: 1, }}>Xihuitl (Meza)</th>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Tonalli (Caso)</th>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Xihuitl (Caso)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultsMezaDesc.map((result, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{formatDate(result.date)}</td>
                                            <td className="col-divider"><span className={`badge ${result.calendar === 'Juliano' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{result.calendar}</span></td>
                                            <td>{result.tonalliMeza?.numeroT?.español} - {result.tonalliMeza?.signoT?.español}</td>
                                            <td className="col-divider">{result.xihuitlMeza?.numeroX?.español} - {result.xihuitlMeza?.simboloX?.español}</td>
                                            <td>{result.tonalli?.numero?.español} - {result.tonalli?.simbolo?.español}</td>
                                            <td>{result.xihuitl?.numeroX?.español} - {result.xihuitl?.simboloX?.español}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {resultsCasoDesc.length > 0 && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-header text-white" style={{ backgroundColor: '#1e3a8a' }}>
                            <h5 className="mb-0">Resultados Tonalli desde Caso: {numero} - {simbolo} ({resultsCasoDesc.length} coincidencias)</h5>
                        </div>
                        <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table className="table table-bordered table-hover mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>#</th>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Fecha</th>
                                        <th className="col-divider" style={{ position: 'sticky', top: 0, zIndex: 1 }}>Calendario</th>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Tonalli (Caso)</th>
                                        <th className="col-divider" style={{ position: 'sticky', top: 0, zIndex: 1 }}>Xihuitl (Caso)</th>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Tonalli (Meza)</th>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Xihuitl (Meza)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultsCasoDesc.map((result, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{formatDate(result.date)}</td>
                                            <td className="col-divider"><span className={`badge ${result.calendar === 'Juliano' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{result.calendar}</span></td>
                                            <td>{result.tonalli?.numero?.español} - {result.tonalli?.simbolo?.español}</td>
                                            <td className="col-divider">{result.xihuitl?.numeroX?.español} - {result.xihuitl?.simboloX?.español}</td>
                                            <td>{result.tonalliMeza?.numeroT?.español} - {result.tonalliMeza?.signoT?.español}</td>
                                            <td>{result.xihuitlMeza?.numeroX?.español} - {result.xihuitlMeza?.simboloX?.español}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Resultados Xihuitl */}
            <div className="mt-4">
                {xihuitlMessage && (
                    <div className="alert alert-warning text-center mx-auto" style={{ maxWidth: '800px' }}>
                        {xihuitlMessage}
                    </div>
                )}
                {xihuitlResultsDesc.length > 0 && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-header text-white" style={{ backgroundColor: '#14532d' }}>
                            <h5 className="mb-0">Resultados Xihuitl: {numeroX} - {simboloX} ({xihuitlResultsDesc.length} coincidencias)</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Año</th>
                                        <th>Calendario</th>
                                        <th>Xihuitl</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {xihuitlResultsDesc.map((result, index) => (
                                        /* React.Fragment para poder renderizar la fila de datos y la fila de nota juntas */
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{result.year}</td>
                                                <td><span className={`badge ${result.calendar === 'Juliano' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{result.calendar}</span></td>
                                                <td>{result.xihuitl.numeroX.español} - {result.xihuitl.simboloX.español}</td>
                                            </tr>
                                            {result.xihuitlMezaStartTime && (
                                                <tr>
                                                    <td colSpan={4} className="text-muted fst-italic" style={{ fontSize: '0.85em', paddingTop: '2px', paddingBottom: '6px', borderTop: 'none' }}>
                                                        <span style={{ color: '#4ade80' }}>📅 Nota: </span> De acuerdo a la conversión de Meza, el año {result.year} comienza el <strong>{result.xihuitlMezaStartTime}</strong> ({result.xihuitlMezaCal}).
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Resultados Ambos (Tonalli + Xihuitl combinados) */}
            <div className="mt-4">
                {ambosMessage && (
                    <div className="alert alert-warning text-center mx-auto" style={{ maxWidth: '800px' }}>
                        {ambosMessage}
                    </div>
                )}
                {ambosResults.length > 0 && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-header text-white" style={{ backgroundColor: '#78350f' }}>
                            <h5 className="mb-0">
                                Resultados Tonalli y Xihuitl: {numero} - {simbolo} / {numeroX} - {simboloX} ({ambosResults.length} coincidencias)
                            </h5>
                        </div>
                        <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table className="table table-bordered table-hover mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>#</th>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Fecha</th>
                                        <th className="col-divider" style={{ position: 'sticky', top: 0, zIndex: 1 }}>Calendario</th>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Tonalli (Meza)</th>
                                        <th className="col-divider" style={{ position: 'sticky', top: 0, zIndex: 1 }}>Xihuitl (Meza)</th>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Tonalli (Caso)</th>
                                        <th style={{ position: 'sticky', top: 0, zIndex: 1 }}>Xihuitl (Caso)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ambosResults.map((result, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{formatDate(result.date)}</td>
                                            <td className="col-divider"><span className={`badge ${result.calendar === 'Juliano' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{result.calendar}</span></td>
                                            <td>{result.tonalliMeza?.numeroT?.español} - {result.tonalliMeza?.signoT?.español}</td>
                                            <td className="col-divider">{result.xihuitlMeza?.numeroX?.español} - {result.xihuitlMeza?.simboloX?.español}</td>
                                            <td>{result.tonalli?.numero?.español} - {result.tonalli?.simbolo?.español}</td>
                                            <td>{result.xihuitl?.numeroX?.español} - {result.xihuitl?.simboloX?.español}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            {/* Resultados Civil */}
            <div className="mt-4">
                {civilMessage && (
                    <div className="alert alert-warning text-center mx-auto" style={{ maxWidth: '800px' }}>
                        {civilMessage}
                    </div>
                )}
                {civilResults.length > 0 && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-header text-white" style={{ backgroundColor: '#059669' }}>
                            <h5 className="mb-0">Resultado Año civil: {civilResults[0].year}</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Año</th>
                                        <th>Calendario</th>
                                        <th>Xihuitl (Meza)</th>
                                        <th>Xihuitl (Caso)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {civilResults.map((result, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{result.year}</td>
                                                <td><span className={`badge ${result.calendar === 'Juliano' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{result.calendar}</span></td>
                                                <td>{result.xihuitlMeza?.numeroX?.español} - {result.xihuitlMeza?.simboloX?.español}</td>
                                                <td>{result.xihuitl?.numeroX?.español} - {result.xihuitl?.simboloX?.español}</td>
                                            </tr>
                                            {result.xihuitlMezaStartTime && (
                                                <tr>
                                                    <td colSpan={5} className="text-muted fst-italic" style={{ fontSize: '0.85em', paddingTop: '2px', paddingBottom: '6px', borderTop: 'none' }}>
                                                        <span style={{ color: '#059669' }}>📅 Nota (Meza): </span> De acuerdo a la conversión de Meza, el año {result.year} inicia el <strong>{result.xihuitlMezaStartTime}</strong> ({result.xihuitlMezaCal}).
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Inverso