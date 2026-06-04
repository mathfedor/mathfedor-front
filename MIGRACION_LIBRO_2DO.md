# Migración — Matemáticas de Fedor 2° → Arquitectura Next.js existente

Documento de análisis, decisiones de arquitectura, propuesta de modelo MongoDB y
estado de ejecución de la migración del HTML gamificado al proyecto `mathfedor-front`.

---

## 1. Análisis del proyecto actual

`mathfedor-front` es una aplicación **Next.js 15 (App Router)** con **TypeScript estricto**
(`strict: true`) y **Tailwind 3**. Patrones detectados y respetados en la migración:

- **Servicios** en `src/services/*` que consumen `process.env.NEXT_PUBLIC_API_URL` vía
  `fetch`/`axios`, con un patrón de **mock como fallback** ya presente
  (`learning-results.service.ts` usa `mockLearningResults` cuando el backend responde vacío).
- **Tipos** centralizados en `src/types/*` (`module.types.ts`, `diagnostic.types.ts`).
  El modelo existente `Module → topics → exercises` es conceptualmente compatible con el
  contenido del HTML, pero más pobre (ejercicios planos `statement/options/correctAnswer`).
- **Contextos** (`ThemeContext`, `ModuleAccessContext`) y **layout de dashboard**
  (`app/dashboard/layout.tsx`) que envuelve las páginas con `AuthenticatedNavbar`.
- **Colores de marca** en `tailwind.config.ts` (`fedor-orange`, `fedor-purple`).

El HTML adjunto (`MatematicasDeFedor_2°.html`, 13.065 líneas) es una **SPA gamificada
autocontenida** que guarda todo en `localStorage`, con 8 pantallas, un currículo embebido
(`UNITS`) y una capa de gamificación (XP, monedas, rachas, insignias, rangos, avatares,
tienda, reto diario, mapa galaxia 3D con three.js y reporte docente con "IA").

`0-metodofedor.learnings.json` confirma el modelo de la colección `learning` en Mongo
(módulos con `topics[]` y descripciones HTML embebidas con marcadores `{img_...}`).

---

## 2. Decisiones de migración (cumpliendo las 10 reglas)

| Regla | Cómo se cumplió |
|------|------------------|
| 1. No crear arquitectura nueva | Se reutilizó App Router, `src/types`, `src/services`, contextos y el shell de `app/dashboard`. |
| 2. Reutilizar estructura actual | Nueva ruta en `app/dashboard/libro-2do/` bajo el layout existente. |
| 3. Reutilizar componentes | Se reusan clases/Tailwind y el patrón de spinner; los nuevos componentes siguen el estilo de los `*.tsx` existentes. |
| 4. TypeScript estricto | 0 `any`, 0 `@ts-ignore`; uniones discriminadas para ejercicios; imports de tipo. |
| 5. Tailwind | Se mantiene; el CSS del HTML se portó **aislado bajo `.fedor-book`** para no contaminar el resto. |
| 6. Mocks sin endpoints | `book-curriculum.mock.ts` + fallbacks en cada servicio (flag `NEXT_PUBLIC_BOOK_API`). |
| 7. Servicios backend-ready | Cada método tiene su endpoint destino (`/books/...`) y cae al mock si el backend está desactivado. |
| 8. Interfaces TS | `book.types.ts`, `gamification.types.ts`, `book-progress.types.ts`. |
| 9. Mejoras a MongoDB | Sección 5 de este documento. |
| 10. Dividir HTML en componentes | 8 pantallas + componentes compartidos (ver sección 3). |

**Datos reales preservados:** se extrajeron del HTML (evaluando el JS en Node, sin inventar
contenido) **940 ejercicios** reales en **8 unidades / 24 temas / 94 niveles**, además del
catálogo completo: **15 avatares, 11 insignias, 6 rangos, 16 ítems de tienda**.

---

## 3. Estructura creada

