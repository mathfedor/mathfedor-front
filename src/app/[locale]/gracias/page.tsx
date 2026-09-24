'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';

// ============================================================================
// VARIABLES DE CONVERSIÓN CONFIGURABLES
// ============================================================================
const PURCHASE_VALUE = 203000; // Valor de la compra en COP (fácilmente editable)
const PURCHASE_CURRENCY = 'COP'; // Moneda
const PRODUCT_NAME = 'Módulo Matemáticas Grado 11';
const PRODUCT_ID = 'modulo-grado-11';

// ============================================================================
// GUÍA PARA DEVELOPERS / MARKETING: INTEGRACIONES ADICIONALES
// ============================================================================
/**
 * 1. META CONVERSIONS API (CAPI) - EVENTO DE COMPRA (SERVER-SIDE):
 * En tu webhook de Wompi (backend) o en una API route de confirmación de Next.js,
 * envía el evento Purchase al endpoint de Meta Graph API:
 * POST https://graph.facebook.com/v19.0/{PIXEL_ID}/events?access_token={META_ACCESS_TOKEN}
 * Body:
 * {
 *   data: [{
 *     event_name: 'Purchase',
 *     event_time: Math.floor(Date.now() / 1000),
 *     event_source_url: 'https://matematicasdefedor.com/gracias',
 *     action_source: 'website',
 *     user_data: {
 *       em: sha256(email.trim().toLowerCase()),
 *       ph: sha256(phone.trim().replace(/\D/g, '')),
 *       client_ip_address: req.ip,
 *       client_user_agent: req.headers['user-agent']
 *     },
 *     custom_data: {
 *       currency: 'COP',
 *       value: 203000,
 *       content_name: 'Módulo Matemáticas Grado 11',
 *       content_ids: ['modulo-grado-11'],
 *       order_id: transactionId
 *     }
 *   }]
 * }
 *
 * 2. GOOGLE ADS CONVERSION TAG:
 * Para registrar la conversión en Google Ads, inserta el siguiente snippet:
 * if (typeof window !== 'undefined' && window.gtag) {
 *   window.gtag('event', 'conversion', {
 *     send_to: 'AW-XXXXXXXXX/YYYYYYYYYYYYYY', // Tu ID y Label de conversión
 *     value: 203000,
 *     currency: 'COP',
 *     transaction_id: transactionId
 *   });
 * }
 */


