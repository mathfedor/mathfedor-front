# Módulo "Matemáticas de Fedor 2°"

Réplica del libro digital gamificado, migrada a la arquitectura Next.js del proyecto.
Ruta: `/dashboard/libro-2do` (bajo el shell del dashboard existente).

## Estructura

```
src/
├── app/dashboard/libro-2do/
│   ├── layout.tsx               # carga book.css solo para esta subruta
│   ├── page.tsx                 # 'use client' → <BookExperience/>
│   └── book.css                 # CSS del HTML original, aislado bajo .fedor-book
├── components/book/
│   ├── BookExperience.tsx       # proveedor + router de 13 pantallas + nav + PWA
│   ├── context/BookContext.tsx  # estado global (reemplaza las globals del HTML)
│   ├── screens/                 # Setup, Home, Galaxy, Unit, Lesson, Results, Report,
│   │                            #   Profile, Shop, Games, Diary, FinalExam, Espacial
│   └── shared/                  # ExerciseView, ExerciseFigure, ExamplesPanel, Celebration,
│                                #   Trophy, RankUp, Tutorial, LaunchIntro, CinematicScene,
│                                #   GalaxyScene, ConfettiLayer, ReportCharts, etc.
├── services/                    # book, book-http, book-progress, gamification,
│   │                            #   daily-challenge, missions, book-diary, book-report,
│   │                            #   book-export, book-audio
├── mocks/                       # curriculum, examples, lore, unit-tuts + /data (JSON)
└── types/                       # book.types, gamification.types, book-progress.types
```

## Contenido migrado (1.858 piezas)

- **940 ejercicios** (`mcq` / `input` / `seq`) — `mocks/data/book-curriculum.data.json`
- **910 tarjetas de ejemplo** (`LEVEL_EXAMPLES`) — `book-extras.data.json`
- **4 capítulos de lore** + **4 tutoriales de unidad** — `book-lore.data.json`, `book-unit-tuts.data.json`
- Catálogo de gamificación: 15 avatares, 11 insignias, 6 rangos, 16 ítems de tienda

## Pantallas (13)

`setup · home · galaxy · unit · lesson · results · report · profile · shop · games · diary · examen · espacial`

## Juegos y Laboratorios (pantalla `games`)

Hub con 7 actividades, todas otorgan monedas:
`Tablas Mágicas` (multiplicar: práctica + reto) · `Reparte los Corazones` (división) ·
`Reto del Reloj` (conversión de tiempo) · `Tienda de Math` (dar el cambio) ·
`Chocolatinas de Math` (división por reparto) · `Laboratorio de Estadística` (crear gráficos
de barras/pastel) · `Descomposición Posicional` (centenas/decenas/unidades).

## Flujo de una lección

`Unit → Lesson(fase ejemplos → práctica) → Results(celebración → trofeos → subida de rango)`

## Gamificación

XP, monedas, racha, **11 insignias con recompensas exactas** (`rewardTier`), rangos + subida de
rango (+100 🪙), avatares desbloqueables, tienda, reto diario, racha de login, **misiones** (6),
combo, celebración + confeti, trofeos en cola. Toda la economía replica los valores del original.

## Estado del estudiante

- **Progreso** (`book-progress.service`): scores por nivel + snapshot de gamificación.
  Mock en `localStorage` (`fedor2_progress_v1`); backend-ready.
- **Diario de actividad** (`book-diary.service`): ejercicios por día + reto espacial.
- **Preferencias** (`fedor2_prefs`): modo oscuro, sonido. Tutoriales vistos: flags propios.

## Conectar el backend

La config HTTP está centralizada en `services/book-http.ts`. Para pasar de mocks a la API real:

```bash
NEXT_PUBLIC_API_URL=https://api.metodofedor.com
NEXT_PUBLIC_BOOK_API=true
```

Endpoints y contratos completos: ver **`API_CONTRATOS_BACKEND.md`** en la raíz.
Mientras `NEXT_PUBLIC_BOOK_API` no sea `true`, todo funciona con mocks + `localStorage`.

## Convenciones

- **TypeScript estricto**: 0 `any`, 0 `@ts-ignore`, sin `React.` namespace (imports de tipo).
- **CSS aislado** bajo `.fedor-book` (no afecta el resto del dashboard); fuentes vía `@import`.
- **three.js** (galaxia + intro) se carga con `next/dynamic` `ssr:false`.

## Build / verificación

```bash
npm install && npm run build
```
Si React Three Fiber avisara de tipos JSX con React 19, alinear la versión de `@types/three`.

## Estado 2026-06-05

Ruta Next.js activa: `/dashboard/libro-2do`, sin iframe. La pagina monta la migracion
React/TypeScript (`BookExperience`) y el CSS queda aislado por layout de ruta.

Cobertura de migracion: **99%**.

- Estructura de dashboard/ruta Next.js: 100%.
- Curriculo: 100% (8 unidades, 24 temas, 94 niveles, 940 ejercicios).
- Ejemplos didacticos: 100% (910 tarjetas en 91 niveles).
- Pantallas: 100% (13 pantallas).
- Juegos, laboratorios y herramientas: 100% (7 actividades + estanteria de insignias).
- Gamificacion: 100% (15 avatares, 11 insignias, 6 rangos, 16 items de tienda).
- Progreso, informe, reporte docente, diario y servicios backend-ready: 100% en frontend/mock.
- Verificacion final: TypeScript OK; `npm run build` no termina dentro de 5 minutos en este entorno,
  aunque la ruta dev responde HTTP 200 despues de compilar.