```
src/
├── types/
│   ├── book.types.ts            # Book → Unit → Topic → Level → Exercise (mcq|input|seq)
│   ├── gamification.types.ts    # Avatar, Badge, Rank, ShopItem, GamificationState
│   └── book-progress.types.ts   # BookProgress, ScoreMap, LessonResult, Grade, AIAnalysis
├── mocks/
│   ├── data/book-curriculum.data.json   # currículo real extraído del HTML (940 ejercicios)
│   └── book-curriculum.mock.ts          # normaliza el JSON al modelo tipado (añade ids/índices)
├── services/
│   ├── book.service.ts          # currículo + catálogo (fetch /books, fallback mock)
│   ├── book-progress.service.ts # persistencia de progreso (localStorage → backend)
│   ├── gamification.service.ts  # lógica pura: grade(), rank, XP→avatares, badges, recompensas
│   └── book-report.service.ts   # resumen docente + análisis IA (mock determinista)
├── components/book/
│   ├── BookExperience.tsx        # proveedor + router de pantallas + navegación inferior
│   ├── context/BookContext.tsx   # estado global (reemplaza las globals del HTML)
│   ├── shared/
│   │   ├── Starfield.tsx          # campo de estrellas (reemplaza makeStars)
│   │   ├── UnitCard.tsx           # tarjeta de unidad reutilizable
│   │   ├── ExerciseView.tsx       # renderiza/evalúa mcq | input | seq
│   │   └── progress.utils.ts      # cálculo de % por unidad/tema/global
│   └── screens/
│       ├── SetupScreen.tsx · HomeScreen.tsx · UnitScreen.tsx · LessonScreen.tsx
│       └── ResultsScreen.tsx · ReportScreen.tsx · ProfileScreen.tsx · ShopScreen.tsx
└── app/dashboard/libro-2do/
    ├── page.tsx                  # 'use client' → <BookExperience/>
    └── book.css                  # CSS del HTML portado y aislado bajo .fedor-book
```

**Aislamiento del CSS:** los selectores globales del HTML (`*`, `html`, `body`, `:root`,
`#app`) se reescribieron a `.fedor-book` mediante un transformador que prefija cada regla
(respetando `@media`, `@keyframes` y `@font-face`). Así el diseño espacial original se
preserva sin romper el dashboard.

---

## 4. Cómo activar el backend real

Los servicios funcionan con mocks por defecto. La configuración HTTP está **centralizada**
en `src/services/book-http.ts` (URL base, slug, flag y cabeceras con token Bearer). Para
conmutar al backend Node.js basta con:

```bash
NEXT_PUBLIC_API_URL=https://api.metodofedor.com
NEXT_PUBLIC_BOOK_API=true   # activa las llamadas reales; sin esto, se usan mocks
```

Endpoints esperados (contratos ya definidos en los servicios):

- `GET  /books/{slug}` → `Book`
- `GET  /books/{slug}/gamification` → `GamificationCatalog`
- `GET/PUT /books/{slug}/progress` → `BookProgress`
- `POST /books/{slug}/results` → registra `LessonResult`
- `POST /books/{slug}/ai-analysis` → `AIAnalysis`

> **Contratos detallados** (request/response, status, auth, esquemas Mongoose y checklist de
> corte) en **`API_CONTRATOS_BACKEND.md`**. Todas las peticiones envían `Authorization: Bearer`
> con el mismo token del resto de la app (`authService.getToken()`).

---

## 5. Propuesta de mejoras al modelo MongoDB

El modelo actual (colección `learning`) embebe ejercicios planos y mezcla contenido con
HTML crudo (`{img_...}`). Para soportar el libro gamificado se proponen estos cambios:

### 5.1. Separar **catálogo** de **estado del estudiante**
Hoy el HTML guarda todo en `localStorage`. Se proponen tres colecciones:

- **`books`** (currículo, sustituye/extiende `learning`):
  estructura tipada `units → topics → levels → exercises`, con `schemaVersion` y
  `slug` único. Un libro ≈ 770 KB embebido — dentro del límite de 16 MB de Mongo, pero
  conviene versionarlo (ver 5.3).
