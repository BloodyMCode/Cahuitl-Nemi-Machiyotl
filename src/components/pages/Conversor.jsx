import React, { useState } from 'react'
import { convertirTonalpohualli, convertirDuran } from '../funtions/funtions';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Estilos.css'

const Conversor = () => {
    //Estados para almacenar la fecha seleccionada y los resultados
    const [selectedDate, setSelectedDate] = useState(null)
    const [tonalpohualliDia, setTonalpohualliDia] = useState(null)
    const [duranAnio, setDuranAnio] = useState(null)
    //Funcion para manejar el clic en el boton
    const handleConvert = () => {
        if (!selectedDate) return
        const date = new Date(selectedDate);//seleccionar fecha
        const tonalpohualliResult = convertirTonalpohualli(date)//llamada de funcion
        const duranResult = convertirDuran(date)//llamada de funcion
        //Actualizar el estado
        setTonalpohualliDia(tonalpohualliResult)
        setDuranAnio(duranResult)
    }
    return (
        <>
            <div className="container text-center">
                <h1 className="text-center mb-4">Conversor de calendarios</h1>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                Selecciona una fecha y hora
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">Calendario</h5>
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
            {tonalpohualliDia && duranAnio && (
                <div className="container text-center">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card" >
                                <p><img src={tonalpohualliDia.numberImage} alt={tonalpohualliDia.numberImage} className="card-img-top img-com" /> <img src={tonalpohualliDia.symbolImage} alt={tonalpohualliDia.symbolImage} className="card-img-top img-com" /></p>
                                <div className="card-body">
                                    <h5 className="card-title">Calendario Tonalpohualli</h5>
                                    <p className="card-text text-subtitle">Día:</p>
                                    <p className="card-text">{tonalpohualliDia.numero} - {tonalpohualliDia.simbolo.español}</p>
                                    <p className="card-text">{tonalpohualliDia.numero} - {tonalpohualliDia.simbolo.nahuatl}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card" >
                                <p><img src={duranAnio.numberImageD} alt={duranAnio.numberImageD} className="card-img-top img-com" /> <img src={duranAnio.symbolImageD} alt={duranAnio.symbolImageD} className="card-img-top img-com" /></p>
                                <div className="card-body">
                                    <h5 className="card-title">Calendario Durán</h5>
                                    <p className="card-text text-subtitle">Año:</p>
                                    <p className="card-text">{duranAnio.numeroD} - {duranAnio.simboloD.español}</p>
                                    <p className="card-text">{duranAnio.numeroD} - {duranAnio.simboloD.nahuatl}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <footer className="mt-5 text-center text-muted">
                <p className="text-white">Basado en la fecha de referencia: 13 de agosto de 1521 (día 1-Serpiente, año 3-Casa)</p>
            </footer>
        </>
    )
}

export default Conversor