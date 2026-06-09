import React, { useState } from 'react'
import { tonalliSimbolos, xihuitlSimbolos, encuentraCoincidence, buscarXihuitl, formatDate } from '../funtions/funtions';
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

    // Mensaje de validación de campos
    const [validationMessage, setValidationMessage] = useState("")

    const [loading, setLoading] = useState(false);
    const [loadingX, setLoadingX] = useState(false);

    const resultsCaso = results.filter(r => r.matchCaso);
    const resultsMeza = results.filter(r => r.matchMeza);

    // Lógica del botón Buscar según el modo seleccionado
    const handleBuscar = () => {
        setValidationMessage("")

        if (modo === 'tonalli' || modo === 'ambos') {
            if (!selectedStartDate || !selectedEndDate) {
                setValidationMessage("Por favor rellena la Fecha inicial y la Fecha límite para la búsqueda de Tonalli.")
                return
            }
        }
        if (modo === 'xihuitl' || modo === 'ambos') {
            if (!yearStart || !yearEnd || isNaN(yearStart) || isNaN(yearEnd)) {
                setValidationMessage("Por favor rellena el Año inicial y el Año final para la búsqueda de Xihuitl.")
                return
            }
        }

        if (modo === 'tonalli') {
            setXihuitlResults([])
            setXihuitlMessage("")
            encuentraCoincidence(selectedStartDate, selectedEndDate, numero, simbolo, setResults, setTonalliMessage, setLoading)
        } else if (modo === 'xihuitl') {
            setResults([])
            setTonalliMessage("")
            buscarXihuitl(yearStart, yearEnd, numeroX, simboloX, setXihuitlResults, setXihuitlMessage, setLoadingX)
        } else if (modo === 'ambos') {
            encuentraCoincidence(selectedStartDate, selectedEndDate, numero, simbolo, setResults, setTonalliMessage, setLoading)
            buscarXihuitl(yearStart, yearEnd, numeroX, simboloX, setXihuitlResults, setXihuitlMessage, setLoadingX)
        }
    }

    // Limpiar todos los resultados y mensajes
    const handleLimpiar = () => {
        setResults([])
        setTonalliMessage("")
        setXihuitlResults([])
        setXihuitlMessage("")
        setValidationMessage("")
    }

    const isLoading = loading || loadingX;

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
                        </select>
                    </div>
                </div>
            </div>

            {/* Formulario dinámico según modo */}
            <div className="row g-4 justify-content-center px-3">

                {/* Bloque Tonalli — visible en modo 'tonalli' y 'ambos' */}
                {(modo === 'tonalli' || modo === 'ambos') && (
                    <div className={`p-4 card shadow-sm ${modo === 'ambos' ? 'col-lg-5 me-lg-4' : 'col-lg-6'}`}>
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

                {/* Bloque Xihuitl — visible en modo 'xihuitl' y 'ambos' */}
                {(modo === 'xihuitl' || modo === 'ambos') && (
                    <div className={`p-4 card shadow-sm ${modo === 'ambos' ? 'col-lg-5' : 'col-lg-6'}`}>
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

                {resultsCaso.length > 0 && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-header text-white" style={{ backgroundColor: '#1e3a8a' }}>
                            <h5 className="mb-0">Resultados Tonalli desde Caso: {numero} - {simbolo} ({resultsCaso.length} coincidencias)</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Calendario</th>
                                        <th>Tonalli (Caso)</th>
                                        <th>Xihuitl (Caso)</th>
                                        <th>Tonalli (Meza)</th>
                                        <th>Xihuitl (Meza)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultsCaso.map((result, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(result.date)}</td>
                                            <td><span className={`badge ${result.calendar === 'Juliano' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{result.calendar}</span></td>
                                            <td>{result.tonalli?.numero?.español} - {result.tonalli?.simbolo?.español}</td>
                                            <td>{result.xihuitl?.numeroX?.español} - {result.xihuitl?.simboloX?.español}</td>
                                            <td>{result.tonalliMeza?.numeroT?.español} - {result.tonalliMeza?.signoT?.español}</td>
                                            <td>{result.xihuitlMeza?.numeroX?.español} - {result.xihuitlMeza?.simboloX?.español}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {resultsMeza.length > 0 && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-header text-white" style={{ backgroundColor: '#14532d' }}>
                            <h5 className="mb-0">Resultados Tonalli desde Meza: {numero} - {simbolo} ({resultsMeza.length} coincidencias)</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Calendario</th>
                                        <th>Tonalli (Meza)</th>
                                        <th>Xihuitl (Meza)</th>
                                        <th>Tonalli (Caso)</th>
                                        <th>Xihuitl (Caso)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultsMeza.map((result, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(result.date)}</td>
                                            <td><span className={`badge ${result.calendar === 'Juliano' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{result.calendar}</span></td>
                                            <td>{result.tonalliMeza?.numeroT?.español} - {result.tonalliMeza?.signoT?.español}</td>
                                            <td>{result.xihuitlMeza?.numeroX?.español} - {result.xihuitlMeza?.simboloX?.español}</td>
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

            {/* Resultados Xihuitl */}
            <div className="mt-4">
                {xihuitlMessage && (
                    <div className="alert alert-warning text-center mx-auto" style={{ maxWidth: '800px' }}>
                        {xihuitlMessage}
                    </div>
                )}
                {xihuitlResults.length > 0 && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-header text-white" style={{ backgroundColor: '#14532d' }}>
                            <h5 className="mb-0">Resultados Xihuitl: {numeroX} - {simboloX} ({xihuitlResults.length} coincidencias)</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Año</th>
                                        <th>Calendario</th>
                                        <th>Xihuitl</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {xihuitlResults.map((result, index) => (
                                        /* React.Fragment para poder renderizar la fila de datos y la fila de nota juntas */
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td>{result.year}</td>
                                                <td><span className={`badge ${result.calendar === 'Juliano' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{result.calendar}</span></td>
                                                <td>{result.xihuitl.numeroX.español} - {result.xihuitl.simboloX.español}</td>
                                            </tr>
                                            {result.xihuitlMezaStartTime && (
                                                <tr>
                                                    <td colSpan={3} className="text-muted fst-italic" style={{ fontSize: '0.85em', paddingTop: '2px', paddingBottom: '6px', borderTop: 'none' }}>
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
        </div>
    )
}

export default Inverso