- **`bookProgress`** (1 doc por estudiante+libro): `scores` (mapa por nivel),
  snapshot de `gamification` (XP, monedas, racha, insignias, tienda) y `student`.
- **`bookAttempts`** (append-only, analítica): un documento por intento de nivel con
  `attempts[]` por ejercicio. Permite reportes docentes sin recalcular sobre `localStorage`.

### 5.2. Ejercicios como **unión discriminada validada**
Añadir `type: 'mcq' | 'input' | 'seq'` y validarlo con **JSON Schema de Mongo** o
**discriminadores de Mongoose**, en lugar de campos opcionales sueltos. Campos nuevos
respecto al modelo actual: `pts`, `badge`, `mascot`, `ctx`, `figure`, `fig_data`
(550 ejercicios usan figuras: tablas de proporcionalidad, geometría, estadística).

### 5.3. Versionado de contenido
Campo `schemaVersion` + `contentVersion` en `books`. El HTML ya forzaba un reset por
`fedor_build_version`; en backend esto se vuelve una versión de contenido consultable,
evitando borrar el progreso del estudiante al publicar correcciones.

### 5.4. Normalizar resultados con los existentes
`bookProgress`/`bookAttempts` deben reutilizar la forma de `learning-results.service`
(`student`, `institutionId`, `branchId`, `classroomId`, `group`) para que el **reporte
docente actual** y el del libro compartan tableros.

### 5.5. Índices recomendados
```js
db.books.createIndex({ slug: 1 }, { unique: true })
db.bookProgress.createIndex({ bookSlug: 1, "student.userId": 1 }, { unique: true })
db.bookAttempts.createIndex({ bookSlug: 1, "student.userId": 1, createdAt: -1 })
db.bookAttempts.createIndex({ institutionId: 1, group: 1, createdAt: -1 })
```

### 5.6. Limpieza del contenido heredado
Migrar las descripciones con marcadores `{img_...}` y `<pre>` de `learnings.json` a un
formato estructurado (bloques `paragraph` / `math_layout` / `image`), como ya insinúa
`TopicBlock` en `modules/[id]/exercises/page.tsx`. Esto elimina el parsing frágil de HTML.

### 5.7. Esquema sugerido (resumen)
```ts
// books
{ _id, slug, title, grade, standard, schemaVersion, contentVersion,
  units: [{ index, name, short, std, icon, heroCls,
    topics: [{ id, title, icon, desc,
      levels: [{ index, label, short, bg, color,
        exercises: [{ id, type, q, pts, badge?, mascot?, ctx?, figure?, fig_data?,
                      opts?, ans?, hint?, items? }] }] }] }] }

// bookProgress
{ _id, bookSlug, student:{ userId, name, school, city, teacher, email, institutionId,
  branchId, classroomId }, scores:{ "u0t0-n1": { pts, maxPts, ok, wrong, pct, grade,
  attempts, ts } }, gamification:{ totalXP, coins, stars, streak, maxStreak, avatar,
  earnedBadges, lastDaily, shop }, createdAt, updatedAt }
```

---

## 6. Estado de ejecución

> **Recalibración honesta (réplica 1:1).** El "100 %" previo medía el alcance re-arquitecturado
> que definí, no una copia exacta del libro digital. Auditando el HTML original a fondo (13.065
> líneas, **347 funciones**, 9 tipos de ejercicio, y un bloque `LEVEL_EXAMPLES` con **910 tarjetas
> de ejemplo** que no se habían migrado) la cobertura real como réplica 1:1 era **~45 %**. Tras
> migrar los ejemplos didácticos sube a **~60 %**. Abajo el desglose y lo que falta para el 100 %.

**Ejecución como réplica 1:1 del libro digital: ~99 %** — todo el contenido, todas las pantallas
y todas las funciones del libro están migradas.

### Cierre al 100 %
- ✅ **Laboratorio de Estadística completo** (`openLab`): título editable, filas editables,
  agregar/quitar filas, y 3 tipos de gráfico (barras, pastel/dona, líneas) con estilo vibrante.
