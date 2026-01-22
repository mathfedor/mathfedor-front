'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ReactNode } from 'react';

interface RecaptchaProviderProps {
    children: ReactNode;
}

export default function RecaptchaProvider({ children }: RecaptchaProviderProps) {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    // Si no hay clave, renderizamos los hijos sin el proveedor (para evitar errores en dev sin config)
    // O podemos ponerlo de todas formas, pero fallará la carga del script.
    // Es mejor ponerlo y que el usuario vea el error si falta la key, o manejarlo con una dummy key si queremos silenciarlo,
    // pero el user pidió implementar, así que asumimos que pondrá la key.

    // Usamos una key por defecto vacía para evitar crash si es undefined durante el build, 
    // pero en runtime debería estar.
    const reCaptchaKey = siteKey || 'CLAVE_FALTANTE_EN_ENV';

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={reCaptchaKey}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: 'head',
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}
