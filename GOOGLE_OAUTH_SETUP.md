# Configuración de Google OAuth para Login

## Pasos para configurar Google OAuth

### 1. Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ API

### 2. Configurar credenciales OAuth 2.0

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **OAuth 2.0 Client IDs**
3. Selecciona **Web application**
4. Configura los orígenes autorizados:
   - `http://localhost:3000` (para desarrollo)
   - `https://tu-dominio.com` (para producción)
5. Configura las URIs de redirección autorizadas:
   - `http://localhost:3000/login`
   - `https://tu-dominio.com/login`
6. Copia el **Client ID**

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=TU_GOOGLE_CLIENT_ID_AQUI
```

Reemplaza `TU_GOOGLE_CLIENT_ID_AQUI` con el Client ID que obtuviste en el paso anterior.

### 4. Configurar el backend

Asegúrate de que tu backend tenga el endpoint `/auth/social-login` configurado para recibir:

```json
{
  "provider": "google",
  "token": "google_id_token"
}
```

### 5. Verificar funcionamiento

1. Inicia el servidor de desarrollo: `npm run dev`
2. Ve a la página de login
3. Haz clic en el botón de Google
4. Debería abrirse el popup de autenticación de Google

## Notas importantes

- El Client ID debe ser público (por eso usamos `NEXT_PUBLIC_`)
- Asegúrate de configurar correctamente los orígenes autorizados
- Para producción, actualiza las URLs en Google Cloud Console
- El backend debe validar el token de Google antes de crear la sesión
