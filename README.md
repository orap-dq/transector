# Transector · Transectos urbanos

**Herramienta de apoyo al MAPEX**
ORAP – Observatorio de la Realidad y la Acción Pastoral · Vicaría Episcopal de Pastoral · Diócesis de Querétaro

👉 **App:** https://orap-dq.github.io/transector/

---

## ¿Qué es?

Transector es una aplicación para el celular que sirve para hacer **transectos urbanos**: recorridos a pie por una zona de la ciudad para observar y registrar lo que se ve, se escucha y se percibe.

Durante el recorrido, la app va mostrando la ubicación en el mapa y graba la ruta. En cualquier momento se puede presionar **Captura** para registrar un punto, y en él guardar:

- 📷 **Fotos** (de la cámara o de la galería)
- 🎙 **Grabaciones de voz**
- 📝 **Notas escritas**
- 💬 **Sentimiento percibido** (tranquilidad, miedo, indiferencia…) con intensidad opcional

Todo queda ubicado en el mapa. La información se sube a **Transector Central**, desde donde el equipo ORAP la revisa, la analiza y la exporta.

## Funciones principales

| | |
|---|---|
| **Transecto libre o planeado** | Un transecto planeado trae su ruta dibujada en el mapa (archivo KML de Google My Maps / Earth, GPX o GeoJSON). La puede subir el usuario o asignarla el equipo ORAP. |
| **Inicio, pausa y cierre** | Se registran fecha, hora de inicio y de cierre, pausas (con motivo), tiempo efectivo y distancia recorrida. |
| **Un día como máximo** | Si un transecto sigue abierto a las 23:59, la app lo cierra sola (*cierre automático*). |
| **Corregir en el camino** | Mientras el transecto está abierto, cada punto se puede editar o borrar (desde su marcador en el mapa). |
| **Sellado** | Una vez cerrado, el transecto ya no se puede modificar desde la app. |
| **Parroquia** | Se elige por decanato y parroquia, o se detecta automáticamente con la ubicación. |
| **Funciona sin señal** | Todo se guarda primero en el celular y se sube después, cuando hay internet. Si se corta la señal a la mitad, continúa donde se quedó. |
| **Historial** | Cada usuario puede ver y abrir sus transectos: mapa, puntos, fotos, audios y notas. |
| **Liberar espacio** | Al subir un transecto, la app ofrece borrar del celular sus fotos y audios (ya están en Drive). También hay un botón *Liberar espacio*. |

## ¿Quién puede usarla?

Solo las personas **dadas de alta en Transector Central** por el equipo ORAP. Cada usuario recibe un código (por ejemplo, `U01`) y una contraseña. La contraseña no se puede cambiar desde la app; si se pierde, el equipo ORAP asigna una nueva.

## Cómo instalarla en el celular

1. Abre **https://orap-dq.github.io/transector/** en Chrome (Android) o Safari (iPhone).
2. Entra con tu usuario y contraseña (la primera vez necesitas internet).
3. Agrégala a la pantalla de inicio:
   - **Android (Chrome):** menú ⋮ › *Agregar a la pantalla principal* / *Instalar app*.
   - **iPhone (Safari):** botón Compartir › *Agregar a inicio*.
4. Permite el acceso a la **ubicación**, la **cámara** y el **micrófono** cuando la app lo pida.

### Recomendaciones para el recorrido

- Mantén la app abierta y la pantalla encendida (la app intenta evitar que se apague). Si la pantalla se apaga, la ruta tendrá un hueco que se une con línea recta; los puntos de captura siempre quedan exactos.
- El mapa de fondo necesita internet la primera vez que se ve una zona; después queda guardado en el celular.
- Cierra el transecto al terminar para que se suba.

---

## Arquitectura

```
┌────────────────────────┐        ┌──────────────────────────────┐
│  App Transector (PWA)  │  POST  │  Transector Central          │
│  este repositorio      │ ─────► │  Google Sheets + Apps Script │
│  GitHub Pages          │        │  (fotos y audios en Drive)   │
└────────────────────────┘        └──────────────▲───────────────┘
                                                 │ JSONP
                                  ┌──────────────┴───────────────┐
                                  │  Transector_Central.html     │
                                  │  (programa del equipo ORAP)  │
                                  └──────────────────────────────┘
```

Este repositorio contiene **solo la app del celular**. El servidor (Apps Script) y el programa de gestión viven en el Drive del ORAP y no se publican aquí.

### Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Toda la app: pantallas, mapa, GPS, captura, base de datos local (IndexedDB) y sincronización. |
| `sw.js` | *Service worker*: guarda la app en el celular para que abra sin señal y guarda las teselas del mapa ya vistas. |
| `manifest.json` | Datos para instalar la app (nombre, colores, íconos). |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Íconos de la app. |
| `logo.png` | Logo de la pantalla de entrada (temporalmente, el emblema del MAPEX). |
| `leaflet/` | Librería de mapas [Leaflet 1.9.4](https://leafletjs.com/), incluida aquí para que funcione sin internet. |

### Cómo publicar una versión nueva

1. Reemplaza en el repositorio los archivos que cambiaron (normalmente `index.html`).
2. **Siempre** sube el número de versión en `sw.js`:
   ```js
   const VERSION = 'transector-v3';   // → 'transector-v4'
   ```
   Así los celulares detectan que hay versión nueva y la descargan la siguiente vez que abran la app con señal (a veces hay que abrirla dos veces).

---

## Privacidad

- Las contraseñas nunca viajan ni se guardan tal cual: solo su huella (SHA-256).
- Las fotos y audios se guardan en una carpeta privada de Google Drive del ORAP; no son públicos.
- Cada usuario solo puede ver sus propios transectos.
- Al hacer fotos de personas en la vía pública, procura respetar su dignidad y privacidad.

## Créditos y licencias

- Desarrollo: **ORAP** · Diócesis de Querétaro.
- Mapas: [Leaflet](https://leafletjs.com/) (licencia BSD-2, ver `leaflet/LICENSE`) y teselas de © [colaboradores de OpenStreetMap](https://www.openstreetmap.org/copyright).
- Logo del MAPEX: © ORAP, Diócesis de Querétaro. Uso reservado.
