'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Script from 'next/script';

// ============================================================================
// CONFIGURACIÓN DE PRODUCTO Y PRECIO - GRADO 2° PRIMARIA
// ============================================================================
const PRODUCT_ID = 'modulo-grado-2';
const PRODUCT_NAME = 'Módulo Matemáticas Grado 2° Primaria';
const PRICE_COP = 203000;
const REGULAR_PRICE_COP = 350000;
const AMOUNT_IN_CENTS = PRICE_COP * 100;
const WHATSAPP_URL =
  'https://wa.me/573107199897?text=Hola,%20tengo%20una%20pregunta%20sobre%20el%20M%C3%B3dulo%20de%202%C2%B0%20Primaria';

export default function LandingGrado2() {
  // Modal de checkout directo
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Referencia a la sección de oferta para ViewContent
  const offerSectionRef = useRef<HTMLDivElement | null>(null);
  const hasFiredViewContent = useRef(false);

  // 1. Meta Pixel PageView automático & IntersectionObserver para ViewContent
  useEffect(() => {
    // PageView
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_title: 'Landing Módulo Grado 2° Primaria',
        page_location: window.location.href,
      });
    }

    // ViewContent al visualizar la sección de oferta y precio
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasFiredViewContent.current) {
            hasFiredViewContent.current = true;

            // Disparar ViewContent en Meta Pixel
            if (typeof window !== 'undefined' && window.fbq) {
              window.fbq('track', 'ViewContent', {
                content_name: PRODUCT_NAME,
                content_ids: [PRODUCT_ID],
                content_type: 'product',
                value: PRICE_COP,
                currency: 'COP',
              });
            }

            // Disparar ViewContent en GTM
            if (typeof window !== 'undefined' && window.dataLayer) {
              window.dataLayer.push({
                event: 'view_item',
                ecommerce: {
                  currency: 'COP',
                  value: PRICE_COP,
                  items: [
                    {
                      item_id: PRODUCT_ID,
                      item_name: PRODUCT_NAME,
                      price: PRICE_COP,
                      quantity: 1,
                    },
                  ],
                },
              });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const currentOfferRef = offerSectionRef.current;
    if (currentOfferRef) {
      observer.observe(currentOfferRef);
    }

    return () => {
      if (currentOfferRef) {
        observer.unobserve(currentOfferRef);
      }
    };
  }, []);

  // Manejador del CTA principal ("Quiero este módulo")
  const handleCtaClick = () => {
    // Disparar InitiateCheckout en Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: PRODUCT_NAME,
        content_ids: [PRODUCT_ID],
        content_type: 'product',
        value: PRICE_COP,
        currency: 'COP',
      });
    }

    // Disparar InitiateCheckout en GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
          currency: 'COP',
          value: PRICE_COP,
          items: [
            {
              item_id: PRODUCT_ID,
              item_name: PRODUCT_NAME,
              price: PRICE_COP,
              quantity: 1,
            },
          ],
        },
      });
    }

    // Abrir modal de checkout para Wompi
    setShowCheckoutModal(true);
  };

  // Enviar a Wompi
  const handleProceedToWompi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      alert('Por favor completa todos los campos para habilitar tu acceso.');
      return;
    }

    setIsProcessing(true);
    const reference = `FEDOR-G2-${Date.now()}`;
    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || 'pub_prod_dummy';

    // Si el Widget de Wompi está cargado
    const WompiWidget =
      typeof window !== 'undefined'
        ? (window as unknown as { WidgetCheckout?: any }).WidgetCheckout
        : undefined;

    if (WompiWidget) {
      try {
        const checkout = new WompiWidget({
          currency: 'COP',
          amountInCents: AMOUNT_IN_CENTS,
          reference: reference,
          publicKey: publicKey,
          redirectUrl: `${window.location.origin}/gracias`,
          customerData: {
            email: buyerEmail.trim(),
            fullName: buyerName.trim(),
            phoneNumber: buyerPhone.trim().replace(/\D/g, ''),
            phoneNumberPrefix: '+57',
          },
        });

        checkout.open(() => {
          window.location.href = `/gracias?ref=${reference}&grade=2`;
        });
      } catch (err) {
        console.warn('Wompi Widget fallback:', err);
        window.location.href = `/gracias?ref=${reference}&grade=2`;
      }
    } else {
      // Fallback de redirección directa a gracias si no hay widget activo
      setTimeout(() => {
        window.location.href = `/gracias?ref=${reference}&grade=2`;
      }, 600);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* Script Wompi Widget */}
      <Script src="https://checkout.wompi.co/widget.js" strategy="lazyOnload" />

      {/* Script GTM Head */}
      <Script
        id="gtm-script-landing-segundo"
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
        id="meta-pixel-landing-segundo"
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

      {/* =================================================================== */}
      {/* 1. HEADER MÍNIMO */}
      {/* =================================================================== */}
      <header className="w-full bg-[#FF6B00] shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Matemáticas de Fedor"
              width={260}
              height={80}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </div>
          <div className="text-right">
            <span className="hidden sm:inline-block text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-xs">
              Módulo Oficial • Grado 2° Primaria
            </span>
          </div>
        </div>
      </header>

      <main className="w-full overflow-hidden">
        {/* =================================================================== */}
        {/* 2. HERO SECTION */}
        {/* =================================================================== */}
        <section className="relative bg-gradient-to-b from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-25">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FF6B00] rounded-full blur-3xl" />
            <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10 text-center">
            {/* Badge de contexto */}
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-black tracking-wide uppercase text-orange-200 mb-6 shadow-xs">
              <span>🚀</span>
              <span>Consolidación Matemática • 2° Grado</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight sm:leading-tight mb-6 font-['Baloo_2',sans-serif]">
              Domina las sumas y restas con reagrupación y el razonamiento lógico con el{' '}
              <span className="text-[#FDBA74] underline decoration-wavy decoration-[#FF6B00]">
                Método Fedor
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-normal mb-8 sm:mb-10">
              El programa digital probado para que los niños de 2° superen el miedo a &quot;llevar&quot; y &quot;prestar&quot;, resuelvan problemas cotidianos con agilidad y construyan una autoconfianza inquebrantable.
            </p>

            {/* CTA Hero */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <button
                type="button"
                id="hero-cta-btn-2"
                onClick={handleCtaClick}
                className="w-full sm:w-auto bg-[#FF6B00] hover:bg-[#EA580C] text-white font-black text-lg sm:text-xl py-4 px-10 rounded-2xl shadow-[0_10px_30px_rgba(255,107,0,0.4)] hover:shadow-[0_15px_35px_rgba(255,107,0,0.5)] transition-all duration-200 hover:-translate-y-1 active:translate-y-0 cursor-pointer text-center"
              >
                Quiero este módulo
              </button>
            </div>

            {/* Micro-copy de confianza */}
            <p className="text-xs sm:text-sm text-blue-200 font-semibold flex items-center justify-center gap-2 mb-12">
              <span>🔒 Pago 100% seguro con Wompi</span>
              <span>•</span>
              <span>⚡ Acceso digital inmediato</span>
              <span>•</span>
              <span>🎓 Garantía 7 días</span>
            </p>

            {/* Mockup multimedia Hero */}
            <div className="relative max-w-3xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-gradient-to-br from-slate-900/90 via-blue-950/80 to-slate-900/95 p-6 sm:p-10 flex flex-col items-center justify-center text-center">
              <div className="relative w-full max-w-md h-56 sm:h-72 mb-4">
                <Image
                  src="/fedor-modulo-2-libros.png"
                  alt="Libros y Material Interactivo Módulo 2° Primaria - Método Fedor"
                  fill
                  className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)]"
                  priority
                />
              </div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold">
                <span>⭐ Incluye 3 Libros Digitales PDF + Plataforma Gamificada 2°</span>
              </div>
              <p className="text-blue-100 text-xs sm:text-sm mt-3 max-w-lg">
                Reagrupación visual, problemas de la vida cotidiana, geometría, cálculo mental y misiones espaciales.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 3. BLOQUE DE DOLOR (Lo que viven hoy padres de 2°) */}
        {/* =================================================================== */}
        <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#FF6B00] font-black text-sm uppercase tracking-wider">
                El salto exigente de segundo grado
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mt-2 font-['Baloo_2',sans-serif]">
                ¿Notas alguna de estas dificultades en tu hijo(a)?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dolor 1 */}
              <div className="p-6 rounded-2xl bg-[#FFF7ED] border border-orange-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#EA580C] font-black flex items-center justify-center shrink-0 text-xl">
                  🤯
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-1">
                    El gran bloqueo de &quot;llevar&quot; y &quot;prestar&quot;
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Al pasar a operaciones con números de 2 y 3 cifras, olvida sumar la que lleva o no entiende por qué la decena le presta a la unidad.
                  </p>
                </div>
              </div>

              {/* Dolor 2 */}
              <div className="p-6 rounded-2xl bg-[#FFF7ED] border border-orange-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#EA580C] font-black flex items-center justify-center shrink-0 text-xl">
                  📄
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-1">
                    Se bloquea con los problemas escritos
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Sabe calcular cuando le pones los números ordenados, pero cuando lee un enunciado con una historia no sabe si debe sumar o restar.
                  </p>
                </div>
              </div>

              {/* Dolor 3 */}
              <div className="p-6 rounded-2xl bg-[#FFF7ED] border border-orange-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#EA580C] font-black flex items-center justify-center shrink-0 text-xl">
                  📉
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-1">
                    Pérdida de entusiasmo y frases negativas
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Comienza a decir frases como &quot;yo no soy bueno para matemáticas&quot; o &quot;es muy difícil&quot;, apagando su curiosidad natural y dañando su autoestima.
                  </p>
                </div>
              </div>

              {/* Dolor 4 */}
              <div className="p-6 rounded-2xl bg-[#FFF7ED] border border-orange-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#EA580C] font-black flex items-center justify-center shrink-0 text-xl">
                  ⚡
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-1">
                    El colegio avanza sin esperar a nadie
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Los temas se suceden rápido: centenas, problemas con dinero, reloj y medición. Si quedan vacíos en 2°, 3° grado será un verdadero dolor de cabeza.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 4. LA SOLUCIÓN (MÉTODO FEDOR 2°) */}
        {/* =================================================================== */}
        <section className="py-16 sm:py-20 bg-[#F9FAFB]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-[#2563EB] font-black text-sm uppercase tracking-wider">
                Comprensión lógica sin frustración
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mt-2 font-['Baloo_2',sans-serif]">
                Cómo el Método Fedor transforma 2° grado en un éxito rotundo
              </h2>
              <p className="text-gray-600 mt-3 text-base sm:text-lg">
                Sustituimos la memorización ciega por razonamiento visual, haciendo que los números cobren sentido y las operaciones fluyan naturalmente.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Paso 1 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2563EB] font-black text-lg flex items-center justify-center mb-4">
                  01
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">
                  Reagrupación explicada visualmente
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Gráficos y bloques interactivos que le muestran con claridad por qué 10 unidades se convierten en una nueva decena.
                </p>
              </div>

              {/* Paso 2 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF6B00] font-black text-lg flex items-center justify-center mb-4">
                  02
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">
                  Método para resolver problemas
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Aprende a identificar datos clave, palabras pista y la operación exacta en situaciones de compras, tiempo y medidas.
                </p>
              </div>

              {/* Paso 3 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2563EB] font-black text-lg flex items-center justify-center mb-4">
                  03
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">
                  Alineado a Estándares MEN 2°
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cubre todos los DBA de 2° grado: números hasta 1.000, figuras bidimensionales, longitud, gráficos de barras y noción de multiplicación.
                </p>
              </div>

              {/* Paso 4 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-black text-lg flex items-center justify-center mb-4">
                  04
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">
                  Cálculo mental y autoconfianza
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Retos de agilidad que entrenan la mente del niño para operar con rapidez y seguridad sin depender de los dedos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 5. QUÉ INCLUYE EL MÓDULO DE 2° */}
        {/* =================================================================== */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#FF6B00] font-black text-sm uppercase tracking-wider">
                Todo lo que recibes
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mt-2 font-['Baloo_2',sans-serif]">
                El kit integral de Matemáticas Grado 2° Primaria
              </h2>
            </div>

            <div className="bg-gradient-to-br from-[#FFFDF5] to-[#FFF8E6] rounded-3xl border-2 border-[#FDE68A] p-6 sm:p-10 shadow-lg">
              <ul className="space-y-4 sm:space-y-5 text-gray-800 text-base sm:text-lg">
                <li className="flex items-start gap-3.5">
                  <span className="text-emerald-600 font-black text-xl shrink-0 mt-0.5">✅</span>
                  <div>
                    <span className="font-black text-gray-900">+120 lecciones interactivas paso a paso</span>{' '}
                    cubriendo todo el temario oficial de 2° grado y los estándares del Ministerio de Educación Nacional.
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="text-emerald-600 font-black text-xl shrink-0 mt-0.5">✅</span>
                  <div>
                    <span className="font-black text-gray-900">+700 ejercicios prácticos y situaciones problema</span>{' '}
                    con retroalimentación guiada (reagrupación de decenas y centenas, problemas cotidianos y geometría).
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="text-emerald-600 font-black text-xl shrink-0 mt-0.5">✅</span>
                  <div>
                    <span className="font-black text-gray-900">3 Libros didácticos en PDF para descargar</span>{' '}
                    con explicaciones ilustradas y talleres para ejercitar en casa con lápiz y papel.
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="text-emerald-600 font-black text-xl shrink-0 mt-0.5">✅</span>
                  <div>
                    <span className="font-black text-gray-900">Libro digital interactivo gamificado en línea</span>{' '}
                    con maratones de cálculo mental, retos espaciales y logros desbloqueables.
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="text-emerald-600 font-black text-xl shrink-0 mt-0.5">✅</span>
                  <div>
                    <span className="font-black text-gray-900">12 meses de acceso total 24/7 sin límites</span>{' '}
                    desde cualquier computador, tablet o celular en cualquier lugar del país.
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="text-emerald-600 font-black text-xl shrink-0 mt-0.5">✅</span>
                  <div>
                    <span className="font-black text-gray-900">Guías de repaso y problemas imprimibles</span>{' '}
                    ideales para preparar exámenes escolares y consolidar los temas más difíciles.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 6. PRUEBA SOCIAL Y AUTORIDAD */}
        {/* =================================================================== */}
        <section className="py-16 sm:py-20 bg-[#F9FAFB] border-t border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block bg-blue-100 text-[#2563EB] font-black px-4 py-2 rounded-full text-sm sm:text-base mb-3">
                ⭐ +10.000 familias confían en el Método Fedor
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 font-['Baloo_2',sans-serif]">
                Lo que dicen las familias de segundo grado
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Testimonio 1 */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div className="mb-4">
                  <div className="flex text-amber-400 mb-3">★★★★★</div>
                  <p className="text-gray-700 italic text-base leading-relaxed">
                    &quot;Samuel no lograba entender las restas pidiendo prestado y se frustraba muchísimo en el colegio. Con las animaciones y ejercicios del Método Fedor lo comprendió en un solo fin de semana. Sus notas pasaron de Desempeño Básico a Superior.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-orange-200 text-[#EA580C] font-black flex items-center justify-center text-lg shrink-0">
                    LM
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm">
                      Laura M. - Madre de Samuel (7 años)
                    </div>
                    <div className="text-gray-500 text-xs">
                      Cali, Colombia
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonio 2 */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div className="mb-4">
                  <div className="flex text-amber-400 mb-3">★★★★★</div>
                  <p className="text-gray-700 italic text-base leading-relaxed">
                    &quot;Lo que más agradezco es la sección de problemas cotidianos. Mi hija Valeria ya no se bloquea al leer un texto largo; ahora sabe extraer los datos con calma y deducir la operación correcta. Es una inversión que vale cada centavo.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-blue-200 text-[#2563EB] font-black flex items-center justify-center text-lg shrink-0">
                    JT
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm">
                      Juan Camilo T. - Padre de Valeria (8 años)
                    </div>
                    <div className="text-gray-500 text-xs">
                      Bucaramanga, Colombia
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 7. OFERTA Y PRECIO */}
        {/* =================================================================== */}
        <section
          id="oferta-precio"
          ref={offerSectionRef}
          className="py-16 sm:py-24 bg-white scroll-mt-20"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-b from-white to-[#FFF9F2] rounded-3xl border-3 border-[#FF6B00] p-7 sm:p-12 shadow-2xl text-center relative overflow-hidden">
              {/* Ribbon destacada */}
              <div className="bg-[#FF6B00] text-white text-xs sm:text-sm font-black uppercase tracking-widest py-1.5 px-8 rounded-full inline-block mb-6 shadow-xs">
                Acceso Completo Grado 2° Primaria
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2 font-['Baloo_2',sans-serif]">
                Dale seguridad y agilidad matemática hoy mismo
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto mb-8">
                Pago único con acceso completo a todo el contenido de 2° grado, 3 libros PDF descargables y plataforma interactiva durante 12 meses.
              </p>

              {/* Precios */}
              <div className="mb-8">
                <span className="text-gray-400 text-lg sm:text-xl line-through font-bold block mb-1">
                  Antes ${REGULAR_PRICE_COP.toLocaleString('es-CO')} COP
                </span>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl sm:text-6xl font-black text-gray-900 font-['Baloo_2',sans-serif]">
                    ${PRICE_COP.toLocaleString('es-CO')}
                  </span>
                  <span className="text-gray-600 font-bold text-lg sm:text-xl">COP</span>
                </div>
                <span className="inline-block mt-2 text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Pago único • Sin mensualidades ni cobros automáticos
                </span>
              </div>

              {/* Botón CTA */}
              <button
                type="button"
                id="offer-cta-btn-2"
                onClick={handleCtaClick}
                className="w-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-black text-xl py-4.5 px-8 rounded-2xl shadow-[0_10px_30px_rgba(255,107,0,0.4)] hover:shadow-[0_15px_35px_rgba(255,107,0,0.5)] transition-all duration-200 hover:-translate-y-1 active:translate-y-0 cursor-pointer mb-6"
              >
                Quiero este módulo
              </button>

              {/* Pagos seguros con Wompi */}
              <div className="border-t border-orange-100 pt-6">
                <p className="text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider">
                  Medios de pago disponibles vía Wompi:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-gray-700">
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">Bancolombia</span>
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">PSE</span>
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">Nequi</span>
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">Daviplata</span>
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">Tarjetas Débito / Crédito</span>
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">Efectivo (Corresponsales)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 8. GARANTÍA */}
        {/* =================================================================== */}
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="bg-[#EFF6FF] border-2 border-[#BFDBFE] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center text-3xl shrink-0 shadow-md">
                🛡️
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2 font-['Baloo_2',sans-serif]">
                  Garantía incondicional de 7 días
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Prueba el módulo con tu hijo durante 7 días completos. Si sientes que no logra mayor claridad en sus operaciones o no estás satisfecho con la metodología, te devolvemos el 100% de tu dinero de forma inmediata.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 9. FAQ */}
        {/* =================================================================== */}
        <section className="py-16 sm:py-20 bg-[#F9FAFB]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#FF6B00] font-black text-sm uppercase tracking-wider">
                Preguntas frecuentes
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mt-2 font-['Baloo_2',sans-serif]">
                Resolvemos tus dudas antes de empezar
              </h2>
            </div>

            <div className="space-y-3.5">
              {/* Pregunta 1 */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(0)}
                  className="w-full text-left p-5 font-black text-gray-900 text-base sm:text-lg flex justify-between items-center hover:text-[#FF6B00] transition-colors"
                >
                  <span>¿A qué edad y nivel escolar está enfocado este módulo?</span>
                  <span className="text-xl text-gray-400 ml-2">{openFaq === 0 ? '−' : '+'}</span>
                </button>
                {openFaq === 0 && (
                  <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-3">
                    Está diseñado para niños de <strong>6 a 8 años</strong> cursando <strong>2° de primaria</strong> en colegios colombianos o estudiantes que necesitan reforzar la suma y resta con reagrupación y problemas de dos cifras.
                  </div>
                )}
              </div>

              {/* Pregunta 2 */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(1)}
                  className="w-full text-left p-5 font-black text-gray-900 text-base sm:text-lg flex justify-between items-center hover:text-[#FF6B00] transition-colors"
                >
                  <span>¿Cómo ayuda a mi hijo con las restas prestando y sumas llevando?</span>
                  <span className="text-xl text-gray-400 ml-2">{openFaq === 1 ? '−' : '+'}</span>
                </button>
                {openFaq === 1 && (
                  <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-3">
                    En lugar de hacer que memorice una regla mecánica sin sentido, el Método Fedor utiliza representaciones gráficas interactivas donde el niño visualiza cómo una decena se desagrupa en unidades, eliminando el misterio y el error habitual.
                  </div>
                )}
              </div>

              {/* Pregunta 3 */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(2)}
                  className="w-full text-left p-5 font-black text-gray-900 text-base sm:text-lg flex justify-between items-center hover:text-[#FF6B00] transition-colors"
                >
                  <span>¿Puede ingresar desde cualquier dispositivo?</span>
                  <span className="text-xl text-gray-400 ml-2">{openFaq === 2 ? '−' : '+'}</span>
                </button>
                {openFaq === 2 && (
                  <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-3">
                    Sí, funciona en computadores de escritorio, portátiles, tablets (iPad y Android) y teléfonos inteligentes. La interfaz se ajusta automáticamente para una experiencia visual óptima.
                  </div>
                )}
              </div>

              {/* Pregunta 4 */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(3)}
                  className="w-full text-left p-5 font-black text-gray-900 text-base sm:text-lg flex justify-between items-center hover:text-[#FF6B00] transition-colors"
                >
                  <span>¿Cómo se realiza el pago en Colombia?</span>
                  <span className="text-xl text-gray-400 ml-2">{openFaq === 3 ? '−' : '+'}</span>
                </button>
                {openFaq === 3 && (
                  <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-3">
                    Utilizamos la pasarela <strong>Wompi de Bancolombia</strong>. Puedes abonar mediante PSE, transferencias desde Nequi, Daviplata, Bancolombia, cualquier tarjeta de crédito o débito, o en efectivo mediante corresponsales bancarios autorizados.
                  </div>
                )}
              </div>

              {/* Pregunta 5 */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(4)}
                  className="w-full text-left p-5 font-black text-gray-900 text-base sm:text-lg flex justify-between items-center hover:text-[#FF6B00] transition-colors"
                >
                  <span>¿El acceso caduca o incluye actualizaciones?</span>
                  <span className="text-xl text-gray-400 ml-2">{openFaq === 4 ? '−' : '+'}</span>
                </button>
                {openFaq === 4 && (
                  <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-3">
                    Tienes acceso ilimitado durante <strong>12 meses continuos</strong> las 24 horas del día. Además, tendrás acceso a todas las mejoras, nuevos ejercicios y los 3 libros descargables en PDF para siempre.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 10. CTA FINAL */}
        {/* =================================================================== */}
        <section className="py-16 sm:py-24 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] text-white text-center px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <span className="bg-orange-500/30 text-orange-200 border border-orange-400/40 text-xs font-black uppercase px-4 py-1.5 rounded-full inline-block mb-4">
              Comienza hoy mismo
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mb-4 font-['Baloo_2',sans-serif]">
              Dale a tu hijo la seguridad de entender cada operación
            </h2>
            <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Segundo grado es el punto de inflexión donde se construye el razonamiento de toda la primaria. Haz que tu hijo disfrute el desafío con el Método Fedor.
            </p>

            <button
              type="button"
              id="final-cta-btn-2"
              onClick={handleCtaClick}
              className="w-full sm:w-auto bg-[#FF6B00] hover:bg-[#EA580C] text-white font-black text-xl py-4.5 px-12 rounded-2xl shadow-[0_10px_35px_rgba(255,107,0,0.5)] hover:shadow-[0_15px_40px_rgba(255,107,0,0.6)] transition-all duration-200 hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            >
              Quiero este módulo
            </button>

            <p className="text-xs sm:text-sm text-blue-200 mt-4">
              Acceso completo por ${PRICE_COP.toLocaleString('es-CO')} COP • Pago único • Garantía de 7 días
            </p>
          </div>
        </section>
      </main>

      {/* =================================================================== */}
      {/* 11. FOOTER MINIMALISTA */}
      {/* =================================================================== */}
      <footer className="bg-[#111827] text-white py-10 px-4 sm:px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center gap-6">
          <Image
            src="/logo.png"
            alt="Matemáticas de Fedor"
            width={220}
            height={70}
            className="h-10 w-auto opacity-90 brightness-110"
          />

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>¿Tienes dudas antes de comprar? Escríbenos por WhatsApp:</span>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#FF6B00] hover:text-orange-400 font-bold underline transition-colors"
            >
              <span>+57 310 719 9897</span>
              <span>💬</span>
            </a>
          </div>

          <p className="text-xs text-gray-500">
            Matemáticas de Fedor. Todos los Derechos Reservados.
          </p>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* MODAL DE CHECKOUT RÁPIDO */}
      {/* =================================================================== */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 text-gray-600 font-black flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="text-xs font-black text-[#FF6B00] uppercase tracking-wider bg-orange-100 px-3 py-1 rounded-full">
                Habilitar Acceso Inmediato
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-2 font-['Baloo_2',sans-serif]">
                Módulo Matemáticas 2° Primaria
              </h3>
              <p className="text-gray-500 text-xs mt-1">
                Total a pagar:{' '}
                <strong className="text-gray-900 text-sm">
                  ${PRICE_COP.toLocaleString('es-CO')} COP
                </strong>
              </p>
            </div>

            <form onSubmit={handleProceedToWompi} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1">
                  Nombre del estudiante o acudiente:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-200 font-semibold text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1">
                  Correo electrónico (para enviar el acceso):
                </label>
                <input
                  type="email"
                  required
                  placeholder="correo@ejemplo.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-200 font-semibold text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1">
                  Teléfono / WhatsApp de contacto:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 3101234567"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-200 font-semibold text-sm text-gray-800"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-black text-base py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Conectando con Wompi...</span>
                ) : (
                  <>
                    <span>Ir al pago seguro con Wompi</span>
                    <span>🔒</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-[11px] text-gray-500 font-medium">
                  🛡️ Transacción protegida y cifrada por Bancolombia / Wompi.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
