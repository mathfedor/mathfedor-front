export default function EstacionSvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4FD8CB" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#4FD8CB" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gVerde" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FE8A5" />
          <stop offset="1" stopColor="#3FAE5C" />
        </linearGradient>
        <linearGradient id="gRojo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF9A8C" />
          <stop offset="1" stopColor="#E04B38" />
        </linearGradient>
        <linearGradient id="gAzul" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BBDCFF" />
          <stop offset="1" stopColor="#5E9AD6" />
        </linearGradient>
        <linearGradient id="gDorado" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE3A1" />
          <stop offset="1" stopColor="#F0A92E" />
        </linearGradient>
        <linearGradient id="gPurpura" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9B2FF" />
          <stop offset="1" stopColor="#7A55E0" />
        </linearGradient>
        <linearGradient id="gRosa" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD7E0" />
          <stop offset="1" stopColor="#F08FB2" />
        </linearGradient>
        <linearGradient id="gTeal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9FF0E6" />
          <stop offset="1" stopColor="#2FB3A4" />
        </linearGradient>
        <linearGradient id="gNaranja" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC08A" />
          <stop offset="1" stopColor="#F07830" />
        </linearGradient>
        <linearGradient id="gBlanco" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D9E2F5" />
        </linearGradient>

        {/* Fedor Base y Caras */}
        <g id="fx-base">
          <ellipse cx="65" cy="142" rx="36" ry="6" fill="rgba(0,0,0,.35)" />
          <rect x="52" y="96" width="10" height="26" rx="5" fill="#8FA3D9" stroke="#070C1F" strokeWidth="4" />
          <rect x="68" y="96" width="10" height="26" rx="5" fill="#8FA3D9" stroke="#070C1F" strokeWidth="4" />
          <ellipse cx="57" cy="126" rx="10" ry="6" fill="#FF6B5E" stroke="#070C1F" strokeWidth="4" />
          <ellipse cx="73" cy="126" rx="10" ry="6" fill="#FF6B5E" stroke="#070C1F" strokeWidth="4" />
          <rect x="20" y="70" width="18" height="10" rx="5" fill="#8FA3D9" stroke="#070C1F" strokeWidth="4" />
          <rect x="92" y="70" width="18" height="10" rx="5" fill="#8FA3D9" stroke="#070C1F" strokeWidth="4" />
          <circle cx="18" cy="75" r="8" fill="#FFC94D" stroke="#070C1F" strokeWidth="4" />
          <circle cx="112" cy="75" r="8" fill="#FFC94D" stroke="#070C1F" strokeWidth="4" />
          <rect x="34" y="58" width="62" height="48" rx="18" fill="#FF8A5C" stroke="#070C1F" strokeWidth="4.5" />
          <rect x="50" y="70" width="30" height="22" rx="7" fill="#0F1836" stroke="#070C1F" strokeWidth="4" />
          <circle cx="58" cy="81" r="3" fill="#4FD8CB" />
          <rect x="66" y="76" width="10" height="4" rx="2" fill="#FFC94D" />
          <rect x="66" y="84" width="10" height="4" rx="2" fill="#FF6B5E" />
          <circle cx="65" cy="30" r="26" fill="#F2F6FF" stroke="#070C1F" strokeWidth="4.5" />
          <path d="M41 30 a24 24 0 0 1 48 0" fill="none" stroke="#C6D2F0" strokeWidth="3" />
          <rect x="46" y="18" width="38" height="26" rx="12" fill="#123047" stroke="#070C1F" strokeWidth="4" />
          <line x1="65" y1="4" x2="65" y2="-2" stroke="#070C1F" strokeWidth="4" />
          <circle cx="65" cy="-4" r="5" fill="#4FD8CB" stroke="#070C1F" strokeWidth="3.5" />
        </g>
        <g id="fx-feliz">
          <use href="#fx-base" />
          <circle cx="57" cy="30" r="3.6" fill="#4FD8CB" />
          <circle cx="73" cy="30" r="3.6" fill="#4FD8CB" />
          <path d="M56 38 Q65 43 74 38" fill="none" stroke="#4FD8CB" strokeWidth="3.4" strokeLinecap="round" />
        </g>
        <g id="fx-wow">
          <use href="#fx-base" />
          <circle cx="57" cy="30" r="4.6" fill="#FFC94D" />
          <circle cx="73" cy="30" r="4.6" fill="#FFC94D" />
          <circle cx="58.5" cy="28.5" r="1.5" fill="#123047" />
          <circle cx="74.5" cy="28.5" r="1.5" fill="#123047" />
          <ellipse cx="65" cy="39" rx="4.5" ry="5.5" fill="none" stroke="#FFC94D" strokeWidth="3.2" />
        </g>
        <g id="fx-triste">
          <use href="#fx-base" />
          <path d="M53 32 L61 28 M77 32 L69 28" stroke="#FF6B5E" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M56 41 Q65 36 74 41" fill="none" stroke="#FF6B5E" strokeWidth="3.4" strokeLinecap="round" />
        </g>

        {/* Iconos de Módulos */}
        <g id="m-mercado">
          <ellipse cx="32" cy="61" rx="22" ry="3" fill="rgba(7,12,31,.4)" />
          <rect x="7" y="13" width="30" height="18" rx="4" fill="url(#gVerde)" stroke="#070C1F" strokeWidth="3" transform="rotate(-10 22 22)" />
          <circle cx="22" cy="21" r="5.5" fill="#FFF4DC" opacity=".85" />
          <path d="M25 44 L50 44 L54 30 L24 30 Z" fill="url(#gRojo)" stroke="#070C1F" strokeWidth="3" />
          <path d="M13 24 L20 24 L25 44 M23 30 L55 30" fill="none" stroke="#070C1F" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="31" cy="34" rx="6" ry="2.6" fill="#fff" opacity=".4" />
          <circle cx="31" cy="53" r="5.5" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="3" />
          <circle cx="46" cy="53" r="5.5" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="3" />
          <circle cx="52" cy="13" r="9" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="3" />
          <text x="52" y="17.5" textAnchor="middle" fontFamily="Baloo 2" fontWeight="800" fontSize="11" fill="#070C1F">$</text>
          <ellipse cx="48.5" cy="9.5" rx="3" ry="2" fill="#fff" opacity=".6" />
        </g>
        <g id="m-planta">
          <ellipse cx="32" cy="61" rx="22" ry="3" fill="rgba(7,12,31,.4)" />
          <circle cx="52" cy="11" r="6.5" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="2.8" />
          <path d="M52 2 v-1 M52 21 v1 M43 11 h-1 M61 11 h1 M46 5 l-1-1 M58 17 l1 1 M58 5 l1-1 M46 17 l-1 1" stroke="#F0A92E" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M27 44 L27 22" stroke="#3FAE5C" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M27 32 Q13 30 11 16 Q25 18 27 32 Z" fill="url(#gVerde)" stroke="#070C1F" strokeWidth="3" />
          <path d="M27 26 Q41 24 43 10 Q29 12 27 26 Z" fill="url(#gVerde)" stroke="#070C1F" strokeWidth="3" />
          <path d="M13 44 L41 44 L37 60 L17 60 Z" fill="url(#gNaranja)" stroke="#070C1F" strokeWidth="3.4" />
          <rect x="11" y="42" width="32" height="7" rx="3.5" fill="url(#gNaranja)" stroke="#070C1F" strokeWidth="3" />
          <ellipse cx="20" cy="52" rx="3" ry="4.5" fill="#fff" opacity=".35" />
        </g>
        <g id="m-crono">
          <ellipse cx="32" cy="61" rx="22" ry="3" fill="rgba(7,12,31,.4)" />
          <circle cx="28" cy="34" r="21" fill="url(#gBlanco)" stroke="#070C1F" strokeWidth="3.4" />
          <circle cx="28" cy="34" r="14.5" fill="#fff" stroke="#B9C4E8" strokeWidth="2" />
          <rect x="23" y="5" width="10" height="7" rx="2.5" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="2.8" />
          <path d="M41 16 l5 -5" stroke="#070C1F" strokeWidth="3.4" strokeLinecap="round" />
          <line x1="28" y1="34" x2="28" y2="23" stroke="#E04B38" strokeWidth="3.4" strokeLinecap="round" />
          <line x1="28" y1="34" x2="36" y2="38" stroke="#070C1F" strokeWidth="3" strokeLinecap="round" />
          <circle cx="28" cy="34" r="2.4" fill="#070C1F" />
          <ellipse cx="21" cy="26" rx="4.5" ry="3" fill="#fff" opacity=".75" />
          <path d="M50 36 l4 9 h-9 Z" fill="#E04B38" stroke="#070C1F" strokeWidth="2.6" />
          <circle cx="50" cy="52" r="8" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="3" />
          <text x="50" y="56" textAnchor="middle" fontFamily="Baloo 2" fontWeight="800" fontSize="9.5" fill="#070C1F">1</text>
        </g>
        <g id="m-dado">
          <ellipse cx="32" cy="61" rx="22" ry="3" fill="rgba(7,12,31,.4)" />
          <rect x="5" y="18" width="28" height="28" rx="7" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="3.2" transform="rotate(-8 19 32)" />
          <g transform="rotate(-8 19 32)" fill="#070C1F"><circle cx="13" cy="26" r="3" /><circle cx="25" cy="38" r="3" /></g>
          <ellipse cx="12" cy="23" rx="4" ry="2.6" fill="#fff" opacity=".55" transform="rotate(-8 19 32)" />
          <rect x="29" y="24" width="28" height="28" rx="7" fill="url(#gTeal)" stroke="#070C1F" strokeWidth="3.2" transform="rotate(7 43 38)" />
          <g transform="rotate(7 43 38)" fill="#070C1F"><circle cx="36" cy="31" r="3" /><circle cx="43" cy="38" r="3" /><circle cx="50" cy="45" r="3" /></g>
          <circle cx="49" cy="11" r="7" fill="url(#gRojo)" stroke="#070C1F" strokeWidth="3" />
          <circle cx="47" cy="9" r="2.6" fill="#fff" opacity=".55" />
        </g>
        <g id="m-piramide">
          <ellipse cx="32" cy="61" rx="22" ry="3" fill="rgba(7,12,31,.4)" />
          <path d="M32 6 L58 50 L32 50 Z" fill="#5E9AD6" stroke="#070C1F" strokeWidth="3.2" />
          <path d="M32 6 L6 50 L32 50 Z" fill="url(#gAzul)" stroke="#070C1F" strokeWidth="3.2" />
          <path d="M19 33 h9 M14 42 h13" stroke="rgba(7,12,31,.35)" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="26" cy="20" rx="3.2" ry="6" fill="#fff" opacity=".4" transform="rotate(26 26 20)" />
          <rect x="43" y="51" width="11" height="11" rx="2.5" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="2.6" />
          <rect x="49" y="40" width="11" height="11" rx="2.5" fill="url(#gTeal)" stroke="#070C1F" strokeWidth="2.6" />
        </g>
        <g id="m-torta">
          <ellipse cx="32" cy="61" rx="22" ry="3" fill="rgba(7,12,31,.4)" />
          <path d="M10 38 L54 38 L50 58 L14 58 Z" fill="url(#gRosa)" stroke="#070C1F" strokeWidth="3.4" />
          <path d="M10 38 Q32 30 54 38 L54 43 Q32 35 10 43 Z" fill="#fff" stroke="#070C1F" strokeWidth="2.8" />
          <path d="M18 26 L46 26 L44 38 L20 38 Z" fill="url(#gRosa)" stroke="#070C1F" strokeWidth="3" />
          <path d="M18 26 Q32 20 46 26 L46 30 Q32 25 18 30 Z" fill="#fff" stroke="#070C1F" strokeWidth="2.6" />
          <rect x="30.5" y="10" width="3" height="10" rx="1.5" fill="#5E9AD6" stroke="#070C1F" strokeWidth="2" />
          <ellipse cx="32" cy="6.5" rx="2.6" ry="3.6" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="2" />
          <circle cx="20" cy="48" r="2.2" fill="#F08FB2" /><circle cx="31" cy="52" r="2.2" fill="#F08FB2" /><circle cx="43" cy="49" r="2.2" fill="#F08FB2" />
          <ellipse cx="18" cy="42" rx="4" ry="2.2" fill="#fff" opacity=".5" />
        </g>
        <g id="m-tele">
          <ellipse cx="32" cy="61" rx="22" ry="3" fill="rgba(7,12,31,.4)" />
          <path d="M7 6 l3 3 M60 4 l-2 2 M59 27 l3 1" stroke="#F2F6FF" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="11" cy="17" r="4" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="2.4" />
          <rect x="13" y="19" width="38" height="14" rx="7" fill="url(#gPurpura)" stroke="#070C1F" strokeWidth="3.2" transform="rotate(-16 32 26)" />
          <rect x="45" y="8" width="12" height="11" rx="4" fill="url(#gTeal)" stroke="#070C1F" strokeWidth="3" transform="rotate(-16 51 13)" />
          <ellipse cx="23" cy="21" rx="6" ry="2.4" fill="#fff" opacity=".45" transform="rotate(-16 23 21)" />
          <path d="M29 35 L19 58 M33 35 L43 58" stroke="#070C1F" strokeWidth="4" strokeLinecap="round" />
          <circle cx="31" cy="35" r="4" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="2.6" />
        </g>
        <g id="m-reloj">
          <ellipse cx="32" cy="61" rx="22" ry="3" fill="rgba(7,12,31,.4)" />
          <circle cx="18" cy="11" r="6" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="2.8" />
          <circle cx="46" cy="11" r="6" fill="url(#gDorado)" stroke="#070C1F" strokeWidth="2.8" />
          <circle cx="32" cy="34" r="22" fill="url(#gTeal)" stroke="#070C1F" strokeWidth="3.4" />
          <circle cx="32" cy="34" r="15.5" fill="#fff" stroke="#070C1F" strokeWidth="2.6" />
          <line x1="32" y1="34" x2="32" y2="24" stroke="#070C1F" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="32" y1="34" x2="40" y2="37" stroke="#E04B38" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="32" cy="34" r="2" fill="#070C1F" />
          <path d="M16 52 l-4 6 M48 52 l4 6" stroke="#070C1F" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="24" cy="25" rx="4.5" ry="3" fill="#fff" opacity=".65" />
        </g>

        {/* Catálogo Estelar */}
        <g id="pv-manzana">
          <circle cx="32" cy="36" r="17" fill="#FF6B5E" stroke="#070C1F" strokeWidth="3.5" />
          <path d="M32 20 Q30 12 36 8" fill="none" stroke="#5BD672" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="26" cy="31" rx="4" ry="6" fill="rgba(255,255,255,.4)" />
          <circle cx="44" cy="18" r="2" fill="#FFC94D" />
          <circle cx="14" cy="24" r="1.6" fill="#F2F6FF" />
        </g>
        <g id="pv-banano">
          <path d="M14 16 Q12 44 40 48 Q54 50 52 41 Q48 45 39 43 Q19 39 21 16 Q19 10 14 16Z" fill="#FFC94D" stroke="#070C1F" strokeWidth="3.5" />
          <path d="M46 12 L50 8 M52 18 L56 16" stroke="#4FD8CB" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g id="pv-galleta">
          <circle cx="32" cy="32" r="19" fill="#D9A25C" stroke="#070C1F" strokeWidth="3.5" />
          <circle cx="25" cy="27" r="2.6" fill="#6B4527" /><circle cx="38" cy="24" r="2.6" fill="#6B4527" /><circle cx="30" cy="38" r="2.6" fill="#6B4527" /><circle cx="41" cy="37" r="2.6" fill="#6B4527" />
          <path d="M12 14 L18 14 M15 11 L15 17" stroke="#9B7BFF" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g id="pv-jugo">
          <rect x="18" y="12" width="28" height="40" rx="5" fill="#9B7BFF" stroke="#070C1F" strokeWidth="3.5" />
          <rect x="18" y="12" width="28" height="11" rx="5" fill="#F2F6FF" stroke="#070C1F" strokeWidth="3.5" />
          <rect x="38" y="3" width="6" height="11" rx="2" fill="#FF6B5E" stroke="#070C1F" strokeWidth="3" />
          <circle cx="32" cy="37" r="8" fill="#C9B8FF" stroke="#070C1F" strokeWidth="3" />
          <circle cx="32" cy="37" r="3" fill="#F2F6FF" />
        </g>
        <g id="pv-pelota">
          <circle cx="32" cy="32" r="19" fill="#B9C4E8" stroke="#070C1F" strokeWidth="3.5" />
          <circle cx="24" cy="26" r="4" fill="#8FA3D9" stroke="#070C1F" strokeWidth="2.5" />
          <circle cx="40" cy="36" r="6" fill="#8FA3D9" stroke="#070C1F" strokeWidth="2.5" />
          <circle cx="34" cy="18" r="2.6" fill="#8FA3D9" stroke="#070C1F" strokeWidth="2.2" />
        </g>
        <g id="pv-robot">
          <rect x="20" y="24" width="24" height="22" rx="6" fill="#4FD8CB" stroke="#070C1F" strokeWidth="3.5" />
          <rect x="24" y="8" width="16" height="14" rx="5" fill="#F2F6FF" stroke="#070C1F" strokeWidth="3.5" />
          <circle cx="29" cy="15" r="2" fill="#070C1F" /><circle cx="35" cy="15" r="2" fill="#070C1F" />
          <line x1="32" y1="8" x2="32" y2="4" stroke="#070C1F" strokeWidth="3" />
          <circle cx="32" cy="3" r="2.4" fill="#FF6B5E" />
          <rect x="12" y="28" width="8" height="6" rx="3" fill="#FFC94D" stroke="#070C1F" strokeWidth="3" />
          <rect x="44" y="28" width="8" height="6" rx="3" fill="#FFC94D" stroke="#070C1F" strokeWidth="3" />
          <rect x="23" y="46" width="7" height="10" rx="3" fill="#8FA3D9" stroke="#070C1F" strokeWidth="3" />
          <rect x="34" y="46" width="7" height="10" rx="3" fill="#8FA3D9" stroke="#070C1F" strokeWidth="3" />
          <rect x="26" y="30" width="12" height="8" rx="2" fill="#0F1836" />
        </g>
        <g id="pv-carrito">
          <rect x="10" y="26" width="36" height="16" rx="8" fill="#FF6B5E" stroke="#070C1F" strokeWidth="3.5" />
          <path d="M18 26 Q22 16 32 16 Q40 16 42 26" fill="#9CCBFF" stroke="#070C1F" strokeWidth="3.5" />
          <circle cx="20" cy="46" r="6" fill="#123047" stroke="#070C1F" strokeWidth="3" />
          <circle cx="38" cy="46" r="6" fill="#123047" stroke="#070C1F" strokeWidth="3" />
          <path d="M46 32 L56 30 M46 36 L54 38" stroke="#FFC94D" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g id="pv-herramienta">
          <path d="M40 10 a12 12 0 1 0 10 18 L38 40 a6 6 0 0 1-8-8 L42 20 Z" fill="#8FA3D9" stroke="#070C1F" strokeWidth="3.5" transform="rotate(8 32 32)" />
          <rect x="14" y="36" width="14" height="16" rx="4" fill="#FFC94D" stroke="#070C1F" strokeWidth="3.5" transform="rotate(-24 21 44)" />
        </g>
        <g id="pv-casco">
          <circle cx="32" cy="30" r="20" fill="#F2F6FF" stroke="#070C1F" strokeWidth="3.5" />
          <rect x="18" y="20" width="28" height="20" rx="9" fill="#123047" stroke="#070C1F" strokeWidth="3.5" />
          <path d="M22 26 Q28 22 34 26" fill="none" stroke="#4FD8CB" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="24" y="48" width="16" height="7" rx="3.5" fill="#FF6B5E" stroke="#070C1F" strokeWidth="3" />
        </g>
        <g id="pv-telescopio">
          <rect x="8" y="22" width="34" height="12" rx="6" fill="#9B7BFF" stroke="#070C1F" strokeWidth="3.5" transform="rotate(-18 25 28)" />
          <rect x="38" y="12" width="12" height="10" rx="4" fill="#4FD8CB" stroke="#070C1F" strokeWidth="3.5" transform="rotate(-18 44 17)" />
          <path d="M24 36 L16 54 M26 36 L34 54" stroke="#070C1F" strokeWidth="4" strokeLinecap="round" />
          <circle cx="54" cy="8" r="2.4" fill="#FFC94D" />
        </g>
        <g id="pv-mochila">
          <rect x="18" y="14" width="28" height="36" rx="10" fill="#FF8A5C" stroke="#070C1F" strokeWidth="3.5" />
          <rect x="24" y="22" width="16" height="12" rx="4" fill="#123047" stroke="#070C1F" strokeWidth="3" />
          <path d="M22 52 Q18 62 26 60 M42 52 Q46 62 38 60" fill="none" stroke="#FFC94D" strokeWidth="4" strokeLinecap="round" />
          <path d="M26 60 L24 56 M38 60 L40 56" stroke="#FF6B5E" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g id="pv-dulce">
          <circle cx="32" cy="30" r="12" fill="#FF6B5E" stroke="#070C1F" strokeWidth="3.5" />
          <path d="M32 30 m-12 0 a12 12 0 0 1 24 0" fill="#FFC94D" stroke="#070C1F" strokeWidth="3.5" />
          <path d="M20 30 L8 22 L12 34 L8 42 L20 34 M44 30 L56 22 L52 34 L56 42 L44 34" fill="#9B7BFF" stroke="#070C1F" strokeWidth="3" strokeLinejoin="round" />
        </g>
        <g id="pv-planta">
          <path d="M32 52 L32 30" stroke="#5BD672" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 38 Q20 36 18 24 Q30 26 32 38 M32 32 Q44 30 46 18 Q34 20 32 32" fill="#5BD672" stroke="#070C1F" strokeWidth="3" />
          <path d="M22 52 L42 52 L40 60 L24 60Z" fill="#FF8A5C" stroke="#070C1F" strokeWidth="3.5" />
        </g>
      </defs>
    </svg>
  );
}
