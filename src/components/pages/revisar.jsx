/* import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar el CSS

const NavbarCollapse = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">Mi Sitio</a>
      <button 
        className="navbar-toggler" 
        type="button" 
        data-toggle="collapse" // Este atributo es de Bootstrap JS, en React puro se maneja con estado
        data-target="#navbarNav" // Igual que arriba
        aria-controls="navbarNav" 
        aria-expanded={isNavOpen} // Controlado por el estado
        aria-label="Toggle navigation"
        onClick={toggleNav} // El evento onClick de React
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="/">Inicio</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/acerca">Acerca</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarCollapse; */



/* ****************CODIGO INDIVIDUAL CONVERSOR.JSX********************* */


/* import React, {useState} from 'react'
import Datetime from 'react-datetime';
import {convertirTonalpohualli, convertirDuran} from '../funtions/funtions';
import "react-datetime/css/react-datetime.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Estilos.css'

const Conversor = () => {
    //Estados para almacenar la fecha seleccionada y los resultados
    const [selectedDate, setSelectedDate]=useState(null)
    const [tonalpohualliDia, setTonalpohualliDia]=useState(null)
    const [duranAnio, setDuranAnio]=useState(null)
   /*  //Simbolos del calendario Tonalpohualli
    const tonalpohualliSimbolos=[
        {español:"Lagarto", nahuatl:"Cipactli", image:"lagarto.png"},
        {español:"Viento", nahuatl:"Echecatl", image:"viento.png"},
        {español:"Casa", nahuatl:"Calli", image:"casa.png"},
        {español:"Lagartija", nahuatl:"Cuetzpalli", image:"lagartija.png"},
        {español:"Serpiente", nahuatl:"Coatl", image:"serpiente.png"},
        {español:"Muerte", nahuatl:"Miquiztli", image:"muerte.png"},
        {español:"Venado", nahuatl:"Mazatl", image:"venado.png"},
        {español:"Conejo", nahuatl:"Tochtli", image:"conejo.png"},
        {español:"Agua", nahuatl:"Atl", image:"agua.png"},
        {español:"Perro", nahuatl:"Itzcuintli", image:"perro.png"},
        {español:"Mono", nahuatl:"Ozomatli", image:"mono.png"},
        {español:"Hierba", nahuatl:"Malinalli", image:"hierba.png"},
        {español:"Caña", nahuatl:"Acatl", image:"caña.png"},
        {español:"Jaguar", nahuatl:"Ocelotl", image:"jaguar.png"},
        {español:"Águila", nahuatl:"Cuauhtli", image:"aguila.png"},
        {español:"Zopilote", nahuatl:"Cozcacuauhtli", image:"zopilote.png"},
        {español:"Movimiento", nahuatl:"Ollin", image:"movimiento.png"},
        {español:"Pedernal", nahuatl:"Tecpatl", image:"pedernal.png"},
        {español:"Lluvia", nahuatl:"Quiahuitl", image:"lluvia.png"},
        {español:"Flor", nahuatl:"Xochitl", image:"flor.png"},
    ] */
  /*   //Simbolos del calendario Duran
    const duranSimbolos=[
       {español:"Caña", nahuatl:"Acatl", image:"caña.png"}, 
       {español:"Pedernal", nahuatl:"Tecpatl", image:"pedernal.png"},
       {español:"Casa", nahuatl:"Calli", image:"casa.png"},
       {español:"Conejo", nahuatl:"Tochtli", image:"conejo.png"},
    ]   */   
    /* //Funcion para convertir la fecha al calendario Tonalpohualli
    const convertirTonalpohualli=(date)=>{
        // Fecha de referencia: 13 de agosto de 1521 (1-serpiente)
        const referenceFecha=new Date(1521,7,13)
        const fechaInicial=new Date(referenceFecha.getTime())
        const fechaFinal=new Date(date.getTime())
        const digitoReferencia=1 // índice para digito tomado del 1 al 13
        const simboloReferencia=4 // índice para serpiente tomado del 0 al 19
        // Si la fecha elegida es posterior a la fecha de referencia
        if(fechaInicial < fechaFinal){
            const diferenciaDias=(calcularDiasManual(date))
            //El ciclo tonalpohualli es de 260 dias (13*20)
            const tonalpohualliCiclo=260
            const diaCiclo=((diferenciaDias % tonalpohualliCiclo)+tonalpohualliCiclo) %  tonalpohualliCiclo 
            console.log(diaCiclo)
            //Calcular el numero (1-13) y simbolo (0-19)
            let numero =((digitoReferencia + diaCiclo) % 13)
            numero=numero <= 0 ? numero + 13 : numero
            let simboloCal=((simboloReferencia + diaCiclo) % 20)
            simboloCal=simboloCal < 0 ? simboloCal + 20 : simboloCal
            return{
                numero,
                simbolo: tonalpohualliSimbolos[simboloCal],
                numberImage: new URL(`../images/${getNumberoImage(numero)}`, import.meta.url).href,
                symbolImage: new URL(`../images/${tonalpohualliSimbolos[simboloCal].image}`, import.meta.url).href,
                diaCiclo
            }
        }else if(fechaInicial > fechaFinal){// Si la fecha elegida es anterior a la fecha de referencia
            const diferenciaDias=(calcularDiasManual(date))
            console.log(diferenciaDias)
            //El ciclo tonalpohualli es de 260 dias (13*20)
            const tonalpohualliCiclo=260
            const diaCiclo=((diferenciaDias % tonalpohualliCiclo)+tonalpohualliCiclo) %     tonalpohualliCiclo 
            console.log(diaCiclo)
            //Calcular el numero (1-13) y simbolo (0-19)
            let numero =((digitoReferencia - diaCiclo) % 13)
            numero=numero <= 0 ? numero + 13 : numero
            let simboloCal=((simboloReferencia - diaCiclo) % 20)
            simboloCal=simboloCal < 0 ? simboloCal + 20 : simboloCal
            return{
                numero,
                simbolo: tonalpohualliSimbolos[simboloCal],
                numberImage: new URL(`../images/${getNumberoImage(numero)}`, import.meta.url).href,
                symbolImage: new URL(`../images/${tonalpohualliSimbolos[simboloCal].image}`, import.meta.url).href,
                diaCiclo
            }

        }else{// Si la fecha elegida es la fecha de referencia
            let numero=digitoReferencia
            let simboloCal=simboloReferencia
            return{
                numero,
                simbolo: tonalpohualliSimbolos[simboloCal],
                numberImage: new URL(`../images/${getNumberoImage(numero)}`, import.meta.url).href,
                symbolImage: new URL(`../images/${tonalpohualliSimbolos[simboloCal].image}`, import.meta.url).href,
                
            }
        }
    }  */
  /*   //Funcion para convertir la fecha al calendario Duran
    const convertirDuran=(date)=>{
        // Fecha de referencia: 13 de agosto de 1521 (3-Casa en Durán)
        const referenceAño=1521
        // Obtener el año de la fecha seleccionada
        const currentAño=date.getFullYear()
        // Fecha de referencia: 13 de agosto de 1521 (3-casa)
        const digitoReferencia=3 // índice para digito tomado del 1 al 13
        const simboloReferencia=2 // índice para casa tomado del 0 al 3
        if(referenceAño < currentAño){//Si el año de referencia (1521) es menor al año seleccionado 
            //Calcular diferencia
            const diferencia=currentAño - referenceAño
            console.log(diferencia)
            // Calcular el número cíclico (1-13)
            let numeroD=((digitoReferencia + diferencia) % 13)
            numeroD=numeroD <= 0 ? numeroD + 13 : numeroD
             // Calcular el símbolo (0-3)
            let simboloCalDuran=((simboloReferencia + diferencia) % 4)
            simboloCalDuran=simboloCalDuran < 0 ? simboloCalDuran + 4 : simboloCalDuran

            return{
            numeroD,
            simboloD:duranSimbolos[simboloCalDuran],
            numberImageD: new URL(`../images/${getNumberoImage(numeroD)}`, import.meta.url).href,
            symbolImageD: new URL(`../images/${duranSimbolos[simboloCalDuran].image}`, import.meta.url).href,
            
            simboloCalDuran
            }
        }else if(referenceAño > currentAño){//Si el año de referencia (1521) es mayor al año seleccionado
            //Calcular diferencia
            const diferencia=referenceAño - currentAño
            console.log(diferencia)
            // Calcular el número cíclico (1-13)
            let numeroD=((digitoReferencia - diferencia) % 13)
            console.log(numeroD)
            numeroD=numeroD <= 0 ? numeroD + 13 : numeroD
            // Calcular el símbolo (0-3)
            let simboloCalDuran=((simboloReferencia - diferencia) % 4)
               console.log(simboloCalDuran)
            simboloCalDuran=simboloCalDuran < 0 ? simboloCalDuran + 4 : simboloCalDuran

            return{
            numeroD,
            simboloD:duranSimbolos[simboloCalDuran],
            numberImageD: new URL(`../images/${getNumberoImage(numeroD)}`, import.meta.url).href,
            symbolImageD: new URL(`../images/${duranSimbolos[simboloCalDuran].image}`, import.meta.url).href,
            
            simboloCalDuran
            }
        }else{//Si el año de referencia (1521) es el año seleccionado
            let numeroD=digitoReferencia
            let simboloCalDuran=simboloReferencia
            return{
            numeroD,
            simboloD:duranSimbolos[simboloCalDuran],
            numberImageD: new URL(`../images/${getNumberoImage(numeroD)}`, import.meta.url).href,
            symbolImageD: new URL(`../images/${duranSimbolos[simboloCalDuran].image}`, import.meta.url).href,
            
            simboloCalDuran
            }
        }
    } 
    //Funcion para manejar el clic en el boton
    const handleConvert = ()=>{
        if (!selectedDate) return
        const date = new Date(selectedDate);//seleccionar fecha
        const tonalpohualliResult=convertirTonalpohualli(date)//llamada de funcion
        const duranResult=convertirDuran(date)//llamada de funcion
        //Actualizar el estado
        setTonalpohualliDia(tonalpohualliResult)
        setDuranAnio(duranResult)
    }
   /*  //Funcion para obtener el archivo de imagen del numero
    const getNumberoImage=(numero)=>{
        const numerosNombres=[
            "1","2","3","4","5","6","7","8","9","10","11","12","13"
        ]
        return `${numerosNombres[numero-1]}.png`
    } 
  return (
    <>
    <div class="container text-center">
        <h1 class="text-center mb-4">Conversor de calendarios</h1>
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                      Selecciona una fecha y hora
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">Calendario</h5>
                        <Datetime
                        value={selectedDate}
                        onChange={setSelectedDate}
                        inputProps={{className:"form-control"}}
                        />
                        <br />
                        <button type="button" class="btn btn-secondary" onClick={handleConvert} disabled={!selectedDate}>Mostrar conversión</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br></br>
    {tonalpohualliDia && duranAnio &&(
    <div class="container text-center">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card" >
                   <p><img src={tonalpohualliDia.numberImage} alt={tonalpohualliDia.numberImage} class="card-img-top img-com"/> <img src={tonalpohualliDia.symbolImage} alt={tonalpohualliDia.symbolImage} class="card-img-top img-com"/></p>
                   <div class="card-body">
                     <h5 class="card-title">Calendario Tonalpohualli</h5>
                     <p class="card-text text-subtitle">Día:</p>
                     <p class="card-text">{tonalpohualliDia.numero} - {tonalpohualliDia.simbolo.español}</p>
                     <p class="card-text">{tonalpohualliDia.numero} - {tonalpohualliDia.simbolo.nahuatl}</p>                      
                   </div>
                </div>
            </div>
            <div class="col-md-6">              
                <div class="card" >
                    <p><img src={duranAnio.numberImageD} alt={duranAnio.numberImageD} class="card-img-top img-com" /> <img src={duranAnio.symbolImageD} alt={duranAnio.symbolImageD} class="card-img-top img-com" /></p>
                    <div class="card-body">
                        <h5 class="card-title">Calendario Durán</h5>
                        <p class="card-text text-subtitle">Año:</p>
                        <p class="card-text">{duranAnio.numeroD} - {duranAnio.simboloD.español}</p>
                        <p class="card-text">{duranAnio.numeroD} - {duranAnio.simboloD.nahuatl}</p>
                    </div>
                  </div>
            </div>
        </div>
    </div>
)}
    <footer className="mt-5 text-center text-muted">
        <p>Basado en la fecha de referencia: 13 de agosto de 1521 (día 1-Serpiente, año 3-Casa)</p>
    </footer>
    </>
  )
}

export default Conversor */