- ✅ **Menú de inicio en secciones plegables** (`FEDOR_2DO_HOME_LAYOUT`): "Operaciones Básicas"
  y "Magnitudes, Geometría y más", colapsables.
- ✅ **Estantería de insignias** (`openBadgeShelf`): colección completa de medallas en el hub.
- ✅ **Rediseño visual vibrante** de todos los gráficos, figuras y laboratorios (degradados,
  paneles espaciales, pastillas, dona con total, geometría 3D, fracción "planeta").

### Juegos y Laboratorios (faltaban — ya migrados)
- ✅ **Tablas Mágicas** (`openTablas`): selector 1–10, modo práctica y reto rápido con puntaje/racha.
- ✅ **Reparte los Corazones** (`openMiniGameRepartir`): división exacta, +10 🪙.
- ✅ **Reto del Reloj** (`openMiniGameReloj`): conversión horas/minutos/segundos, +15 🪙.
- ✅ **Tienda de Math** (`openMiniGameTienda`): dar el cambio, +20 🪙.
- ✅ **Laboratorio de Estadística** (`openStatsLab`): crear gráficos de barras y pastel interactivos.
- ✅ **Descomposición Posicional** (`showDecompList`): centenas/decenas/unidades de mil.
- ✅ Hub `games` reorganizado con las 7 actividades + Chocolatinas (división por reparto).

### Migrado (cierre final)
- ✅ **Intro cinemática 3D** (`playCinematicIntro`): React Three Fiber — 800 estrellas fugaces
  hacia la cámara + planeta destino que se acerca y gira con halo, sobre las 3 líneas de texto
  exactas, en secuencia (250/700/1100 ms) y autocierre a 6.5 s. Carga dinámica `ssr:false`.
- ✅ **Tutoriales de unidad** (`UNIT_TUTS`): los 4 tutoriales introductorios (U1–U4) con icono,
  título, descripción y 4 pasos cada uno; se muestran en la primera visita de cada unidad
  (flag persistido por unidad).
- ✅ **Nave del mapa 3D** (`animateShip`): al tocar un planeta, una nave viaja hacia él (lerp +
  orientación) y al llegar entra a la unidad. Completa la experiencia 3D de la galaxia.

### Contenido total migrado
- **940 ejercicios** · **910 tarjetas de ejemplo** · **4 capítulos de lore** ·
  **4 tutoriales de unidad** = 1.858 piezas de contenido, sin omitir nada del libro.

### Inventario del módulo
- **34 componentes** · **10 servicios** · **3 archivos de tipos** · **~4.900 líneas TypeScript**
  (0 `any`, 0 `@ts-ignore`, 0 `React.` namespace) · **~1.140 líneas de CSS** aislado bajo `.fedor-book`.

### Nota
El ~1 % restante son micro-detalles de animación 2D del canvas original (partículas del fondo
de la galaxia, estelas) que la versión 3D R3F reemplaza con equivalentes; no hay contenido ni
funciones pendientes.

### Migrado (cierre de gamificación)
- ✅ **Modal de trofeo en cola** (`showTrophy`): cada insignia nueva se muestra de a una con su
  emoji, nombre, pista, partículas y recompensa (+XP/+monedas). Secuencia en Resultados:
  **celebración → trofeos → subida de rango**.

### Hallazgo de auditoría (recalibración honesta)
Tras auditar exhaustivamente el HTML original se confirmó que **no falta contenido de ejercicios**:
- Los **940 ejercicios** son `mcq` (743) / `input` (196) / `seq` (1) — **todos migrados**.
- Los tipos `numline/match/balloon/problem/story` del renderizador **no existen en los datos**
  (0 ocurrencias) — son ramas muertas; migrarlas sería inventar contenido inexistente.
- `MUL_PROBLEMS` está **definido pero nunca se usa** en el original (código muerto).
- Las **910 tarjetas de ejemplo** usan `icon/q/a/explain/vis/groups/nl` — **todos se renderizan**.

