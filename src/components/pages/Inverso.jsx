import React, { useState } from 'react'
import { getDiasMonth, convertirTonalli, tonalliSimbolos, convertirXihuitl, xihuitlSimbolos } from '../funtions/funtions';
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

    // Funcion para buscar coincidencias en Tonalli
    const encuentraCoincidence = () => {
        if (selectedStartDate === selectedEndDate) {
            setResults([])
            setTonalliMessage("En este periodo no existen coincidencias con el nombre Tonalli indicado, por favor introduzca un periodo distinto")
            return
        }

        const fechaInicio = new Date(selectedStartDate + 'T00:00:00')
        const fechaFin = new Date(selectedEndDate + 'T00:00:00')

        setLoading(true)
        setTonalliMessage("")
        setResults([])

        setTimeout(() => {
            const matches = []
            const fechaJuliano = new Date(1582, 9, 4)

            // Recorrer años, meses y días.
            for (let year = fechaInicio.getFullYear(); year <= fechaFin.getFullYear(); year++) {
                if (year === 0) continue

                const startMonth = (year === fechaInicio.getFullYear()) ? fechaInicio.getMonth() : 0
                const endMonth = (year === fechaFin.getFullYear()) ? fechaFin.getMonth() : 11

                for (let month = startMonth; month <= endMonth; month++) {
                    const diasInMonth = getDiasMonth(year, month)
                    const startDay = (year === fechaInicio.getFullYear() && month === fechaInicio.getMonth()) ? fechaInicio.getDate() : 1
                    const endDay = (year === fechaFin.getFullYear() && month === fechaFin.getMonth()) ? fechaFin.getDate() : diasInMonth

                    for (let day = startDay; day <= endDay; day++) {
                        const currentDate = new Date(year, month, day)
                        if (currentDate > fechaFin) break

                        const tonalli = convertirTonalli(currentDate)
                        const xihuitl = convertirXihuitl(currentDate)

                        if (tonalli.numero.español === numero.toString() && tonalli.simbolo.español === simbolo) {
                            matches.push({
                                date: currentDate,
                                calendar: currentDate <= fechaJuliano ? 'Juliano' : 'Gregoriano',
                                tonalli: tonalli,
                                xihuitl: xihuitl
                            })
                        }
                    }
                }
            }

            if (matches.length === 0) {
                setTonalliMessage("En este periodo no existen coincidencias con el nombre Tonalli indicado, por favor introduzca un periodo distinto")
            }
            setResults(matches)
            setLoading(false)
        }, 100)
    }

    // Funcion para buscar coincidencias del Xihuitl
    const buscarXihuitl = () => {
        if (yearStart === yearEnd) {
            setXihuitlResults([])
            setXihuitlMessage("En este periodo no existen coincidencias con el nombre de Xihutil indicado, por favor introduzca un periodo distinto")
            return
        }

        setLoadingX(true)
        setXihuitlMessage("")
        setXihuitlResults([])

        setTimeout(() => {
            const matches = []
            const firstYear = Math.min(yearStart, yearEnd)
            const lastYear = Math.max(yearStart, yearEnd)

            for (let year = firstYear; year <= lastYear; year++) {
                if (year === 0) continue
                // Cada año tiene un identificador Xihuitl.
                const xihuitl = convertirXihuitl(new Date(year, 0, 1))
                if (xihuitl.numeroX.español === numeroX.toString() && xihuitl.simboloX.español === simboloX) {
                    matches.push({
                        year: year,
                        calendar: year < 1582 ? 'Juliano' : 'Gregoriano',
                        xihuitl: xihuitl
                    })
                }
            }

            if (matches.length === 0) {
                setXihuitlMessage("En este periodo no existen coincidencias con el nombre de Xihutil indicado, por favor introduzca un periodo distinto")
            }
            setXihuitlResults(matches)
            setLoadingX(false)
        }, 100)
    }
    // Formatear fecha para mostrar
    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

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

                    <div className="d-grid">
                        <button type="button" className="btn btn-primary shadow-sm" onClick={encuentraCoincidence} disabled={loading}>
                            {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Calculando...</>) : ('Buscar Tonalli')}
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
                        <button type="button" className="btn btn-success shadow-sm" onClick={buscarXihuitl} disabled={loadingX}>
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
                {results.length > 0 && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-header text-white" style={{ backgroundColor: '#1e3a8a' }}>
                            <h5 className="mb-0">Resultados Tonalli: {numero} - {simbolo} ({results.length} coincidencias)</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Calendario</th>
                                        <th>Tonalli</th>
                                        <th>Xihuitl</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((result, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(result.date)}</td>
                                            <td><span className={`badge ${result.calendar === 'Juliano' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>{result.calendar}</span></td>
                                            <td>{result.tonalli.numero.español} - {result.tonalli.simbolo.español}</td>
                                            <td>{result.xihuitl.numeroX.español} - {result.xihuitl.simboloX.español}</td>
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