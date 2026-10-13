# Estado Actual del Proyecto: Machiyotl (PROJECT_STATUS.md)

**Última actualización:** Octubre 2026  
**Repositorio GitHub:** [MathCoffee/Cahuitl-Nemi-Machiyotl](https://github.com/MathCoffee/Cahuitl-Nemi-Machiyotl)  
**Rama activa:** `main`

---

## 📌 Resumen de Estado

| Componente | Estado | Detalle |
| :--- | :---: | :--- |
| **Sincronización Git** |  Completado | Totalmente al día con upstream (`BloodyMCode/Calendarios`). Commits `6068e47` y `66ab735` integrados. |
| **Entorno Local** |  Completado | Migrado a disco local fuera de iCloud: `/Users/emyzucatalan/Developer/Machiyotl`. |
| **Generación 3D (Python)** |  Completado | `toroData.json` generado exitosamente sin discrepancias. |
| **Dependencias (`npm`)** |  Completado | Todas las dependencias (UI, Plotly, Vite, Rollup x64) instaladas y enlazadas. |
| **Compilación (`build`)** |  Completado | `npm run build` ejecutado exitosamente (`dist/index.html` generado en 5m 21s). |
| **Servidor Dev (`localhost`)** |  Completado | Respondiendo con HTTP 200 en `http://localhost:5173/` en 472ms. |
| **Empaquetado Tauri v2** | ⏳ Pendiente | Siguiente fase aprobada: generación de instaladores para Mac (`.dmg`) y Windows (`.exe`/`.msi`). |

---

## 🛠️ Historial de Problemas Resueltos y Diagnóstico
1. **iCloud Dataless Faults:** Se diagnosticó que al estar en `com~apple~CloudDocs`, el sistema de archivos de Apple desalojaba archivos de `node_modules` (`SIZE/OFF 2097120`), congelando el proceso Node en el kernel de macOS. Solucionado al clonar y trabajar en `/Users/emyzucatalan/Developer/Machiyotl`.
2. **Rollup darwin-x64:** Se instaló `@rollup/rollup-darwin-x64` para compatibilidad completa con procesadores Intel en macOS.
3. **Subdependencias de React Bootstrap:** Se declararon explícitamente `dom-helpers` y `uncontrollable` para evitar fallos de esbuild en pre-empaquetado.

---

## 🎯 Siguiente Tarea a Ejecutar
1. Instalar `@tauri-apps/cli`.
2. Crear la configuración de `src-tauri/` (`Cargo.toml`, `tauri.conf.json`, iconos e inicialización de Rust).
3. Configurar el workflow `.github/workflows/release.yml` para compilar instaladores automáticamente en GitHub Actions para macOS y Windows.