/* ****************CODIGO INDIVIDUAL INVERSO.JSX********************* */


/* import React, {useState} from 'react'
import Datetime from 'react-datetime';
import { getDiasMonth, convertirTonalpohualli, tonalpohualliSimbolos } from '../funtions/funtions';
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
   /*  const tonalpohualliSimbolos=[
        'Lagarto', 'Viento', 'Casa', 'Lagartija', 'Serpiente', 'Muerte', 'Venado', 'Conejo', 'Agua', 'Perro', 'Mono', 'Hierba', 'Caña', 'Jaguar', 'Aguila', 'Zopilote', 'Movimiento', 'Pedernal', 'Lluvia', 'Flor'
    ] 
    // Símbolos del Duran
    const duranSimbolos=['Caña','Pedernal','Casa','Conejo']
    //Fecha de referencia
    const referenceDate=new Date(1521,7,13)
     // Función para verificar si un año es bisiesto
/*     const bisiestoAnio = (year) => {
        if (year < 1582) {
          // Calendario juliano: divisible entre 4
          return year % 4 === 0;
        } else {
          // Calendario gregoriano: divisible entre 4 pero no entre 100, excepto si es divisible entre 400
          return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        }
    } */
 /*    // Funcion Días por mes, considerando años bisiestos
    const getDiasMonth=(year, month)=>{
        const diasInMonth=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if(month === 1){
            return bisiestoAnio(year) ? 29 : 28
        }
        return diasInMonth[month]
    } */
    
 /*    // Función para calcular días transcurridos manualmente
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
    } */
   
    //Funcion para convertir la fecha al calendario Tonalpohualli
  /*   const convertirTonalpohualli=(date)=>{
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
    const encuentraCoincidence = () =>{
        const fechaInicio=new Date(selectedDate)
        const fechaFin=new Date(selectedEndDate)
        const fechaReferencia=new Date(referenceDate.getTime())
        //console.log(selectedDate.getFullYear())
        console.log(fechaFin)
        console.log(fechaInicio)
        setLoading(true)
        setResults([])
        setTimeout(()=>{
            const matches=[]
           // if(selectedStartDate < fechaReferencia){
                // Buscar en calendario juliano (fecha inicio hasta 4 de octubre de 1582)
                for(let year = fechaInicio.getFullYear();year <= 1582;year++){
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
                }
                // Buscar en calendario gregoriano (15 de octubre de 1582 hasta fecha final seleccionada)
                for(let year = 1582;year <= selectedEndDate.getFullYear();year++){
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

                }
                setResults(matches)
                setLoading(false)
                console.log(matches)
           // }
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
            <h1 class="text-center mb-4">Conversor de calendarios invertido</h1>
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
                      {/* tonalpohualliSimbolos.map((sim)=>(<option key={sim} value={sim}>{sim.charAt(0).toUpperCase()+sim.slice(1)}</option>)) *//*}/*
                      {tonalpohualliSimbolos.map((sim)=>(<option key={sim.español} value={sim.español}>{sim.español.charAt(0).toUpperCase()+sim.español.slice(1)}</option>))}
                    </select>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-11">
                    <label for="datePicker" class="form-label">Fecha inicial</label>
                </div>
                <div class="col-md-11">
                    <Datetime value={selectedDate} onChange={setSelectedDate} inputProps={{className:'form-control'}} />
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-11">
                    <label for="datePicker" class="form-label">Fecha limite</label>
                </div>
                <div class="col-md-11">
                    <Datetime value={selectedEndDate} onChange={setSelectedEndDate} inputProps={{className:'form-control'}} />
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-11">
                    <button type="button" class="btn btn-secondary" onClick={encuentraCoincidence} disabled={loading}>{loading ? (<><span class="spinner-border spinner-border-sm me-2" role="status"></span>Calculando</>) : ('Buscar')}</button>
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
                                    <td>{result.tonalpohualli.numero} - {result.tonalpohualli.simbolo.español}</td>
                                    {/* <td>{result.tonalpohualli.numero} - {result.tonalpohualli.simbolo}</td> *//*}
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

export default Inverso */