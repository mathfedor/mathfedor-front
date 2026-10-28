'use client';

import React, { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GRADOS,
  DISPONIBLES,
  PORTADAS_MAP,
  WA_PHONE,
  GradoItem
} from './nuevaLandingData';
import { usersService } from '@/services/users.service';
import { authService } from '@/services/auth.service';
import { generateAutoPassword } from '@/lib/password';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { trackFreeAccountCreated } from '@/lib/analytics/leads';
import './nueva-landing.css';

export default function NuevaLandingPage() {
  const [sel, setSel] = useState<number>(3);
  const [pos, setPos] = useState<number>(3);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [vista, setVista] = useState<'abanico' | 'orbita' | 'mosaico'>('abanico');
  const [isMobileRiel, setIsMobileRiel] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Modals state
  const [isHojaOpen, setIsHojaOpen] = useState<boolean>(false);
  const [isAltaOpen, setIsAltaOpen] = useState<boolean>(false);

  // Alta form state
  const [formNombre, setFormNombre] = useState<string>('');
  const [formCorreo, setFormCorreo] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { executeRecaptcha } = useGoogleReCaptcha();

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gradeCardRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const fichaRef = useRef<HTMLDivElement | null>(null);

  // Drag tracking refs
  const isPointerDownRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startPosRef = useRef<number>(3);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const velocityXRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const wheelCooldownRef = useRef<number>(0);

  // Check mobile riel mode
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      setIsMobileRiel(w <= 640 && vista === 'abanico');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [vista]);

  // Starfield animation
  useEffect(() => {
    if (windowWidth <= 640) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let stars: Array<{ x: number; y: number; r: number; f: number; v: number }> = [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setupCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = [];
      const count = Math.round((window.innerWidth * window.innerHeight) / 11000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 1.2 + 0.25,
          f: Math.random() * 6.28,
          v: Math.random() * 0.015 + 0.004
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.f += s.v;
        ctx.globalAlpha = 0.25 + Math.abs(Math.sin(s.f)) * 0.55;
        ctx.fillStyle = i % 11 === 0 ? '#ffa155' : i % 7 === 0 ? '#49c9f5' : '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    setupCanvas();
    render();

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else if (!reducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    const handleWinResize = () => {
      setupCanvas();
      if (reducedMotion) render();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('resize', handleWinResize);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleWinResize);
    };
  }, [windowWidth]);

  // Select grade helper
  const elegir = useCallback(
    (g: number, centrar = true) => {
      setSel(g);
      setPos(g);
      if (centrar && isMobileRiel) {
        const el = gradeCardRefs.current[g];
        if (el?.scrollIntoView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    },
    [isMobileRiel]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHojaOpen || isAltaOpen) {
        if (e.key === 'Escape') {
          setIsHojaOpen(false);
          setIsAltaOpen(false);
        }
        return;
      }

      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' && sel < 11) {
        e.preventDefault();
        elegir(sel + 1, true);
      } else if (e.key === 'ArrowLeft' && sel > 1) {
        e.preventDefault();
        elegir(sel - 1, true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sel, isHojaOpen, isAltaOpen, elegir]);

  // Pointer drag event handlers for moving the books with the cursor
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isMobileRiel || vista === 'mosaico') return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isPointerDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityXRef.current = 0;
    startPosRef.current = pos;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const dx = e.clientX - startXRef.current;
    if (!hasMovedRef.current && Math.abs(dx) > 4) {
      hasMovedRef.current = true;
      setIsDragging(true);
    }

    if (hasMovedRef.current) {
      const now = performance.now();
      const dt = now - lastTimeRef.current;
      if (dt > 0) {
        velocityXRef.current = (e.clientX - lastXRef.current) / dt;
      }
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;

      // ~140px de desplazamiento del cursor avanza 1 grado en el carrusel
      const step = 140;
      const newPos = Math.max(1, Math.min(11, startPosRef.current - dx / step));
      setPos(newPos);

      // El libro que queda al frente (el más centrado) se convierte en el seleccionado en tiempo real
      const newFront = Math.max(1, Math.min(11, Math.round(newPos)));
      if (newFront !== sel) {
        setSel(newFront);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (hasMovedRef.current) {
      setIsDragging(false);

      // Inercia si el usuario soltó con un gesto rápido
      let target = Math.round(pos);
      const vx = velocityXRef.current;
      if (Math.abs(vx) > 0.45) {
        if (vx < -0.45) target = Math.min(11, Math.ceil(pos));
        if (vx > 0.45) target = Math.max(1, Math.floor(pos));
      }
      target = Math.max(1, Math.min(11, target));

      setSel(target);
      setPos(target);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);
    setPos(sel);
  };

  // Wheel / Trackpad scroll support
  const handleWheel = (e: React.WheelEvent) => {
    if (isMobileRiel || vista === 'mosaico') return;

    const now = Date.now();
    if (now - wheelCooldownRef.current < 160) return;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 15) return;

    if (delta > 0 && sel < 11) {
      wheelCooldownRef.current = now;
      elegir(sel + 1, false);
    } else if (delta < 0 && sel > 1) {
      wheelCooldownRef.current = now;
      elegir(sel - 1, false);
    }
  };

  // Form submit handler with real backend registration and auto-login
  const handleAltaSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nombre = formNombre.trim();
    const correo = formCorreo.trim();

    if (!nombre || !correo || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) {
      setFormError(
        !nombre
          ? 'Escriba su nombre para poder saludarlo.'
          : 'Revise el correo: ahí le llega la clave de acceso.'
      );
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    const autoPassword = generateAutoPassword();

    try {
      let recaptchaToken = '';
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('register');
        } catch (rcError) {
          console.warn('No se pudo generar token de reCAPTCHA:', rcError);
        }
      }

      const gradoNombre = `Grado ${sel}° ${currentGrado.etapa === 'primaria' ? 'Primaria' : 'Bachillerato'}`;

      await usersService.createUser({
        name: nombre,
        email: correo,
        password: autoPassword,
        rol: 'Student',
        recaptchaToken,
        legalConsents: {
          termsAndPrivacyAccepted: true,
          termsVersion: '1.0',
          privacyPolicyVersion: '1.0',
          commercialCommunicationsAccepted: true,
          commercialCommunicationsAcceptedAt: new Date().toISOString(),
        },
      });

      // Tracking analítica de registro exitoso
      try {
        trackFreeAccountCreated(gradoNombre);
      } catch (trackErr) {
        console.warn('Analytics tracking error:', trackErr);
      }

      setFormSuccess(true);

      // Limpiar cualquier sesión previa en localStorage para evitar heredar roles anteriores
      authService.logout();

      // Intentar auto-login para que quede autenticado y entre directo
      try {
        let loginToken = recaptchaToken;
        if (executeRecaptcha) {
          try {
            loginToken = await executeRecaptcha('login');
          } catch {
            // fallback al token obtenido previamente
          }
        }

        await authService.login({
          email: correo,
          password: autoPassword,
          recaptchaToken: loginToken,
        });

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('userUpdated'));
        }
      } catch (loginErr) {
        console.warn('Auto-login post-registro no completado:', loginErr);
      }
    } catch (err: any) {
      let msg = 'Ocurrió un error al registrar el usuario. Por favor verifica tus datos e intenta nuevamente.';
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAlta = () => {
    setFormError('');
    setFormSuccess(false);
    setIsAltaOpen(true);
  };

  const currentGrado: GradoItem = GRADOS.find((item) => item.g === sel) || GRADOS[2];
  const isAvailable = Boolean(DISPONIBLES[sel]);

  // Compute 3D Card Style using continuous pos
  const getCardStyle = (g: number): React.CSSProperties => {
    if (isMobileRiel || vista === 'mosaico') {
      const d = g - sel;
      return {
        zIndex: 50 - Math.abs(d)
      };
    }

    const d = g - pos;
    const absD = Math.abs(d);
    const closeness = Math.max(0, 1 - absD);

    const angosto = windowWidth <= 980;
    const ventana = angosto ? 2 : 3;
    const cw = angosto ? 220 : 260;
    const paso = cw * (angosto ? 0.48 : 0.5);

    if (vista === 'abanico') {
      const dc = Math.max(-ventana, Math.min(ventana, d));
      const fuera = absD > ventana + 0.6;
      const giro = dc * 9;
      const x = dc * paso + (d - dc) * 6;
      const y = Math.abs(dc) * 6 - closeness * 14;
      const z = -Math.abs(dc) * 54 + closeness * 64;
      const s = 1 - Math.min(0.14, Math.abs(dc) * 0.045) + closeness * 0.12;

      return {
        zIndex: Math.round(50 - absD * 2),
        opacity: fuera ? 0 : 1,
        pointerEvents: fuera ? 'none' : 'auto',
        transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${-giro}deg) scale(${s})`,
        transition: isDragging
          ? 'none'
          : 'transform 0.45s cubic-bezier(0.22, 0.8, 0.3, 1), filter 0.3s, opacity 0.3s'
      };
    } else {
      // vista === 'orbita'
      const r = angosto ? 210 : 340;
      const a = d * (Math.PI / 10);
      const sc = 1 - Math.min(0.2, absD * 0.05) + closeness * 0.12;
      const fuera = absD > 4.2;

      return {
        zIndex: Math.round(50 - absD * 2),
        opacity: fuera ? 0 : 1,
        pointerEvents: fuera ? 'none' : 'auto',
        transform: `translate(-50%, -50%) translate3d(${Math.sin(a) * r}px, ${
          -closeness * 12
        }px, ${Math.cos(a) * r - r}px) rotateY(${-a * 42}deg) scale(${sc})`,
        transition: isDragging
          ? 'none'
          : 'transform 0.45s cubic-bezier(0.22, 0.8, 0.3, 1), filter 0.3s, opacity 0.3s'
      };
    }
  };

  const getEscenarioClass = () => {
    let cls = 'escenario';
    if (isDragging) cls += ' arrastrando';
    if (isMobileRiel) cls += ' riel';
    else if (vista === 'mosaico') cls += ' mosaico';
    return cls;
  };

  const waHref = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
    `Hola, quiero información del módulo de ${sel}°`
  )}`;

  return (
    <div className="nueva-landing-root">
      {/* Dynamic Starfield Canvas */}
      <canvas id="cielo" ref={canvasRef} aria-hidden="true" />

      {/* Top Header */}
      <header className="tope">
        <div className="caja">
          <div className="marca">
            Matemáticas de <span>Fedor</span>
          </div>
          <button className="btn btn-primario" type="button" onClick={openAlta}>
            Empezar gratis
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="heroe">
          <div className="caja">
            <span className="cinta">1° a 6° disponible hoy · 7° a 11° en camino</span>
            <h1>
              ¿Quiere que su hijo <em>destaque</em> en matemáticas?
            </h1>
            <p className="bajada">
              Ningún papá lo dice en voz alta: yo tampoco me sé la tabla del 7. Por eso su hijo
              aprende aquí solo, <b>sin que usted tenga que sentarse al lado</b>. Pruébelo 17 días
              gratis.
            </p>

            {/* View Mode Switcher */}
            <div className="vistas" role="group" aria-label="Forma de ver los grados">
              <button
                type="button"
                aria-pressed={vista === 'abanico'}
                onClick={() => setVista('abanico')}
              >
                Abanico
              </button>
              <button
                type="button"
                aria-pressed={vista === 'orbita'}
                onClick={() => setVista('orbita')}
              >
                Órbita
              </button>
              <button
                type="button"
                aria-pressed={vista === 'mosaico'}
                onClick={() => setVista('mosaico')}
              >
                Mosaico
              </button>
            </div>
          </div>

          {/* 3D Grade Carousel Stage */}
          <div
            className={getEscenarioClass()}
            id="escenario"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onWheel={handleWheel}
          >
            {/* Desktop Navigation Arrows */}
            {!isMobileRiel && vista !== 'mosaico' && sel > 1 && (
              <button
                type="button"
                className="flecha-nav izq"
                aria-label="Grado anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  elegir(sel - 1, false);
                }}
              >
                &#8592;
              </button>
            )}
            {!isMobileRiel && vista !== 'mosaico' && sel < 11 && (
              <button
                type="button"
                className="flecha-nav der"
                aria-label="Grado siguiente"
                onClick={(e) => {
                  e.stopPropagation();
                  elegir(sel + 1, false);
                }}
              >
                &#8594;
              </button>
            )}

            <div className="pista" id="pista" role="radiogroup" aria-label="Grado de su hijo">
              {GRADOS.map((item) => {
                const activo = item.g === sel;
                const cover = PORTADAS_MAP[item.g];
                const disponible = Boolean(DISPONIBLES[item.g]);

                return (
                  <button
                    key={item.g}
                    ref={(el) => {
                      gradeCardRefs.current[item.g] = el;
                    }}
                    type="button"
                    className="grado"
                    id={`grado-${item.g}`}
                    data-g={item.g}
                    role="radio"
                    aria-checked={activo}
                    tabIndex={activo ? 0 : -1}
                    aria-label={`Grado ${item.g}${disponible ? '' : ', próximamente'}`}
                    style={getCardStyle(item.g)}
                    onClick={() => {
                      if (hasMovedRef.current) return;
                      elegir(item.g, true);
                    }}
                  >
                    <div className="lamina">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={`Portada libro grado ${item.g}°`}
                          width={480}
                          height={480}
                          decoding="async"
                          priority={item.g <= 3}
                          draggable={false}
                        />
                      ) : (
                        <div className="falta">
                          <b>{item.g}°</b>
                          <small>portada pendiente</small>
                        </div>
                      )}
                      {!disponible && <span className="pronto">Pronto</span>}
                      <span className="etiqueta" aria-hidden="true">
                        {item.g}°
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="caja">
            <p className="ayuda" id="ayuda">
              {isMobileRiel
                ? 'Deslice para ver los otros grados.'
                : 'Arrastre con el cursor, use la rueda del mouse o toque para mover los libros. El del frente queda seleccionado.'}
            </p>
          </div>
        </section>

        {/* Selected Grade Detail Card (Ficha) */}
        <section className="caja">
          <div className="ficha" id="ficha" ref={fichaRef} aria-live="polite">
            <div className="ficha-tope">
              <div>
                <p className="curso" id="f-curso">
                  {currentGrado.g}° de {currentGrado.etapa}
                </p>
                <h2 id="f-titulo">{currentGrado.titulo}</h2>
              </div>
              <span className={`estado ${isAvailable ? 'listo' : 'camino'}`} id="f-estado">
                {isAvailable ? 'Disponible' : 'En camino'}
              </span>
            </div>

            <ul className="temas" id="f-temas">
              {currentGrado.temas.map(([tema, desc], idx) => (
                <li key={idx}>
                  <span className="punto"></span>
                  <span>
                    <b>{tema}</b>
                    {desc}
                  </span>
                </li>
              ))}
            </ul>

            <div className="acciones">
              <button className="btn btn-primario" type="button" onClick={openAlta}>
                {isAvailable
                  ? `Quiero probarlo con mi hijo de ${currentGrado.g}°`
                  : `Avísenme cuando salga ${currentGrado.g}°`}
              </button>
              <a className="btn btn-fantasma" href="#planes">
                ¿Cuánto cuesta después?
              </a>
            </div>
            <p className="nota-btn">
              No pedimos tarjeta. Solo su nombre y su correo. A los 17 días no se le cobra nada: usted
              decide si sigue.
            </p>
          </div>
        </section>

        {/* Testimonials (Voces) */}
        <section className="seccion voces">
          <div className="caja">
            <p className="rotulo">Familias</p>
            <p className="cifra">Más de 10.000 familias ya estudian con el método</p>
            <div className="tres">
              <article className="tarjeta">
                <p className="estrellas" aria-label="Cinco estrellas">
                  ★★★★★
                </p>
                <blockquote>
                  Mateo lloraba cada vez que le ponían fracciones. No entendía por qué 1/2 era mayor
                  que 1/4. Con los gráficos lo entendió en 3 días. Pasó de básico a superior y ahora
                  hace las tareas solo.
                  <cite className="quien">Carlos M. · papá de Mateo, 4° · Medellín</cite>
                </blockquote>
              </article>
              <article className="tarjeta">
                <p className="estrellas" aria-label="Cinco estrellas">
                  ★★★★★
                </p>
                <blockquote>
                  La división por dos cifras era nuestro dolor de cabeza todas las tardes. Les enseña
                  con una paciencia y un paso a paso que ningún libro tradicional tiene.
                  <cite className="quien">Claudia V. · mamá de Valentina, 4° · Cali</cite>
                </blockquote>
              </article>
              <article className="tarjeta">
                <p className="estrellas" aria-label="Cinco estrellas">
                  ★★★★★
                </p>
                <blockquote>
                  Lo que más me sirvió fue dejar de pelear a las nueve de la noche. Ella entra sola,
                  hace sus quince minutos y yo reviso después en qué va.
                  <cite className="quien">Paola S. · mamá de Sara, 3° · Barranquilla</cite>
                </blockquote>
              </article>
            </div>
          </div>
        </section>

        {/* Why it works */}
        <section className="seccion">
          <div className="caja">
            <p className="rotulo">Por qué funciona</p>
            <h2 className="titular">Deja de memorizar y empieza a entender</h2>
            <p className="entrada">
              El niño que se aprende las cosas de memoria aguanta hasta tercero. En cuarto llegan las
              fracciones y se le cae todo. Y ahí ya no es que no sepa: es que le da miedo
              equivocarse. Aquí empezamos por el porqué, no por la regla.
            </p>
            <div className="tres">
              <article className="tarjeta">
                <h3>Ve lo que está haciendo</h3>
                <p>
                  Nada de «hágalo así porque así es». Ve en pantalla por qué 6 por 4 son 24, lo mueve
                  con el dedo y lo entiende. Después ya no se le olvida.
                </p>
              </article>
              <article className="tarjeta">
                <h3>No tiene que sentarse al lado</h3>
                <p>
                  Cada ejercicio le dice de una si quedó bien y por qué. Y cuando se traba, ahí mismo
                  hay un video del profe explicando ese tema. No tiene que esperarlo a usted.
                </p>
              </article>
              <article className="tarjeta">
                <h3>Usted sabe en qué va sin preguntarle</h3>
                <p>
                  Puede ver qué temas ya pasó y en cuáles se está demorando. Sin revisarle el cuaderno
                  y sin discutir.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Pricing (Planes) */}
        <section className="seccion voces" id="planes">
          <div className="caja">
            <p className="rotulo">Precios</p>
            <h2 className="titular">Cuánto cuesta si decide seguir</h2>
            <p className="entrada">
              Primero los 17 días gratis. Ahí ve si a su hijo le sirve. Si sigue, el anual queda en
              $15.000 al mes y es el único que le deja descargar los libros y quedárselos para
              siempre, incluso si después cancela.
            </p>

            <div className="planes">
              <div className="plan">
                <p className="nombre">Prueba</p>
                <p className="precio">Gratis</p>
                <p className="equiv">17 días</p>
                <p className="detalle">El libro completo y la Zona Fedor. No pedimos tarjeta.</p>
              </div>
              <div className="plan">
                <p className="nombre">Mensual</p>
                <p className="precio">$24.999</p>
                <p className="equiv">al mes</p>
                <p className="detalle">
                  Todo lo de arriba, más un libro en Excel de regalo. Puede cancelar cuando quiera.
                </p>
              </div>
              <div className="plan destacado">
                <span className="sello">Casi 5 meses gratis</span>
                <p className="nombre">Anual</p>
                <p className="precio">$179.999</p>
                <p className="equiv">equivale a $15.000 al mes</p>
                <p className="detalle">
                  Pagando mes a mes serían $299.988. Se ahorra $119.989 y se queda con todos los
                  libros descargados.
                </p>
              </div>
            </div>

            <div className="familia">
              <strong>¿Tiene más de un hijo?</strong>
              <p>
                El segundo grado le queda en <span className="naranja">$69.999 al año</span>. Menos
                de $6.000 al mes por el otro hijo.
              </p>
            </div>

            <div className="garantia">
              <span className="escudo" aria-hidden="true">
                🛡️
              </span>
              <p>
                <b>Garantía de 17 días</b>
                Si paga y no ve a su hijo más suelto con las matemáticas dentro de los 17 días, nos escribe por WhatsApp y
                le devolvemos el 100%. Sin trámites.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs (Dudas) */}
        <section className="seccion">
          <div className="caja">
            <p className="rotulo">Dudas</p>
            <h2 className="titular">Lo que más nos preguntan</h2>
            <div style={{ marginTop: '18px' }}>
              <details>
                <summary>¿Sirve en el celular o necesito computador?</summary>
                <p>
                  Funciona en el celular, en la tablet y en el computador. No hay que instalar nada:
                  se entra con el correo y la clave que le llega.
                </p>
              </details>
              <details>
                <summary>¿Cuánto tiempo al día tiene que dedicarle?</summary>
                <p>
                  Con quince o veinte minutos al día alcanza. La idea no es cargarlo con más tareas,
                  es que esos minutos sí le queden.
                </p>
              </details>
              <details>
                <summary>¿Sirve si en el colegio usan otro libro?</summary>
                <p>
                  Sí. Los temas están ordenados según los estándares del Ministerio de Educación, que
                  son los mismos que sigue el colegio. Lo que cambia es la forma de explicarlos.
                </p>
              </details>
              <details>
                <summary>¿Y si me equivoco de grado?</summary>
                <p>
                  Nos escribe por WhatsApp y se lo cambiamos sin costo. Pasa seguido y no es
                  problema.
                </p>
              </details>
              <details>
                <summary>¿Cómo cancelo?</summary>
                <p>
                  Durante los 17 días no hay nada que cancelar, porque no hay tarjeta de por medio. Si
                  ya está pagando, se cancela desde su cuenta o escribiéndonos. No hay que llamar a
                  nadie.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Closing Call to Action */}
        <section className="seccion">
          <div className="caja" style={{ textAlign: 'center' }}>
            <h2 className="titular">Entonces, ¿en qué grado está su hijo?</h2>
            <p className="entrada" style={{ marginInline: 'auto' }}>
              17 días completos para probarlo con él. Si en esos 17 días no lo ve más suelto
              haciendo la tarea, lo deja ahí y no pasa nada. No hay tarjeta, no hay cobro, no hay que
              llamar a cancelar.
            </p>
            <div className="acciones" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primario" type="button" onClick={openAlta}>
                Quiero empezar con mi hijo
              </button>
              <a className="btn btn-fantasma" href={waHref} target="_blank" rel="noopener noreferrer">
                Preguntar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pie">
          <div className="caja">
            <p>
              Matemáticas de Fedor · Colombia ·{' '}
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                WhatsApp +57 310 719 9897
              </a>
            </p>
            <p style={{ marginTop: '6px' }}>
              Escríbanos si tiene dudas antes de empezar. Contesta una persona.
            </p>
          </div>
        </footer>
      </main>

      {/* Floating Change Grade Button */}
      <button
        className="flotante"
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIsHojaOpen(true)}
      >
        Cambiar de grado <span className="nro">{sel}°</span>
      </button>

      {/* Grade Selector Modal Sheet (#hoja) */}
      <div
        className="hoja"
        hidden={!isHojaOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hoja-t"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsHojaOpen(false);
        }}
      >
        <div className="hoja-panel">
          <div className="hoja-tope">
            <h3 id="hoja-t">¿En qué grado está su hijo?</h3>
            <button
              className="cerrar"
              type="button"
              aria-label="Cerrar"
              onClick={() => setIsHojaOpen(false)}
            >
              &times;
            </button>
          </div>

          <div className="rejilla" role="radiogroup" aria-labelledby="hoja-t">
            {GRADOS.map((item) => (
              <button
                key={item.g}
                type="button"
                className="mini"
                role="radio"
                aria-checked={item.g === sel}
                onClick={() => {
                  elegir(item.g, true);
                  setIsHojaOpen(false);
                  fichaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                <span className="n">{item.g}°</span>
                <span className="q">
                  {item.etapa === 'primaria' ? 'Primaria' : 'Bachillerato'}
                </span>
              </button>
            ))}
          </div>

          <p className="hoja-pie">Si se equivoca de grado, se lo cambiamos sin costo.</p>
        </div>
      </div>

      {/* 7-Day Free Trial Modal Sheet (#alta) */}
      <div
        className="hoja"
        hidden={!isAltaOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alta-t"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsAltaOpen(false);
        }}
      >
        <div className="hoja-panel">
          <div className="hoja-tope">
            <h3 id="alta-t">
              {isAvailable ? 'Active los 17 días gratis' : `Le avisamos cuando salga ${sel}°`}
            </h3>
            <button
              className="cerrar"
              type="button"
              aria-label="Cerrar"
              onClick={() => setIsAltaOpen(false)}
            >
              &times;
            </button>
          </div>

          <div id="alta-cuerpo">
            <p className="alta-grado">
              Grado <b>{sel}°</b> <span>· {currentGrado.etapa}</span>
            </p>

            {formSuccess ? (
              <div className="ok">
                <div className="tic" aria-hidden="true">
                  🎉
                </div>
                <h3>¡Listo, {formNombre.split(' ')[0]}!</h3>
                <p>
                  Hemos activado sus <b>17 días gratis</b> para el módulo de <b>Grado {sel}°</b>.
                  Le enviamos un correo a <b>{formCorreo}</b> con su clave de acceso para entrar de inmediato.
                </p>
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link
                    href={`/es/dashboard/mis-modulos`}
                    className="btn btn-primario"
                    style={{ width: '100%' }}
                  >
                    Ir a mis libros interactivos
                  </Link>
                  <a
                    href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
                      `Hola, acabo de activar mi prueba de 17 días para Grado ${sel}° (${formCorreo})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-fantasma"
                    style={{ width: '100%' }}
                  >
                    Escribir por WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form id="alta-form" noValidate onSubmit={handleAltaSubmit}>
                <label className="campo" htmlFor="c-nombre">
                  <span>Su nombre</span>
                  <input
                    id="c-nombre"
                    name="nombre"
                    type="text"
                    autoComplete="name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    required
                    disabled={isSubmitting}
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    placeholder="Ej. María Pérez"
                  />
                </label>

                <label className="campo" htmlFor="c-correo">
                  <span>Su correo</span>
                  <input
                    id="c-correo"
                    name="correo"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="off"
                    spellCheck="false"
                    enterKeyHint="go"
                    required
                    disabled={isSubmitting}
                    value={formCorreo}
                    onChange={(e) => setFormCorreo(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </label>

                <button
                  className="btn btn-primario"
                  type="submit"
                  style={{ width: '100%' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Activando 17 días...'
                    : (isAvailable ? 'Empezar la prueba gratis de 17 días' : `Notificarme cuando salga ${sel}°`)}
                </button>

                {formError && (
                  <p className="campo-error" id="alta-err" role="alert">
                    {formError}
                  </p>
                )}

                <p className="nota-btn" style={{ textAlign: 'center' }}>
                  No pedimos tarjeta. A los 17 días no se le cobra nada.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
