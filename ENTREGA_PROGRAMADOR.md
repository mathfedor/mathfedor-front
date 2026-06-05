# Entrega — Módulo «Matemáticas de Fedor 2°»

Documento de handoff para integrar el libro digital en la plataforma.

## Qué es

El libro digital **original** (autocontenido, 2.6 MB) se sirve **íntegro y sin modificar** dentro de la app Next.js, mostrándose a pantalla completa dentro del dashboard. No se reescribió el libro: es el archivo exacto entregado por el cliente. Sobre él se inyecta, en tiempo de ejecución y **sin tocar el archivo original**, un parche del mismo origen que aplica las correcciones acordadas.

## Archivos que se suben (solo 3)

```
public/libro-fedor-2/index.html          ← el libro original, intacto (2.6 MB)
src/app/dashboard/libro-2do/page.tsx      ← la ruta: iframe + parche + botones
src/components/Sidebar.tsx                ← enlace ⭐ "Matemáticas de Fedor 2°" en el menú
```

Ruta pública resultante: `/dashboard/libro-2do`.

## Cómo funciona la integración

`page.tsx` monta un `<iframe src="/libro-fedor-2/index.html">` a pantalla completa (`position:fixed; inset:0`). Al cargar (`onLoad`), inyecta un `<script>` (constante `PATCH`) dentro del documento del iframe. Como el iframe es del **mismo origen**, el script puede leer y extender las funciones globales del libro. Si por cualquier motivo la inyección fallara, el libro sigue funcionando igual, solo sin las mejoras.

## Correcciones incluidas en el parche

1. **Galaxia — planetas siempre visibles.** La galaxia original usa Three.js/WebGL y, si el WebGL no inicializa, se ve vacía. El parche reemplaza `openGalaxyMap`/`closeGalaxyMap` por un render **2D en canvas** (sin WebGL): dibuja todos los planetas con su nombre, su % de avance y la ruta entre ellos; al tocar un planeta abre su panel (`showGPlanetPanel`) o navega a la unidad (`goUnit`). Funciona en cualquier dispositivo.

2. **Video de entrada «¡BIENVENIDO, CADETE!» completo.** La intro original también dependía de Three.js y quedaba incompleta (solo texto). El parche reescribe `playCinematicIntro` con una **animación CSS garantizada**: campo de estrellas en hipervelocidad, cohete despegando, planeta acercándose y las tres líneas de texto reveladas en secuencia, con botón SALTAR y auto-cierre (~7 s).

3. **Números grandes legibles.** En la representación gráfica de cantidades, el libro dibujaba *todos* los objetos (p. ej. 234 emojis, imposibles de contar). El parche limita a **20 objetos visibles** y añade un badge **«+N más»** (idéntico al criterio que ya usaba `buildProbScene`). **No altera la respuesta**: solo la representación visual.

4. **Pantalla completa en escritorio.** Se inyecta CSS `@media(min-width:900px){ #app{max-width:min(1280px,95vw)} }` para que el libro llene la pantalla en desktop. **En móvil queda exactamente igual** (la regla solo aplica ≥900px).

5. **Todos los niveles accesibles.** `isPlanetUnlocked` se fuerza a `true` para revisar todo sin bloqueos.

6. **Recursos en Home y Perfil.** Panel «⚡ Mis Recursos» con accesos a Laboratorio de Estadística, Tablas de Multiplicar, Mini-juegos, Descomposición, Examen Final, Reto Espacial y Diario.

7. **Datos coherentes.** Se corrige la figura cuando no coincide con el enunciado (cubo/prisma/rectángulo/cuadrado) y se eliminan opciones duplicadas en preguntas de selección múltiple.

## Requisito de la plataforma: pantalla completa en escritorio

El iframe ya se monta a pantalla completa. Para que en la plataforma se despliegue ocupando **toda la pantalla en escritorio**, basta con montar la ruta `/dashboard/libro-2do` sin contenedores que la limiten en ancho/alto; el componente usa `position:fixed; inset:0; z-index:60`, así que cubre el viewport por sí mismo. El botón **⛶ Pantalla completa** además ofrece fullscreen nativo del navegador. En móvil no se requiere nada: se respeta el diseño actual.

## Probar localmente

```bash
npm install
npm run dev
# abrir http://localhost:3000/dashboard/libro-2do
```

> Nota: la galaxia y el video usan recursos de CDN (fuentes y, opcionalmente, Three.js). Las correcciones 2D/CSS funcionan **aunque la CDN o el WebGL fallen**.

## Subir

```bash
npm run build
git add -A
git commit -m "feat: libro Matematicas de Fedor 2 (original integrado + correcciones)"
git push
```

## Notas técnicas

- El parche es un IIFE con guarda `__fedor_patch_extra` (no se duplica si se reinyecta).
- No usa `localStorage`/`sessionStorage` salvo para reproducir la intro una vez por sesión.
- La primera re-implementación en React (`src/components/book/`) **no se usa**; está excluida del build vía `tsconfig.json` (`exclude`) y `eslint.config.mjs` (`ignores`). Se puede borrar sin afectar al libro:
  ```bash
  rm -rf src/components/book
  ```
- Stack: Next.js 15 (App Router), TypeScript strict, Tailwind 3.
