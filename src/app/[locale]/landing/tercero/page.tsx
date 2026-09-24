'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import { usersService } from '@/services/users.service';
import { authService } from '@/services/auth.service';

// ============================================================================
// CONFIGURACIÓN DE PRODUCTO Y PRECIO - GRADO 3° PRIMARIA
// ============================================================================
const PRODUCT_ID = 'modulo-grado-3';
const PRODUCT_NAME = 'Módulo Matemáticas Grado 3° Primaria';
const PRICE_COP = 203000;
const REGULAR_PRICE_COP = 350000;
const AMOUNT_IN_CENTS = PRICE_COP * 100;
const WHATSAPP_URL =
  'https://wa.me/573107199897?text=Hola,%20tengo%20una%20pregunta%20sobre%20el%20M%C3%B3dulo%20de%203%C2%B0%20Primaria';

export default function LandingGrado3() {
  // Modal de checkout directo
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal de registro para módulo gratis
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerTermsAccepted, setRegisterTermsAccepted] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Referencia a la sección de oferta para ViewContent
  const offerSectionRef = useRef<HTMLDivElement | null>(null);
  const hasFiredViewContent = useRef(false);

  // Manejador del registro para el módulo gratis
  const handleFreeRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      setRegisterError('Por favor completa todos los campos.');
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!registerTermsAccepted) {
      setRegisterError('Debes aceptar los términos y la política de privacidad.');
      return;
    }

    setIsRegistering(true);

    try {
      await usersService.createUser({
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
        rol: 'Student',
        legalConsents: {
          termsAndPrivacyAccepted: true,
          termsVersion: '1.0',
          privacyPolicyVersion: '1.0',
          commercialCommunicationsAccepted: true,
          commercialCommunicationsAcceptedAt: new Date().toISOString(),
        },
      });

      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'CompleteRegistration', {
          content_name: 'modulo_gratis_grado_3',
          status: true,
        });
      }
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'sign_up',
          method: 'email',
          grade: 'Grado 3 Gratis',
        });
      }

      setRegisterSuccess(true);

      try {
        await authService.login({
          email: registerEmail.trim(),
          password: registerPassword,
        });
        setTimeout(() => {
          window.location.href = '/dashboard/mis-modulos';
        }, 1200);
      } catch {
        setTimeout(() => {
          window.location.href = '/login?registered=true';
        }, 1500);
      }
    } catch (err: any) {
      let msg = 'Ocurrió un error al registrar el usuario. Por favor verifica tus datos e intenta nuevamente.';
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }
      setRegisterError(msg);
    } finally {
      setIsRegistering(false);
    }
  };

  // 1. Meta Pixel PageView automático & IntersectionObserver para ViewContent
  useEffect(() => {
    // PageView
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_title: 'Landing Módulo Grado 3° Primaria',
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
    const reference = `FEDOR-G3-${Date.now()}`;
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
          window.location.href = `/gracias?ref=${reference}&grade=3`;
        });
      } catch (err) {
        console.warn('Wompi Widget fallback:', err);
        window.location.href = `/gracias?ref=${reference}&grade=3`;
      }
    } else {
      // Fallback de redirección directa a gracias si no hay widget activo
      setTimeout(() => {
        window.location.href = `/gracias?ref=${reference}&grade=3`;
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
        id="gtm-script-landing-tercero"
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
        id="meta-pixel-landing-tercero"
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
              Módulo Oficial • Grado 3° Primaria
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
              <span>⭐</span>
              <span>Multiplicación, División y Pruebas SABER 3° • Primaria</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight sm:leading-tight mb-6 font-['Baloo_2',sans-serif]">
              Aprende las tablas de multiplicar, división y lógica sin memorización vacía con el{' '}
              <span className="text-[#FDBA74] underline decoration-wavy decoration-[#FF6B00]">
                Método Fedor
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-normal mb-8 sm:mb-10">
              El método interactivo que transforma el grado más desafiante de la primaria en un camino de éxito, dominio de las 4 operaciones y preparación con ventaja para las Pruebas SABER 3°.
            </p>

            {/* CTA Hero */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <button
                type="button"
                id="hero-cta-btn-3"
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
            <div className="relative max-w-3xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-gradient-to-br from-slate-900/90 via-blue-950/80 to-slate-900/95 p-6 sm:p-10 flex flex-col items-center justify-center text-center mb-10">
              <div className="relative w-full max-w-md h-56 sm:h-72 mb-4">
                <Image
                  src="/fedor-modulo-3-libros.png"
                  alt="Libros y Material Interactivo Módulo 3° Primaria - Método Fedor"
                  fill
                  className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)]"
                  priority
                />
              </div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold">
                <span>⭐ Incluye 3 Libros Digitales PDF + Plataforma Gamificada 3°</span>
              </div>
              <p className="text-blue-100 text-xs sm:text-sm mt-3 max-w-lg">
                Tablas razonadas del 1 al 10, división exacta e inexacta, fracciones intuitivas y simulacros tipo SABER 3°.
              </p>
            </div>

            {/* =================================================================== */}
            {/* SECCIÓN DE 2 VIDEOS: LANZAMIENTO ESPECIAL Y MÉTODO FEDOR ENTERO */}
            {/* =================================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto text-left">
              {/* VIDEO 1: LANZAMIENTO ESPECIAL (MÓDULO GRATIS) */}
              <div className="rounded-3xl bg-slate-900/85 backdrop-blur-md border-2 border-emerald-400/40 p-5 sm:p-7 shadow-2xl flex flex-col justify-between hover:border-emerald-400/70 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-black uppercase px-3 py-1 rounded-full">
                      <span>🎁</span>
                      <span>Opción 1 • Lanzamiento Especial</span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-200/90 bg-white/10 px-2.5 py-0.5 rounded-md">
                      Acceso en Línea
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 font-['Baloo_2',sans-serif]">
                    Módulo Gratis: Grado 3°
                  </h3>

                  {/* Video 1 */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black aspect-video mb-4 shadow-lg">
                    <video
                      src="/lanzamiento-especial.mp4"
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Frase explicativa clara */}
                  <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 mb-5 text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    <p className="flex items-start gap-2">
                      <span className="text-base shrink-0">📖</span>
                      <span>
                        <strong className="text-emerald-300">Importante:</strong> El módulo gratuito es <strong>solo el libro digital dentro de la plataforma</strong> para estudiar y practicar en línea (no incluye descargas de libros en PDF ni simulacros de examen).
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  {/* Botón Quiero el módulo gratis */}
                  <button
                    type="button"
                    id="hero-free-btn-3"
                    onClick={() => setShowRegisterModal(true)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base sm:text-lg py-4 px-6 rounded-2xl shadow-[0_8px_25px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.45)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 text-center"
                  >
                    <span>Quiero el módulo gratis</span>
                    <span className="text-xl">✨</span>
                  </button>

                  <p className="text-[11px] text-center text-blue-200/80 mt-2.5 font-medium">
                    ⚡ Registro gratuito en 30 segundos • Creas tu usuario y contraseña
                  </p>
                </div>
              </div>

              {/* VIDEO 2: MÉTODO FEDOR ENTERO (MÓDULO COMPLETO CON WOMPI) */}
              <div className="rounded-3xl bg-slate-900/85 backdrop-blur-md border-2 border-[#FF6B00]/70 p-5 sm:p-7 shadow-2xl flex flex-col justify-between hover:border-[#FF6B00] transition-all duration-300 ring-2 ring-[#FF6B00]/25">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-[#FF6B00]/25 border border-[#FF6B00]/70 text-orange-200 text-xs font-black uppercase px-3 py-1 rounded-full shadow-xs">
                      <span>⚡</span>
                      <span>Opción 2 • Módulo Completo Oficial</span>
                    </span>
                    <span className="text-[11px] font-bold text-orange-200 bg-[#FF6B00]/40 px-2.5 py-0.5 rounded-md">
                      Acceso Total + Descargas
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 font-['Baloo_2',sans-serif]">
                    Método Fedor Entero: Grado 3°
                  </h3>

                  {/* Video 2 */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black aspect-video mb-4 shadow-lg">
                    <video
                      src="/metodo-fedor-entero.mp4"
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Frase explicativa clara */}
                  <div className="bg-orange-950/40 border border-orange-500/30 rounded-xl p-3.5 mb-5 text-xs sm:text-sm text-orange-100 leading-relaxed">
                    <p className="flex items-start gap-2">
                      <span className="text-base shrink-0">🎓</span>
                      <span>
                        <strong className="text-orange-300">Módulo completo:</strong> Viene con el módulo completo, es decir, el <strong>libro digital interactivo</strong> y todas las <strong>descargas de ayuda</strong> (3 libros PDF imprimibles, tablas razonadas y simulacros tipo SABER 3°).
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  {/* Botón Pagar en Wompi */}
                  <button
                    type="button"
                    id="hero-cta-btn-3-video"
                    onClick={handleCtaClick}
                    className="w-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-black text-base sm:text-lg py-4 px-6 rounded-2xl shadow-[0_8px_25px_rgba(255,107,0,0.45)] hover:shadow-[0_12px_30px_rgba(255,107,0,0.55)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 text-center"
                  >
                    <span>Quiero este módulo</span>
                    <span className="text-xl">🚀</span>
                  </button>

                  <p className="text-[11px] text-center text-blue-200/80 mt-2.5 font-medium">
                    🔒 Incluye libro digital + descargas completas • Pago Wompi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 3. BLOQUE DE DOLOR (Lo que viven hoy padres de 3°) */}
        {/* =================================================================== */}
        <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#FF6B00] font-black text-sm uppercase tracking-wider">
                El año decisivo de la primaria
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mt-2 font-['Baloo_2',sans-serif]">
                ¿Está tu hijo enfrentando estos obstáculos en tercer grado?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dolor 1 */}
              <div className="p-6 rounded-2xl bg-[#FFF7ED] border border-orange-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#EA580C] font-black flex items-center justify-center shrink-0 text-xl">
                  ✖️
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-1">
                    La pesadilla de memorizar las tablas de multiplicar
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Repetir como loro las tablas del 6, 7, 8 y 9 genera llanto, ansiedad y olvidos a los pocos días porque nunca entendió el principio matemático.
                  </p>
                </div>
              </div>

              {/* Dolor 2 */}
              <div className="p-6 rounded-2xl bg-[#FFF7ED] border border-orange-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#EA580C] font-black flex items-center justify-center shrink-0 text-xl">
                  ➗
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-1">
                    El gran choque con la división
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Al introducir la división, el niño no comprende cómo repartir ni cómo interactúan el dividendo, divisor y residuo, causándole bloqueo en clase.
                  </p>
                </div>
              </div>

              {/* Dolor 3 */}
              <div className="p-6 rounded-2xl bg-[#FFF7ED] border border-orange-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#EA580C] font-black flex items-center justify-center shrink-0 text-xl">
                  📝
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-1">
                    Ansiedad por las primeras Pruebas SABER 3°
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    El colegio y el Ministerio de Educación evalúan competencias de razonamiento en 3° y las pruebas diagnósticas generan angustia tanto al niño como a la familia.
                  </p>
                </div>
              </div>

              {/* Dolor 4 */}
              <div className="p-6 rounded-2xl bg-[#FFF7ED] border border-orange-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#EA580C] font-black flex items-center justify-center shrink-0 text-xl">
                  🧩
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-1">
                    Problemas con operaciones combinadas
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Los ejercicios ya no son de una sola operación; exigen sumar primero y luego multiplicar o dividir, y el estudiante no sabe por dónde empezar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 4. LA SOLUCIÓN (MÉTODO FEDOR 3°) */}
        {/* =================================================================== */}
        <section className="py-16 sm:py-20 bg-[#F9FAFB]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-[#2563EB] font-black text-sm uppercase tracking-wider">
                Comprensión profunda y duradera
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mt-2 font-['Baloo_2',sans-serif]">
                Cómo el Método Fedor convierte las tablas y la división en una aventura
              </h2>
              <p className="text-gray-600 mt-3 text-base sm:text-lg">
                Convertimos conceptos abstractos en arreglos rectangulares, juegos de reparto equitativo y retos de cálculo ágil que quedan grabados para siempre.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Paso 1 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2563EB] font-black text-lg flex items-center justify-center mb-4">
                  01
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">
                  Multiplicación razonada
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Matrices visuales y grupos repetidos. El niño entiende por qué 7 × 8 = 56 antes de memorizarlo, haciendo que recordarlo sea facilísimo.
                </p>
              </div>

              {/* Paso 2 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF6B00] font-black text-lg flex items-center justify-center mb-4">
                  02
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">
                  División intuitiva
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Repartos justos de elementos y conexión directa como la operación inversa de multiplicar, sin misterios ni confusiones.
                </p>
              </div>

              {/* Paso 3 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2563EB] font-black text-lg flex items-center justify-center mb-4">
                  03
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">
                  Simulacros SABER 3°
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Preguntas tipo prueba de Estado explicadas paso a paso para familiarizarse con el formato y contestar con total seguridad.
                </p>
              </div>

              {/* Paso 4 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-black text-lg flex items-center justify-center mb-4">
                  04
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">
                  Iniciación a Fracciones
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Pizzas, figuras y particiones gráficas que hacen que medios, cuartos y octavos sean intuitivos y divertidos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 5. QUÉ INCLUYE EL MÓDULO DE 3° */}
        {/* =================================================================== */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#FF6B00] font-black text-sm uppercase tracking-wider">
                Todo lo que recibes
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mt-2 font-['Baloo_2',sans-serif]">
                El kit integral de Matemáticas Grado 3° Primaria
              </h2>
            </div>

            <div className="bg-gradient-to-br from-[#FFFDF5] to-[#FFF8E6] rounded-3xl border-2 border-[#FDE68A] p-6 sm:p-10 shadow-lg">
              <ul className="space-y-4 sm:space-y-5 text-gray-800 text-base sm:text-lg">
                <li className="flex items-start gap-3.5">
                  <span className="text-emerald-600 font-black text-xl shrink-0 mt-0.5">✅</span>
                  <div>
                    <span className="font-black text-gray-900">+120 lecciones interactivas completas</span>{' '}
                    cubriendo las 4 operaciones básicas, números hasta 10.000, fracciones y geometría de 3° según estándares MEN.
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="text-emerald-600 font-black text-xl shrink-0 mt-0.5">✅</span>
                  <div>
                    <span className="font-black text-gray-900">+800 ejercicios interactivos y retos de lógica</span>{' '}
                    con explicaciones paso a paso de cada respuesta correcta o incorrecta.
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="text-emerald-600 font-black text-xl shrink-0 mt-0.5">✅</span>
                  <div>
                    <span className="font-black text-gray-900">3 Libros didácticos en PDF descargables</span>{' '}
                    con teoría clara, ejercicios resueltos y hojas de trabajo para imprimir en casa.
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="text-emerald-600 font-black text-xl shrink-0 mt-0.5">✅</span>
                  <div>
                    <span className="font-black text-gray-900">Módulo de preparación Pruebas SABER 3°</span>{' '}
                    con preguntas contextualizadas y retroalimentación para entrenar velocidad y razonamiento.
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="text-emerald-600 font-black text-xl shrink-0 mt-0.5">✅</span>
                  <div>
                    <span className="font-black text-gray-900">12 meses de acceso total 24/7 sin restricciones</span>{' '}
                    disponible en computadores, tablets y celulares para estudiar a su ritmo.
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="text-emerald-600 font-black text-xl shrink-0 mt-0.5">✅</span>
                  <div>
                    <span className="font-black text-gray-900">Tablas de multiplicar interactivas y descargables</span>{' '}
                    diseñadas con trucos de simetría y patrones que facilitan su memorización natural.
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
                Lo que dicen las familias de tercer grado
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Testimonio 1 */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div className="mb-4">
                  <div className="flex text-amber-400 mb-3">★★★★★</div>
                  <p className="text-gray-700 italic text-base leading-relaxed">
                    &quot;Sufríamos horrores con las tablas del 7 y del 8. Mi hijo Lucas se bloqueaba en las evaluaciones. Con el Método Fedor descubrió los patrones y aprendió a multiplicar razonando. Hoy es el más rápido de su clase en cálculo mental y le encanta ayudar a sus amigos.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-orange-200 text-[#EA580C] font-black flex items-center justify-center text-lg shrink-0">
                    PS
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm">
                      Paola S. - Madre de Lucas (8 años)
                    </div>
                    <div className="text-gray-500 text-xs">
                      Barranquilla, Colombia
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonio 2 */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div className="mb-4">
                  <div className="flex text-amber-400 mb-3">★★★★★</div>
                  <p className="text-gray-700 italic text-base leading-relaxed">
                    &quot;La preparación para las pruebas diagnósticas del colegio fue impecable. Mariana aprendió a interpretar enunciados con dos operaciones y a no caer en las preguntas trampa. El módulo superó por completo nuestras expectativas familiares.&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-blue-200 text-[#2563EB] font-black flex items-center justify-center text-lg shrink-0">
                    RB
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm">
                      Ricardo B. - Padre de Mariana (9 años)
                    </div>
                    <div className="text-gray-500 text-xs">
                      Bogotá, Colombia
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
                Acceso Completo Grado 3° Primaria
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2 font-['Baloo_2',sans-serif]">
                Asegura el dominio total de las 4 operaciones
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto mb-8">
                Pago único con acceso completo a todo el contenido de 3° grado, simulacros SABER 3°, 3 libros PDF descargables y plataforma interactiva durante 12 meses.
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
                id="offer-cta-btn-3"
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
                  Prueba el módulo con tu hijo durante 7 días completos. Si sientes que no aprende con más facilidad y gusto las tablas o la división, te devolvemos el 100% de tu dinero inmediatamente, sin trámites complicados.
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
                  <span>¿A quién está dirigido específicamente este módulo?</span>
                  <span className="text-xl text-gray-400 ml-2">{openFaq === 0 ? '−' : '+'}</span>
                </button>
                {openFaq === 0 && (
                  <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-3">
                    A estudiantes de <strong>7 a 9 años</strong> que cursan <strong>3° de primaria</strong> en colegios colombianos o niños de otros grados que necesitan afianzar urgentemente las tablas de multiplicar, división y razonamiento de problemas antes de pasar a 4° y 5°.
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
                  <span>¿Cómo funciona la preparación para las Pruebas SABER 3°?</span>
                  <span className="text-xl text-gray-400 ml-2">{openFaq === 1 ? '−' : '+'}</span>
                </button>
                {openFaq === 1 && (
                  <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-3">
                    Incluye simulacros con preguntas contextualizadas que miden los 5 pensamientos matemáticos exigidos por el Ministerio de Educación Nacional (numérico, espacial, métrico, aleatorio y variacional), enseñando al niño a descartar distractores y razonar la respuesta correcta.
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
                  <span>¿Se necesita computador o puede usarse en celular y tablet?</span>
                  <span className="text-xl text-gray-400 ml-2">{openFaq === 2 ? '−' : '+'}</span>
                </button>
                {openFaq === 2 && (
                  <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-3">
                    Funciona de manera excelente en tablets, celulares y computadores. Solo requieres conexión a internet y cualquier navegador web (Chrome, Safari, Edge, Firefox).
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
                  <span>¿Qué métodos de pago aceptan?</span>
                  <span className="text-xl text-gray-400 ml-2">{openFaq === 3 ? '−' : '+'}</span>
                </button>
                {openFaq === 3 && (
                  <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-3">
                    Aceptamos todos los medios autorizados en Colombia por <strong>Wompi (Bancolombia)</strong>: PSE (cualquier banco), Nequi, Daviplata, tarjetas crédito/débito (Visa, Mastercard, Amex) o pagos en efectivo en corresponsales bancarios autorizados.
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
                  <span>¿Cuándo recibo el acceso a la plataforma?</span>
                  <span className="text-xl text-gray-400 ml-2">{openFaq === 4 ? '−' : '+'}</span>
                </button>
                {openFaq === 4 && (
                  <div className="px-5 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-3">
                    El acceso es <strong>inmediato y automático</strong>. Al completarse la transacción por Wompi, el sistema activa tu usuario al instante y recibirás las instrucciones en tu correo para empezar de una vez.
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
              Dale a tu hijo la llave para dominar las matemáticas de primaria
            </h2>
            <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Las tablas y la división no tienen que ser un trauma. Con la pedagogía adecuada de Fedor, tu hijo ganará confianza, velocidad y amor por los desafíos lógicos.
            </p>

            <button
              type="button"
              id="final-cta-btn-3"
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
                Módulo Matemáticas 3° Primaria
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

      {/* =================================================================== */}
      {/* 9. MODAL DE REGISTRO GRATIS (MÓDULO DE 3°) */}
      {/* =================================================================== */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border-2 border-emerald-500/30 max-h-[90vh] overflow-y-auto">
            {/* Botón cerrar */}
            <button
              onClick={() => {
                setShowRegisterModal(false);
                setRegisterError('');
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-lg cursor-pointer transition-colors"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                🎁 Módulo Oficial Grado 3° Primaria
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-2 font-['Baloo_2',sans-serif]">
                Crea tu cuenta de acceso gratis
              </h3>
              <p className="text-gray-600 text-xs mt-1.5 leading-relaxed">
                Podrás ingresar a practicar y estudiar con el <strong>libro digital interactivo de 3° Primaria</strong> en línea sin costo.
              </p>
            </div>

            {/* Aviso aclaratorio importante */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-[12px] text-amber-900 leading-snug">
              <span className="font-bold">Nota:</span> Esta modalidad gratuita te da acceso al <strong>libro digital dentro de la plataforma</strong>. Si luego deseas descargar los 3 libros en PDF y simulacros de examen, podrás adquirir el módulo completo.
            </div>

            {registerError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                ⚠️ {registerError}
              </div>
            )}

            {registerSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl font-black flex items-center justify-center mx-auto mb-3">
                  ✓
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-1 font-['Baloo_2',sans-serif]">
                  ¡Cuenta creada con éxito!
                </h4>
                <p className="text-gray-600 text-sm">
                  Iniciando tu sesión y abriendo la plataforma...
                </p>
              </div>
            ) : (
              <form onSubmit={handleFreeRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1">
                    Nombre del estudiante o acudiente:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofía Restrepo"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 font-semibold text-sm text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1">
                    Correo electrónico:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 font-semibold text-sm text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1">
                    Crea tu contraseña (mínimo 6 caracteres):
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 font-semibold text-sm text-gray-800"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check-3"
                    checked={registerTermsAccepted}
                    onChange={(e) => setRegisterTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="terms-check-3" className="text-[11px] text-gray-600 leading-snug cursor-pointer">
                    Acepto los{' '}
                    <Link href="/legal/terminos" target="_blank" className="text-emerald-700 underline font-semibold">
                      Términos de servicio
                    </Link>{' '}
                    y la{' '}
                    <Link href="/legal/privacidad" target="_blank" className="text-emerald-700 underline font-semibold">
                      Política de privacidad
                    </Link>
                    .
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
                >
                  {isRegistering ? (
                    <span>Creando tu cuenta gratuita...</span>
                  ) : (
                    <>
                      <span>Crear mi cuenta y acceder gratis</span>
                      <span>✨</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <p className="text-[11px] text-gray-500 font-medium">
                    🔒 Tus datos están protegidos. Acceso digital inmediato sin tarjeta de crédito.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
