// Archivo generado automáticamente por toro_animacion_3d_v3.3.py
// No modificar manualmente.

export const pointsData = [
    {
        "n": 1,
        "q": 1,
        "r": 1,
        "numeral": 1,
        "symName": "lagarto",
        "symFile": "1-lagarto.png",
        "X": 5.0,
        "Y": 0.0,
        "Z": 0.0,
        "classKey": "tlahuiztlanpa",
        "className": "Inicio de Trecena Tlahuiztlanpa",
        "labelNum": "(1,1)",
        "labelImg": "(1, Lagarto)"
    },
    // ... más puntos hasta el 260
];

export const categoriasInfo = [
    { "key": "base", "color": "#4B5563", "symbol": "circle", "size": 5, "name": "Día Regular (q, r)" },
    // ... etc
];

export const groupedData = {
    "base": [ /* puntos de la categoría base */],
    "familia_q_1": [ /* ... */],
    "tlahuiztlanpa": [ /* ... */],
    // ...
};

export const framesData = [
    {
        "trail": [{ "X": 5.0, "Y": 0.0, "Z": 0.0 }],
        "current": { "X": 5.0, "Y": 0.0, "Z": 0.0, "labelNum": "(1,1)", "labelImg": "(1, Lagarto)", "n": 1 }
    },
    // ... frames hasta el 260
];

export const getPointByDay = (n) => pointsData.find(p => p.n === n);