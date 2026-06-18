import os
import json
import numpy as np
import plotly.graph_objects as go
import plotly.io as pio

# Ruta de salida fija a src/data/toroData.js
output_dir = os.path.join(os.getcwd(), "src","components", "data")
os.makedirs(output_dir, exist_ok=True)
output_file = os.path.join(output_dir, "toroData.js")

print("Generando Animación 3D v3 con Representación Dual de Numerales e Imágenes...")


# Mapeo por defecto por si las imágenes no están accesibles
nombres_simbolos_defecto = {
    0: "flor", 1: "lagarto", 2: "viento", 3: "casa", 4: "lagartija",
    5: "serpiente", 6: "muerte", 7: "venado", 8: "conejo", 9: "agua",
    10: "perro", 11: "mono", 12: "hierba", 13: "carrizo", 14: "jaguar",
    15: "aguila", 16: "zopilote", 17: "movimiento", 18: "pedernal", 19: "lluvia"
}


# 2. Parámetros del Toro
R_major = 5
r_minor = 1.5

def mapear(x_mod, y_mod):
    v_ang = 2 * np.pi * (x_mod / 13.0)
    u_ang = 2 * np.pi * (y_mod / 20.0)
    X = (R_major + r_minor * np.cos(u_ang)) * np.cos(v_ang)
    Y = (R_major + r_minor * np.cos(u_ang)) * np.sin(v_ang)
    Z = r_minor * np.sin(u_ang)
    return X, Y, Z

points_data = []

for n in range(1, 261):
    q = n % 13
    r = n % 20
    X, Y, Z = mapear(q, r)
    
    numeral = 13 if q == 0 else q
    sym_name = nombres_simbolos_defecto[r]
    sym_file = f"{r}-{sym_name}.png"

    # Clasificación
    if q == 1:
        if n in [1, 53, 105, 157, 209]:
            class_key = 'tlahuiztlanpa'
            class_name = 'Inicio de Trecena Tlahuiztlanpa'
        elif n in [14, 66, 118, 170, 222]:
            class_key = 'huitztlanpa'
            class_name = 'Inicio de Trecena Huitztlanpa'
        elif n in [27, 79, 131, 183, 235]:
            class_key = 'cihuatlanpa'
            class_name = 'Inicio de Trecena Cihuatlanpa'
        elif n in [40, 92, 144, 196, 248]:
            class_key = 'mictlanpa'
            class_name = 'Inicio de Trecena Mictlanpa'
        else:
            class_key = 'tlahuiztlanpa'
            class_name = 'Inicio de Trecena Tlahuiztlanpa'
    elif r == 1:
        class_key = 'familia_q_1'
        class_name = 'Inicio de Veintena'
    else:
        class_key = 'base'
        class_name = 'Día Regular'
        
    points_data.append({
        "n": n,
        "q": q,
        "r": r,
        "numeral": numeral,
        "symName": sym_name,
        "symFile": sym_file,
        "X": float(X),
        "Y": float(Y),
        "Z": float(Z),
        "classKey": class_key,
        "className": class_name,
        "labelNum": f"({q},{r})",
        "labelImg": f"({numeral}, {sym_name.capitalize()})"
    })
# --- CLASIFICACIÓN DE LOS 260 PUNTOS Y RECOLECCIÓN DE DATOS ---
categorias_info = [
    {"key": "base", "color": "#4B5563", "symbol": "circle", "size": 5, "name": "Día Regular (q, r)"},
    {"key": "familia_q_1", "color": "#00CEC9", "symbol": "circle", "size": 8, "name": "Inicio de Veintena"},
    {"key": "tlahuiztlanpa", "color": "#F1C40F", "symbol": "diamond", "size": 11, "name": "Inicio de Trecena Tlahuiztlanpa"},
    {"key": "huitztlanpa", "color": "#0984E3", "symbol": "diamond", "size": 11, "name": "Inicio de Trecena Huitztlanpa"},
    {"key": "cihuatlanpa", "color": "#D63031", "symbol": "diamond", "size": 11, "name": "Inicio de Trecena Cihuatlanpa"},
    {"key": "mictlanpa", "color": "#7F8C8D", "symbol": "diamond", "size": 11, "name": "Inicio de Trecena Mictlanpa"},
]

grouped = {}
for cat in categorias_info:
    grouped[cat["key"]] = [p for p in points_data if p["classKey"] == cat["key"]]

# --- CONTROL DE ANIMACIÓN Y SLIDERS ---
frames = []
for k in range(1, 261):
    trail = [{"X": p["X"], "Y": p["Y"], "Z": p["Z"]} for p in points_data[:k]]
    current = points_data[k-1]
    frames.append({
        "trail": trail,
        "current": {
            "X": current["X"],
            "Y": current["Y"],
            "Z": current["Z"],
            "labelNum": current["labelNum"],
            "labelImg": current["labelImg"],
            "n": current["n"]
        }
    })
js_content = f"""// Archivo generado automáticamente por toro_animacion_3d_v3.3.py
// No modificar manualmente.
export const pointsData = {json.dumps(points_data, indent=2)};

export const categoriasInfo = {json.dumps(categorias_info, indent=2)};

export const groupedData = {json.dumps(grouped, indent=2, default=lambda x: list(x) if isinstance(x, np.ndarray) else x)};

export const framesData = {json.dumps(frames, indent=2)};

export const getPointByDay = (n) => pointsData.find(p => p.n === n);
"""

with open(output_file, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"✅ toroData.js generado en {output_file}")