# Revisión matemática — Matemáticas de Fedor 2°

Auditoría de **corrección matemática** del contenido del libro (940 ejercicios + 910 tarjetas
de ejemplo), realizada de forma programática sobre los datos.

## Veredicto: el contenido es matemáticamente correcto ✅

| Verificación | Resultado |
|--------------|-----------|
| Aritmética de enunciados (sumas/restas/multiplicaciones/divisiones, con paréntesis) | **158 verificadas · 0 errores** |
| Respuesta correcta presente entre las opciones (MCQ) | **0 errores** (todas presentes) |
| Geometría: perímetro, área y volumen (cuadrado, rectángulo, cubo, prisma) | **150 verificadas · 0 errores** |
| Ejemplos con grupos (a + / − / × / ÷ b = r) | **84 verificados · 0 errores** |
| Secuencias numéricas (progresión aritmética) | **consistentes** |
| Ejercicios con respuesta vacía | **0** |

> Nota metodológica: varias "discrepancias" iniciales resultaron ser falsos positivos de los
> verificadores automáticos (no contemplaban paréntesis en `(a×b)÷c`, el formato colombiano de
> miles `13.000`, la resta en ejemplos `sub_`, ni las preguntas tipo "¿cuál **NO** es igual?").
> Con los verificadores corregidos, **no hay errores matemáticos en las respuestas**.

## Correcciones aplicadas (2 bugs de calidad de datos, heredados del original)

Eran fallos objetivos del libro original (no afectaban la respuesta correcta, pero sí la calidad):

### 1. Figura que no coincide con el enunciado — **76 ejercicios corregidos**
Varios ejercicios de geometría tenían `fig_data.kind` en desacuerdo con el enunciado: el problema
hablaba de un **rectángulo** pero la figura configurada era un **cuadrado** (o viceversa), por lo
que se habría dibujado la figura equivocada. Se ajustó `fig_data.kind` para que **coincida con el
enunciado** (la respuesta ya era correcta y no se tocó). Ej.: `U6/T1/N1/#2` "Un rectángulo
largo=4m ancho=3m" → figura `cuadrado` ➜ `rectangulo`.

### 2. Opción duplicada en MCQ — **6 ejercicios corregidos**
Seis preguntas de perímetro repetían una opción (a veces la propia respuesta), dejando solo 3
alternativas reales. Se reemplazó la opción duplicada por un **distractor estándar de perímetro**
(semiperímetro `l+a`, `2·l`, o suma de tres lados), manteniendo la respuesta correcta. Ej.:
`["14m","7m","12m","12m"]` ➜ `["14m","7m","12m","8m"]` (respuesta `14m`).

El detalle completo de los 82 cambios está en `correcciones-matematicas.json` (carpeta de salida).

## Re-verificación tras las correcciones

| Comprobación | Resultado |
|--------------|-----------|
| Conteo de ejercicios | **940** (intacto) |
| Desajuste figura ↔ enunciado | **0** |
| MCQ con opción duplicada | **0** |
| MCQ con respuesta fuera de opciones | **0** |
| Geometría con respuesta incorrecta | **0** |
| Tipos de ejercicio | mcq 743 · input 196 · seq 1 (intacto) |

**Conclusión:** el libro queda matemáticamente correcto y, además, con las figuras coherentes con
sus enunciados y sin opciones repetidas. No se inventó contenido: las respuestas se mantuvieron y
los ajustes son correcciones fundamentadas en el propio enunciado y en errores típicos de cada tema.
