import React, { useState } from 'react'
import { convertirTonalli, convertirXihuitl, convertirTonalliMeza, convertirXihuitlMeza, cempohualliMeza, obtenerDiaRitual } from '../funtions/funtions';
import CalendarioGiratorio from './CalendarioGiratorio';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Estilos.css'

const Conversor = () => {
    //Estados para almacenar la fecha seleccionada, la hora y los resultados
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [tonalliDia, setTonalliDia] = useState(null)
    const [xihuitlAnio, setXihuitlAnio] = useState(null)
    const [tonalliDiaMeza, setTonalliDiaMeza] = useState(null)
    const [xihuitlAnioMeza, setXihuitlAnioMeza] = useState(null)
    const [veintenaMeza, setVeintenaMeza] = useState(null)
    const [ritualDay, setRitualDay] = useState(null)
    const [hasPrevious, setHasPrevious] = useState(() => {
        try {
            return typeof window !== 'undefined' && !!localStorage.getItem('lastConversionQuery')
        } catch (e) {
            return false
        }
    })

    // Funcion interna para ejecutar la conversion
    const runConversion = (dateStr, timeStr) => {
        // Combinar fecha y hora, para Caso(si no hay hora, se usa 00:00)
        const timeCaso = timeStr ? timeStr : '00:00'
        const dateObj = new Date(`${dateStr}T${timeCaso}`)

        const tonalliResult = convertirTonalli(dateObj)//llamada de funcion
        const xihuitlResult = convertirXihuitl(dateObj)//llamada de funcion
        const tonalliResultMeza = convertirTonalliMeza(dateStr, timeStr)//llamada de funcion
        const xihuitlResultMeza = convertirXihuitlMeza(dateStr, timeStr)//llamada de funcion
        const veintenaResultMeza = cempohualliMeza(dateStr, timeStr)//llamada de funcion

        //Actualizar el estado
        setTonalliDia(tonalliResult)
        setXihuitlAnio(xihuitlResult)
        setTonalliDiaMeza(tonalliResultMeza)
        setXihuitlAnioMeza(xihuitlResultMeza)
        setVeintenaMeza(veintenaResultMeza)

        const ritualData = obtenerDiaRitual(dateStr, timeStr)
        if (ritualData) {
            setRitualDay(((ritualData.day - 1) % 365) + 1)
        } else {
            setRitualDay(null)
        }
    }

    //Funcion para manejar el clic en el boton Mostrar conversión
    const handleConvert = () => {
        if (!selectedDate) return
        runConversion(selectedDate, selectedTime)

        // Guardar la consulta en localStorage
        try {
            localStorage.setItem('lastConversionQuery', JSON.stringify({ date: selectedDate, time: selectedTime }))
            setHasPrevious(true)
        } catch (e) {
            console.error("Error al guardar en localStorage", e)
        }
    }

    // Funcion para manejar el clic en el boton Consulta anterior
    const handleLoadPrevious = () => {
        try {
            const saved = localStorage.getItem('lastConversionQuery')
            if (saved) {
                const { date, time } = JSON.parse(saved)
                setSelectedDate(date)
                setSelectedTime(time || '')
                runConversion(date, time || '')
            }
        } catch (e) {
            console.error("Error al cargar la consulta de localStorage", e)
        }
    }

    return (
        <>
            <div className="container text-center">
                <h1 className="text-center mb-4">Correlaciones Calendarícas Precoloniales</h1>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                Selecciona una fecha y hora
                            </div>
                            <div className="card-body">
                                {/* <h5 className="card-title">Calendario</h5> */}
                                <div className="row">
                                    <div className="col-md-7 mb-3">
                                        <label className="form-label text-start d-block" htmlFor="input-fecha">Fecha:</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-calendar-event"></i></span>
                                            <input id="input-fecha" type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ colorScheme: 'dark' }} />
                                        </div>
                                    </div>
                                    <div className="col-md-5 mb-3">
                                        <label className="form-label text-start d-block" htmlFor="input-hora">Hora (opcional):</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-clock"></i></span>
                                            <input id="input-hora" type="time" className="form-control" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} style={{ colorScheme: 'dark' }} />
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <button id="btn-mostrar-conversion" type="button" className="btn btn-secondary me-2" onClick={handleConvert} disabled={!selectedDate}>Mostrar conversión</button>
                                <button id="btn-consulta-anterior" type="button" className="btn btn-outline-info" onClick={handleLoadPrevious} disabled={!hasPrevious}>Consulta anterior</button>
                                <CalendarioGiratorio
                                    tonalliDiaMeza={tonalliDiaMeza}
                                    veintenaMeza={veintenaMeza}
                                    ritualDay={ritualDay}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            {tonalliDia && tonalliDiaMeza && xihuitlAnio && xihuitlAnioMeza && (
                <div className="container text-center">
                    <div className="row justify-content-center">
                        <p className="text-theme-muted">* Correspondencia de Meza</p>
                        <div className="col-md-6">
                            <div className="card" >
                                {/* <p><img src={tonalliDiaMeza.numberTonalImage} alt={tonalliDiaMeza.numberTonalImage} className="card-img-top img-com" /> <img src={tonalliDiaMeza.signTonalImage} alt={tonalliDiaMeza.signTonalImage} className="card-img-top img-com" /></p> */}
                                {/* AHORA: */}
                                <div className="d-flex justify-content-center align-items-center gap-3 pt-3">
                                    <img
                                        src={tonalliDiaMeza.numberTonalImage}
                                        alt="Numeral Tonalli"
                                        className="img-com"
                                    />
                                    <img
                                        src={tonalliDiaMeza.signTonalImage}
                                        alt="Signo Tonalli"
                                        className="img-com"
                                    />
                                </div>
                                {/* <div className="card-header rounded-3 bg-light">
                                    <img src={tonalliDiaMeza.numberTonalImage} alt={tonalliDiaMeza.numberTonalImage} className="img-com" />
                                    <img src={tonalliDiaMeza.signTonalImage} alt={tonalliDiaMeza.signTonalImage} className="img-com" />
                                </div> */}
                                <div className="card-body">
                                    <h5 className="card-title">Tonalli</h5>
                                    <small className="text-secondary" style={{ fontSize: '11px' }}>* Según la correspondencia de Meza</small>
                                    <p className="card-text text-subtitle">Día:</p>
                                    {/* <p className="card-text text-white small">Hora considerada: {tonalliDiaMeza.usedTime}</p> */}
                                    {/* <p className="card-text">{tonalliDia.numero.español} - {tonalliDia.simbolo.español}</p>
                                    <p className="card-text">{tonalliDia.numero.nahuatl} - {tonalliDia.simbolo.nahuatl}</p>
                                    <p className='card-text'>{tonalliDia.numero.nusavi} - {tonalliDia.simbolo.nusavi}</p> */}
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">Idioma</th>
                                                <th scope="col">Numeral</th>
                                                <th scope="col">Signo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Español</td>
                                                <td>{tonalliDiaMeza.numeroT.español}</td>
                                                <td>{tonalliDiaMeza.signoT.español}</td>
                                            </tr>
                                            <tr>
                                                <td>Nahuatl</td>
                                                <td>{tonalliDiaMeza.numeroT.nahuatl}</td>
                                                <td>{tonalliDiaMeza.signoT.nahuatl}</td>
                                            </tr>
                                            <tr>
                                                <td>Ñu savi Ceremonial</td>
                                                <td>{tonalliDiaMeza.numeroT.nusavi}</td>
                                                <td>{tonalliDiaMeza.signoT.nusavi}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <small className="text-secondary" style={{ fontSize: '12px', color: '#adb5bd' }}>Hora procesada: {tonalliDiaMeza.usedTime}</small><br></br>
                                    {/* <div className="alert alert-secondary py-1 small mb-1">Hora procesada: {tonalliDiaMeza.usedTime}</div>
                                    <div className="alert alert-info py-1 small mb-1">Inicio del año: {tonalliDiaMeza.startTime}</div> */}
                                    <div className="alert alert-success py-1 small">Esta fecha pertenece a la veintena: {veintenaMeza}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card" >
                                {/* <p><img src={xihuitlAnioMeza.numberImageX} alt={xihuitlAnioMeza.numberImageX} className="card-img-top img-com" /> <img src={xihuitlAnioMeza.symbolImageX} alt={xihuitlAnioMeza.symbolImageX} className="card-img-top img-com" /></p> */}
                                <div className="d-flex justify-content-center align-items-center gap-3 pt-3">
                                    <img src={xihuitlAnioMeza.numberImageX} alt={xihuitlAnioMeza.numberImageX} className="img-com" />
                                    <img src={xihuitlAnioMeza.symbolImageX} alt={xihuitlAnioMeza.symbolImageX} className="img-com" />
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Xihuitl</h5>
                                    <small className="text-secondary" style={{ fontSize: '11px', color: '#adb5bd' }}>* Según la correspondencia de Meza</small>
                                    <p className="card-text text-subtitle">Año:</p>
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">Idioma</th>
                                                <th scope="col">Numeral</th>
                                                <th scope="col">Signo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Español</td>
                                                <td>{xihuitlAnioMeza.numeroX.español}</td>
                                                <td>{xihuitlAnioMeza.simboloX.español}</td>
                                            </tr>
                                            <tr>
                                                <td>Nahuatl</td>
                                                <td>{xihuitlAnioMeza.numeroX.nahuatl}</td>
                                                <td>{xihuitlAnioMeza.simboloX.nahuatl}</td>
                                            </tr>
                                            <tr>
                                                <td>Ñu savi Ceremonial</td>
                                                <td>{xihuitlAnioMeza.numeroX.nusavi}</td>
                                                <td>{xihuitlAnioMeza.simboloX.nusavi}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <small className="text-secondary" style={{ fontSize: '12px', color: '#adb5bd' }}>Inicio del año: {tonalliDiaMeza.startTime}</small>
                                    {/* <small className="text-secondary" style={{ fontSize: '12px', color: '#adb5bd' }}>Hora procesada: {xihuitlAnioMeza.usedTime}</small><br></br>
                                    <small className="text-secondary" style={{ fontSize: '12px', color: '#adb5bd' }}>Inicio del año: {xihuitlAnioMeza.startTime}</small> */}
                                    {/* <div className="alert alert-secondary py-1 small mb-1">Hora procesada: {xihuitlAnioMeza.usedTime}</div>
                                    <div className="alert alert-info py-1 small">Inicio del año: {xihuitlAnioMeza.startTime}</div> */}
                                </div>
                            </div>
                        </div>
                        <small className="text-secondary" style={{ fontSize: '13px' }}>* Correspondencia de Meza basado en la fecha de referencia: día 1-Cipactli, año 1-Tochtli (12 de marzo de 2026)</small><br /><br />
                        <p className="text-theme-muted">* Correspondencia de Caso</p>
                        <div className="col-md-6">
                            <div className="card" >
                                {/* <p><img src={tonalliDia.numberImage} alt={tonalliDia.numberImage} className="card-img-top img-com" /> <img src={tonalliDia.symbolImage} alt={tonalliDia.symbolImage} className="card-img-top img-com" /></p> */}
                                <div className="d-flex justify-content-center align-items-center gap-3 pt-3">
                                    <img src={tonalliDia.numberImage} alt={tonalliDia.numberImage} className="img-com" />
                                    <img src={tonalliDia.symbolImage} alt={tonalliDia.symbolImage} className="img-com" />
                                </div>
                                {/*  <div className="card-header rounded-3 bg-light">
                                    <img src={tonalliDia.numberImage} alt={tonalliDia.numberImage} className="img-com" />
                                    <img src={tonalliDia.symbolImage} alt={tonalliDia.symbolImage} className="img-com" />
                                </div> */}
                                <div className="card-body">
                                    <h5 className="card-title">Tonalli</h5>
                                    <small className="text-secondary" style={{ fontSize: '11px' }}>* Según la correspondencia de Caso</small>
                                    <p className="card-text text-subtitle">Día:</p>
                                    {/*  <p className="card-text text-white small">Hora considerada: {tonalliDia.usedTime}</p> */}
                                    {/* <p className="card-text">{tonalliDia.numero.español} - {tonalliDia.simbolo.español}</p>
                                    <p className="card-text">{tonalliDia.numero.nahuatl} - {tonalliDia.simbolo.nahuatl}</p>
                                    <p className='card-text'>{tonalliDia.numero.nusavi} - {tonalliDia.simbolo.nusavi}</p> */}
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">Idioma</th>
                                                <th scope="col">Numeral</th>
                                                <th scope="col">Signo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Español</td>
                                                <td>{tonalliDia.numero.español}</td>
                                                <td>{tonalliDia.simbolo.español}</td>
                                            </tr>
                                            <tr>
                                                <td>Nahuatl</td>
                                                <td>{tonalliDia.numero.nahuatl}</td>
                                                <td>{tonalliDia.simbolo.nahuatl}</td>
                                            </tr>
                                            <tr>
                                                <td>Ñu savi Ceremonial</td>
                                                <td>{tonalliDia.numero.nusavi}</td>
                                                <td>{tonalliDia.simbolo.nusavi}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <small className="text-secondary" style={{ fontSize: '12px', color: '#adb5bd' }}>Hora procesada: {tonalliDia.usedTime}</small>
                                    {/* <div className="alert alert-secondary py-1 small mb-1">Hora procesada: {tonalliDia.usedTime}</div> */}
                                    {/* <div className="alert alert-info py-1 small">Inicio del año: {tonalliDia.startTime}</div> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card" >
                                {/* <p><img src={xihuitlAnio.numberImageX} alt={xihuitlAnio.numberImageX} className="card-img-top img-com" /> <img src={xihuitlAnio.symbolImageX} alt={xihuitlAnio.symbolImageX} className="card-img-top img-com" /></p> */}
                                <div className="d-flex justify-content-center align-items-center gap-3 pt-3">
                                    <img src={xihuitlAnio.numberImageX} alt={xihuitlAnio.numberImageX} className="img-com" />
                                    <img src={xihuitlAnio.symbolImageX} alt={xihuitlAnio.symbolImageX} className="img-com" />
                                </div>
                                {/*  <div className="card-header rounded-3 bg-light">
                                    <img src={xihuitlAnio.numberImageX} alt={xihuitlAnio.numberImageX} className="img-com" />
                                    <img src={xihuitlAnio.symbolImageX} alt={xihuitlAnio.symbolImageX} className="img-com"  />
                                </div> */}
                                <div className="card-body">
                                    <h5 className="card-title">Xihuitl</h5>
                                    <small className="text-secondary" style={{ fontSize: '11px', color: '#adb5bd' }}>* Según la correspondencia de Caso</small>
                                    <p className="card-text text-subtitle">Año:</p>
                                    {/* <p className="card-text">{xihuitlAnio.numeroX.español} - {xihuitlAnio.simboloX.español}</p>
                                    <p className="card-text">{xihuitlAnio.numeroX.nahuatl} - {xihuitlAnio.simboloX.nahuatl}</p>
                                    <p className='card-text'>{xihuitlAnio.numeroX.nusavi} - {xihuitlAnio.simboloX.nusavi}</p> */}
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">Idioma</th>
                                                <th scope="col">Numeral</th>
                                                <th scope="col">Signo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Español</td>
                                                <td>{xihuitlAnio.numeroX.español}</td>
                                                <td>{xihuitlAnio.simboloX.español}</td>
                                            </tr>
                                            <tr>
                                                <td>Nahuatl</td>
                                                <td>{xihuitlAnio.numeroX.nahuatl}</td>
                                                <td>{xihuitlAnio.simboloX.nahuatl}</td>
                                            </tr>
                                            <tr>
                                                <td>Ñu savi Ceremonial</td>
                                                <td>{xihuitlAnio.numeroX.nusavi}</td>
                                                <td>{xihuitlAnio.simboloX.nusavi}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <small className="text-secondary" style={{ fontSize: '13px' }}>* Correspondencia de Caso basado en la fecha de referencia: día 1-Coatl, año 3-Calli (13 de agosto de 1521)</small>
                    </div>
                </div>
            )}
            {/*  <footer className="mt-5 text-center text-secondary" style={{ color: '#adb5bd' }}>
                <p className="text-white">*Conversión de Caso basado en la fecha de referencia: día 1-Coatl, año 3-Calli (13 de agosto de 1521)</p>
                <p className="text-white">*Conversión de Meza basado en la fecha de referencia: día 1-Cipactli, año 1-Tochtli (12 de marzo de 2026)</p>
            </footer> */}
        </>
    )
}

export default Conversor