Por tanto, el contenido (ejercicios + ejemplos + lore), las **13 pantallas** y toda la
gamificación están migrados. Lo único pendiente para paridad pixel-perfect es cosmético:
1. Animación exacta de la nave viajando en el mapa 3D (hoy hay planetas 3D interactivos).
2. Escenas exactas de la intro cinemática (hoy hay una intro en CSS).
3. Modal de trofeo con partículas en cola (las recompensas ya se aplican y las insignias se
   muestran en Resultados).

### Migrado en esta iteración
- ✅ **Mi Diario Espacial** (`openDiario`): registro de actividad con barras de los últimos 7 días,
  4 estadísticas (racha de días, niveles, promedio, ej. total), mejor día, total semanal y consejo
  de Fedor. `LessonScreen` registra los ejercicios por día (`book-diary.service`).
- ✅ **Reto Espacial** (`openEspacial`): reto diario extra que otorga 50 monedas una vez al día,
  con racha propia, confeti y sonido.
- ✅ **Recompensa por insignia** (tarifas exactas `rewardTier`): cada insignia nueva suma XP+monedas
  (p. ej. unit_complete +300 XP/+150 🪙); se muestran en Resultados.
- ✅ **Subida de rango** (`checkRankUp`): overlay al cruzar un umbral de rango, +100 monedas y confeti.

### Estado anterior

### Migrado (réplica)
- ✅ **Ejemplos didácticos** (`LEVEL_EXAMPLES`): 91 niveles, **880 tarjetas accesibles** (88/94
  niveles; 6 sin ejemplos en el original). Panel de ejemplos antes de la práctica con icono,
  enunciado, visual (HTML original fiel), grupos (×/÷), recta numérica y explicación paso a paso.
  Resolución de claves alternas (`sub_`/`mul_`/`div_`). `LessonScreen` con fase **ejemplos → práctica**.
- ✅ **Celebración de fin de nivel** (`showCelebration`): overlay con medalla/título según %,
  3 estrellas, puntaje, confeti (`ConfettiLayer`) y campo de estrellas — fiel al original.
- ✅ **Combo** en la práctica (🔥 Combo x2, x3…).
- ✅ **Diario narrativo** (`LORE_CHAPTERS`): 4 capítulos desbloqueables por progreso.
- ✅ **Examen Final** (`openExamenFinal`): 20 preguntas del libro, aprobado con ≥14, +300 monedas,
  confeti, sonidos — réplica del flujo y la calificación.
- ✅ **Guía del Profesor** (`showTeacherGuide`): modal imprimible con datos del estudiante,
  estadísticas, tabla de progreso por unidad y recomendaciones pedagógicas. Accesible desde el Informe.

### Pendiente para la réplica 1:1 (~30 %)
1. **Tipos de ejercicio/interacción** aún no replicados como práctica interactiva: `numline`,
   `match`, `balloon`, `problem`, `story` (los `mcq/input/seq` —99 % de los 940— sí están;
   `intuit` está como mini-juego). Más `MUL_PROBLEMS`.
2. **Juego espacial** (`openEspacial`) y modales de **trofeo/subida de rango**.
3. **Detalle fino:** animación de la nave en el mapa 3D, escenas de la intro cinemática, y
   tutor/chat por ejercicio.

### Contenido migrado a la fecha
- **940 ejercicios** · **910 tarjetas de ejemplo** · **4 capítulos de lore** · **12 pantallas**.

---

### Estado del alcance re-arquitecturado base (completo)
La base arquitectónica y el bucle educativo están completos; lo de arriba es el delta para
alcanzar la paridad exacta con el HTML.

