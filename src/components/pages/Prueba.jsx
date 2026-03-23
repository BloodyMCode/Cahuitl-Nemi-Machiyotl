// Función para calcular la diferencia en días desde una fecha de referencia
    const calcularDiferenciaDias=(date, date2)=>{
        let dias=0
         // Ajustar por el cambio de calendario juliano a gregoriano (10 días omitidos en 1582)
        const gregorianStart = new Date(1582, 9, 15); // 15 de octubre de 1582 (gregoriano)
        let currentDate = new Date(date.getTime())
        // Avanzar día a día hasta llegar a date2
        while (currentDate < date2){
            // Si estamos en la transición juliano-gregoriana, saltar 10 días
            if(currentDate.getFullYear() === 1582 && currentDate.getMonth() === 9 && currentDate.getDate() === 4){
                currentDate = new Date(1582,9,15)
                continue
            }
        }
        






        // Ajustar si la fecha seleccionada es antes del mediodía
        const hours=date.getHours()
        const adjustedDate=new Date(date)
        if(hours < 12){
            adjustedDate.setDate(adjustedDate.getDate()-1)
           
        }
        

        const inicioAño=Math.min(1521, adjustedDate.getFullYear())
        const finAño=Math.max(1521, adjustedDate.getFullYear())
        // Calcular días entre años
        for(let año = inicioAño; año < finAño; año++){
            dias += bisiestoAnio(año) ? 366 : 365
        }
        // Ajustar por el cambio del calendario juliano al gregoriano (1582)
        if(adjustedDate.getFullYear() > 1582 || (adjustedDate.getFullYear() === 1582 && adjustedDate.getMonth() > 9) || (adjustedDate.getFullYear() === 1582 && adjustedDate.getMonth() === 9 && adjustedDate.getDate >= 15)){
            dias -= 10
        }
        // Calcular días dentro del año para la fecha de referencia
        let refDias=0
        for(let month = 0; month < 7; month++){
            if(month === 7){
                refDias += 13// 13 de agosto
            }else{
                refDias += getDiasMonth(month, 1521)
            }
        }
        // Calcular días dentro del año para la fecha seleccionada
        let selectedDias=0
        for(let month = 0; month < adjustedDate.getMonth(); month++){
            selectedDias += getDiasMonth(month, adjustedDate.getFullYear())
        }
        selectedDias += adjustedDate.getDate()
        // Ajustar según si la fecha de referencia es anterior o posterior
        if(adjustedDate.getFullYear() >= 1521){
            dias=dias - refDias + selectedDias
            console.log(dias)
        }else{
            dias= - (dias + refDias - selectedDias)
            console.log(dias)
        }
        return dias


    }