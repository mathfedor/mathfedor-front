# Contratos de API — Backend del libro "Matemáticas de Fedor 2°"

Guía para el equipo Node.js. Implementando estos endpoints y activando un flag,
el front reemplaza automáticamente los mocks por el backend real, **sin cambios de código**.

> Las formas de request/response son **idénticas** a las interfaces TypeScript del front
> (`src/types/book.types.ts`, `gamification.types.ts`, `book-progress.types.ts`). Reusarlas
> en el backend (o derivar el modelo Mongoose de ellas) garantiza compatibilidad total.

---

## 1. Activación

El front decide entre mock y backend con dos variables de entorno
(`src/services/book-http.ts`):

```bash
NEXT_PUBLIC_API_URL=https://api.metodofedor.com   # base de la API
NEXT_PUBLIC_BOOK_API=true                          # activa las llamadas reales
```

Sin `NEXT_PUBLIC_BOOK_API=true`, todo funciona con mocks y `localStorage` (estado actual).

## 2. Convenciones

- **Formato:** JSON (`Content-Type: application/json`).
- **Auth:** cabecera `Authorization: Bearer <token>` cuando hay sesión
  (la añade `bookHeaders()`; mismo token que el resto de la app, `authService.getToken()`).
- **Base path:** todos los recursos cuelgan de `/books/{slug}`; hoy `slug = matematicas-fedor-2`.
- **Errores:** se espera `{ "message": string }` con el código HTTP correspondiente.
  El front degrada a mock/local ante cualquier fallo (resiliencia), así que el backend
  puede desplegarse incrementalmente.

## 3. Endpoints

### 3.1. `GET /books/{slug}` — Currículo completo
- **Auth:** opcional (contenido público).
- **Response 200:** objeto `Book`.

```ts
Book {
  id: string; slug: string; title: string; grade: string; standard: string;
  units: Unit[];                       // 8 unidades
}
Unit { id; index; name; short; std; heroCls; icon; topics: Topic[] }
Topic { id; title; icon; desc; levels: Level[] }   // niveles N1..N5
Level { index; label; short; dot; bg; color; exercises: Exercise[] }
Exercise =                               // unión discriminada por `type`
  | { id; type:'mcq';   q; pts; opts:string[]; ans:string; badge?; bst?; mascot?; ctx?; figure?; fig_data? }
  | { id; type:'input'; q; pts; ans:string; hint?; badge?; ... }
  | { id; type:'seq';   q; pts; items:{t:'f'|'b'; v?; a?}[]; badge?; ... }
```
- **Notas:** ~770 KB. Conviene `Cache-Control` y/o `ETag`. Ver `mocks/data/book-curriculum.data.json` como semilla.

### 3.2. `GET /books/{slug}/gamification` — Catálogo de gamificación
- **Auth:** opcional.
- **Response 200:** `GamificationCatalog`.

```ts
GamificationCatalog {
  avatars: { av:string; xp:number; label:string }[];    // 15
  badges:  { id; emoji; name; tip; bg; bc }[];           // 11
  ranks:   { min:number; label; color }[];               // 6
  shopItems:{ id; cat:'casco'|'traje'|'mascota'|'nave'; emoji; name; price; avatar:string|null; unlockXP; desc }[]; // 16
}
```

### 3.3. `GET /books/{slug}/progress` — Progreso del estudiante autenticado
- **Auth:** requerida (deriva el estudiante del token).
- **Response 200:** `BookProgress` · **204/`null`** si aún no existe.

```ts
BookProgress {
  id?: string; bookSlug: string;
  student: { name; school; city; teacher; email?; avatar };
  scores: Record<string, LevelScore>;            // clave "u{u}t{t}-n{n}" o "daily-YYYY-MM-DD"
  gamification: GamificationState;
  createdAt?: string; updatedAt?: string;
}
LevelScore { key; topicTitle; levelLabel; pts; maxPts; ok; wrong; pct; grade:'S'|'A'|'B'|'L'; attempts; ts }
GamificationState { totalXP; coins; stars; streak; maxStreak; avatar; earnedBadges:string[];
  lastDaily; lastLogin?; loginStreak?; lastDailyChallenge?; shop:{ owned:string[]; equipped:Record<cat,string> } }
```

### 3.4. `PUT /books/{slug}/progress` — Guardar progreso completo (upsert)
- **Auth:** requerida.
- **Request body:** `BookProgress` (sin `id`; el backend hace upsert por `bookSlug` + estudiante).
- **Response 200:** `BookProgress` persistido (con `id`, `updatedAt`).

### 3.5. `POST /books/{slug}/results` — Registrar resultado de una lección
- **Auth:** requerida.
- **Request body:** `LessonResult` (incluye los intentos por ejercicio).

