import React, {use, useState} from 'react'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Estilos.css'
import moment from 'moment'

const Conversor = () => {
    //Estados para almacenar la fecha seleccionada y los resultados
    const [selectedDate, setSelectedDate]=useState(null)
    const [tonalpohualliDia, setTonalpohualliDia]=useState(null)
    const [duranAnio, setDuranAnio]=useState(null)
    //Simbolos del calendario Tonalpohualli
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
    ]
    //Simbolos del calendario Duran
    const duranSimbolos=[
       {español:"Caña", nahuatl:"Acatl", image:"caña.png"}, 
       {español:"Pedernal", nahuatl:"Tecpatl", image:"pedernal.png"},
       {español:"Casa", nahuatl:"Calli", image:"casa.png"},
       {español:"Conejo", nahuatl:"Tochtli", image:"conejo.png"},
    ] 
    
    // Fecha de referencia: 13 de agosto de 1521 = 1-Serpiente
    const referenceFecha2=new Date('1521-08-13')// 13 de agosto de 1521
    const referenceTonalpohualli={
        number:1,
        simboloT:'Serpiente',
        simboloIndex:4 // índice de Serpiente en el array
    }


    
    // Función para verificar si un año es bisiesto según las reglas correspondientes
    const esBisiesto = (year) => {
        if (year < 1582) {
          // Calendario juliano: divisible entre 4
          return year % 4 === 0;
        } else {
          // Calendario gregoriano: divisible entre 4 pero no entre 100, excepto si es divisible entre 400
          return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        }
    }



    // Funcion Días por mes, considerando años bisiestos
    const getDiasMonth=(year, month/* , isGregorian = true */)=>{
        const diasInMonth=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if(month === 1){
            return esBisiesto(year/* , isGregorian */) ? 29 : 28
        }
        return diasInMonth[month]
        
    }
    // Función para calcular días transcurridos manualmente
    const calcularDiasManual=(date)=>{
        let dias=0
        const referenceFecha=new Date(1521,7,13)
        const fechaInicio=new Date(referenceFecha.getTime())
        const fechaFin=new Date(date.getTime())
        // Ajustar por el cambio de calendario (4-15 de octubre de 1582 no existieron)
        const fechaCambioCalendario=new Date(1582, 9, 4)
        const fechaCambioCalendario2=new Date(1582,9,15)
        const diasSaltados=10
        // Si la fecha de inicio es anterior al cambio y la fecha fin es posterior
        if(fechaInicio < fechaFin){
            if(fechaCambioCalendario && fechaCambioCalendario2){
            dias -=diasSaltados
            }
            console.log(dias)
            // Calcular días año por año
            for(let year=fechaInicio.getFullYear(); year < fechaFin.getFullYear(); year++){
                dias += esBisiesto(year) ? 366 :365
            }
            console.log(dias)
            // Restar días del año inicial que ya pasaron
            for(let month=0;month<fechaInicio.getMonth();month++){
                dias -= getDiasMonth(fechaInicio.getFullYear(),month)
                console.log(dias)
            }
            console.log(dias)
            // Restar días del mes inicial que ya pasaron
            dias -= fechaInicio.getDate()
            /* for(let day=0;day<fechaInicio.getDate();day++){
                dias -= 1
            } */
            /* let dia=12 *///dias del mes 7
            /* dias-=fechaInicio.getDate() - dia */
            console.log(dias)
            // Sumar días del año final que han pasado
            for (let month=0; month<fechaFin.getMonth();month++){
                dias += getDiasMonth(fechaFin.getFullYear(), month)
            }
            console.log(dias)
            dias += fechaFin.getDate() // Sumar días del mes final que han pasado
            console.log(dias)
        
        }else if(fechaInicio > fechaFin){
            // Calcular días año por año
            for(let year=fechaFin.getFullYear(); year < fechaInicio.getFullYear(); year++){
                dias += esBisiesto(year) ? 366 :365
            }
            console.log(dias)
            // Restar días del año inicial que ya pasaron
            for(let month=0;month<fechaFin.getMonth();month++){
                dias -= getDiasMonth(fechaFin.getFullYear(),month)
                console.log(dias)
            }
            console.log(dias)
            // Restar días del mes inicial que ya pasaron
            dias -= fechaFin.getDate()
            /* for(let day=0;day<fechaInicio.getDate();day++){
                dias -= 1
            } */
            /* let dia=12 *///dias del mes 7
            /* dias-=fechaInicio.getDate() - dia */
            console.log(dias)
            // Sumar días del año final que han pasado
            for (let month=0; month<fechaInicio.getMonth();month++){
                dias += getDiasMonth(fechaInicio.getFullYear(), month)
            }
            console.log(dias)
            dias += fechaInicio.getDate() // Sumar días del mes final que han pasado
            console.log(dias)

        }
        return dias
    }
    //Funcion para convertir la fecha al calendario Tonalpohualli
    const convertirTonalpohualli=(date)=>{
        //El ciclo tonalpohualli es de 260 dias (13*20)
       /*  const totalDias=Math.abs(date)
        const cicloDia=totalDias % 260 */
        //Calcular el numero (1-13) y simbolo (0-19)
        /* const numero=(cicloDia % 13)+1
        const simboloCal=cicloDia % 20 */
         
        // Fecha de referencia: 13 de agosto de 1521 (1-serpiente)
        const referenceFecha=new Date(1521,7,13)
        const fechaInicial=new Date(referenceFecha.getTime())
        const fechaFinal=new Date(date.getTime())
        const digitoReferencia=1 // índice para digito tomado del 1 al 13
        const simboloReferencia=4 // índice para serpiente tomado del 0 al 19

        if(fechaInicial < fechaFinal){
            const diferenciaDias=(calcularDiasManual(date))
            console.log(diferenciaDias)
            //El ciclo tonalpohualli es de 260 dias (13*20)
            const tonalpohualliCiclo=260
            const diaCiclo=((diferenciaDias % tonalpohualliCiclo)+tonalpohualliCiclo) %     tonalpohualliCiclo 
            console.log(diaCiclo)
            //Calcular el numero (1-13) y simbolo (0-19)
            /* const numero =(diaCiclo % 13)+1
            const simboloCal = diaCiclo % 20 */
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
        }else if(fechaInicial > fechaFinal){
            const diferenciaDias=(calcularDiasManual(date))
            console.log(diferenciaDias)
            //El ciclo tonalpohualli es de 260 dias (13*20)
            const tonalpohualliCiclo=260
            const diaCiclo=((diferenciaDias % tonalpohualliCiclo)+tonalpohualliCiclo) %     tonalpohualliCiclo 
            console.log(diaCiclo)
            //Calcular el numero (1-13) y simbolo (0-19)
            /* const numero =(diaCiclo % 13)+1
            const simboloCal = diaCiclo % 20 */
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

        }else{
            let numero=digitoReferencia
            let simboloCal=simboloReferencia
            return{
                numero,
                simbolo: tonalpohualliSimbolos[simboloCal],
                numberImage: new URL(`../images/${getNumberoImage(numero)}`, import.meta.url).href,
                symbolImage: new URL(`../images/${tonalpohualliSimbolos[simboloCal].image}`, import.meta.url).href,
                
            }
        }


        
    } 
    //Funcion para convertir la fecha al calendario Duran
    const convertirDuran=(date)=>{
        // Fecha de referencia: 13 de agosto de 1521 (3-Casa en Durán)
        const referenceAño=1521
        // Obtener el año de la fecha seleccionada
        const currentAño=date.getFullYear()

        // Fecha de referencia: 13 de agosto de 1521 (3-casa)
        const digitoReferencia=3 // índice para digito tomado del 1 al 13
        const simboloReferencia=2 // índice para casa tomado del 0 al 3
        if(referenceAño < currentAño){
            //Calcular diferencia
            const diferencia=currentAño - referenceAño
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
        }else if(referenceAño > currentAño){
            //Calcular diferencia
            const diferencia=referenceAño - currentAño
            // Calcular el número cíclico (1-13)
            let numeroD=((digitoReferencia - diferencia) % 13)
            numeroD=numeroD <= 0 ? numeroD - 13 : numeroD
            // Calcular el símbolo (0-3)
            let simboloCalDuran=((simboloReferencia - diferencia) % 4)
            simboloCalDuran=simboloCalDuran < 0 ? simboloCalDuran - 4 : simboloCalDuran

            return{
            numeroD,
            simboloD:duranSimbolos[simboloCalDuran],
            numberImageD: new URL(`../images/${getNumberoImage(numeroD)}`, import.meta.url).href,
            symbolImageD: new URL(`../images/${duranSimbolos[simboloCalDuran].image}`, import.meta.url).href,
            
            simboloCalDuran
            }
        }else{
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
        //Calcular diferencia
        //const diferencia=currentAño - referenceAño
        // Calcular el número cíclico (1-13)
       /*  let numeroCiclico=((digitoReferencia - 1 + diferencia)% 13)
        numeroCiclico=numeroCiclico <= 0 ? numeroCiclico + 13 : numeroCiclico */
        //let numeroD=((digitoReferencia + diferencia) % 13)
        //numeroD=numeroD <= 0 ? numeroD + 13 : numeroD
         // Calcular el símbolo (0-3)
         /* let simboloCiclico=((simboloReferencia + diferencia) % 4)
         simboloCiclico=simboloCiclico < 0 ? simboloCiclico + 4 : simboloCiclico */
        //let simboloCalDuran=((simboloReferencia + diferencia) % 4)
        //simboloCalDuran=simboloCalDuran < 0 ? simboloCalDuran + 4 : simboloCalDuran




        // Calcular diferencia en años
        /* let diffAño=currentAño - referenceAño */


        // Ajustar si la fecha es antes del 13 de agosto
        /* if(date.getMonth() < 7 || (date.getMonth() === 7 && date.getDate() < 13)){
            diffAño--
        } */        
        //El ciclo Durán es de 52 años (13x4)
        /* const duranCiclo=52
        const añoEnCiclo=((diffAño % duranCiclo) + duranCiclo) % duranCiclo */
        //Calcular el numero (1-13) y simbolo (0-3)
        /* const numeroD=(añoEnCiclo % 13) + 1
        const simboloCalDuran=añoEnCiclo % 4 */

         // Calcular el número y símbolo correspondiente
        /*  const numeroD=((diffAño % 13) + 13) % 13 || 13
         const simboloCalDuran = ((diffAño % 4) + 4) % 4 */

        
    }
    //funcion para manejar el clic en el boton
    const handleConvert = ()=>{
        if (!selectedDate) return
       
        //Realizar las conversiones
        const date = new Date(selectedDate);
        const tonalpohualliResult=convertirTonalpohualli(date)
        const duranResult=convertirDuran(date)
        //Actualizar el estado con los resultados
        setTonalpohualliDia(tonalpohualliResult)
        setDuranAnio(duranResult)
    }
    //Funcion para obtener el nombre del archivo de imagen del numero
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
            <div class="col-md-6">
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
                   {/* <img src={new URL(`../images/${getNumberoImage(tonalpohualliDia.numero)}`, import.meta.url).href} class="card-img-top" alt={`Numero ${tonalpohualliDia.numero}`}/>
                   <img src={new URL(`../images/${tonalpohualliDia.simbolo.image}`, import.meta.url).href} alt={tonalpohualliDia.simbolo.español} /> */}
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
                    {/* <img src={new URL(`../images/${getNumberoImage(duranAnio.numeroD)}`, import.meta.url).href} class="card-img-top" alt={`Número ${duranAnio.numeroD}`}/>
                    <img src={new URL(`../images/${duranAnio.simboloD.image}`, import.meta.url).href} alt={duranAnio.simboloD.español} /> */}
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
        <p>Basado en la fecha de referencia: 13 de agosto de 1521 (1-Serpiente, 3-Casa)</p>
      </footer>
       
    </>
  )
}

//export default Conversor