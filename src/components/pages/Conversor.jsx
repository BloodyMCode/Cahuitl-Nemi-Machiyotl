import React, { useState } from 'react'
import { convertirTonalli, convertirXihuitl } from '../funtions/funtions';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Estilos.css'

const Conversor = () => {
    //Estados para almacenar la fecha seleccionada y los resultados
    const [selectedDate, setSelectedDate] = useState(null)
    const [tonalliDia, setTonalliDia] = useState(null)
    const [xihuitlAnio, setXihuitlAnio] = useState(null)
    //Funcion para manejar el clic en el boton
    const handleConvert = () => {
        if (!selectedDate) return
        const date = new Date(selectedDate);//seleccionar fecha
        const tonalliResult = convertirTonalli(date)//llamada de funcion
        const xihuitlResult = convertirXihuitl(date)//llamada de funcion
        //Actualizar el estado
        setTonalliDia(tonalliResult)
        setXihuitlAnio(xihuitlResult)
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
                                <div className="input-group">
                                    <span className="input-group-text"><i className="bi bi-calendar-event"></i></span>
                                    <input type="datetime-local" className="form-control" value={selectedDate || ''} onChange={(e) => setSelectedDate(e.target.value)} style={{ colorScheme: 'dark' }} />
                                </div>
                                <br />
                                <button type="button" className="btn btn-secondary" onClick={handleConvert} disabled={!selectedDate}>Mostrar conversión</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            {tonalliDia && xihuitlAnio && (
                <div className="container text-center">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card" >
                                <p><img src={tonalliDia.numberImage} alt={tonalliDia.numberImage} className="card-img-top img-com" /> <img src={tonalliDia.symbolImage} alt={tonalliDia.symbolImage} className="card-img-top img-com" /></p>
                                <div className="card-body">
                                    <h5 className="card-title">Tonalli</h5>
                                    <p className="card-text text-subtitle">Día:</p>
                                    <p className="card-text">{tonalliDia.numero} - {tonalliDia.simbolo.español}</p>
                                    <p className="card-text">{tonalliDia.numero} - {tonalliDia.simbolo.nahuatl}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card" >
                                <p><img src={xihuitlAnio.numberImageD} alt={xihuitlAnio.numberImageD} className="card-img-top img-com" /> <img src={xihuitlAnio.symbolImageD} alt={xihuitlAnio.symbolImageD} className="card-img-top img-com" /></p>
                                <div className="card-body">
                                    <h5 className="card-title">Xihuitl</h5>
                                    <p className="card-text text-subtitle">Año:</p>
                                    <p className="card-text">{xihuitlAnio.numeroX} - {xihuitlAnio.simboloX.español}</p>
                                    <p className="card-text">{xihuitlAnio.numeroX} - {xihuitlAnio.simboloX.nahuatl}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <footer className="mt-5 text-center text-muted">
                <p className="text-white">Basado en la fecha de referencia: día 1-Serpiente, año 3-Casa (13 de agosto de 1521)</p>
            </footer>
        </>
    )
}

export default Conversor