import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Módulo React de la migración previa (no se usa: la ruta sirve el libro
    // original vía iframe). Se excluye del lint para un build limpio.
    ignores: ["src/components/book/**"],
  },
];

export default eslintConfig;
