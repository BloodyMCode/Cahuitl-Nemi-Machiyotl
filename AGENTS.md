# Guía y Reglas para Agentes de Antigravity (AGENTS.md)

Este repositorio contiene el proyecto **Machiyotl (Cahuitl-Nemi-Machiyotl)**, una aplicación interactiva astronómica y calendárica mesoamericana desarrollada en **React 19 + Vite 6 + Plotly.js 3D + Bootstrap**.

---

## 1. Repositorios y Control de Versiones
* **Repositorio Oficial (Origin):** `https://github.com/MathCoffee/Cahuitl-Nemi-Machiyotl.git`
  * Rama principal: `main`
* **Repositorio Upstream (Código fuente original):** `https://github.com/BloodyMCode/Calendarios.git`
  * Se utiliza para traer actualizaciones del código fuente original cuando el autor publique cambios.
* **Token de Acceso GitHub:** Configurado en el remote origin para operaciones autenticadas (`git push`).

---

## 2. Regla Crítica del Entorno Local (NO usar iCloud / Google Drive para `node_modules`)
* **Ubicación obligatoria:** El repositorio DEBE clonarse y ejecutarse en una ruta local del disco sólido (ej. `~/Developer/Machiyotl` o `C:\Developer\Machiyotl`).
* **Motivo técnico:** Los servicios de sincronización en la nube (iCloud Drive, Google Drive, OneDrive) desalojan archivos pequeños (*dataless faults* de inodos) y bloquean el sistema de archivos durante `npm install` o `vite dev`, causando congelamientos (*deadlocks*) en el kernel y errores de tipo `ENOTEMPTY`.

---

## 3. Arquitectura del Proyecto y Tecnologías
* **Frontend:**
  * React 19 (`react`, `react-dom`)
  * Vite 6 (`vite`, `@vitejs/plugin-react`)
  * Router: `react-router-dom` v7
  * UI: `bootstrap`, `react-bootstrap`, `bootstrap-icons`, `cdbootstrap`
  * Subdependencias obligatorias de UI: `dom-helpers`, `uncontrollable`
  * Visualización 3D y Gráficos: `plotly.js-dist-min`, `react-plotly.js`
* **Backend / Scripts Auxiliares:**
  * Python 3 (`python3 src/components/python/toro_animacion_3d_v3.6.py`)
  * Genera el archivo geométrico matemático: `src/components/data/toroData.json`

---

## 4. Comandos de Trabajo

### Iniciar en Desarrollo:
```bash
npm run dev
```
*(Este comando ejecuta primero la generación de datos en Python y luego levanta el servidor Vite en `http://localhost:5173/`).*

### Compilar para Producción:
```bash
npm run build
```
*(Genera la carpeta optimizada `dist/` con todos los bundles de JavaScript, CSS y assets empaquetados).*

### Actualizar desde Upstream (BloodyMCode/Calendarios):
```bash
git fetch upstream
git merge upstream/main --no-edit
npm run generate-data
git push origin main
```

---

## 5. Próximo Paso en la Hoja de Ruta: Empaquetado Multiplataforma con Tauri v2
* **Objetivo:** Convertir la aplicación en instalables nativos de escritorio para **macOS (.dmg)** y **Windows (.exe / .msi)**.
* **Estrategia acordada:**
  1. Configuración de `src-tauri/` con Tauri v2 y Rust.
  2. Implementación del flujo de GitHub Actions en `.github/workflows/release.yml` para compilar automáticamente instaladores al publicar una etiqueta de versión (`v1.0.0`).
  3. Soporte para compilación local en macOS mediante `npm run tauri build`.
