# Inicio rápido — Libro "Matemáticas de Fedor 2°"

Guía de despliegue del módulo migrado.

## 1. Probar en local
```bash
npm install
npm run dev
```
Abre **http://localhost:3000/dashboard/libro-2do** (o usa el enlace
**"⭐ Matemáticas de Fedor 2°"** en el menú lateral).

## 2. Verificación final del compilador (compuerta antes de subir)
```bash
npm run build
```
Debe pasar sin errores. Si React Three Fiber reportara tipos JSX (poco probable, R3F v9
soporta React 19), es un arreglo conocido de 1 línea — ver `MIGRACION_LIBRO_2DO.md`.

## 3. Variables de entorno
- `NEXT_PUBLIC_API_URL` — ya la usa tu app (no cambia).
- `NEXT_PUBLIC_BOOK_API=true` — **opcional**, solo cuando el backend `/books/*` esté listo.
  Sin esta variable, el libro funciona con datos mock (ideal para lanzar ya).

## 4. Subir
```bash
git push        # o despliega como siempre (Vercel / tu servidor)
```

## Qué incluye
- Ruta: `src/app/dashboard/libro-2do/`
- Módulo: `src/components/book/` (40 componentes, 13 pantallas)
- Servicios backend-ready: `src/services/book-*.ts`, `gamification`, `missions`, `daily-challenge`
- Datos: `src/mocks/data/` (940 ejercicios · 910 ejemplos · lore · tutoriales)
- PWA: `public/manifest.webmanifest` + `public/sw.js`
- Enlace en `src/components/Sidebar.tsx`

## Documentos de referencia
- `MIGRACION_LIBRO_2DO.md` — arquitectura, modelo Mongo, estado
- `API_CONTRATOS_BACKEND.md` — contratos de los endpoints `/books/*`
- `REVISION_MATEMATICA.md` — auditoría matemática
- `src/components/book/README.md` — guía del módulo
