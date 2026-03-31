import React, { useState } from 'react'

const Calculadora = () => {
    const [sdate, setSdate] = useState('2026-03-12');
    const [time, setTime] = useState('06:43');
    const [result, setResult] = useState(null);
    // Referencia Maestra: 12 de Marzo 2026, 06:43 AM = Bloque 1, Año 1, Día 1
    const REF_YEAR = 2026;
    const calcularPosicion = () => {
        if (!sdate || !time) return;
        const [yStr, mStr, dStr] = sdate.split('-');
        const [hStr, minStr] = time.split(':');

        const y = parseInt(yStr);
        const m = parseInt(mStr);
        const d = parseInt(dStr);
        const h = parseInt(hStr);
        const min = parseInt(minStr);

        const isJuliano = y <= 1582;
        const baseDay = isJuliano ? 2 : 12;

        // 1. Determinar el Año dentro del Bloque (1 a 52)
        // Usamos 1974 como ancla (52 años antes de 2026)
        let yearInBlock = ((y - 1974) % 52) + 1;
        if (yearInBlock <= 0) yearInBlock += 52;

        // 2. Determinar la posición en el ciclo de 4 años (0, 1, 2, 3)
        let cyclePos = (y - REF_YEAR) % 4;
        if (cyclePos < 0) cyclePos += 4;

        // 3. Definir inicio exacto de ESTE año consultado
        let startDay = baseDay;
        let startHour = 6;
        let startMin = 43;

        if (cyclePos === 1) startHour = 12;
        if (cyclePos === 2) { startDay = baseDay - 1; startHour = 18; }
        if (cyclePos === 3) { startHour = 0; }

        // 4. Calcular días transcurridos desde el 1 de Enero (Cuenta fija 365)
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        const getAbsDays = (month, day) => {
            let total = 0;
            for (let i = 0; i < month - 1; i++) total += daysInMonth[i];
            return total + day;
        }

        const targetAbsDays = getAbsDays(m, d);
        const startAbsDays = getAbsDays(3, startDay);

        // Diferencia de días nominales
        let diffDays = targetAbsDays - startAbsDays;

        // 5. AJUSTE DE HORA RITUAL:
        // El día cambia en la hora específica. Si la hora ingresada es anterior 
        // a la hora de inicio, restamos 1 día (pertenece al día ritual anterior).
        const inputTotalMins = (h * 60) + min;
        const startTotalMins = (startHour * 60) + startMin;

        if (inputTotalMins < startTotalMins) {
            diffDays -= 1;
        }

        // 6. CÁLCULO FINAL
        // (Años previos del bloque * 365) + días transcurridos este año + 1
        const finalDay = ((yearInBlock - 1) * 365) + diffDays + 1;

        setResult({
            day: finalDay,
            year: yearInBlock,
            cycle: cyclePos + 1,
            cal: isJuliano ? "Juliano" : "Gregoriano",
            startTime: `${startDay} de marzo, ${startHour}:${startMin < 10 ? '0' + startMin : startMin}`
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
                                <label className="small fw-bold">Hora</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        </div>
                        <button className="btn btn-primary w-100 fw-bold shadow-sm" onClick={calcularPosicion}>CALCULAR DÍA RITUAL</button>

                        {result && (
                            <div className="mt-4 p-3 bg-white rounded border text-center">
                                <span className="badge bg-secondary mb-2">{result.cal}</span>
                                <h1 className="display-4 fw-bold text-primary mb-0">Día {result.day}</h1>
                                <p className="text-muted small">Año {result.year} del Bloque (Ciclo 4: Año {result.cycle})</p>
                                <div className="alert alert-secondary py-1 small">Inicio del año: {result.startTime}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Calculadora