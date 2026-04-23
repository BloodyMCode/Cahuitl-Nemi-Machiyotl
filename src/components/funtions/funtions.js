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
            numberImage: getImagePath(numerosNombres[numero - 1].image),
            symbolImage: getImagePath(tonalliSimbolos[simboloCal].image),
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
            numberImage: getImagePath(numerosNombres[numero - 1].image),
            symbolImage: getImagePath(tonalliSimbolos[simboloCal].image),
            diaCiclo,
            simboloInv: tonalliSimbolos[simboloCal].español//se integra para acceder a la propiedad en español en el codigo Inverso.jsx 
        }
    } else {// Si la fecha elegida es la fecha de referencia
        let numero = digitoReferencia
        let simboloCal = simboloReferencia
        return {
            numero: numerosNombres[numero - 1],
            simbolo: tonalliSimbolos[simboloCal],
            numberImage: getImagePath(numerosNombres[numero - 1].image),
            symbolImage: getImagePath(tonalliSimbolos[simboloCal].image),
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
        // Si no hay hora y estamos en el día de inicio, se asume que es el inicio del año ritual
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
        usedTime: `${h}:${min < 10 ? '0' + min : min}`
    };
};
export const convertirTonalliMeza = (sdate, time) => {
    const numDay = (obtenerDiaRitual(sdate, time))
    const day = numDay.day


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
            numberImage: getImagePath(numerosNombres[numero - 1].image),
            symbolImage: getImagePath(tonalliSimbolos[simboloCal].image),
            diaCiclo,
            simboloInv: tonalliSimbolos[simboloCal].español //se integra para acceder a la propiedad en español en el codigo Inverso.jsx            
        }
    }
}
