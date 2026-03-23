import React, {use, useState} from 'react'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Estilos.css'

const Inverso = () => {
    const [numero, setNumero] = useState(1);
    const [simbolo, setSimbolo] = useState('Lagarto');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState(new Date())
    const [selectedEndDate, setSelectedEndDate] = useState(new Date())
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false); 
    // Símbolos del Tonalpohualli
    const tonalpohualliSimbolos=[
        'Lagarto', 'Viento', 'Casa', 'Lagartija', 'Serpiente', 'Muerte', 'Venado', 'Conejo', 'Agua', 'Perro', 'Mono', 'Hierba', 'Caña', 'Jaguar', 'Aguila', 'Zopilote', 'Movimiento', 'Pedernal', 'Lluvia', 'Flor'
    ]
    // Símbolos del Duran
    const duranSimbolos=['Caña','Pedernal','Casa','Conejo']
    //Fecha de referencia
    const referenceDate=new Date(1521,7,13)
     // Función para verificar si un año es bisiesto
    const bisiestoAnio = (year) => {
        if (year < 1582) {
          // Calendario juliano: divisible entre 4
          return year % 4 === 0;
        } else {
          // Calendario gregoriano: divisible entre 4 pero no entre 100, excepto si es divisible entre 400
          return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        }
    }
    // Funcion Días por mes, considerando años bisiestos
    const getDiasMonth=(year, month)=>{
        const diasInMonth=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if(month === 1){
            return bisiestoAnio(year) ? 29 : 28
        }
        return diasInMonth[month]
    }
    // Función para calcular días transcurridos manualmente
    const calculateDias=(date1,date2)=>{
        let dias=0
        let diasDespues=0
        const referenceFecha=new Date(referenceDate.getTime())//fecha referencia 13-Ago-1521
        const fechaInicio=new Date(date1.getTime())
        const fechaFin=new Date(date2.getTime())
        // Ajustar por el cambio de calendario (5-15 de octubre de 1582 no existieron)
        const fechaCambioCalendarioA=new Date(1582, 9, 4)
        const fechaCambioCalendarioB=new Date(1582,9,15)
        const diasSaltados=10
        // Si la fecha inicio elegida es anterior y la fecha fin posterior a la fecha de referencia
        if(fechaInicio < referenceFecha && fechaFin > referenceFecha){
            // Calcular días año por año desde la fecha inicio hasta fecha referencia
            for(let year = fechaInicio.getFullYear(); year < referenceFecha.getFullYear(); year++){
                dias += bisiestoAnio(year) ? 366 : 365
            }
            // Restar meses del año de fecha inicio que ya pasaron
            for(let month=0;month<fechaInicio.getMonth();month++){
                dias -=getDiasMonth(fechaInicio.getFullYear(),month)
            }
            // Restar días del mes de fecha inicial
            dias-=fechaInicio.getDate()
            // Sumar meses del año referencia (fecha referencia) (01-1521 al 07-1521)
            for(let month=0;month<referenceFecha.getMonth();month++){
                dias += getDiasMonth(referenceFecha.getFullYear(),month)
            }
            console.log(dias)
            // Sumar días del mes referencia (fecha referencia) (01-08-1521 al 13-08-1521)
            dias +=referenceFecha.getDate()
            // Calcular días año por año desde la fecha referencia hasta fecha final
            //Salto de días por el cambio del calendario juliano al gregoriano en 1582
            if(fechaCambioCalendarioA && fechaCambioCalendarioB){
            diasDespues -=diasSaltados
            }
            // Calcular días año por año
            for(let year=referenceFecha;year<fechaFin.getFullYear();year++){
                diasDespues += bisiestoAnio(year) ? 366 :365                
            }
            // Restar meses del año referencia que ya pasaron (01-1521 al 07-1521)
            for(let month=0;month<referenceFecha.getMonth();month++){
                diasDespues -= getDiasMonth(referenceFecha.getFullYear(),month)
            }
            // Restar días del mes referencia que ya pasaron (01-08-1521 al 12-08-1521)
            diasDespues -= referenceFecha.getDate()
            // Sumar meses del año final que han pasado (01-añoFinal hasta el mes anterior al mes elegido del añoFinal)
            for(let month=0;month<fechaFin.getMonth;month++){
                diasDespues += getDiasMonth(fechaFin.getFullYear(),month)
            }
            // Sumar días del mes final que han pasado (01-mes-añoFinal hasta el dia-mes-añofinal)
            diasDespues += fechaFin.getDate()
            console.log(diasDespues)
            
            return {
                dias,
                diasDespues
            }
        }

    }
    // Función para calcular días transcurridos manualmente
    const calcularDiasManual=(date)=>{
        let dias=0
        const referenceFecha=new Date(1521,7,13)//fecha referencia 13-Ago-1521
        const fechaInicio=new Date(referenceFecha.getTime())
        const fechaFin=new Date(date.getTime())
        // Ajustar por el cambio de calendario (5-15 de octubre de 1582 no existieron)
        const fechaCambioCalendarioA=new Date(1582, 9, 4)
        const fechaCambioCalendarioB=new Date(1582,9,15)
        const diasSaltados=10
        // Si la fecha elegida es posterior a la fecha de referencia
        if(fechaInicio < fechaFin){
            //Salto de días por el cambio del calendario juliano al gregoriano en 1582
            if(fechaCambioCalendarioA && fechaCambioCalendarioB){
            dias -=diasSaltados
            }
            // Calcular días año por año
            for(let year=fechaInicio.getFullYear(); year < fechaFin.getFullYear(); year++){
                dias += bisiestoAnio(year) ? 366 :365
            }
            // Restar meses del año inicial que ya pasaron (01-1521 al 07-1521)
            for(let month=0;month<fechaInicio.getMonth();month++){
                dias -= getDiasMonth(fechaInicio.getFullYear(),month)
            }
            // Restar días del mes inicial que ya pasaron (01-08-1521 al 12-08-1521)
            dias -= fechaInicio.getDate()
            // Sumar meses del año final que han pasado (01-añoFinal hasta el mes anterior al mes elegido del añoFinal)
            for (let month=0; month<fechaFin.getMonth();month++){
                dias += getDiasMonth(fechaFin.getFullYear(), month)
            }
            // Sumar días del mes final que han pasado (01-mes-añoFinal hasta el dia-mes-añofinal)
            dias += fechaFin.getDate() 
        }else if(fechaInicio > fechaFin){// Si la fecha elegida es anterior a la fecha de referencia
            // Calcular días año por año
            for(let year=fechaFin.getFullYear(); year < fechaInicio.getFullYear(); year++){
                dias += bisiestoAnio(year) ? 366 :365
            }
            // Restar meses del año final que ya pasaron (01-añoFinal hasta el mes anterior al mes elegido del añoFinal)
            for(let month=0;month<fechaFin.getMonth();month++){
                dias -= getDiasMonth(fechaFin.getFullYear(),month)
            }
            // Restar días del mes final que ya pasaron (01-mes-añoFinal hasta el dia-mes-añofinal)
            dias -= fechaFin.getDate()
            // Sumar meses del año inicial (fecha referencia) (01-1521 al 07-1521)
            for (let month=0; month<fechaInicio.getMonth();month++){
                dias += getDiasMonth(fechaInicio.getFullYear(), month)
            }
            // Sumar días del mes Inicial (fecha referencia) (01-08-1521 al 13-08-1521)
            dias += fechaInicio.getDate() 
        }
        return dias
    }
    //Funcion para convertir la fecha al calendario Tonalpohualli
    const convertTonalpohualli=(date)=>{
        const fechaReferencia=new Date(referenceDate.getTime())
        const fechaInicial=new Date(date.getTime())
        const digitoReferencia=1 // índice para digito tomado del 1 al 13
        const simboloReferencia=4 // índice para serpiente tomado del 0 al 19
        if(fechaInicial < fechaReferencia){// Si la fecha elegida es anterior a la fecha de referencia
            const diferenciaDiasAntes=(calculateDias(date))

        }

    }
    //Funcion para convertir la fecha al calendario Tonalpohualli
    const convertirTonalpohualli=(date)=>{
        const fechaInicial=new Date(referenceDate.getTime())
        const fechaFinal=new Date(date.getTime())
        const digitoReferencia=1 // índice para digito tomado del 1 al 13
        const simboloReferencia=4 // índice para serpiente tomado del 0 al 19
        // Si la fecha elegida es posterior a la fecha de referencia
        if(fechaInicial < fechaFinal){
            const diferenciaDias=(calcularDiasManual(date))
            //El ciclo tonalpohualli es de 260 dias (13*20)
            const tonalpohualliCiclo=260
            const diaCiclo=((diferenciaDias % tonalpohualliCiclo)+tonalpohualliCiclo) %  tonalpohualliCiclo 
            //Calcular el numero (1-13) y simbolo (0-19)
            let numero =((digitoReferencia + diaCiclo) % 13)
            numero=numero <= 0 ? numero + 13 : numero
            let simboloCal=((simboloReferencia + diaCiclo) % 20)
            simboloCal=simboloCal < 0 ? simboloCal + 20 : simboloCal
            return{
                numero,
                simbolo: tonalpohualliSimbolos[simboloCal]
            }
        }else if(fechaInicial > fechaFinal){// Si la fecha elegida es anterior a la fecha de referencia
            const diferenciaDias=(calcularDiasManual(date))
            //El ciclo tonalpohualli es de 260 dias (13*20)
            const tonalpohualliCiclo=260
            const diaCiclo=((diferenciaDias % tonalpohualliCiclo)+tonalpohualliCiclo) %     tonalpohualliCiclo 
            //Calcular el numero (1-13) y simbolo (0-19)
            let numero =((digitoReferencia - diaCiclo) % 13)
            numero=numero <= 0 ? numero + 13 : numero
            let simboloCal=((simboloReferencia - diaCiclo) % 20)
            simboloCal=simboloCal < 0 ? simboloCal + 20 : simboloCal
            return{
                numero,
                simbolo: tonalpohualliSimbolos[simboloCal]
            }

        }else{// Si la fecha elegida es la fecha de referencia
            let numero=digitoReferencia
            let simboloCal=simboloReferencia
            return{
                numero,
                simbolo: tonalpohualliSimbolos[simboloCal]
                
            }
        }
    } 
    //Función para buscar coincidencias2
    const coincidence = () =>{
        setLoading(true)
        setResults([])
        setTimeout(()=>{
            const matches=[]

        })
    }
    //Función para buscar coincidencias
    const findCoincidence = () =>{
        setLoading(true)
        setResults([])
        setTimeout(()=>{
            const matches=[]
            // Buscar en calendario juliano (45 a.C. hasta 4 de octubre de 1582)
            for(let year = -45; year <= 1582; year++){
                if(year === 0) continue //El año 0 no existe
                for (let month = 0;month < 12; month++){
                    const diasInMonth=getDiasMonth(year,month)
                    for(let day = 1;day <= diasInMonth;day++){
                        if(year === 1582 && month === 9 && day > 4) break
                            const currentDate=new Date(year,month,day)
                            const tonalpohualli=convertirTonalpohualli(currentDate)
                            if(tonalpohualli.numero === numero && tonalpohualli.simbolo === simbolo){
                                matches.push({
                                    date:currentDate,
                                    calendar:'Juliano',
                                    tonalpohualli:tonalpohualli
                                })
                            }
                    }
                }
            }
            // Buscar en calendario gregoriano (15 de octubre de 1582 hasta fecha seleccionada)
            for(let year = 1582;year <= selectedDate.getFullYear(); year++){
                const startMonth = (year === 1582) ? 9 : 0
                const endMonth = (year === selectedDate.getFullYear()) ? selectedDate.getMonth() : 11
                for(let month = startMonth; month <= endMonth;month++){
                    const diasInMonth = getDiasMonth(year,month)
                    const startDay=(year === 1582 && month === 9) ? 15 : 1
                    const endDay=(year === selectedDate.getFullYear() && month === selectedDate.getMonth()) ? selectedDate.getDate() : diasInMonth
                    for(let day = startDay;day <= endDay;day++){
                        const currentDate=new Date(year, month, day)
                        const tonalpohualli=convertirTonalpohualli(currentDate)
                        if(tonalpohualli.numero === numero && tonalpohualli.simbolo === simbolo){
                            matches.push({
                                date:currentDate,
                                calendar:'Gregoriano',
                                tonalpohualli:tonalpohualli
                            })
                        }
                    }
                }
            }
            setResults(matches)
            setLoading(false)
            console.log(matches)
        },100)
    }
    // Formatear fecha para mostrar
    const formatDate=(date)=>{
        return date.toLocaleDateString('es-ES',{
            year:'numeric',
            month:'long',
            day:'numeric'
        })
    }
    return (
        <>
        <div class="container text-center">
            <h1 class="text-center mb-4">Conversor de calendarios</h1>
            <div class="row justify-content-center">
                <h5 class="text-center mb-4">Selecciona un digito y un simbolo del Tonalpohualli</h5>
                <div class="col-md-11">
                    <label for="number" class="form-label">Digito Tonalpohualli</label>
                </div>
                <div class="col-md-11">
                    <select id="number" class="form-select" aria-label="Default select example" value={numero} onChange={(e)=>setNumero(parseInt(e.target.value))}>
                      {Array.from({length:13},(_, i)=>i+1).map((num)=>(<option key={num} value={num}>{num}</option>))}
                    </select>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-11">
                    <label for="symbol" class="form-label">Simbolo Tonalpohualli</label>
                </div>
                <div class="col-md-11">
                    <select id="symbol" class="form-select" aria-label="Default select example" value={simbolo} onChange={(e)=>setSimbolo(e.target.value)}>
                      {tonalpohualliSimbolos.map((sim)=>(<option key={sim} value={sim}>{sim.charAt(0).toUpperCase()+sim.slice(1)}</option>))}
                    </select>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-11">
                    <label for="datePicker" class="form-label">Fecha limite</label>
                </div>
                <div class="col-md-11">
                    <Datetime value={selectedDate} onChange={setSelectedDate} inputProps={{className:'form-control'}} />
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-11">
                    <button type="button" class="btn btn-secondary" onClick={findCoincidence} disabled={loading}>{loading ? (<><span class="spinner-border spinner-border-sm me-2" role="status"></span>Calculando</>) : ('Buscar')}</button>
                </div>
            </div>
            {results.length > 0 && (
            <>
            <div class="row justify-content-center">
                <div class="col-md-11">
                    <h5 class="text-center mb-4">Resultados: {numero} - {simbolo}</h5>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-11">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Fecha</th>
                                <th scope="col">Calendario</th>
                                <th scope="col">Tonalpohualli</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result,index)=>(
                                <tr key={index}>
                                    <td>{formatDate(result.date)}</td>
                                    <td><span class={`badge ${result.calendar === 'Juliano' ? 'bg-warning' : 'bg-info'}`}>{result.calendar}</span></td>
                                    <td>{result.tonalpohualli.numero} - {result.tonalpohualli.simbolo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-11">
                    <h5 class="text-center mb-4">Se encontraron {results.length} coincidencias</h5>
                </div>
            </div>
            </>
            )}
        </div>
        </>
    )
}

export default Inverso