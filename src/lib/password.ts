/**
 * Genera una contraseña segura y legible para nuevos registros automáticos.
 * Formato: Fedor + 4 caracteres alfanuméricos + 3 dígitos + !
 * Ejemplo: Fedor9k2a718!
 */
export function generateAutoPassword(): string {
  const chars = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomCode = '';
  for (let i = 0; i < 4; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const digits = Math.floor(100 + Math.random() * 900);
  return `Fedor${randomCode}${digits}!`;
}
