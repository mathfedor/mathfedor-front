# Matemáticas de Fedor 2° — Integración

El libro digital **original** (entregado por ti) se sirve **íntegro, sin modificar**, dentro de
tu app Next.js. Se preserva el **100 %**: todos los niveles, gamificación, video de despegue,
mascota, laboratorios, botones, ejemplos y ejercicios — porque es tu archivo exacto.

## Cómo funciona
- Tu libro vive en: `public/libro-fedor-2/index.html` (autocontenido, 2.6 MB).
- La ruta `src/app/dashboard/libro-2do/page.tsx` lo muestra en un **iframe** a pantalla completa
  bajo el navbar, con estado de carga y botón de pantalla completa.
- Acceso desde el menú: **"⭐ Matemáticas de Fedor 2°"** (`src/components/Sidebar.tsx`).

## Probar
```bash
npm install
npm run dev
# abre /dashboard/libro-2do
```

## Subir
```bash
npm run build
git add -A
git commit -m "feat: libro Matematicas de Fedor 2 (original integrado)"
git push
```

## Lo único necesario (mantener)
```
public/libro-fedor-2/index.html
src/app/dashboard/libro-2do/page.tsx
src/components/Sidebar.tsx   (enlace al menú)
```

## Limpieza opcional (recomendada para un repo pristino)
La primera re-implementación en React ya **no se usa** (la ruta sirve tu original). Para dejar
el repo limpio y sin ningún riesgo en el build, bórrala en tu máquina:
```bash
rm -rf src/components/book
rm -f  src/app/dashboard/libro-2do/book.css
rm -f  src/services/book-*.ts src/services/gamification.service.ts \
       src/services/missions.service.ts src/services/daily-challenge.service.ts
rm -f  src/types/book.types.ts src/types/book-progress.types.ts src/types/gamification.types.ts
rm -rf src/mocks/book-curriculum.mock.ts src/mocks/book-examples.mock.ts \
       src/mocks/book-lore.mock.ts src/mocks/book-unit-tuts.mock.ts src/mocks/data
# documentos de la versión anterior (opcional):
rm -f  MIGRACION_LIBRO_2DO.md API_CONTRATOS_BACKEND.md REVISION_MATEMATICA.md correcciones-matematicas.json
```
> No afecta al libro en vivo: este sigue funcionando porque se sirve desde `public/`.
