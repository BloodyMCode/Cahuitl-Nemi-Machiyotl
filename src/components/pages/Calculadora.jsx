import React, { useState } from 'react'

const Calculadora = () => {
    const [sdate, setSdate] = useState('2026-03-12');
    const [time, setTime] = useState('');
    const [result, setResult] = useState(null);
    // Referencia Maestra: 12 de Marzo 2026, 06:43 AM = Bloque 1, Año 1, Día 1
    const REF_YEAR = 2026;
    const calcularPosicion = () => {
        if (!sdate) return;
        const [yStr, mStr, dStr] = sdate.split('-');
        
        let y = parseInt(yStr);
        const m = parseInt(mStr);
        const d = parseInt(dStr);

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

        // 7. CÁLCULO FINAL
        const finalDay = ((yearInBlock - 1) * 365) + diffDays + 1;

        setResult({
            day: finalDay,
            year: yearInBlock,
            cycle: params.cyclePos + 1,
            cal: isJuliano ? "Juliano" : "Gregoriano",
            startTime: `${params.sDay} de marzo, ${params.sHour}:${params.sMin < 10 ? '0' + params.sMin : params.sMin}`,
            usedTime: `${h}:${min < 10 ? '0' + min : min}`
        })
    }

    return (
        <>
            <div className="container py-5">
                <div className="card shadow-lg border-0 mx-auto" style={{ maxWidth: '500px' }}>
                    <div className="card-header bg-dark text-white text-center">
                        <h5 className="mb-0">Calculador Ritual 18,980 Días</h5>
                    </div>
                    <div className="card-body bg-light">
                        <div className="row g-2 mb-3">
                            <div className="col-12">
                                <label className="small fw-bold">Fecha</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={sdate}
                                    onChange={e => setSdate(e.target.value)}
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        </div>
                        <div className="row g-2 mb-4">
                            <div className="col-12">
                                <label className="small fw-bold">Hora (Opcional)</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    style={{ colorScheme: 'dark' }}
                                />
                                <small className="text-muted" style={{ fontSize: '10px' }}>* Si se deja vacío, usa la hora de inicio del año ritual.</small>
                            </div>
                        </div>
                        <button className="btn btn-primary w-100 fw-bold shadow-sm" onClick={calcularPosicion}>CALCULAR DÍA RITUAL</button>

                        {result && (
                            <div className="mt-4 p-3 bg-white rounded border text-center">
                                <span className="badge bg-secondary mb-2">{result.cal}</span>
                                <h1 className="display-4 fw-bold text-primary mb-0">Día {result.day}</h1>
                                <p className="text-muted small">Año {result.year} del Bloque (Ciclo 4: Año {result.cycle})</p>
                                <div className="alert alert-secondary py-1 small mb-1">Hora procesada: {result.usedTime}</div>
                                <div className="alert alert-info py-1 small">Inicio del año: {result.startTime}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Calculadora