function GraciasContent() {
  const searchParams = useSearchParams();
  const transactionRef = searchParams.get('ref') || searchParams.get('id') || `FEDOR-${Date.now()}`;
  const gradeParam = searchParams.get('grade');
  const hasFiredPurchase = useRef(false);

  // Determinar producto dinámicamente según referencia o query param
  let resolvedProductName = PRODUCT_NAME;
  let resolvedProductId = PRODUCT_ID;
  let resolvedSubheading = 'Has dado el paso más importante para asegurar un resultado sobresaliente en el <strong>ICFES Saber 11°</strong> y tu ingreso universitario.';

  if (gradeParam === '1' || transactionRef.includes('FEDOR-G1-')) {
    resolvedProductName = 'Módulo Matemáticas Grado 1° Primaria';
    resolvedProductId = 'modulo-grado-1';
    resolvedSubheading = 'Has dado el paso más importante para construir las bases numéricas de tu hijo(a) y despertar su amor por las matemáticas desde <strong>1° de primaria</strong>.';
  } else if (gradeParam === '2' || transactionRef.includes('FEDOR-G2-')) {
    resolvedProductName = 'Módulo Matemáticas Grado 2° Primaria';
    resolvedProductId = 'modulo-grado-2';
    resolvedSubheading = 'Has dado el paso más importante para que tu hijo(a) domine las operaciones con reagrupación y la resolución de problemas cotidianos en <strong>2° de primaria</strong>.';
  } else if (gradeParam === '3' || transactionRef.includes('FEDOR-G3-')) {
    resolvedProductName = 'Módulo Matemáticas Grado 3° Primaria';
    resolvedProductId = 'modulo-grado-3';
    resolvedSubheading = 'Has dado el paso más importante para que tu hijo(a) domine las tablas de multiplicar, la división y se prepare para las <strong>Pruebas SABER 3°</strong>.';
  }

  useEffect(() => {
    if (hasFiredPurchase.current) return;
    hasFiredPurchase.current = true;

    // 1. Disparar evento Purchase en Meta Pixel (Client-Side)
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        content_name: resolvedProductName,
        content_ids: [resolvedProductId],
        content_type: 'product',
        value: PURCHASE_VALUE,
        currency: PURCHASE_CURRENCY,
        order_id: transactionRef,
      });
    }

    // 2. Disparar evento Purchase en Google Tag Manager (DataLayer)
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'purchase',
        ecommerce: {
          transaction_id: transactionRef,
          value: PURCHASE_VALUE,
          currency: PURCHASE_CURRENCY,
          items: [
            {
              item_id: resolvedProductId,
              item_name: resolvedProductName,
              price: PURCHASE_VALUE,
              quantity: 1,
            },
          ],
        },
      });
    }
  }, [transactionRef, resolvedProductName, resolvedProductId]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Tarjeta principal de confirmación */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center">
        {/* Icono de éxito */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl sm:text-5xl mx-auto mb-6 shadow-sm animate-bounce" style={{ animationIterationCount: 2 }}>
          ✓
        </div>

        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block mb-3">
          Pago Confirmado con Éxito
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 font-['Baloo_2',sans-serif] mb-3">
          ¡Felicitaciones y bienvenido a Matemáticas de Fedor!
        </h1>

        <p
          className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mb-6"
          dangerouslySetInnerHTML={{ __html: resolvedSubheading }}
        />

        {/* Resumen de compra */}
        <div className="bg-[#FFFDF5] border-2 border-[#FDE68A] rounded-2xl p-5 mb-8 text-left text-sm text-gray-700 max-w-md mx-auto">
          <div className="flex justify-between py-1 border-b border-orange-100 font-medium">
            <span className="text-gray-500">Producto:</span>
            <span className="font-bold text-gray-900">{resolvedProductName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-orange-100 font-medium">
            <span className="text-gray-500">Referencia:</span>
            <span className="font-mono text-xs text-gray-800">{transactionRef}</span>
          </div>
          <div className="flex justify-between py-1 font-medium pt-2">
            <span className="text-gray-500">Total pagado:</span>
            <span className="font-black text-[#FF6B00] text-base">
              ${PURCHASE_VALUE.toLocaleString('es-CO')} {PURCHASE_CURRENCY}
            </span>
          </div>
        </div>

        {/* Pasos siguientes */}
        <div className="text-left bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200/80">
          <h2 className="font-black text-gray-900 text-base sm:text-lg mb-4 flex items-center gap-2">
            <span>🚀</span>
            <span>¿Qué debes hacer a continuación?</span>
          </h2>

          <ol className="space-y-3.5 text-sm sm:text-base text-gray-700">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong>Revisa tu correo electrónico:</strong> Te hemos enviado las credenciales y el enlace directo de acceso a la plataforma. <em>(Revisa también la carpeta de Spam o Promociones)</em>.
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong>Inicia sesión en Fedor:</strong> Ingresa con tu correo registrado para activar tu perfil de estudiante de 11°.
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong>Comienza con la Unidad 1 o tu diagnóstico:</strong> Avanza a tu ritmo, practica con los ejercicios interactivos y mide tu evolución.
              </div>
            </li>
          </ol>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto bg-[#FF6B00] hover:bg-[#EA580C] text-white font-black text-base py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer text-center"
          >
            Ir a Iniciar Sesión en la Plataforma
          </Link>

          <a
            href="https://wa.me/573107199897?text=Hola,%20acabo%20de%20comprar%20el%20M%C3%B3dulo%20de%20Grado%2011%20y%20quiero%20confirmar%20mi%20acceso"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Escribir por WhatsApp</span>
            <span>💬</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PaginaGracias() {
  return (
    <>
      {/* Script GTM Head */}
      <Script
        id="gtm-script-gracias"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PLHW2S9G');
          `,
        }}
      />

      {/* Script Meta Pixel */}
      <Script
        id="meta-pixel-gracias"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1305911099962631');
            fbq('track', 'PageView');
          `,
        }}
      />

      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-PLHW2S9G"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1305911099962631&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

      {/* Header mínimo para la página de Gracias */}
      <header className="w-full bg-[#FF6B00] shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Matemáticas de Fedor"
            width={240}
            height={70}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
      </header>

      <main>
        <Suspense fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6B00]" />
          </div>
        }>
          <GraciasContent />
        </Suspense>
      </main>

      <footer className="bg-[#111827] text-white py-8 px-4 text-center text-xs text-gray-400">
        <p>Matemáticas de Fedor • Soporte WhatsApp: +57 310 719 9897</p>
        <p className="mt-1">Todos los Derechos Reservados.</p>
      </footer>
    </>
  );
}