```ts
LessonResult {
  levelKey: string; topicTitle; levelLabel; pts; maxPts; ok; wrong; pct;
  grade: Grade;                                  // objeto completo (letra, nota, %, etc.)
  attempts: { exerciseId; userAnswer; correctAnswer; isCorrect }[];
}
```
- **Recomendado:** almacenar en colección **append-only** `bookAttempts` para analítica docente.
- **Response 201:** `{ message: 'ok' }` (el front ya actualizó su estado optimistamente).

### 3.6. `POST /books/{slug}/ai-analysis` — Análisis IA del informe
- **Auth:** requerida.
- **Request body:** `{ scores: Record<string, LevelScore> }`.
- **Response 200:** `AIAnalysis`.

```ts
AIAnalysis { teacher: string; family: string; positive: string; improve: string }
```
- **Notas:** el front trae un mock determinista; el backend puede invocar un LLM real.

## 4. Mapa servicio → endpoint

| Servicio front | Método → endpoint |
|----------------|-------------------|
| `bookService.getBook` | `GET /books/{slug}` |
| `bookService.getGamificationCatalog` | `GET /books/{slug}/gamification` |
| `bookProgressService.getProgress` | `GET /books/{slug}/progress` |
| `bookProgressService.saveProgress` | `PUT /books/{slug}/progress` |
| `bookProgressService.submitLessonResult` | `POST /books/{slug}/results` |
| `bookReportService.generateAIAnalysis` | `POST /books/{slug}/ai-analysis` |

## 5. Esquemas Mongoose sugeridos

Alineados con la sección 5 de `MIGRACION_LIBRO_2DO.md` (separar catálogo de estado).

```js
// books — currículo (semilla: mocks/data/book-curriculum.data.json)
const BookSchema = new Schema({
  slug: { type: String, unique: true, index: true },
  title: String, grade: String, standard: String,
  schemaVersion: { type: Number, default: 1 },
  contentVersion: { type: Number, default: 1 },
  units: [/* Unit → Topic → Level → Exercise (validar `type`) */],
}, { timestamps: true });

// bookProgress — 1 doc por estudiante + libro
const BookProgressSchema = new Schema({
  bookSlug: { type: String, index: true },
  student: {
    userId: { type: Schema.Types.ObjectId, index: true },
    name: String, school: String, city: String, teacher: String, email: String, avatar: String,
    institutionId: Schema.Types.ObjectId, branchId: Schema.Types.ObjectId, classroomId: String,
  },
  scores: { type: Map, of: new Schema({
    key: String, topicTitle: String, levelLabel: String,
    pts: Number, maxPts: Number, ok: Number, wrong: Number, pct: Number,
    grade: { type: String, enum: ['S','A','B','L'] }, attempts: Number, ts: String,
  }, { _id: false }) },
  gamification: {
    totalXP: Number, coins: Number, stars: Number, streak: Number, maxStreak: Number,
    avatar: String, earnedBadges: [String], lastDaily: String, lastLogin: String,
    loginStreak: Number, lastDailyChallenge: String,
    shop: { owned: [String], equipped: { type: Map, of: String } },
  },
}, { timestamps: true });
BookProgressSchema.index({ bookSlug: 1, 'student.userId': 1 }, { unique: true });

// bookAttempts — append-only (analítica)
const BookAttemptSchema = new Schema({
  bookSlug: String, student: { userId: Schema.Types.ObjectId, name: String },
  institutionId: Schema.Types.ObjectId, group: String,
  result: Schema.Types.Mixed,                       // LessonResult
}, { timestamps: true });
BookAttemptSchema.index({ bookSlug: 1, 'student.userId': 1, createdAt: -1 });

// gamificationCatalog — estático
const GamificationCatalogSchema = new Schema({
  slug: { type: String, unique: true },
  avatars: Array, badges: Array, ranks: Array, shopItems: Array,
});
```

## 6. Seguridad y rendimiento
- Derivar `student.userId` del **token**, nunca confiar en el `userId` del body.
- Validar el body con JSON Schema / Zod antes de persistir (el front es optimista).
- `GET /books/{slug}` cacheable (contenido versionado por `contentVersion`).
- Índices del §5 + TTL opcional en `bookAttempts` si el volumen crece.

## 7. Checklist de corte mock → backend
1. Implementar los 6 endpoints del §3 devolviendo las formas exactas.
2. Sembrar `books` y `gamificationCatalog` con `mocks/data/book-curriculum.data.json`.
3. Definir `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_BOOK_API=true` en el front.
4. Verificar el flujo: setup → lección → `POST /results` → `PUT /progress` → informe.
```