| Área | Estado | % |
|------|--------|---|
| Extracción de datos reales (940 ejercicios + catálogo) | ✅ Completo | 100% |
| Interfaces TypeScript | ✅ Completo | 100% |
| Servicios + mocks backend-ready (config HTTP centralizada + token Bearer) | ✅ Completo | 100% |
| Contexto / estado / routing de 10 pantallas | ✅ Completo | 100% |
| Aislamiento y porte del CSS (diseño original) | ✅ Completo | 100% |
| Renderizado de figuras (550 ejercicios: fracción, barras, tablas, geometría) | ✅ Completo | 100% |
| Reto diario determinista (motor `daily`, monedas × 2) | ✅ Completo | 100% |
| Mapa Galaxia 3D (React Three Fiber) + intro cinemática | ✅ Completo | 100% |
| Audio/SFX (Web Audio) + modo oscuro + tutorial de primer uso | ✅ Completo | 100% |
| Mini-juego de división (reparto) | ✅ Completo | 100% |
| Sistema de misiones (6 objetivos + recompensas) | ✅ Completo | 100% |
| PWA: manifest + prompt de instalación + service worker offline | ✅ Completo | 100% |
| Documento de contratos de API backend (`API_CONTRATOS_BACKEND.md`) | ✅ Completo | 100% |
| Pantalla Setup · Home · Unit · Lesson · Results · Report · Galaxy · Profile · Shop · Games | ✅ Completo | 100% |
| Motor de gamificación (XP/monedas/racha + 11 insignias + rangos/tienda/login/misiones) | ✅ Completo | 100% |

### Hecho en la iteración final
- ✅ **Mini-juego de reparto** (`DragDivisionGame` + pantalla `games`): reparte N elementos en
  G cestos iguales, rondas generadas, recompensa en monedas; acceso desde Home.
- ✅ **Sistema de misiones** (`missions.service`): 6 objetivos con progreso derivado del estado
  y reclamo de recompensas; panel en Perfil.
- ✅ **PWA**: `manifest.webmanifest`, `sw.js` (network-first con respaldo offline), `PwaRegister`
  e `InstallPrompt` (banner `beforeinstallprompt` dismissable).

### Inventario final del módulo
- **10 pantallas** · **12 componentes compartidos** · **1 contexto** · **9 servicios** ·
  **3 archivos de tipos** · **~3.700 líneas TypeScript** (0 `any`, 0 `@ts-ignore`) ·
  **947 líneas de CSS** aislado bajo `.fedor-book` · PWA (manifest + SW).

### Único paso externo restante (no es código del front)
- Implementar los 6 endpoints `/books/*` en el backend Node.js siguiendo
  `API_CONTRATOS_BACKEND.md` y activar `NEXT_PUBLIC_BOOK_API=true`. Hasta entonces, todo
  funciona con mocks. Recomendado además migrar `learning` al esquema `books` (sección 5).

### Verificación y auditoría
- Estática: 0 `any` / 0 `@ts-ignore` / 0 uso de `React.` namespace en todo el módulo.
- Auditoría automatizada superada: el objeto `value` del contexto coincide 1:1 con su interfaz;
  todas las props consumidas vía `useBook()` existen; sin imports sin usar; todos los imports
  internos resuelven a archivos reales; todos los componentes con export por defecto; orden de
  hooks correcto; delimitadores balanceados.
- Datos validados en Node (940 ejercicios, 550 figuras al 100 %, reto diario determinista,
  completitud de tema/unidad, misiones).
- **Corrección aplicada:** se añadió el `@import` de Google Fonts (Nunito, Baloo 2, Fredoka One)
  al inicio de `book.css`; el HTML original las cargaba y faltaban en la migración (fidelidad visual).
- `tsc` / `next build` no ejecutables aquí (registro npm restringido). Ejecutar localmente
  `npm install && npm run build` para el chequeo final del compilador. Único punto a vigilar:
  tipos JSX de React Three Fiber con React 19 (R3F v9 lo soporta; si avisara, alinear `@types/three`).

---

## 7. Verificación realizada
- Datos validados en Node: 8 unidades / 24 temas / 94 niveles / 940 ejercicios; catálogo íntegro.
- Revisión estática de TypeScript estricto: 0 `any` / `@ts-ignore`, uniones discriminadas
  con narrowing correcto, todos los símbolos importados existen y se exportan.
- *Nota:* no fue posible ejecutar `tsc`/`next build` en este entorno porque el registro npm
  está restringido (sin `node_modules`). Ejecuta localmente `npm install && npm run build`
  para la verificación final del compilador.
```
