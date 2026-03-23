//Simbolos del calendario Tonalpohualli
export const tonalpohualliSimbolos=[
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
    {español:"Flor", nahuatl:"Xochitl", image:"flor.png"}
]
//Simbolos del calendario Duran
const duranSimbolos=[
   {español:"Caña", nahuatl:"Acatl", image:"caña.png"}, 
   {español:"Pedernal", nahuatl:"Tecpatl", image:"pedernal.png"},
   {español:"Casa", nahuatl:"Calli", image:"casa.png"},
   {español:"Conejo", nahuatl:"Tochtli", image:"conejo.png"}
]     
// Función para verificar si un año es bisiesto según las reglas correspondientes
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
export const getDiasMonth=(year, month)=>{
    const diasInMonth=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if(month === 1){
        return bisiestoAnio(year) ? 29 : 28
    }
    return diasInMonth[month]
    
}
 // Función para calcular días transcurridos manualmente
export const calcularDiasManual=(date)=>{
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
        // Sumar días del mes final que han pasado (01-mes-añoFinal hasta el dia-mes-año final)
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
export const convertirTonalpohualli=(date)=>{
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
        const diaCiclo=((diferenciaDias % tonalpohualliCiclo)+tonalpohualliCiclo) % tonalpohualliCiclo 
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
            diaCiclo,
            simboloInv:tonalpohualliSimbolos[simboloCal].español //se integra para acceder a la propiedad en español en el codigo Inverso.jsx            
        }
    }else if(fechaInicial > fechaFinal){// Si la fecha elegida es anterior a la fecha dereferencia
        const diferenciaDias=(calcularDiasManual(date))
        console.log(diferenciaDias)
        //El ciclo tonalpohualli es de 260 dias (13*20)
        const tonalpohualliCiclo=260
        const diaCiclo=((diferenciaDias % tonalpohualliCiclo)+tonalpohualliCiclo) %    tonalpohualliCiclo 
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
            diaCiclo,
            simboloInv:tonalpohualliSimbolos[simboloCal].español//se integra para acceder a la propiedad en español en el codigo Inverso.jsx 
        }
    }else{// Si la fecha elegida es la fecha de referencia
        let numero=digitoReferencia
        let simboloCal=simboloReferencia
        return{
            numero,
            simbolo: tonalpohualliSimbolos[simboloCal],
            numberImage: new URL(`../images/${getNumberoImage(numero)}`, import.meta.url).href,
            symbolImage: new URL(`../images/${tonalpohualliSimbolos[simboloCal].image}`, import.meta.url).href,
            simboloInv:tonalpohualliSimbolos[simboloCal].español//se integra para acceder a la propiedad en español en el codigo Inverso.jsx 
        }
    }
} 
//Funcion para convertir la fecha al calendario Duran
export const convertirDuran=(date)=>{
    // Fecha de referencia: 13 de agosto de 1521 (3-Casa en Durán)
    const referenceAño=1521
    // Obtener el año de la fecha seleccionada
    const currentAño=date.getFullYear()
    // Fecha de referencia: 13 de agosto de 1521 (3-casa)
    const digitoReferencia=3 // índice para digito tomado del 1 al 13
    const simboloReferencia=2 // índice para casa tomado del 0 al 3
    if(referenceAño < currentAño){//Si el año de referencia (1521) es menor al añoseleccionado 
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
        simboloDInv:duranSimbolos[simboloCalDuran].español,
        simboloCalDuran
        }
    }else if(referenceAño > currentAño){//Si el año de referencia (1521) es mayor al añoseleccionado
        //Calcular diferencia
        const diferencia=referenceAño - currentAño
        // Calcular el número cíclico (1-13)
        let numeroD=((digitoReferencia - diferencia) % 13)
        numeroD=numeroD <= 0 ? numeroD + 13 : numeroD
        // Calcular el símbolo (0-3)
        let simboloCalDuran=((simboloReferencia - diferencia) % 4)
        simboloCalDuran=simboloCalDuran < 0 ? simboloCalDuran + 4 : simboloCalDuran
        return{
        numeroD,
        simboloD:duranSimbolos[simboloCalDuran],
        numberImageD: new URL(`../images/${getNumberoImage(numeroD)}`, import.meta.url).href,
        symbolImageD: new URL(`../images/${duranSimbolos[simboloCalDuran].image}`, import.meta.url).href,
        simboloDInv:duranSimbolos[simboloCalDuran].español,
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
        simboloDInv:duranSimbolos[simboloCalDuran].español,
        simboloCalDuran
        }
    }
}
 //Funcion para obtener el archivo de imagen del numero
export const numerosNombres=["1","2","3","4","5","6","7","8","9","10","11","12","13"]
const getNumberoImage=(numero)=>{
    /* const numerosNombres=[
        "1","2","3","4","5","6","7","8","9","10","11","12","13"
    ] */
    return `${numerosNombres[numero-1]}.png`
}
