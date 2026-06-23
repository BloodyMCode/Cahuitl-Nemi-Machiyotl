import os
import json
import numpy as np
import plotly.graph_objects as go
import plotly.io as pio

print("Generando Animación 3D v3 con Representación Dual de Numerales e Imágenes...")

# 1. Escanear carpeta de imágenes para símbolos
""" simbolos_dir = "imagenes/simbolos"
simbolos_files = {} """
# ============================================================
# MODIFICACIÓN: Ruta absoluta a la carpeta de imágenes
# ============================================================
# El script está en src/components/python, las imágenes en src/components/images
script_dir = os.path.dirname(__file__)                      # src/components/python
simbolos_dir = os.path.join(script_dir, '..', 'images')    # src/components/images


# Mapeo por defecto por si las imágenes no están accesibles
nombres_simbolos_defecto = {
    0: "flor", 1: "lagarto", 2: "viento", 3: "casa", 4: "lagartija",
    5: "serpiente", 6: "muerte", 7: "venado", 8: "conejo", 9: "agua",
    10: "perro", 11: "mono", 12: "hierba", 13: "caña", 14: "jaguar",
    15: "aguila", 16: "zopilote", 17: "movimiento", 18: "pedernal", 19: "lluvia"
}

""" if os.path.exists(simbolos_dir):
    for filename in os.listdir(simbolos_dir):
        if filename.endswith(".png"):
            parts = filename.split("-")
            if len(parts) >= 2:
                try:
                    r_val = int(parts[0].strip())
                    simbolos_files[r_val] = filename
                except ValueError:
                    pass """

# Generar diccionario completo de mapeo de nombres y archivos de símbolos
""" simbolos_info = {}
for r in range(20):
    filename = simbolos_files.get(r, "")
    if filename:
        parts = filename.split("-")
        name = parts[1].replace(".png", "").strip()
    else:
        # Fallback si el archivo no existe
        name = nombres_simbolos_defecto[r]
        filename = f"{r} - {name}.png"
        if r == 7:
            filename = "7-venado.png"
    
    simbolos_info[r] = {
        "file": filename,
        "name": name
    } """
# ============================================================
# Generar simbolos_info usando nombres de archivo sin guiones
# ============================================================
simbolos_info = {}
for r in range(20):
    name = nombres_simbolos_defecto[r]
    simbolos_info[r] = {
        "file": f"{name}.png",   # ej: "flor.png"
        "name": name
    }

# (Opcional) Podrías verificar que los archivos existen, pero se asume que están.

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

# 3. Trayectoria para la animación (261 puntos para cerrar el lazo)
n_vals = np.arange(1, 262)
u_mod = n_vals % 13
v_mod = n_vals % 20
X_traj, Y_traj, Z_traj = mapear(u_mod, v_mod)

fig = go.Figure()

# --- TRAZO 0: Superficie del Toro estática ---
u_toro = np.linspace(0, 2*np.pi, 80)
v_toro = np.linspace(0, 2*np.pi, 80)
U_grid, V_grid = np.meshgrid(u_toro, v_toro)
X_surf = (R_major + r_minor * np.cos(U_grid)) * np.cos(V_grid)
Y_surf = (R_major + r_minor * np.cos(U_grid)) * np.sin(V_grid)
Z_surf = r_minor * np.sin(U_grid)

fig.add_trace(go.Surface(
    x=X_surf, y=Y_surf, z=Z_surf,
    opacity=0.20,
    colorscale='Blues',
    showscale=False,
    hoverinfo='skip',
    name='Toro'
))

# --- CLASIFICACIÓN DE LOS 260 PUNTOS Y RECOLECCIÓN DE DATOS ---
categorías = {
    'base': {
        'x': [], 'y': [], 'z': [], 'n': [],
        'text_num': [], 'text_img': [], 'hover': [],
        'color': '#4B5563', 'symbol': 'circle', 'size': 5, 'name': 'Día Regular (q, r)'
    },
    'familia_q_1': {
        'x': [], 'y': [], 'z': [], 'n': [],
        'text_num': [], 'text_img': [], 'hover': [],
        'color': '#00CEC9', 'symbol': 'circle', 'size': 8, 'name': 'Inicio de Veintena'
    },
    'tlahuiztlanpa': {
        'x': [], 'y': [], 'z': [], 'n': [],
        'text_num': [], 'text_img': [], 'hover': [],
        'color': '#F1C40F', 'symbol': 'diamond', 'size': 11, 'name': 'Inicio de Trecena Tlahuiztlanpa'
    },
    'huitztlanpa': {
        'x': [], 'y': [], 'z': [], 'n': [],
        'text_num': [], 'text_img': [], 'hover': [],
        'color': '#0984E3', 'symbol': 'diamond', 'size': 11, 'name': 'Inicio de Trecena Huitztlanpa'
    },
    'cihuatlanpa': {
        'x': [], 'y': [], 'z': [], 'n': [],
        'text_num': [], 'text_img': [], 'hover': [],
        'color': '#D63031', 'symbol': 'diamond', 'size': 11, 'name': 'Inicio de Trecena Cihuatlanpa'
    },
    'mictlanpa': {
        'x': [], 'y': [], 'z': [], 'n': [],
        'text_num': [], 'text_img': [], 'hover': [],
        'color': '#7F8C8D', 'symbol': 'diamond', 'size': 11, 'name': 'Inicio de Trecena Mictlanpa'
    }
}

