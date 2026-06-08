import React, { useState } from 'react'
import { tonalliSimbolos, xihuitlSimbolos, encuentraCoincidence, buscarXihuitl, formatDate } from '../funtions/funtions';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Estilos.css'

const Inverso = () => {
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

    const [loading, setLoading] = useState(false);
    const [loadingX, setLoadingX] = useState(false);

    const resultsCaso = results.filter(r => r.matchCaso);
    const resultsMeza = results.filter(r => r.matchMeza);

    return (
        <div className="container-fluid py-4">
            <h1 className="text-center mb-5">Correlaciones Calendarícas Precoloniales</h1>

            <div className="row g-4 justify-content-center px-3">
                {/* Tonalli */}
                <div className="col-lg-5 p-4 card shadow-sm me-lg-4">
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

                    <div className="mb-4">
                        <label className="form-label fw-bold">Fecha límite</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-calendar-check"></i></span>
                            <input type="date" className="form-control" value={selectedEndDate} onChange={(e) => setSelectedEndDate(e.target.value)} style={{ colorScheme: 'dark' }} />
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        {/*  <button type="button" className="btn btn-primary shadow-sm" onClick={encuentraCoincidence} disabled={loading}> */}
                        <button type="button" className="btn btn-primary flex-grow-1 shadow-sm" onClick={() => encuentraCoincidence(selectedStartDate, selectedEndDate, numero, simbolo, setResults, setTonalliMessage, setLoading)} disabled={loading}>
                            {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Calculando...</>) : ('Buscar Tonalli')}
                        </button>
                        <button type="button" className="btn btn-secondary shadow-sm" onClick={() => { setResults([]); setTonalliMessage(""); }} disabled={loading}>
                            Limpiar
                        </button>
                    </div>
                </div>

                {/* Xihuitl */}
                <div className="col-lg-5 p-4 card shadow-sm">
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

                    <div className="mb-4">
                        <label htmlFor="yearEnd" className="form-label fw-bold">Año final</label>
                        <input type="number" id="yearEnd" className="form-control" value={yearEnd} onChange={(e) => setYearEnd(parseInt(e.target.value))} style={{ colorScheme: 'dark' }} />
                    </div>

                    <div className="d-grid">
                        {/*  <button type="button" className="btn btn-success shadow-sm" onClick={buscarXihuitl} disabled={loadingX}> */}
                        <button type="button" className="btn btn-success shadow-sm" onClick={() => buscarXihuitl(yearStart, yearEnd, numeroX, simboloX, setXihuitlResults, setXihuitlMessage, setLoadingX)} disabled={loadingX}>
                            {loadingX ? (<><span className="spinner-border spinner-border-sm me-2"></span>Calculando...</>) : ('Buscar Xihuitl')}
                        </button>
                    </div>
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
                                        <tr key={index}>
                                            <td>{result.year}</td>
                                            <td><span className={`badge ${result.calendar === 'Juliano' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{result.calendar}</span></td>
                                            <td>{result.xihuitl.numeroX.español} - {result.xihuitl.simboloX.español}</td>
                                        </tr>
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