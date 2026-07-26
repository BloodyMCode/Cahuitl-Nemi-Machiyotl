// Mapa de imágenes usando import.meta.glob para asegurar que Vite las incluya en el build
const images = import.meta.glob('../images/*.png', { eager: true, import: 'default' });

/**
 * Función auxiliar para obtener la URL de una imagen desde el mapa de Vite
 * @param {string} imageName - nombre del archivo (ej: 'lagarto.png')
 * @returns {string} URL de la imagen procesada por Vite
 */
export const getImagePath = (imageName) => {
    const path = `../images/${imageName}`;
    return images[path] || '';
};
//Categias para tablero
//Simbolos del calendario Tonalli
export const tonalliSimbolos = [
    { español: "Lagarto", nahuatl: "Cipactli", nusavi: "Quevui", category: 'animales', image: "lagarto.png" },
    { español: "Viento", nahuatl: "Echecatl", nusavi: "Chi", category: 'naturales', image: "viento.png" },
    { español: "Casa", nahuatl: "Calli", nusavi: "Cuau", category: 'cosas', image: "casa.png" },
    { español: "Lagartija", nahuatl: "Cuetzpalli", nusavi: "Q, Que", category: 'animales', image: "lagartija.png" },
    { español: "Serpiente", nahuatl: "Coatl", nusavi: "Yo", category: 'animales', image: "serpiente.png" },
    { español: "Muerte", nahuatl: "Miquiztli", nusavi: "Mahu", category: 'abstractos', image: "muerte.png" },
    { español: "Venado", nahuatl: "Mazatl", nusavi: "Cuaa", category: 'animales', image: "venado.png" },
    { español: "Conejo", nahuatl: "Tochtli", nusavi: "Sayu", category: 'animales', image: "conejo.png" },
    { español: "Agua", nahuatl: "Atl", nusavi: "Agua", category: 'naturales', image: "agua.png" },
    { español: "Perro", nahuatl: "Itzcuintli", nusavi: "Hua", category: 'animales', image: "perro.png" },
    { español: "Mono", nahuatl: "Ozomatli", nusavi: "Ñuu", category: 'animales', image: "mono.png" },
    { español: "Hierba", nahuatl: "Malinalli", nusavi: "Cuañe", category: 'vegetales', image: "hierba.png" },
    { español: "Caña", nahuatl: "Acatl", nusavi: "Huiyo", category: 'vegetales', image: "caña.png" },
    { español: "Jaguar", nahuatl: "Ocelotl", nusavi: "Huidzu", category: 'animales', image: "jaguar.png" },
    { español: "Águila", nahuatl: "Cuauhtli", nusavi: "Sa", category: 'animales', image: "aguila.png" },
    { español: "Zopilote", nahuatl: "Cozcacuauhtli", nusavi: "Cuii", category: 'animales', image: "zopilote.png" },
    { español: "Movimiento", nahuatl: "Ollin", nusavi: "Qhi", category: 'abstractos', image: "movimiento.png" },
    { español: "Pedernal", nahuatl: "Tecpatl", nusavi: "Cusi", category: 'cosas', image: "pedernal.png" },
    { español: "Lluvia", nahuatl: "Quiahuitl", nusavi: "Co", category: 'naturales', image: "lluvia.png" },
    { español: "Flor", nahuatl: "Xochitl", nusavi: "Huaco", category: 'vegetales', image: "flor.png" }
]
//Simbolos del Xihuitl
export const xihuitlSimbolos = [
    { español: "Caña", nahuatl: "Acatl", nusavi: "Huiyo", image: "caña.png" },
    { español: "Pedernal", nahuatl: "Tecpatl", nusavi: "Cusi", image: "pedernal.png" },
    { español: "Casa", nahuatl: "Calli", nusavi: "Cuau", image: "casa.png" },
    { español: "Conejo", nahuatl: "Tochtli", nusavi: "Sayu", image: "conejo.png" }
]
//Funcion para obtener la imagen del numero
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
//Veintenas
export const cempohuallapohualli = [
    { nahuatl: "Atlacahualo" },
    { nahuatl: "Tlacaxipehualiztli" },
    { nahuatl: "Tozoztontli" },
    { nahuatl: "Ueitozoztli" },
    { nahuatl: "Toxcatl" },
    { nahuatl: "Etzalcualiztli" },
    { nahuatl: "Tecuilhuitontli" },
    { nahuatl: "Uetecuilhuitl" },
    { nahuatl: "Tlaxochimaco" },
    { nahuatl: "Xocotl Uetzi" },
    { nahuatl: "Ochpaniliztli" },
    { nahuatl: "Teotlehco" },
    { nahuatl: "Tepeilhuitl" },
    { nahuatl: "Quecholli" },
    { nahuatl: "Panquetzaliztli" },
    { nahuatl: "Atemoztli" },
    { nahuatl: "Tititl" },
    { nahuatl: "Izcalli" }
]
//Orientaciones
export const orientation = ['Este', 'Norte', 'Oeste', 'Sur']
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
//CUENTA CASO
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
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // Si la fecha elegida es posterior a la fecha de referencia
    if (fechaInicial < fechaFinal) {
        const diferenciaDias = (calcularDiasManual(date))
        //El ciclo tonalli es de 260 dias (13*20)
        const tonalliCiclo = 260
        const diaCiclo = ((diferenciaDias % tonalliCiclo) + tonalliCiclo) % tonalliCiclo //operacion modulas num mod 260
        //Calcular el numero (1-13) y simbolo (0-19)
        let numero = ((digitoReferencia + diaCiclo) % 13)
        numero = numero <= 0 ? numero + 13 : numero
        let simboloCal = ((simboloReferencia + diaCiclo) % 20)
        simboloCal = simboloCal < 0 ? simboloCal + 20 : simboloCal
        const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
        const h12 = hours % 12 || 12;
        const usedTime = `${h12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

        return {
            /* numero, */
            numero: numerosNombres[numero - 1],
            simbolo: tonalliSimbolos[simboloCal],
            /* numberImage: new URL(`../images/${getNumberoImage(numero)}`, import.meta.url).href, */
            numberImage: getImagePath(numerosNombres[numero - 1].image),
            symbolImage: getImagePath(tonalliSimbolos[simboloCal].image),
            diaCiclo,
            simboloInv: tonalliSimbolos[simboloCal].español, //se integra para acceder a la propiedad en español en el codigo Inverso.jsx            
            usedTime: usedTime
        }
    } else if (fechaInicial > fechaFinal) {// Si la fecha elegida es anterior a la fecha dereferencia
        const diferenciaDias = (calcularDiasManual(date))
        /* console.log(diferenciaDias) */
        //El ciclo tonalli es de 260 dias (13*20)
        const tonalliCiclo = 260
        const diaCiclo = ((diferenciaDias % tonalliCiclo) + tonalliCiclo) % tonalliCiclo
        /* console.log(diaCiclo) */
        //Calcular el numero (1-13) y simbolo (0-19)
        let numero = ((digitoReferencia - diaCiclo) % 13)
        numero = numero <= 0 ? numero + 13 : numero
        let simboloCal = ((simboloReferencia - diaCiclo) % 20)
        simboloCal = simboloCal < 0 ? simboloCal + 20 : simboloCal

        const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
        const h12 = hours % 12 || 12;
        const usedTime = `${h12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

        return {
            numero: numerosNombres[numero - 1],
            simbolo: tonalliSimbolos[simboloCal],
            numberImage: getImagePath(numerosNombres[numero - 1].image),
            symbolImage: getImagePath(tonalliSimbolos[simboloCal].image),
            diaCiclo,
            simboloInv: tonalliSimbolos[simboloCal].español,//se integra para acceder a la propiedad en español en el codigo Inverso.jsx 
            usedTime: usedTime
        }
    } else {// Si la fecha elegida es la fecha de referencia
        let numero = digitoReferencia
        let simboloCal = simboloReferencia

        const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
        const h12 = hours % 12 || 12;
        const usedTime = `${h12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

        return {
            numero: numerosNombres[numero - 1],
            simbolo: tonalliSimbolos[simboloCal],
            numberImage: getImagePath(numerosNombres[numero - 1].image),
            symbolImage: getImagePath(tonalliSimbolos[simboloCal].image),
            simboloInv: tonalliSimbolos[simboloCal].español,//se integra para acceder a la propiedad en español en el codigo Inverso.jsx 
            usedTime: usedTime
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
            numberImageX: getImagePath(numerosNombres[numeroX - 1].image),
            symbolImageX: getImagePath(xihuitlSimbolos[simboloCalXihuitl].image),
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
            numberImageX: getImagePath(numerosNombres[numeroX - 1].image),
            symbolImageX: getImagePath(xihuitlSimbolos[simboloCalXihuitl].image),
            simboloXInv: xihuitlSimbolos[simboloCalXihuitl].español,
            simboloCalXihuitl
        }
    } else {//Si el año de referencia (1521) es el año seleccionado
        let numeroX = digitoReferencia
        let simboloCalXihuitl = simboloReferencia
        return {
            numeroX: numerosNombres[numeroX - 1],
            simboloX: xihuitlSimbolos[simboloCalXihuitl],
            numberImageX: getImagePath(numerosNombres[numeroX - 1].image),
            symbolImageX: getImagePath(xihuitlSimbolos[simboloCalXihuitl].image),
            simboloXInv: xihuitlSimbolos[simboloCalXihuitl].español,
            simboloCalXihuitl
        }
    }
}

//CUENTA MEZA

/**
 * Calcula la posición de una fecha dentro del ciclo ritual de 18,980 días.
 * @param {string} sdate - Fecha en formato 'YYYY-MM-DD'
 * @param {string} time - Hora en formato 'HH:MM' (opcional)
 * @returns {object|null} Resultado del cálculo o null si no hay fecha.
 */
export const obtenerDiaRitual = (sdate, time) => {
    if (!sdate) return null;
    const [yStr, mStr, dStr] = sdate.split('-');

    let y = parseInt(yStr);
    const m = parseInt(mStr);
    const d = parseInt(dStr);

    // Referencia Maestra: 12 de Marzo 2026, 06:43 AM = Bloque 1, Año 1, Día 1
    const REF_YEAR = 2026;

    // 1. Determinar el Calendario (Juliano <= 1582)
    const isJuliano = y <= 1582;
    const baseDay = isJuliano ? 2 : 12;

    // Función para obtener parámetros del año ritual
    const getYearParams = (year) => {
        let cyclePos = (year - REF_YEAR) % 4;
        if (cyclePos < 0) cyclePos += 4;

        let sDay = baseDay;
        let sHour = 6;
        let sMin = 43;

        if (cyclePos === 1) sHour = 12;
        if (cyclePos === 2) { sDay = baseDay - 1; sHour = 18; }
        if (cyclePos === 3) { sHour = 0; }

        return { cyclePos, sDay, sHour, sMin };
    };

    // 2. Calcular días transcurridos desde el 1 de Enero (Cuenta fija 365)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const getAbsDays = (month, day) => {
        let total = 0;
        for (let i = 0; i < month - 1; i++) total += daysInMonth[i];
        return total + day;
    };

    let targetAbsDays = getAbsDays(m, d);
    let params = getYearParams(y);
    let startAbsDays = getAbsDays(3, params.sDay);

    // 3. Manejo de Hora y Comparación Ritual
    let h, min;
    let isBeforeStart = false;

    if (time) {
        const [hStr, minStr] = time.split(':');
        h = parseInt(hStr);
        min = parseInt(minStr);
        const inputTotalMins = (h * 60) + min;
        const startTotalMins = (params.sHour * 60) + params.sMin;

        if (targetAbsDays < startAbsDays || (targetAbsDays === startAbsDays && inputTotalMins < startTotalMins)) {
            isBeforeStart = true;
        }
    } else {
        if (targetAbsDays < startAbsDays) {
            isBeforeStart = true;
        }
    }

    // 4. ¿Estamos antes del inicio del año ritual de este año civil?
    if (isBeforeStart) {
        y -= 1;
        params = getYearParams(y);
        startAbsDays = getAbsDays(3, params.sDay);
        targetAbsDays += 365;
    }

    // 5. Resolver hora por defecto si no se proporcionó
    if (!time) {
        h = params.sHour;
        min = params.sMin;
    }

    // 6. Determinar el Año dentro del Bloque (1 a 52)
    let yearInBlock = ((y - 1974) % 52) + 1;
    if (yearInBlock <= 0) yearInBlock += 52;

    const inputTotalMins = (h * 60) + min;
    const startTotalMins = (params.sHour * 60) + params.sMin;

    // Diferencia de días nominales
    let diffDays = targetAbsDays - startAbsDays;

    if (inputTotalMins < startTotalMins) {
        diffDays -= 1;
    }

    // Cap para asegurar que el año ritual solo tiene 365 días (del día 0 al 364)
    // Esto absorbe el desfase de 6 horas al final del año anterior.
    if (diffDays >= 365) {
        diffDays = 364;
    }

    // 7. CÁLCULO FINAL
    const finalDay = ((yearInBlock - 1) * 365) + diffDays + 1;

    return {
        day: finalDay,
        year: yearInBlock,
        cycle: params.cyclePos + 1,
        cal: isJuliano ? "Juliano" : "Gregoriano",
        startTime: `${params.sDay} de marzo, ${params.sHour}:${params.sMin < 10 ? '0' + params.sMin : params.sMin}`,
        usedTime: `${h % 12 || 12}:${min < 10 ? '0' + min : min} ${h >= 12 ? 'p.m.' : 'a.m.'}`
        /* usedTime: `${h}:${min < 10 ? '0' + min : min}` */
    };
};
export const convertirTonalliMeza = (sdate, time) => {
    //Detecta si el valor recibido en sdate es un objeto Date (usando inverso.jsx). Si lo es, extrae el año, mes y día en formato local y lo convierte en una cadena "YYYY-MM-DD", si es una cadena (usando conversor.jsx) el if se ignora
    if (sdate instanceof Date) {
        const y = sdate.getFullYear();
        const m = String(sdate.getMonth() + 1).padStart(2, '0');
        const d = String(sdate.getDate()).padStart(2, '0');
        sdate = `${y}-${m}-${d}`;
    }
    //fin de admitir objeto Date
    const numDay = (obtenerDiaRitual(sdate, time))
    const day = numDay.day//numero de día de los 18980

    let coincide = false;
    let k = Math.floor((day - 1) / 365)//redondeo al numero entero inferior, k= 0 a 51, se puede conocer en que vuelta completa del calendario 365 nos encontramos, por ejemplo la primera vuelta se completa al transcurrir los primeros 365 días
    // Revisamos si day es múltiplo de 361 a 365, ya que estos son nemontemi
    /*  for (let nem = 361; nem <= 365; nem++) {//nem =>nemontemi
         let i = day / nem
         //Revisamos si existe modulo 0 y si i esta entre 1 y 52 que son los multiplos de 361-365
         if (day % nem === 0 && i >= 1 && i <= 52) {
             coincide = true
             break // Si ya encontramos uno, no hace falta seguir buscando
         }
 
     } */
    //Revisamos si el numero de día corresponde a un nemontemi
    for (let base = 361; base <= 365; base++) { //tomamos 361 a 365 como numeros base para calcular nemontemi
        let nem = base + (365 * k)//calculamos el nemontemi sumando el número base al producto de 365 por k (0 a 51, numero de vuelta del calendario)
        if (day === nem) {//comparamos si el numero de día es igual a un nemontemi
            coincide = true
            break//si coincide salimos del bucle
        }
    }

    let numeroTonal = 0
    let signoTonal = 0
    if (coincide) {
        let i = Math.ceil(day / 365)// redondeo al numero entero superior, i= 1 a 52, sirve para saber en que numero del ciclo de 52 años nos encontramos, por ejemplo los primeros 365 días corresponden al ciclo 1 de 52 años. 
        //numeroTonal = (day - (360 * i)) % 13 //formula original
        numeroTonal = ((day - (360 * i)) % 13 + 13) % 13//formula  asegurando que el resultado siempre sera positivo (incluso si day fuera negativo)
        numeroTonal = numeroTonal <= 0 ? numeroTonal + 13 : numeroTonal//asegurar que si el resultado es 0 se vuelve 13; si es 1..12 → queda igual 
        //signoTonal = (day - (360 * i)) % 20//formula original
        signoTonal = ((day - (360 * i)) % 20 + 20) % 20//formula  asegurando que el resultado siempre sera positivo (incluso si day fuera negativo)
        signoTonal = signoTonal <= 0 ? signoTonal + 20 : signoTonal//asegurar que si el resultado es 0 se vuelve 20; si es 1..19 → queda igual
    } else {
        numeroTonal = ((((((day % 13) + 13) % 13) - (5 * k)) % 13) + 13) % 13;//numero tonal meza
        numeroTonal = numeroTonal <= 0 ? numeroTonal + 13 : numeroTonal
        //numeroTonal = numeroTonal === 0 ? 13 : numeroTonal;
        signoTonal = ((((((day % 20) + 20) % 20) - (5 * k)) % 20) + 20) % 20;
        signoTonal = signoTonal <= 0 ? signoTonal + 20 : signoTonal
    }
    return {
        numeroT: numerosNombres[numeroTonal - 1],
        signoT: tonalliSimbolos[signoTonal - 1],
        /* numberTonalImage: new URL(`../images/${getNumberoImage(numero)}`, import.meta.url).href, */
        numberTonalImage: getImagePath(numerosNombres[numeroTonal - 1].image),
        signTonalImage: getImagePath(tonalliSimbolos[signoTonal - 1].image),
        signoTonalInv: tonalliSimbolos[signoTonal - 1].español, //se integra para acceder a la propiedad en español en el codigo Inverso.jsx            
        usedTime: numDay.usedTime,
        startTime: numDay.startTime
    }
}

export const convertirXihuitlMeza = (sdate, time) => {
    //Detecta si el valor recibido en sdate es un objeto Date (usando inverso.jsx). Si lo es, extrae el año, mes y día en formato local y lo convierte en una cadena "YYYY-MM-DD", si es una cadena (usando conversor.jsx) el if se ignora
    if (sdate instanceof Date) {
        const y = sdate.getFullYear();
        const m = String(sdate.getMonth() + 1).padStart(2, '0');
        const d = String(sdate.getDate()).padStart(2, '0');
        sdate = `${y}-${m}-${d}`;
    }
    //fin de admitir objeto Date
    const ritualData = obtenerDiaRitual(sdate, time);
    if (!ritualData) return null;

    const yearInBlock = ritualData.year; // 1 a 52

    // numeroMeza 1-13
    let numeroMeza = ((yearInBlock - 1) % 13) + 1;

    // signoMeza (índice en xihuitlSimbolos)
    // Año 1: Conejo (índice 3)
    // Año 2: Caña (índice 0)
    // Año 3: Pedernal (índice 1)
    // Año 4: Casa (índice 2)
    // Fórmula: (yearInBlock - 1 + 3) % 4
    let signoMezaIndex = (yearInBlock - 1 + 3) % 4;

    return {
        numeroX: numerosNombres[numeroMeza - 1],
        simboloX: xihuitlSimbolos[signoMezaIndex],
        numberImageX: getImagePath(numerosNombres[numeroMeza - 1].image),
        symbolImageX: getImagePath(xihuitlSimbolos[signoMezaIndex].image),
        simboloXInv: xihuitlSimbolos[signoMezaIndex].español,
        usedTime: ritualData.usedTime,
        startTime: ritualData.startTime
    };
};

export const cempohualliMeza = (sdate, time) => {
    //Detecta si el valor recibido en sdate es un objeto Date (usando inverso.jsx). Si lo es, extrae el año, mes y día en formato local y lo convierte en una cadena "YYYY-MM-DD", si es una cadena (usando conversor.jsx) el if se ignora
    if (sdate instanceof Date) {
        const y = sdate.getFullYear();
        const m = String(sdate.getMonth() + 1).padStart(2, '0');
        const d = String(sdate.getDate()).padStart(2, '0');
        sdate = `${y}-${m}-${d}`;
    }
    //fin de admitir objeto Date
    const ritualData = obtenerDiaRitual(sdate, time);
    if (!ritualData) return null;

    // Calculamos dInYear (día del año ritual 0-364)
    // dInYear = (day - 1) % 365
    const dInYear = (ritualData.day - 1) % 365;

    if (dInYear < 360) {
        const index = Math.floor(dInYear / 20);
        return cempohuallapohualli[index].nahuatl;
    } else {
        return "Nemontemi";
    }
}
//FUNCIONES INVERSO

// Funcion para buscar coincidencias en Tonalli
export const encuentraCoincidence = (
    selectedStartDate,
    selectedEndDate,
    numero,
    simbolo,
    setResults,
    setTonalliMessage,
    setLoading
) => {
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

        // Recorrer años, meses y días desde la fecha inicio hasta la fecha fin
        for (let year = fechaInicio.getFullYear(); year <= fechaFin.getFullYear(); year++) {
            if (year === 0) continue//el año 0 no existe en el calendario civil

            const startMonth = (year === fechaInicio.getFullYear()) ? fechaInicio.getMonth() : 0 //Condición ? Valor_si_es_verdadero : Valor_si_es_falso
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
                    const tonalliMeza = convertirTonalliMeza(currentDate)
                    const xihuitlMeza = convertirXihuitlMeza(currentDate)

                    //if (tonalli.numero.español === numero.toString() && tonalli.simbolo.español === simbolo) {
                    const matchCaso = tonalli.numero.español === numero.toString() && tonalli.simbolo.español === simbolo;
                    const matchMeza = tonalliMeza && tonalliMeza.numeroT.español === numero.toString() && tonalliMeza.signoT.español === simbolo;

                    if (matchCaso || matchMeza) {
                        matches.push({
                            date: currentDate,
                            calendar: currentDate <= fechaJuliano ? 'Juliano' : 'Gregoriano',
                            tonalli: tonalli,
                            xihuitl: xihuitl,
                            tonalliMeza: tonalliMeza,
                            xihuitlMeza: xihuitlMeza,
                            matchCaso: matchCaso,
                            matchMeza: matchMeza
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
export const buscarXihuitl = (
    yearStart,
    yearEnd,
    numeroX,
    simboloX,
    setXihuitlResults,
    setXihuitlMessage,
    setLoadingX
) => {
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
            // Se pasa el año como string 'YYYY-01-01' para que obtenerDiaRitual calcule
            // correctamente la fecha y hora de inicio del año ritual (startTime) según el
            // ciclo de 4 posiciones: año 1 = 2/12-mar 06:43, año 2 = 2/12-mar 12:43,
            // año 3 = 1/11-mar 18:43, año 4 = 2/12-mar 00:43 (juliano/gregoriano)
            const xihuitlMeza = convertirXihuitlMeza(`${year}-01-01`)
            if (xihuitl.numeroX.español === numeroX.toString() && xihuitl.simboloX.español === simboloX) {
                matches.push({
                    year: year,
                    calendar: year < 1582 ? 'Juliano' : 'Gregoriano',
                    xihuitl: xihuitl,
                    xihuitlMeza: xihuitlMeza,
                    xihuitlMezaStartTime: xihuitlMeza ? xihuitlMeza.startTime : null,
                    xihuitlMezaCal: xihuitlMeza ? (year <= 1582 ? 'Juliano' : 'Gregoriano') : null
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

/**
 * Busca el Xihuitl de un año civil dado.
 * - Usa convertirXihuitl con el 1 de enero del año para la cuenta Caso.
 * - Usa convertirXihuitlMeza con el 12 de marzo del año para la cuenta Meza.
 * @param {number} year - Año civil a consultar
 * @param {Function} setCivilResults - Setter del estado de resultados
 * @param {Function} setCivilMessage - Setter del estado de mensaje
 * @param {Function} setLoading - Setter del estado de carga
 */
export const buscarAnioCivil = (year, setCivilResults, setCivilMessage, setLoading) => {
    setCivilResults([])
    setCivilMessage("")
    setLoading(true)

    setTimeout(() => {
        if (year === 0) {
            setCivilMessage("El año 0 no existe en el calendario civil.")
            setLoading(false)
            return
        }

        // Xihuitl Caso: 1 de enero del año civil
        const dateEnero = new Date(year, 0, 1)
        const xihuitlCaso = convertirXihuitl(dateEnero)

        // Xihuitl Meza: 12 de marzo del año civil (inicio del año ritual Meza)
        const dateMarzoStr = `${year}-03-12`
        const xihuitlMeza = convertirXihuitlMeza(dateMarzoStr)

        const calendar = year < 1582 ? 'Juliano' : 'Gregoriano'

        setCivilResults([{
            year: year,
            calendar: calendar,
            xihuitl: xihuitlCaso,
            xihuitlMeza: xihuitlMeza,
            xihuitlMezaStartTime: xihuitlMeza ? xihuitlMeza.startTime : null,
            xihuitlMezaCal: xihuitlMeza ? (year <= 1582 ? 'Juliano' : 'Gregoriano') : null
        }])
        setLoading(false)
    }, 100)
}

// Formatear fecha para mostrar
export const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// Funcion para buscar coincidencias de Tonalli y Xihuitl combinados
export const buscarAmbos = (
    selectedStartDate,
    selectedEndDate,
    modoAmbos,
    yearStart,
    yearEnd,
    numero,
    simbolo,
    numeroX,
    simboloX,
    setAmbosResults,
    setAmbosMessage,
    setLoadingAmbos
) => {
    // Determinar fechaInicio y fechaFin según modoAmbos
    let startDateStr, endDateStr;

    if (modoAmbos === 'fecha') {
        // Usar directamente las fechas ingresadas; normalizar orden internamente
        startDateStr = selectedStartDate;
        endDateStr = selectedEndDate;
    } else {
        // Año inicio y año fin: se usa el primer día del año inicio y el último del año fin
        const yA = parseInt(yearStart);
        const yB = parseInt(yearEnd);
        const yMin = Math.min(yA, yB);
        const yMax = Math.max(yA, yB);
        startDateStr = `${yMin}-01-01`;
        endDateStr = `${yMax}-12-31`;
    }

    const fechaA = new Date(startDateStr + 'T00:00:00');
    const fechaB = new Date(endDateStr + 'T00:00:00');
    // Normalizar: fechaInicio siempre es la menor, fechaFin la mayor (permite ingreso invertido)
    const fechaInicio = fechaA <= fechaB ? fechaA : fechaB;
    const fechaFin = fechaA <= fechaB ? fechaB : fechaA;

    if (fechaInicio.getTime() === fechaFin.getTime()) {
        setAmbosResults([]);
        setAmbosMessage("En este periodo no existen coincidencias con los nombres indicados, por favor introduzca un periodo distinto");
        return;
    }

    setLoadingAmbos(true);
    setAmbosMessage("");
    setAmbosResults([]);

    setTimeout(() => {
        const matches = [];
        const fechaJuliano = new Date(1582, 9, 4);

        // Recorrer todos los días del periodo, igual que en encuentraCoincidence
        for (let year = fechaInicio.getFullYear(); year <= fechaFin.getFullYear(); year++) {
            if (year === 0) continue;//el año 0 no existe en el calendario civil

            const startMonth = (year === fechaInicio.getFullYear()) ? fechaInicio.getMonth() : 0;
            const endMonth = (year === fechaFin.getFullYear()) ? fechaFin.getMonth() : 11;

            for (let month = startMonth; month <= endMonth; month++) {
                const diasEnMes = getDiasMonth(year, month);
                const startDay = (year === fechaInicio.getFullYear() && month === fechaInicio.getMonth()) ? fechaInicio.getDate() : 1;
                const endDay = (year === fechaFin.getFullYear() && month === fechaFin.getMonth()) ? fechaFin.getDate() : diasEnMes;

                for (let day = startDay; day <= endDay; day++) {
                    const currentDate = new Date(year, month, day);
                    if (currentDate > fechaFin) break;

                    const tonalli = convertirTonalli(currentDate);
                    // Para xihuitl: en modo 'fecha' el xihuitl considera el año de la fecha actual
                    // En modo 'anio' también se usa el año de la fecha actual (primer día del año)
                    const xihuitl = convertirXihuitl(currentDate);
                    const tonalliMeza = convertirTonalliMeza(currentDate);
                    const xihuitlMeza = convertirXihuitlMeza(currentDate);

                    const matchTonalliCaso = tonalli.numero.español === numero.toString() && tonalli.simbolo.español === simbolo;
                    const matchTonalliMeza = tonalliMeza && tonalliMeza.numeroT.español === numero.toString() && tonalliMeza.signoT.español === simbolo;
                    const matchXihuitlCaso = xihuitl.numeroX.español === numeroX.toString() && xihuitl.simboloX.español === simboloX;
                    const matchXihuitlMeza = xihuitlMeza && xihuitlMeza.numeroX.español === numeroX.toString() && xihuitlMeza.simboloX.español === simboloX;

                    // Solo incluir si coincide tonalli Y xihuitl (cualquier combinación Caso/Meza)
                    const coincideTonalli = matchTonalliCaso || matchTonalliMeza;
                    const coincideXihuitl = matchXihuitlCaso || matchXihuitlMeza;

                    if (coincideTonalli && coincideXihuitl) {
                        matches.push({
                            date: currentDate,
                            calendar: currentDate <= fechaJuliano ? 'Juliano' : 'Gregoriano',
                            tonalli,
                            xihuitl,
                            tonalliMeza,
                            xihuitlMeza,
                            matchTonalliCaso,
                            matchTonalliMeza,
                            matchXihuitlCaso,
                            matchXihuitlMeza,
                        });
                    }
                }
            }
        }

        if (matches.length === 0) {
            setAmbosMessage("En este periodo no existen coincidencias con los nombres indicados, por favor introduzca un periodo distinto");
        }
        // Ordenar de más actual a más antiguo
        matches.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAmbosResults(matches);
        setLoadingAmbos(false);
    }, 100);
}
//Funciones de TABLERO

/**
 * Manejo de cambio de checkbox de categorías para Tablero
 * @param {string} category 
 * @param {Function} setSelectedCategories 
 */
export const handleCategoryChange = (category, setSelectedCategories) => {
    setSelectedCategories(prev => ({
        ...prev,
        [category]: !prev[category]
    }));
};

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]
export const revNumbers = [...numbers].toReversed()//invertir el orden

/**
 * Función para destacar celda CSS según la categoría
 * @param {object} cell 
 * @param {Set} featuredCells 
 * @param {Array} revNumbers 
 * @returns {string} Clase CSS para la celda
 */
export const getCellClass = (cell, featuredCells, revNumbers) => {
    const cellId = `${cell.row}-${cell.col}`;
    const isFeatured = featuredCells ? featuredCells.has(cellId) : false;
    if (isFeatured) {
        switch (cell.category) {
            case 'animales':
                return 'cell-animales';
            case 'naturales':
                return 'cell-naturales';
            case 'cosas':
                return 'cell-cosas';
            case 'abstractos':
                return 'cell-abstractos';
            case 'vegetales':
                return 'cell-vegetales';
            default:
                return '';
        }
    }
    const isColOne = revNumbers && revNumbers[cell.col % revNumbers.length] === '1';
    if (isColOne) {
        return 'bg-column-one';
    }
    return '';
};

