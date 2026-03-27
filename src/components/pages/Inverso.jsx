import React, { useState } from 'react'
import { getDiasMonth, convertirTonalli, tonalliSimbolos, convertirXihuitl } from '../funtions/funtions';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Estilos.css'

const Inverso = () => {
    const [numero, setNumero] = useState(1);
    const [simbolo, setSimbolo] = useState('Lagarto');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const formatDateForInput = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    };
    const [selectedStartDate, setSelectedStartDate] = useState(formatDateForInput(new Date()))
    const [selectedEndDate, setSelectedEndDate] = useState(formatDateForInput(new Date()))
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false);
    // Símbolos del xihuitl
    const xihuitlSimbolos = ['Caña', 'Pedernal', 'Casa', 'Conejo']
    //Fecha de referencia
    const referenceDate = new Date(1521, 7, 13)
    //Función para buscar coincidencias2
    const encuentraCoincidence = () => {
        const fechaInicio = new Date(selectedStartDate + 'T00:00:00')
        const fechaFin = new Date(selectedEndDate + 'T00:00:00')
        const fechaReferencia = new Date(referenceDate.getTime())
        //console.log(selectedStartDate.getFullYear())
        console.log(fechaFin)
        console.log(fechaInicio)

        setLoading(true)
        setResults([])
        setTimeout(() => {
            const matches = []
            //codigo prueba
            // if(fechaInicio < fechaReferencia){
            const tonalliStart = convertirTonalli(fechaInicio)
            // Ajustar por el cambio de calendario (5-15 de octubre de 1582 no existieron)
            const fechaJuliano = new Date(1582, 9, 4)
            const fechaGregoriano = new Date(1582, 9, 15)
            const diasSaltados = 10
            // if(fechaFin >= fechaGregoriano){
            for (let year = fechaInicio.getFullYear(); year <= fechaFin.getFullYear(); year++) {
                const startMonth = (year === fechaInicio.getFullYear()) ? fechaInicio.getMonth() : 0 //mes 0 de rango 0-11
                const endMonth = (year === fechaFin.getFullYear()) ? fechaFin.getMonth() : 11 //mes 11 de rango 0-11
                if (year === 0) continue //El año 0 no existe
                for (let month = startMonth; month < endMonth; month++) {
                    const diasInMonth = getDiasMonth(year, month)
                    const startDay = (year === fechaInicio.getFullYear() && month === fechaInicio.getMonth()) ? fechaInicio.getDate() : 1
                    const endDay = (year === fechaFin.getFullYear() && month === fechaFin.getMonth()) ? fechaFin.getDate() : diasInMonth
                    for (let day = startDay; day <= endDay; day++) {
                        /*  if(year === 1582 && month === 9 && day === 4){
                             year=fechaGregoriano.getFullYear()
                             month=fechaGregoriano.getMonth()
                             day=fechaGregoriano.getDate()
                             continue
                         } */
                        const currentDate = new Date(year, month, day)
                        const tonalli = convertirTonalli(currentDate)
                        const xihuitl = convertirXihuitl(currentDate)
                        if (tonalli.numero === numero && tonalli.simbolo.español === simbolo) {// if(tonalpohualli.numero === numero && tonalpohualli.simbolo === simbolo)
                            if (currentDate <= fechaJuliano) {
                                matches.push({
                                    date: currentDate,
                                    calendar: 'Juliano',
                                    tonalli: tonalli,
                                    xihuitl: xihuitl
                                })
                            } else {
                                matches.push({
                                    date: currentDate,
                                    calendar: 'Gregoriano',
                                    tonalli: tonalli,
                                    xihuitl: xihuitl
                                })
                            }
                        }
                    }
                }
                // }

            }

            // }
            // if(selectedStartDate < fechaReferencia){
            // Buscar en calendario juliano (fecha inicio hasta 4 de octubre de 1582)
            /* for(let year = fechaInicio.getFullYear();year <= 1582;year++){
                const startMonth=(year === fechaInicio.getFullYear()) ? fechaInicio.getMonth : 0 //mes 0
                const endMonth=(year === 1582) ? 9 : 11 //mes 11 de rango 0-11
                if(year === 0) continue //El año 0 no existe
                for(let month = startMonth;month < endMonth;month++){
                    const diasInMonth=getDiasMonth(year,month)
                    const startDay=(year === fechaInicio.getFullYear() && month === fechaInicio.getMonth()) ? fechaInicio.getDate() : 1
                    const endDay=(year === 1582 && month === 9) ? 4 : diasInMonth
                    for(let day = startDay;day <= endDay;day++){
                        if(year === 1582 && month === 9 && day > 4) break
                        const currentDate=new Date(year,month,day)
                        const tonalpohualli=convertirTonalpohualli(currentDate)
                        if(tonalpohualli.numero === numero && tonalpohualli.simbolo.español === simbolo){// if(tonalpohualli.numero === numero && tonalpohualli.simbolo === simbolo){
                            matches.push({
                                date:currentDate,
                                calendar:'Juliano',
                                tonalpohualli:tonalpohualli
                            })
                        }
                    }
                }
            } */
            // Buscar en calendario gregoriano (15 de octubre de 1582 hasta fecha final seleccionada)
            /* for(let year = 1582;year <= selectedEndDate.getFullYear();year++){
                const startMonth = (year === 1582) ? 9 : 0
                const endMonth = (year === selectedEndDate.getFullYear()) ? selectedEndDate.getMonth() : 11
                for(let month = startMonth;month <= endMonth;month++){
                    const diasInMonth = getDiasMonth(year,month)
                    const startDay=(year === 1582 && month === 9) ? 15 : 1
                    const endDay=(year === selectedEndDate.getFullYear() && month === selectedEndDate.getMonth()) ? selectedEndDate.getDate() : diasInMonth
                    for(let day = startDay;day <= endDay;day ++){
                        const currentDate=new Date (year,month,day)
                        const tonalpohualli=convertirTonalpohualli(currentDate)
                        if(tonalpohualli.numero === numero && tonalpohualli.simbolo.español === simbolo){//if(tonalpohualli.numero === numero && tonalpohualli.simbolo === simbolo){
                            matches.push({
                                date:currentDate,
                                calendar:'Gregoriano',
                                tonalpohualli:tonalpohualli
                            })
                        }
                    }
                }

            } */
            setResults(matches)
            setLoading(false)
            console.log(matches)
            // }
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
        <>
            <div className="container text-center">
                <h1 className="text-center mb-4">Correlaciones Calendarícas Precoloniales</h1>
                <div className="row justify-content-center">
                    <h5 className="text-center mb-4">Selecciona un numeral y un signo del Tonalli</h5>
                    <div className="col-md-11">
                        <label htmlFor="number" className="form-label">Numeral Tonalli</label>
                    </div>
                    <div className="col-md-11">
                        <select id="number" className="form-select" aria-label="Default select example" value={numero} onChange={(e) => setNumero(parseInt(e.target.value))}>
                            {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (<option key={num} value={num}>{num}</option>))}
                        </select>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-11">
                        <label htmlFor="symbol" className="form-label">Signo Tonalli</label>
                    </div>
                    <div className="col-md-11">
                        <select id="symbol" className="form-select" aria-label="Default select example" value={simbolo} onChange={(e) => setSimbolo(e.target.value)}>
                            {/* tonalpohualliSimbolos.map((sim)=>(<option key={sim} value={sim}>{sim.charAt(0).toUpperCase()+sim.slice(1)}</option>)) */}
                            {tonalliSimbolos.map((sim) => (<option key={sim.español} value={sim.español}>{sim.español.charAt(0).toUpperCase() + sim.español.slice(1)}</option>))}
                        </select>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-11">
                        <label htmlFor="datePicker" className="form-label">Fecha inicial</label>
                    </div>
                    <div className="col-md-11">
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-calendar3"></i></span>
                            <input type="date" className="form-control" value={selectedStartDate} onChange={(e) => setSelectedStartDate(e.target.value)} style={{ colorScheme: 'dark' }} />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-11">
                        <label htmlFor="datePicker" className="form-label">Fecha limite</label>
                    </div>
                    <div className="col-md-11">
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-calendar3"></i></span>
                            <input type="date" className="form-control" value={selectedEndDate} onChange={(e) => setSelectedEndDate(e.target.value)} style={{ colorScheme: 'dark' }} />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-11">
                        <button type="button" className="btn btn-secondary" onClick={encuentraCoincidence} disabled={loading}>{loading ? (<><span className="spinner-border spinner-border-sm me-2" role="status"></span>Calculando</>) : ('Buscar')}</button>
                    </div>
                </div>
                {results.length > 0 && (
                    <>
                        <div className="row justify-content-center">
                            <div className="col-md-11">
                                <h5 className="text-center mb-4">Resultados: {numero} - {simbolo}</h5>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-11">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Fecha</th>
                                            <th scope="col">Calendario</th>
                                            <th scope="col">Tonalli</th>
                                            <th scope="col">Xihuitl</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((result, index) => (
                                            <tr key={index}>
                                                <td>{formatDate(result.date)}</td>
                                                <td><span className={`badge ${result.calendar === 'Juliano' ? 'bg-warning' : 'bg-info'}`}>{result.calendar}</span></td>
                                                <td>{result.tonalli.numero.español} - {result.tonalli.simbolo.español}</td>
                                                {/* <td>{result.tonalpohualli.numero} - {result.tonalpohualli.simbolo}</td> */}
                                                <td>{result.xihuitl.numeroX} - {result.xihuitl.simboloXInv}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-11">
                                <h5 className="text-center mb-4">Se encontraron {results.length} coincidencias</h5>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Inverso