points_data = {}

for n in range(1, 261):
    q = n % 13
    r = n % 20
    X, Y, Z = mapear(q, r)
    
    numeral = 13 if q == 0 else q
    sym_name = simbolos_info[r]["name"]
    sym_file = simbolos_info[r]["file"] # ahora es "flor.png", etc.
    
    label_num = f"({q},{r})"
    label_img = f"({numeral}, {sym_name.capitalize()})"
    
    hover_info = f"Día n: <b>{n}</b><br>Coordenadas: <b>({q}, {r})</b>"
    
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
        
    categorías[class_key]['x'].append(X)
    categorías[class_key]['y'].append(Y)
    categorías[class_key]['z'].append(Z)
    categorías[class_key]['n'].append(n)
    categorías[class_key]['text_num'].append(label_num)
    categorías[class_key]['text_img'].append(label_img)
    categorías[class_key]['hover'].append(hover_info + f"<br>Tipo: <b>{class_name}</b>")
    
    points_data[n] = {
        "q": q,
        "r": r,
        "numeral": numeral,
        "symName": sym_name,
        "symFile": sym_file, # ej: "flor.png"
        "className": class_name,
        "classKey": class_key
    }

# Agregar los traces al gráfico Plotly (Trazas 1 a 6)
trace_keys = ['base', 'familia_q_1', 'tlahuiztlanpa', 'huitztlanpa', 'cihuatlanpa', 'mictlanpa']
for cat_key in trace_keys:
    cat = categorías[cat_key]
    line_dict = dict(color='white', width=1) if cat_key != 'base' else dict(color='black', width=0.5)
    
    fig.add_trace(go.Scatter3d(
        x=cat['x'], y=cat['y'], z=cat['z'],
        mode='markers',  # Iniciamos limpio
        marker=dict(
            size=cat['size'],
            color=cat['color'],
            symbol=cat['symbol'],
            line=line_dict
        ),
        text=cat['text_num'],  # Por defecto numérico
        textposition="top center",
        textfont=dict(color='#0F172A', size=11, family='Arial, sans-serif'),
        hovertext=cat['hover'],
        hoverinfo='text',
        customdata=cat['n'],  # Almacena el número de día n
        name=cat['name']
    ))

# --- TRAZO 5: Rastro (Trail) animado ---
fig.add_trace(go.Scatter3d(
    x=[X_traj[0]], y=[Y_traj[0]], z=[Z_traj[0]],
    mode='lines',
    line=dict(color='yellow', width=4),
    opacity=0.8,
    name='Trayectoria',
    hoverinfo='skip'
))

# --- TRAZO 6: Generador Activo (Tracer) animado ---
fig.add_trace(go.Scatter3d(
    x=[X_traj[0]], y=[Y_traj[0]], z=[Z_traj[0]],
    mode='markers+text',
    marker=dict(
        size=10,
        color='red',
        symbol='circle',
        line=dict(color='black', width=1)
    ),
    text=["(1,1)"],
    textposition="top center",
    textfont=dict(color='red', size=12, family='Arial Black'),
    name='Generador Activo',
    hoverinfo='skip'
))
# ==============================================================================
# REEMPLAZAR DESDE LOS FRAMES / SLIDERS HASTA EL FINAL DEL ARCHIVO CON ESTO:
# ==============================================================================

# Generar el arreglo ordenado de las trayectorias para pasarlo directo a React
# Esto evita recalcular arreglos de numpy en el cliente.
trajectory_data = []
for k in range(1, len(n_vals)):
    q = k % 13
    r = k % 20
    X, Y, Z = mapear(q, r)
    trajectory_data.append({"n": int(k), "x": float(X), "y": float(Y), "z": float(Z)})

# Estructura unificada para el archivo JSON de salida
output_data = {
    "points": points_data,
    "trajectory": trajectory_data
}

# Definir la ruta de salida correcta según tu arquitectura de carpetas
output_path = os.path.join(os.path.dirname(__file__), "..", "data", "toroData.json")

# Crear el directorio base si no existe
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Exportar datos puros con codificación UTF-8
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print(f"¡Datos geométricos exportados exitosamente en: {output_path}!")
