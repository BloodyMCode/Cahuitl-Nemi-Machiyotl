//Simbolos del calendario Tonalli
export const tonalliSimbolos = [
    { español: "Lagarto", nahuatl: "Cipactli", nusavi: "Quevui", image: "lagarto.png" },
    { español: "Viento", nahuatl: "Echecatl", nusavi: "Chi", image: "viento.png" },
    { español: "Casa", nahuatl: "Calli", nusavi: "Cuau", image: "casa.png" },
    { español: "Lagartija", nahuatl: "Cuetzpalli", nusavi: "Q, Que", image: "lagartija.png" },
    { español: "Serpiente", nahuatl: "Coatl", nusavi: "Yo", image: "serpiente.png" },
    { español: "Muerte", nahuatl: "Miquiztli", nusavi: "Mahu", image: "muerte.png" },
    { español: "Venado", nahuatl: "Mazatl", nusavi: "Cuaa", image: "venado.png" },
    { español: "Conejo", nahuatl: "Tochtli", nusavi: "Sayu", image: "conejo.png" },
    { español: "Agua", nahuatl: "Atl", nusavi: "Agua", image: "agua.png" },
    { español: "Perro", nahuatl: "Itzcuintli", nusavi: "Hua", image: "perro.png" },
    { español: "Mono", nahuatl: "Ozomatli", nusavi: "Ñuu", image: "mono.png" },
    { español: "Hierba", nahuatl: "Malinalli", nusavi: "Cuañe", image: "hierba.png" },
    { español: "Caña", nahuatl: "Acatl", nusavi: "Huiyo", image: "caña.png" },
    { español: "Jaguar", nahuatl: "Ocelotl", nusavi: "Huidzu", image: "jaguar.png" },
    { español: "Águila", nahuatl: "Cuauhtli", nusavi: "Sa", image: "aguila.png" },
    { español: "Zopilote", nahuatl: "Cozcacuauhtli", nusavi: "Cuii", image: "zopilote.png" },
    { español: "Movimiento", nahuatl: "Ollin", nusavi: "Qhi", image: "movimiento.png" },
    { español: "Pedernal", nahuatl: "Tecpatl", nusavi: "Cusi", image: "pedernal.png" },
    { español: "Lluvia", nahuatl: "Quiahuitl", nusavi: "Co", image: "lluvia.png" },
    { español: "Flor", nahuatl: "Xochitl", nusavi: "Huaco", image: "flor.png" }
]
//Simbolos del Xihuitl
const xihuitlSimbolos = [
    { español: "Caña", nahuatl: "Acatl", nusavi: "Huiyo", image: "caña.png" },
    { español: "Pedernal", nahuatl: "Tecpatl", nusavi: "Cusi", image: "pedernal.png" },
    { español: "Casa", nahuatl: "Calli", nusavi: "Cuau", image: "casa.png" },
    { español: "Conejo", nahuatl: "Tochtli", nusavi: "Sayu", image: "conejo.png" }
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
export const getDiasMonth = (year, month) => {
    const diasInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (month === 1) {
        return bisiestoAnio(year) ? 29 : 28
    }
    return diasInMonth[month]

}
// Función para calcular días transcurridos manualmente
export const calcularDiasManual = (date) => {
    let dias = 0
    const referenceFecha = new Date(1521, 7, 13)//fecha referencia 13-Ago-1521
    const fechaInicio = new Date(referenceFecha.getTime())
    const fechaFin = new Date(date.getTime())
    // Ajustar por el cambio de calendario (5-15 de octubre de 1582 no existieron)
    const fechaCambioCalendarioA = new Date(1582, 9, 4)
    const fechaCambioCalendarioB = new Date(1582, 9, 15)
    const diasSaltados = 10
    // Si la fecha elegida es posterior a la fecha de referencia
    if (fechaInicio < fechaFin) {
        //Salto de días por el cambio del calendario juliano al gregoriano en 1582
        if (fechaCambioCalendarioA && fechaCambioCalendarioB) {
            dias -= diasSaltados
        }
        // Calcular días año por año
        for (let year = fechaInicio.getFullYear(); year < fechaFin.getFullYear(); year++) {
            dias += bisiestoAnio(year) ? 366 : 365
        }
        // Restar meses del año inicial que ya pasaron (01-1521 al 07-1521)
        for (let month = 0; month < fechaInicio.getMonth(); month++) {
            dias -= getDiasMonth(fechaInicio.getFullYear(), month)
        }
        // Restar días del mes inicial que ya pasaron (01-08-1521 al 12-08-1521)
        dias -= fechaInicio.getDate()
        // Sumar meses del año final que han pasado (01-añoFinal hasta el mes anterior al mes elegido del añoFinal)
        for (let month = 0; month < fechaFin.getMonth(); month++) {
            dias += getDiasMonth(fechaFin.getFullYear(), month)
        }
        // Sumar días del mes final que han pasado (01-mes-añoFinal hasta el dia-mes-año final)
        dias += fechaFin.getDate()
    } else if (fechaInicio > fechaFin) {// Si la fecha elegida es anterior a la fecha de referencia
        // Calcular días año por año
        for (let year = fechaFin.getFullYear(); year < fechaInicio.getFullYear(); year++) {
            dias += bisiestoAnio(year) ? 366 : 365
        }
        // Restar meses del año final que ya pasaron (01-añoFinal hasta el mes anterior al mes elegido del añoFinal)
        for (let month = 0; month < fechaFin.getMonth(); month++) {
            dias -= getDiasMonth(fechaFin.getFullYear(), month)
        }
        // Restar días del mes final que ya pasaron (01-mes-añoFinal hasta el dia-mes-añofinal)
        dias -= fechaFin.getDate()
        // Sumar meses del año inicial (fecha referencia) (01-1521 al 07-1521)
        for (let month = 0; month < fechaInicio.getMonth(); month++) {
            dias += getDiasMonth(fechaInicio.getFullYear(), month)
        }
        // Sumar días del mes Inicial (fecha referencia) (01-08-1521 al 13-08-1521)
        dias += fechaInicio.getDate()
    }
    return dias
}
//Funcion para convertir la fecha al calendario Tonalli
export const convertirTonalli = (date) => {
    // Fecha de referencia: 13 de agosto de 1521 (1-serpiente)
    const referenceFecha = new Date(1521, 7, 13)
    const fechaInicial = new Date(referenceFecha.getTime())
    const fechaFinal = new Date(date.getTime())
    const digitoReferencia = 1 // índice para digito tomado del 1 al 13
    const simboloReferencia = 4 // índice para serpiente tomado del 0 al 19
    // Si la fecha elegida es posterior a la fecha de referencia
    if (fechaInicial < fechaFinal) {
        const diferenciaDias = (calcularDiasManual(date))
        //El ciclo tonalli es de 260 dias (13*20)
        const tonalliCiclo = 260
        const diaCiclo = ((diferenciaDias % tonalliCiclo) + tonalliCiclo) % tonalliCiclo
        //Calcular el numero (1-13) y simbolo (0-19)
        let numero = ((digitoReferencia + diaCiclo) % 13)
        numero = numero <= 0 ? numero + 13 : numero
        let simboloCal = ((simboloReferencia + diaCiclo) % 20)
        simboloCal = simboloCal < 0 ? simboloCal + 20 : simboloCal
        return {
            /* numero, */
            numero: numerosNombres[numero - 1],
            simbolo: tonalliSimbolos[simboloCal],
            /* numberImage: new URL(`../images/${getNumberoImage(numero)}`, import.meta.url).href, */
            numberImage: new URL(`../images/${numerosNombres[numero - 1].image}`, import.meta.url).href,
            symbolImage: new URL(`../images/${tonalliSimbolos[simboloCal].image}`, import.meta.url).href,
            diaCiclo,
            simboloInv: tonalliSimbolos[simboloCal].español //se integra para acceder a la propiedad en español en el codigo Inverso.jsx            
        }
    } else if (fechaInicial > fechaFinal) {// Si la fecha elegida es anterior a la fecha dereferencia
        const diferenciaDias = (calcularDiasManual(date))
        console.log(diferenciaDias)
        //El ciclo tonalli es de 260 dias (13*20)
        const tonalliCiclo = 260
        const diaCiclo = ((diferenciaDias % tonalliCiclo) + tonalliCiclo) % tonalliCiclo
        console.log(diaCiclo)
        //Calcular el numero (1-13) y simbolo (0-19)
        let numero = ((digitoReferencia - diaCiclo) % 13)
        numero = numero <= 0 ? numero + 13 : numero
        let simboloCal = ((simboloReferencia - diaCiclo) % 20)
        simboloCal = simboloCal < 0 ? simboloCal + 20 : simboloCal
        return {
            numero: numerosNombres[numero - 1],
            simbolo: tonalliSimbolos[simboloCal],
            numberImage: new URL(`../images/${numerosNombres[numero - 1].image}`, import.meta.url).href,
            symbolImage: new URL(`../images/${tonalliSimbolos[simboloCal].image}`, import.meta.url).href,
            diaCiclo,
            simboloInv: tonalliSimbolos[simboloCal].español//se integra para acceder a la propiedad en español en el codigo Inverso.jsx 
        }
    } else {// Si la fecha elegida es la fecha de referencia
        let numero = digitoReferencia
        let simboloCal = simboloReferencia
        return {
            numero: numerosNombres[numero - 1],
            simbolo: tonalliSimbolos[simboloCal],
            numberImage: new URL(`../images/${numerosNombres[numero - 1].image}`, import.meta.url).href,
            symbolImage: new URL(`../images/${tonalliSimbolos[simboloCal].image}`, import.meta.url).href,
            simboloInv: tonalliSimbolos[simboloCal].español//se integra para acceder a la propiedad en español en el codigo Inverso.jsx 
        }
    }
}
//Funcion para convertir la fecha al calendario xihuitl
export const convertirXihuitl = (date) => {
    // Fecha de referencia: 13 de agosto de 1521 (3-Casa en xihuitl)
    const referenceAño = 1521
    // Obtener el año de la fecha seleccionada
    const currentAño = date.getFullYear()
    // Fecha de referencia: 13 de agosto de 1521 (3-casa)
    const digitoReferencia = 3 // índice para digito tomado del 1 al 13
    const simboloReferencia = 2 // índice para casa tomado del 0 al 3
    if (referenceAño < currentAño) {//Si el año de referencia (1521) es menor al añoseleccionado 
        //Calcular diferencia
        const diferencia = currentAño - referenceAño
        // Calcular el número cíclico (1-13)
        let numeroX = ((digitoReferencia + diferencia) % 13)
        numeroX = numeroX <= 0 ? numeroX + 13 : numeroX
        // Calcular el símbolo (0-3)
        let simboloCalXihuitl = ((simboloReferencia + diferencia) % 4)
        simboloCalXihuitl = simboloCalXihuitl < 0 ? simboloCalXihuitl + 4 : simboloCalXihuitl
        return {
            /* numeroX, */
            numeroX: numerosNombres[numeroX - 1],
            simboloX: xihuitlSimbolos[simboloCalXihuitl],
            /* numberImageX: new URL(`../images/${getNumberoImage(numeroX)}`, import.meta.url).href, */
            numberImageX: new URL(`../images/${numerosNombres[numeroX - 1].image}`, import.meta.url).href,
            symbolImageX: new URL(`../images/${xihuitlSimbolos[simboloCalXihuitl].image}`, import.meta.url).href,
            simboloXInv: xihuitlSimbolos[simboloCalXihuitl].español,
            simboloCalXihuitl
        }
    } else if (referenceAño > currentAño) {//Si el año de referencia (1521) es mayor al añoseleccionado
        //Calcular diferencia
        const diferencia = referenceAño - currentAño
        // Calcular el número cíclico (1-13)
        let numeroX = ((digitoReferencia - diferencia) % 13)
        numeroX = numeroX <= 0 ? numeroX + 13 : numeroX
        // Calcular el símbolo (0-3)
        let simboloCalXihuitl = ((simboloReferencia - diferencia) % 4)
        simboloCalXihuitl = simboloCalXihuitl < 0 ? simboloCalXihuitl + 4 : simboloCalXihuitl
        return {
            numeroX: numerosNombres[numeroX - 1],
            simboloX: xihuitlSimbolos[simboloCalXihuitl],
            numberImageX: new URL(`../images/${numerosNombres[numeroX - 1].image}`, import.meta.url).href,
            symbolImageX: new URL(`../images/${xihuitlSimbolos[simboloCalXihuitl].image}`, import.meta.url).href,
            simboloXInv: xihuitlSimbolos[simboloCalXihuitl].español,
            simboloCalXihuitl
        }
    } else {//Si el año de referencia (1521) es el año seleccionado
        let numeroX = digitoReferencia
        let simboloCalXihuitl = simboloReferencia
        return {
            numeroX: numerosNombres[numeroX - 1],
            simboloX: xihuitlSimbolos[simboloCalXihuitl],
            numberImageX: new URL(`../images/${numerosNombres[numeroX - 1].image}`, import.meta.url).href,
            symbolImageX: new URL(`../images/${xihuitlSimbolos[simboloCalXihuitl].image}`, import.meta.url).href,
            simboloXInv: xihuitlSimbolos[simboloCalXihuitl].español,
            simboloCalXihuitl
        }
    }
}
//Funcion para obtener el archivo de imagen del numero
//export const numerosNombres = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]
export const numerosNombres = [
    { español: "1", nahuatl: "Ce", nusavi: "Ca, co", image: "1.png" },
    { español: "2", nahuatl: "Ome", nusavi: "Ca, co", image: "2.png" },
    { español: "3", nahuatl: "Yei", nusavi: "Co", image: "3.png" },
    { español: "4", nahuatl: "Nahui", nusavi: "Qui", image: "4.png" },
    { español: "5", nahuatl: "Macuilli", nusavi: "Q, qhu", image: "5.png" },
    { español: "6", nahuatl: "Chicuace", nusavi: "Ñu", image: "6.png" },
    { español: "7", nahuatl: "Chicome", nusavi: "Sa", image: "7.png" },
    { español: "8", nahuatl: "Chicueyi", nusavi: "Na", image: "8.png" },
    { español: "9", nahuatl: "Chicnahui", nusavi: "Q, qhu", image: "9.png" },
    { español: "10", nahuatl: "Matlacti", nusavi: "Si", image: "10.png" },
    { español: "11", nahuatl: "Matlacti ihuan ce", nusavi: "Si, sii", image: "11.png" },
    { español: "12", nahuatl: "Matlacti ihuan ome", nusavi: "Ca", image: "12.png" },
    { español: "13", nahuatl: "Matlacti ihuan yei", nusavi: "Si", image: "13.png" }]
/* const getNumberoImage = (numero) => { */
/* const numerosNombres=[
    "1","2","3","4","5","6","7","8","9","10","11","12","13"
] */
/*     return `${numerosNombres.español[numero - 1]}.png`
} */
