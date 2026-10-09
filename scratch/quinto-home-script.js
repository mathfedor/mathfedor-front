Inicio pensado para niños de 10–12 años: héroe con rango y botón
      "Continuar", "Hoy en Fedor", Panel de comando con todas las
      herramientas, "Mis mundos" por unidad y zona de profes al final.
   No cambia ejercicios ni contenidos: solo presentación.
   ══════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function U(){ return (typeof UNITS!=='undefined') ? UNITS : []; }
function pctU(ui){ try{ return getUnitPct(ui); }catch(e){ return 0; } }
function bestU(ui){ try{ return getUnitBestPct(ui); }catch(e){ return 0; } }
function xpTot(){ try{ return totalXP||0; }catch(e){ return 0; } }
function hablar(t){ try{ if(typeof fedor5Hablar==='function') fedor5Hablar(t); }catch(e){} }
function tono(){ try{ if(typeof fedor5Tono==='function') fedor5Tono(); }catch(e){} }
function hex2rgba(h,a){ h=String(h||'#888888').replace('#',''); if(h.length===3) h=h.split('').map(function(c){return c+c;}).join(''); var n=parseInt(h,16); return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')'; }
function shade(hex, amt){
  if(!hex || hex[0]!=='#') return hex;
  var r=parseInt(hex.slice(1,3),16)||0, g=parseInt(hex.slice(3,5),16)||0, b=parseInt(hex.slice(5,7),16)||0;
  r=Math.max(0,Math.min(255,r+amt)); g=Math.max(0,Math.min(255,g+amt)); b=Math.max(0,Math.min(255,b+amt));
  return '#'+[r,g,b].map(function(x){ return x.toString(16).padStart(2,'0'); }).join('');
}

/* ═══════════════ DATOS: cuerpos celestes del libro de 4° ═══════════════ */
var BODIES = [{"id":"tierra","type":"mission","category":"🪐 PLANETA","name":"🌍 La Tierra","icon":"🌍","color":"#1A6CB4","glow":"#4DA6FF","ring":false,"desc":"","facts":["🌊 71% es agua, por eso se ve azul","🌀 Gira una vuelta cada 24 horas","🌡️ Temperatura promedio: 15°C","🌙 Tiene 1 satélite: la Luna","👥 Habitantes: 8 mil millones"],"distance":"0 km · Tu hogar"},{"id":"luna","type":"moon","category":"🌙 SATÉLITE NATURAL","name":"🌙 La Luna","icon":"🌙","color":"#9B9B9B","glow":"#E5E5E5","ring":false,"desc":"La Luna te da la bienvenida. Aquí los astronautas descansan antes del gran salto cósmico.","facts":["👨‍🚀 12 humanos han caminado en ella","📏 Diámetro: 3.474 km","⏱️ Sin atmósfera ni viento","🌖 Tiene fases: nueva, creciente, llena"],"distance":"384.400 km de la Tierra"},{"id":"mercurio","type":"planet","category":"🪐 PLANETA ROCOSO","name":"☿ Mercurio","icon":"🟤","color":"#9B7A4F","glow":"#E0B07A","ring":false,"desc":"Mercurio es el planeta más pequeño y el más cercano al Sol. Su día dura 59 días terrestres.","facts":["🔥 Día: 430°C · Noche: -180°C","⚡ Año dura solo 88 días","🌑 Sin lunas, sin atmósfera","📏 Es el planeta más pequeño"],"distance":"77 millones km de la Tierra"},{"id":"venus","type":"planet","category":"🪐 PLANETA ROCOSO","name":"♀ Venus","icon":"🟡","color":"#D4AC2A","glow":"#FFD96A","ring":false,"desc":"Venus brilla más que cualquier estrella en el cielo. Es el planeta más caliente del sistema solar.","facts":["🌡️ Temperatura: 462°C (¡extremo!)","☁️ Atmósfera de dióxido de carbono","🔄 Gira al revés que los demás","✨ Visible al amanecer y atardecer"],"distance":"41 millones km de la Tierra"},{"id":"marte","type":"mission","category":"🪐 PLANETA","name":"🔴 Marte","icon":"🔴","color":"#C94B22","glow":"#FF6B3B","ring":false,"desc":"","facts":["🟥 Color por el óxido de hierro","🏔️ Tiene el volcán más alto: Olimpo","🌪️ Tormentas de polvo gigantes","🛰️ La NASA tiene robots explorando","🌗 Tiene 2 lunas: Fobos y Deimos"],"distance":"225 millones km de la Tierra"},{"id":"sirio","type":"star","category":"⭐ ESTRELLA","name":"⭐ Sirio","icon":"⭐","color":"#FFD700","glow":"#FFF4A8","ring":false,"desc":"Sirio es la estrella más brillante del cielo nocturno desde la Tierra.","facts":["✨ La estrella más brillante del cielo","🌟 Es 2 veces más grande que el Sol","👯 En realidad son 2 estrellas juntas","🌡️ Su superficie: 9.940°C"],"distance":"8,6 años luz de la Tierra"},{"id":"asteroides1","type":"asteroid","category":"🪨 ASTEROIDE","name":"🪨 Ceres","icon":"🪨","color":"#A0A0A0","glow":"#D5D5D5","ring":false,"desc":"Ceres es el objeto más grande del cinturón de asteroides. Es considerado planeta enano.","facts":["💎 Es el asteroide más grande","🧊 Tiene agua congelada en su superficie","📅 Descubierto en 1801"],"distance":"Cinturón principal"},{"id":"asteroides2","type":"asteroid","category":"🪨 ASTEROIDE","name":"🪨 Vesta","icon":"🪨","color":"#A0A0A0","glow":"#D5D5D5","ring":false,"desc":"Vesta es el segundo asteroide más grande del cinturón. Es muy brillante.","facts":["🌟 Es el asteroide más brillante","🌑 Su superficie tiene cráteres","📐 Diámetro: 525 km"],"distance":"Cinturón principal"},{"id":"asteroides3","type":"asteroid","category":"🪨 ASTEROIDE","name":"🪨 Pallas","icon":"🪨","color":"#A0A0A0","glow":"#D5D5D5","ring":false,"desc":"Pallas tiene una forma muy irregular. Es el tercer asteroide más grande.","facts":["🔶 Forma irregular","🌌 Órbita muy inclinada","📅 Descubierto en 1802"],"distance":"Cinturón principal"},{"id":"jupiter","type":"planet","category":"🪐 GIGANTE GASEOSO","name":"🟠 Júpiter","icon":"🟠","color":"#D8853A","glow":"#FFB870","ring":false,"desc":"Júpiter es el planeta más grande del sistema solar. Su gran mancha roja es una tormenta de siglos.","facts":["👑 El planeta MÁS GRANDE","🌪️ Mancha roja: tormenta de 350 años","🌙 Tiene 95 lunas conocidas","⚡ Cabrían 1300 Tierras dentro","🪐 Sus 4 lunas grandes son visibles con telescopio"],"distance":"628 millones km de la Tierra"},{"id":"saturno","type":"mission","category":"🪐 GIGANTE","name":"🪐 Saturno","icon":"🪐","color":"#B8860B","glow":"#F5C518","ring":true,"desc":"","facts":["💍 Anillos de hielo y rocas","🌙 Tiene 146 lunas (¡muchísimas!)","🎈 Flotaría en agua: es muy ligero","⚡ Vientos de 1.800 km/h","📏 Es el 2° planeta más grande"],"distance":"1.275 millones km de la Tierra"},{"id":"halley","type":"comet","category":"☄️ COMETA","name":"☄️ Cometa Halley","icon":"☄️","color":"#A8E8FF","glow":"#E0F4FF","ring":false,"desc":"El cometa Halley pasa cerca de la Tierra cada 76 años. ¡Es el más famoso de todos!","facts":["🔁 Pasa cada 76 años","👀 Próxima visita: 2061","📏 Núcleo de 15 km de largo","🚀 Nombrado por Edmond Halley en 1705"],"distance":"Variable según su órbita"},{"id":"neptuno","type":"mission","category":"🪐 GIGANTE HELADO","name":"🔵 Neptuno","icon":"🔵","color":"#1A4CB4","glow":"#4D8AFF","ring":false,"desc":"","facts":["💨 Vientos de 2.100 km/h (los más rápidos)","❄️ Temperatura: -218°C","🌑 Tiene 14 lunas","👁️ Se ve azul intenso por el metano","📅 Año dura 165 años terrestres"],"distance":"4.350 millones km de la Tierra"},{"id":"urano","type":"planet","category":"🪐 GIGANTE HELADO","name":"🔷 Urano","icon":"🔷","color":"#5FBEC8","glow":"#A8E8F0","ring":false,"desc":"Urano rueda de lado como una pelota. Es muy frío y su color azul viene del metano.","facts":["🎳 Gira de lado, como rodando","❄️ Temperatura: -224°C","💎 Lluvia de diamantes en su interior","🌙 Tiene 27 lunas","🔵 Color azul por el metano"],"distance":"2.720 millones km de la Tierra"},{"id":"pluton","type":"planet","category":"🪐 PLANETA ENANO","name":"🟣 Plutón","icon":"🟣","color":"#8B5A2B","glow":"#C89060","ring":false,"desc":"Plutón ya no es planeta oficial desde 2006, pero sigue siendo un mundo helado fascinante.","facts":["⚠️ Reclasificado como planeta enano en 2006","🧊 Temperatura: -229°C","🌙 Tiene 5 lunas","📅 Año: 248 años terrestres","🚀 La sonda New Horizons lo visitó en 2015"],"distance":"5.900 millones km de la Tierra"},{"id":"nebulosa","type":"nebula","category":"🌌 NEBULOSA","name":"🌌 Nebulosa de Orión","icon":"🌌","color":"#9B5CFF","glow":"#D4A8FF","ring":false,"desc":"Una nebulosa es donde NACEN las estrellas. Es una nube gigante de polvo y gas cósmico.","facts":["⭐ Es la guardería de estrellas más cercana","📏 Mide 24 años luz de ancho","🔭 Visible a simple vista en la constelación de Orión","🎨 Colores naranja, rosa y azul"],"distance":"1.344 años luz"},{"id":"sol","type":"mission","category":"☀️ ESTRELLA","name":"☀️ El Sol","icon":"☀️","color":"#E8650A","glow":"#FFD700","ring":false,"desc":"","facts":["🔥 Temperatura superficie: 5.500°C","⚡ Núcleo: 15 millones °C","📏 Cabrían 1.3 millones de Tierras dentro","🌍 Da luz y calor a TODOS los planetas","💫 Es una estrella mediana, hay millones más grandes"],"distance":"149.600.000 km de la Tierra"}];
var POS = {
  tierra:{x:50,y:6,size:110}, luna:{x:74,y:9,size:55}, mercurio:{x:14,y:14,size:62}, venus:{x:33,y:19,size:74},
  marte:{x:18,y:30,size:100}, sirio:{x:82,y:30,size:78}, asteroides1:{x:36,y:40,size:52}, asteroides2:{x:52,y:44,size:38},
  asteroides3:{x:68,y:40,size:50}, jupiter:{x:18,y:52,size:115}, saturno:{x:52,y:55,size:120}, halley:{x:84,y:55,size:58},
  neptuno:{x:22,y:68,size:104}, urano:{x:52,y:71,size:80}, pluton:{x:82,y:72,size:56}, nebulosa:{x:30,y:85,size:130}, sol:{x:68,y:91,size:160}
};
/* Orden de la ruta de misiones (de abajo hacia arriba) */
var RUTA = ['tierra','mercurio','venus','marte','sirio','asteroides1','asteroides3','jupiter','saturno','halley','neptuno','urano','pluton','nebulosa','sol'];

/* Agrupa las unidades del libro por su número ("Unidad 1 — …") */
function grupos(){
  var g = [], idx = {};
  U().forEach(function(u, ui){
    var m = String(u.name||'').match(/Unidad\s+(\d+)/i), n = m ? +m[1] : (ui+1);
    if(idx[n]===undefined){ idx[n] = g.length; g.push({n:n, uis:[], titulos:[], intros:[]}); }
    var G = g[idx[n]];
    G.uis.push(ui);
    var parte = String(u.name||'').split('—').pop().trim();
    var tit = parte.split('·')[0].trim(), sub = parte.indexOf('·')>=0 ? parte.split('·').pop().trim() : parte;
    G.base = G.base || tit; G.titulos.push(sub);
    if(u.intro) G.intros.push(u.intro);
  });
  g.sort(function(a,b){ return a.n-b.n; });
  g.forEach(function(G){
    G.titulo = G.uis.length > 2 ? G.base : G.titulos.join(' y ');
    G.icon = U()[G.uis[0]].icon || '📘';
  });
  return g;
}
function pctGrupo(G){ var s=0; G.uis.forEach(function(ui){ s+=pctU(ui); }); return Math.round(s/G.uis.length); }
function bestGrupo(G){ var s=0; G.uis.forEach(function(ui){ s+=bestU(ui); }); return Math.round(s/G.uis.length); }
function estrellas(p){ return p>=95?5:p>=80?4:p>=65?3:p>=50?2:p>0?1:0; }

var MUNDO = null;   // cuerpos + misiones
function construir(){
  var G = grupos(), porId = {};
  BODIES.forEach(function(b){ porId[b.id] = b; b.mision = null; });
  G.forEach(function(g, i){
    var id = RUTA[i]; if(!id || !porId[id]) return;
    var b = porId[id];
    b.mision = g; g.body = b; g.num = i+1;
  });
  MUNDO = {grupos:G, cuerpos:BODIES};
  return MUNDO;
}
function misionActual(){
  var G = MUNDO.grupos;
  for(var i=0;i<G.length;i++) if(pctGrupo(G[i]) < 100) return G[i];
  return null;
}

/* ═══════════════ CSS ═══════════════ */
var CSS = [
/* — Universo (del libro de 4°) — */
'#galaxyModal.f5u{background:radial-gradient(ellipse at top,#1A0A42 0%,#0A0420 50%,#020108 100%)!important;touch-action:auto!important}',
'#uStars .ustar{position:absolute;background:#fff;border-radius:50%;animation:utwink 2s ease-in-out infinite alternate}',
'#uSceneStars .ss{position:absolute;border-radius:50%;background:#fff;animation:utwink 2.5s ease-in-out infinite}',
'.gfilter-chip{background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.18);color:rgba(255,255,255,.8);border-radius:14px;padding:6px 13px;font-size:12px;font-weight:900;cursor:pointer;white-space:nowrap;font-family:Nunito,sans-serif;transition:all .2s}',
'.gfilter-chip:hover{background:rgba(255,255,255,.18);color:#fff;transform:translateY(-1px)}',
'.gfilter-chip.active{background:linear-gradient(135deg,#FFE066,#FF8C2A);color:#2A0F60;border-color:#FFE066;box-shadow:0 4px 14px rgba(255,140,42,.45)}',
'@keyframes ubodyFloat{0%,100%{transform:translate(-50%,50%) translateY(0)}50%{transform:translate(-50%,50%) translateY(-8px)}}',
'@keyframes uorbRot{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}',
'@keyframes uringPulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.6}50%{transform:translate(-50%,-50%) scale(1.12);opacity:.95}}',
'@keyframes utwink{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}',
'@keyframes ucometTail{0%,100%{opacity:.7;transform:rotate(-30deg) scaleX(1)}50%{opacity:1;transform:rotate(-30deg) scaleX(1.2)}}',
'@keyframes uflashHint{0%,100%{opacity:.4;transform:translate(-50%,0) translateY(0)}50%{opacity:1;transform:translate(-50%,0) translateY(-4px)}}',
'@keyframes f5pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,224,102,.7)}70%{box-shadow:0 0 0 14px rgba(255,224,102,0)}}',
'.ubody{position:absolute;transform:translate(-50%,50%);cursor:pointer;z-index:5;transition:filter .25s ease;animation:ubodyFloat 4s ease-in-out infinite}',
'.ubody:hover{filter:brightness(1.15);z-index:8}',
'.uorb{width:var(--size,80px);height:var(--size,80px);border-radius:50%;background:radial-gradient(circle at 32% 28%,var(--g-1),var(--g-2) 55%,var(--g-3) 100%);box-shadow:0 0 40px var(--g-glow),inset -8px -10px 24px rgba(0,0,0,.45),inset 6px 6px 16px rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:calc(var(--size,80px)*.5);position:relative;overflow:hidden;z-index:3}',
'.uorb::before{content:"";position:absolute;top:8%;left:18%;width:30%;height:22%;border-radius:50%;background:radial-gradient(ellipse,rgba(255,255,255,.55),transparent 70%);transform:rotate(-25deg);pointer-events:none}',
'.uorb .uemoji{filter:drop-shadow(0 2px 6px rgba(0,0,0,.4));position:relative;z-index:2}',
'.uhalo{position:absolute;left:50%;top:50%;width:calc(var(--size,80px)*1.5);height:calc(var(--size,80px)*1.5);border-radius:50%;background:radial-gradient(circle,var(--g-glow) 0%,transparent 55%);opacity:.5;animation:uringPulse 2.6s ease-in-out infinite;pointer-events:none;z-index:2}',
'.uring{position:absolute;left:50%;top:50%;width:calc(var(--size,80px)*1.85);height:calc(var(--size,80px)*1.85);border-radius:50%;border:2px dashed rgba(255,224,102,.6);transform:translate(-50%,-50%);animation:uorbRot 22s linear infinite;pointer-events:none;z-index:1}',
'.usaturn-rings{position:absolute;left:50%;top:50%;width:calc(var(--size,80px)*1.95);height:calc(var(--size,80px)*.55);background:linear-gradient(180deg,transparent 20%,rgba(245,197,24,.55) 30%,rgba(245,197,24,.85) 50%,rgba(245,197,24,.55) 70%,transparent 80%);border-radius:50%;transform:translate(-50%,-50%) rotate(-15deg);box-shadow:0 0 24px rgba(245,197,24,.55);pointer-events:none;z-index:4}',
'.ucomet-tail{position:absolute;left:50%;top:50%;width:calc(var(--size,80px)*2.6);height:14px;background:linear-gradient(90deg,var(--g-glow),transparent);transform-origin:0 50%;transform:rotate(-30deg);border-radius:50% 0 0 50%;filter:blur(3px);opacity:.85;animation:ucometTail 2.2s ease-in-out infinite;pointer-events:none;z-index:1}',
'.ustar-rays{position:absolute;left:50%;top:50%;width:calc(var(--size,80px)*2.3);height:calc(var(--size,80px)*2.3);transform:translate(-50%,-50%);background:repeating-conic-gradient(from 0deg,rgba(255,224,102,.4) 0deg 8deg,transparent 8deg 30deg);border-radius:50%;animation:uorbRot 18s linear infinite;pointer-events:none;z-index:1;filter:blur(2px)}',
'.unebula{background:radial-gradient(ellipse,rgba(155,92,255,.7) 0%,rgba(212,168,255,.4) 30%,rgba(108,40,180,.2) 60%,transparent 80%)!important;filter:blur(1px);box-shadow:none!important}',
'.unebula::before{display:none}',
'.uasteroid{border-radius:42% 58% 50% 50%/48% 42% 55% 52%}',
'.ulabel{position:absolute;left:50%;top:calc(100% + 12px);transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:3px;white-space:nowrap;pointer-events:none;z-index:6}',
'.ulabel-name{background:rgba(10,5,30,.88);color:#fff;font-weight:900;font-size:13px;padding:4px 11px;border-radius:11px;border:1.5px solid var(--label-border,rgba(255,255,255,.25));box-shadow:0 4px 10px rgba(0,0,0,.4);font-family:Nunito,sans-serif}',
'.ulabel-cat{background:var(--label-cat-bg,#C5BFEE);color:#1A1033;font-weight:900;font-size:9px;padding:2px 8px;border-radius:8px;letter-spacing:.04em;font-family:Nunito,sans-serif}',
'.ulabel-pct{background:#16876A;color:#fff;font-weight:900;font-size:10px;padding:1px 8px;border-radius:8px;font-family:Nunito,sans-serif}',
'.umission-num{position:absolute;top:-16px;right:-10px;width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#FFE066,#FF8C2A);border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-family:"Baloo 2",sans-serif;font-size:17px;font-weight:900;color:#3D1468;box-shadow:0 6px 16px rgba(232,101,10,.55);z-index:9}',
'.umission-num.ok{background:linear-gradient(135deg,#6EE7B7,#16876A);color:#fff}',
'.uhint-tap{position:absolute;left:50%;top:-40px;transform:translateX(-50%);font-size:30px;pointer-events:none;animation:uflashHint 1.3s ease-in-out infinite;z-index:10}',
'#gPlanetPanel.f5p{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}',
'.f5sub{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#F8F5FF;border:2px solid #E8DBFF;border-radius:14px;cursor:pointer;font-family:Nunito,sans-serif;width:100%;text-align:left;margin-bottom:6px;transition:transform .15s}',
'.f5sub:hover{transform:translateX(4px);border-color:#8B3EDB}',
/* — Inicio infantil — */
'#screen-home .f5sec{font-family:"Baloo 2",Nunito,sans-serif;font-size:19px;font-weight:900;color:#3D1468;margin:1.1rem .2rem .55rem;display:flex;align-items:center;gap:8px}',
'#screen-home .f5sec small{font-family:Nunito,sans-serif;font-size:12px;font-weight:800;color:#7A7299}',
'.f5hero-x{position:relative;z-index:2;max-width:520px;margin:.6rem auto 0;display:flex;flex-direction:column;gap:10px}',
'.f5rank{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.22);border-radius:16px;padding:8px 12px}',
'.f5rank b{font-family:"Baloo 2",sans-serif;font-size:15px;color:#FFE066;white-space:nowrap}',
'.f5bar{flex:1;height:12px;background:rgba(0,0,0,.35);border-radius:8px;overflow:hidden}',
'.f5bar>i{display:block;height:100%;background:linear-gradient(90deg,#FFE066,#FF8C2A);border-radius:8px;transition:width 1s}',
'.f5chips{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}',
'.f5chip{background:rgba(255,255,255,.14);border:1.5px solid rgba(255,255,255,.25);color:#fff;border-radius:14px;padding:5px 12px;font-weight:900;font-size:14px;font-family:Nunito,sans-serif}',
'.f5go{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px 16px;border:none;border-radius:20px;cursor:pointer;background:linear-gradient(135deg,#FFE066,#FF8C2A);color:#2A0F60;font-family:"Baloo 2",sans-serif;font-size:19px;font-weight:900;box-shadow:0 8px 24px rgba(255,140,42,.45);animation:f5pulse 2.2s infinite}',
'.f5go small{display:block;font-family:Nunito,sans-serif;font-size:12px;font-weight:800;color:#5C2A00}',
'.f5hoy{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}',
'.f5hoy>*{margin:0!important;height:100%;border-radius:18px!important}',
'.f5tile{display:flex;align-items:center;gap:10px;padding:14px;border-radius:18px;border:none;cursor:pointer;color:#fff;font-family:Nunito,sans-serif;text-align:left;box-shadow:0 8px 20px rgba(40,10,90,.18);transition:transform .15s}',
'.f5tile:hover{transform:translateY(-3px)}',
'.f5tile .i{font-size:30px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.25))}',
'.f5tile b{display:block;font-family:"Baloo 2",sans-serif;font-size:15px;line-height:1.1}',
'.f5tile small{font-size:11px;font-weight:800;opacity:.9}',
'.f5cmd{background:linear-gradient(160deg,#2A0F60,#3D1468 60%,#5C21A6);border-radius:22px;padding:14px;box-shadow:0 12px 30px rgba(40,10,90,.3)}',
'.f5cmd h4{color:#FFE066;font-family:"Baloo 2",sans-serif;font-size:13px;letter-spacing:.08em;margin:10px 4px 8px;text-transform:uppercase}',
'.f5cmd h4:first-child{margin-top:0}',
'.f5grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}',
'.f5btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:84px;padding:8px 6px;border-radius:16px;border:2px solid rgba(255,255,255,.18);cursor:pointer;color:#fff;font-family:Nunito,sans-serif;font-weight:900;font-size:12px;line-height:1.15;text-align:center;transition:transform .15s,box-shadow .15s}',
'.f5btn:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 8px 18px rgba(0,0,0,.3)}',
'.f5btn span:first-child{font-size:30px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))}',
'.f5mundos{display:grid;grid-template-columns:1fr;gap:14px;align-items:start}',
'body.f5uopen #p3Fab,body.f5uopen #p3Popup,body.f5uopen #f5Ajustes,body.f5uopen #f5VerStamp{display:none!important}',
'@media(min-width:720px){.f5mundos{grid-template-columns:1fr 1fr}}',
'.f5m{position:relative;background:#FFFFFF;border-radius:22px;overflow:visible;box-shadow:0 10px 26px rgba(40,10,90,.14);border:2.5px solid transparent;transition:transform .15s}',
'.f5m:hover{transform:translateY(-3px)}',
'.f5m.now{border-color:#FFB020;animation:f5pulse 2.4s infinite}',
'.f5m-top{position:relative;border-radius:20px 20px 0 0;padding:14px 14px 14px 104px;min-height:92px;color:#fff;overflow:hidden}',
'.f5m-top::after{content:"";position:absolute;inset:0;background-image:radial-gradient(circle at 20% 30%,rgba(255,255,255,.6) 1px,transparent 1.5px),radial-gradient(circle at 70% 60%,rgba(255,255,255,.5) 1px,transparent 1.5px),radial-gradient(circle at 90% 20%,rgba(255,255,255,.7) 1px,transparent 1.5px);background-size:120px 120px,90px 90px,150px 150px;opacity:.6;pointer-events:none}',
'.f5m-orb{position:absolute;left:14px;top:12px;width:76px;height:76px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:36px;box-shadow:0 0 24px var(--gl),inset -6px -8px 18px rgba(0,0,0,.4),inset 5px 5px 12px rgba(255,255,255,.25);z-index:2}',
'.f5m-num{position:absolute;left:66px;top:6px;width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#FFE066,#FF8C2A);border:3px solid #fff;color:#3D1468;font-family:"Baloo 2",sans-serif;font-weight:900;font-size:15px;display:flex;align-items:center;justify-content:center;z-index:3}',
'.f5m-kick{font-size:10px;font-weight:900;letter-spacing:.1em;opacity:.9;text-transform:uppercase;position:relative;z-index:2}',
'.f5m-title{font-family:"Baloo 2",sans-serif;font-size:21px;font-weight:900;line-height:1.1;margin:2px 0 6px;position:relative;z-index:2;text-shadow:0 2px 8px rgba(0,0,0,.35);padding-right:58px}',
'.f5m-stars{font-size:13px;letter-spacing:1px;position:relative;z-index:2}',
'.f5m-pct{position:absolute;right:12px;top:12px;background:rgba(0,0,0,.35);border-radius:14px;padding:4px 10px;font-family:"Baloo 2",sans-serif;font-weight:900;font-size:17px;z-index:2}',
'.f5m-now{position:absolute;right:12px;bottom:10px;background:#FFE066;color:#3D1468;border-radius:12px;padding:3px 10px;font-weight:900;font-size:11px;z-index:2}',
'.f5m-body{padding:12px 14px 14px}',
'.f5m-row{display:flex;align-items:center;gap:10px;width:100%;padding:9px 10px;margin-bottom:6px;border-radius:14px;border:2px solid #EEE8FB;background:#FBF9FF;cursor:pointer;font-family:Nunito,sans-serif;text-align:left;transition:all .15s}',
'.f5m-row:hover{border-color:#8B3EDB;background:#F3ECFF;transform:translateX(3px)}',
'.f5m-row .ic{font-size:22px;width:30px;text-align:center}',
'.f5m-row .tx{flex:1;min-width:0}',
'.f5m-row .tx b{display:block;font-size:14px;color:#1A1033;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
'.f5m-row .tx small{font-size:11px;color:#6B5E8A;font-weight:700}',
'.f5m-mini{height:7px;background:#E8DBFF;border-radius:4px;overflow:hidden;margin-top:4px}',
'.f5m-mini>i{display:block;height:100%;border-radius:4px}',
'.f5m-go{font-family:"Baloo 2",sans-serif;font-weight:900;font-size:13px;color:#fff;background:linear-gradient(135deg,#5C21A6,#8B3EDB);border-radius:12px;padding:6px 12px;white-space:nowrap}',
'.f5m-temas{display:flex;flex-wrap:wrap;gap:5px;margin:2px 0 10px}',
'.f5m-temas span{background:#F3ECFF;color:#3D1468;border-radius:10px;padding:3px 9px;font-size:11px;font-weight:800}',
'.f5adult{margin-top:1.2rem;background:#F7F4FF;border:2px dashed #C5BFEE;border-radius:18px;padding:10px 12px}',
'.f5adult>summary{cursor:pointer;font-family:"Baloo 2",sans-serif;font-size:16px;font-weight:900;color:#3D1468;list-style:none;display:flex;align-items:center;gap:8px}',
'.f5adult>summary::-webkit-details-marker{display:none}',
'.f5adult[open]>summary{margin-bottom:10px}',
'.f5hide{display:none!important}',
'#f5U3btnMap{display:none!important}',
'@media(max-width:560px){.f5hoy{grid-template-columns:1fr}.f5m-title{font-size:18px}.f5go{font-size:17px}.f5m-body{padding:10px}.f5m-row{gap:6px;padding:8px}.f5m-row .tx b{white-space:normal;font-size:13px}.f5m-go{font-size:12px;padding:5px 8px}.f5m-top{padding-left:96px}.f5m-kick{font-size:9px}}'
].join('\n');
(function(){ var st=document.createElement('style'); st.id='f5H'; st.textContent=CSS; document.head.appendChild(st); })();

/* ═══════════════ 1. UNIVERSO FEDOR (escena del 4°) ═══════════════ */
var filtro = 'all';
function montarUniverso(){
  var m = $('galaxyModal'); if(!m || m.getAttribute('data-f5')==='1') return;
  m.setAttribute('data-f5','1'); m.classList.add('f5u');
  m.innerHTML =
    '<div id="uStars" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0"></div>'
  + '<div style="position:absolute;top:0;left:0;right:0;z-index:30;background:linear-gradient(180deg,rgba(0,0,20,.95) 75%,rgba(0,0,20,.6) 95%,transparent);padding:12px 16px 26px;display:flex;align-items:center;justify-content:space-between;gap:10px">'
  +   '<button onclick="closeGalaxyMap()" style="background:linear-gradient(135deg,#FF8C2A,#E8650A);border:2.5px solid #fff;color:#fff;border-radius:26px;padding:11px 20px;font-size:16px;font-weight:900;cursor:pointer;display:flex;align-items:center;gap:8px;box-shadow:0 6px 22px rgba(232,101,10,.6);font-family:Nunito,sans-serif"><span style="font-size:22px">🏠</span><span>VOLVER</span></button>'
  +   '<div style="flex:1;text-align:center"><div style="font-size:12px;font-weight:900;color:#FFE066;text-transform:uppercase;letter-spacing:.16em;font-family:\'Baloo 2\',sans-serif">🌌 Universo Fedor</div>'
  +   '<div id="f5uSub" style="font-size:13px;font-weight:800;color:rgba(255,255,255,.78);margin-top:2px">Explora 17 cuerpos celestes</div></div>'
  +   '<div style="text-align:center;background:linear-gradient(135deg,rgba(245,197,24,.25),rgba(255,140,42,.15));border-radius:14px;padding:6px 14px;border:2px solid rgba(245,197,24,.5);min-width:60px"><div id="gHudXP" style="font-size:20px;font-weight:900;color:#FFE066;font-family:\'Baloo 2\',sans-serif;line-height:1">0</div><div style="font-size:11px;color:rgba(255,224,102,.85);font-weight:800">XP</div></div>'
  + '</div>'
  + '<div style="position:absolute;top:84px;left:0;right:0;z-index:25;padding:0 14px;overflow-x:auto"><div id="gFilterChips" style="display:flex;gap:8px;justify-content:center;min-width:max-content;padding:4px 6px">'
  +   [['all','🌌 Todos'],['mission','⭐ Misiones'],['planet','🪐 Planetas'],['asteroid','🪨 Asteroides'],['star','⭐ Estrellas'],['comet','☄️ Cometas'],['nebula','🌌 Nebulosas']].map(function(f){
        return '<button class="gfilter-chip'+(f[0]==='all'?' active':'')+'" data-filter="'+f[0]+'" onclick="f5uFiltro(\''+f[0]+'\')">'+f[1]+'</button>'; }).join('')
  + '</div></div>'
  + '<div id="universeScroll" style="position:absolute;top:132px;left:0;right:0;bottom:0;overflow-y:auto;overflow-x:hidden;z-index:10">'
  +   '<div style="text-align:center;color:#fff;padding:8px 14px 0"><div style="font-family:\'Baloo 2\',sans-serif;font-size:23px;color:#FFE066;font-weight:900;text-shadow:0 0 30px rgba(245,197,24,.5)">🚀 Tu viaje cósmico · 5°</div>'
  +   '<div style="font-size:13px;color:rgba(255,255,255,.75);font-weight:700;margin-top:3px">Toca cualquier planeta · Sigue la ruta dorada: cada misión es una unidad del libro</div></div>'
  +   '<div id="universeScene" style="position:relative;width:100%;max-width:780px;margin:14px auto;height:1620px;background:radial-gradient(ellipse at 30% 20%,rgba(155,92,255,.18),transparent 55%),radial-gradient(ellipse at 80% 70%,rgba(36,196,150,.12),transparent 55%),radial-gradient(ellipse at 50% 90%,rgba(26,108,180,.15),transparent 55%);border-radius:32px;overflow:hidden;box-shadow:inset 0 0 80px rgba(0,0,0,.6)">'
  +     '<div id="uSceneStars" style="position:absolute;inset:0;pointer-events:none;z-index:1"></div>'
  +     '<svg width="100%" height="100%" style="position:absolute;inset:0;pointer-events:none;z-index:2" viewBox="0 0 100 100" preserveAspectRatio="none">'
  +       '<path id="f5uPathAll" d="" stroke="rgba(255,224,102,.55)" stroke-width="0.35" stroke-dasharray="1.4 1.2" fill="none"/>'
  +       '<path id="f5uPathDone" d="" stroke="#6EE7B7" stroke-width="0.6" fill="none"/></svg>'
  +     '<div id="uBodies" style="position:absolute;inset:0;z-index:5"></div>'
  +   '</div><div style="height:130px"></div>'
  + '</div>'
  + '<div id="gPlanetPanel" class="f5p" style="display:none;position:absolute;bottom:0;left:0;right:0;z-index:50;background:#FFFFFF;border-radius:24px 24px 0 0;padding:1.1rem 1.25rem 1.6rem;transform:translateY(100%);transition:transform .4s cubic-bezier(.34,1.56,.64,1);box-shadow:0 -10px 32px rgba(0,0,0,.6);max-height:82vh;overflow-y:auto;max-width:760px;margin:0 auto">'
  +   '<div style="width:48px;height:5px;background:#DDD8F5;border-radius:3px;margin:0 auto .9rem;cursor:pointer" onclick="closeGPlanetPanel()"></div>'
  +   '<div style="display:flex;align-items:center;gap:16px;margin-bottom:1rem"><div id="gPpIcon" style="font-size:66px;filter:drop-shadow(0 4px 16px rgba(0,0,0,.25));line-height:1"></div>'
  +     '<div style="flex:1;min-width:0"><div id="gPpName" style="font-size:22px;font-weight:900;color:#1A1033;line-height:1.15;font-family:\'Baloo 2\',sans-serif"></div>'
  +     '<div id="gPpSubtitle" style="font-size:12px;color:#6C28B4;font-weight:900;margin-top:3px;letter-spacing:.03em"></div>'
  +     '<div id="gPpDistance" style="font-size:11px;color:#7A7299;font-weight:800;margin-top:5px"></div></div>'
  +     '<div id="gPpPctBox" style="text-align:center;background:linear-gradient(135deg,#FEF0E6,#FFE2C8);border:2px solid #FBBF7A;border-radius:14px;padding:6px 12px"><div id="gPpPct" style="font-size:24px;font-weight:900;color:#E8650A;font-family:\'Baloo 2\',sans-serif;line-height:1"></div><div style="font-size:11px;color:#7A3200;font-weight:900">PROGRESO</div></div></div>'
  +   '<div id="f5uMision"></div>'
  +   '<div id="gPpDesc" style="font-size:14px;color:#1A1033;background:#F8F5FF;border-left:4px solid #6C28B4;border-radius:10px;padding:12px 14px;margin-bottom:1rem;line-height:1.5;font-weight:600"></div>'
  +   '<div style="font-size:12px;font-weight:900;color:#3D1468;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">💡 Datos curiosos</div>'
  +   '<div id="gPpFacts" style="display:flex;flex-direction:column;gap:6px"></div>'
  + '</div>'
  + '<canvas id="uCanvas" style="display:none"></canvas><canvas id="gMinimapCv" style="display:none"></canvas><div id="gJourneyHud" style="display:none"></div><div id="gHudStatus" style="display:none"></div><div id="gPpLevels" style="display:none"></div><div id="gPpGame" style="display:none"></div><div id="gPpGameTxt" style="display:none"></div><button id="gPpBtn" style="display:none"></button>';
}
function estrellasFondo(){
  var c = $('uStars');
  if(c && !c.children.length) for(var i=0;i<60;i++){ var s=document.createElement('div'); s.className='ustar'; var z=Math.random()*2+.8; s.style.cssText='width:'+z+'px;height:'+z+'px;left:'+(Math.random()*100)+'%;top:'+(Math.random()*100)+'%;opacity:'+(.3+Math.random()*.6).toFixed(2)+';animation-delay:'+(Math.random()*3)+'s'; c.appendChild(s); }
  var l = $('uSceneStars');
  if(l && !l.children.length) for(var j=0;j<110;j++){ var t=document.createElement('div'); t.className='ss'; var w=Math.random()*2.5+.5; t.style.cssText='width:'+w+'px;height:'+w+'px;left:'+(Math.random()*100)+'%;top:'+(Math.random()*100)+'%;opacity:'+(Math.random()*.7+.3).toFixed(2)+';animation-delay:'+(Math.random()*3)+'s'; l.appendChild(t); }
}
function pasaFiltro(b){
  if(filtro==='all') return true;
  if(filtro==='mission') return !!b.mision;
  if(filtro==='planet') return b.type==='planet' || b.type==='mission' || b.type==='moon';
  return b.type===filtro;
}
function tipoBase(b){ return b.type==='mission' ? (b.id==='sol'?'star':'planet') : b.type; }
window.f5uFiltro = function(f){
  filtro = f;
  document.querySelectorAll('#gFilterChips .gfilter-chip').forEach(function(c){ c.classList.toggle('active', c.getAttribute('data-filter')===f); });
  pintarUniverso();
};
function pintarUniverso(){
  construir();
  var cont = $('uBodies'); if(!cont) return;
  cont.innerHTML = '';
  var actual = misionActual();
  MUNDO.cuerpos.forEach(function(b, i){
    var pos = POS[b.id]; if(!pos || !pasaFiltro(b)) return;
    var tb = tipoBase(b);
    var d = document.createElement('div');
    d.className = 'ubody';
    d.style.left = pos.x+'%'; d.style.bottom = pos.y+'%';
    d.style.setProperty('--size', pos.size+'px');
    d.style.setProperty('--g-1', b.glow); d.style.setProperty('--g-2', b.color); d.style.setProperty('--g-3', shade(b.color,-40)); d.style.setProperty('--g-glow', b.glow);
    d.style.animationDelay = (i*0.23 % 2)+'s';
    var h = '<div class="uhalo"></div>';
    if(b.mision && !b.ring) h += '<div class="uring"></div>';
    if(tb==='star') h += '<div class="ustar-rays"></div>';
    if(b.type==='comet') h += '<div class="ucomet-tail"></div>';
    var oc = 'uorb' + (b.type==='asteroid'?' uasteroid':'') + (b.type==='nebula'?' unebula':'');
    h += '<div class="'+oc+'"><span class="uemoji">'+b.icon+'</span></div>';
    if(b.ring) h += '<div class="usaturn-rings"></div>';
    var pc = 0;
    if(b.mision){
      pc = pctGrupo(b.mision);
      h += '<div class="umission-num'+(pc>=100?' ok':'')+'">'+(pc>=100?'✓':b.mision.num)+'</div>';
      if(actual && actual===b.mision) h += '<div class="uhint-tap">🧑‍🚀</div>';
    }
    h += '<div class="ulabel"><div class="ulabel-name" style="--label-border:'+(b.mision?'#FF8C2A':'rgba(255,255,255,.25)')+'">'+esc(String(b.name).replace(/^\S+\s/,''))+'</div>'
      +  '<div class="ulabel-cat" style="--label-cat-bg:'+(b.mision?'#FFE066':'#C5BFEE')+'">'+esc(b.mision ? 'MISIÓN '+b.mision.num+' · '+b.mision.titulo : b.category)+'</div>'
      +  (b.mision && pc>0 ? '<div class="ulabel-pct">'+pc+'%</div>' : '') + '</div>';
    d.innerHTML = h;
    d.onclick = function(){ tono(); window.showGPlanetPanel(i); };
    cont.appendChild(d);
  });
  // Ruta dorada (todas) y tramo recorrido (verde)
  var all = '', done = '', ult = -1;
  MUNDO.grupos.forEach(function(g, k){ if(pctGrupo(g) > 0) ult = k; });
  MUNDO.grupos.forEach(function(g, k){
    if(!g.body) return; var p = POS[g.body.id]; if(!p) return;
    var seg = (k===0?'M':'L') + p.x + ' ' + (100-p.y) + ' ';
    all += seg; if(k <= ult) done += seg;
  });
  var pa = $('f5uPathAll'), pd = $('f5uPathDone');
  if(pa) pa.setAttribute('d', filtro==='all'||filtro==='mission' ? all.trim() : '');
  if(pd) pd.setAttribute('d', (filtro==='all'||filtro==='mission') && ult>0 ? done.trim() : '');
  var sub = $('f5uSub'); if(sub) sub.textContent = 'Explora '+MUNDO.cuerpos.length+' cuerpos celestes · '+MUNDO.grupos.length+' misiones';
  var hx = $('gHudXP'); if(hx) hx.textContent = xpTot();
}
window.openGalaxyMap = function(){
  montarUniverso();
  var m = $('galaxyModal'); if(!m) return;
  try{ galaxyOpen = true; }catch(e){}
  m.style.display = 'block';
  document.body.style.overflow = 'hidden';
  document.body.classList.add('f5uopen');
  estrellasFondo(); pintarUniverso();
  // Llevar la vista a la misión actual
  setTimeout(function(){
    var sc = $('universeScroll'), scene = $('universeScene'); if(!sc || !scene) return;
    var a = misionActual(), y = a && a.body ? POS[a.body.id].y : 6;
    sc.scrollTop = Math.max(0, scene.offsetTop + scene.offsetHeight*(1-y/100) - sc.clientHeight*0.6);
  }, 60);
  hablar('Universo Fedor. Toca un planeta para ver tu misión.');
};
window.closeGalaxyMap = function(){
  try{ galaxyOpen = false; }catch(e){}
  var m = $('galaxyModal'); if(m) m.style.display = 'none';
  document.body.style.overflow = '';
  document.body.classList.remove('f5uopen');
  try{ if(typeof gAnimFrame!=='undefined' && gAnimFrame){ cancelAnimationFrame(gAnimFrame); gAnimFrame = null; } }catch(e){}
  window.closeGPlanetPanel();
};
window.closeGPlanetPanel = function(){
  var p = $('gPlanetPanel'); if(!p) return;
  p.style.transform = 'translateY(100%)'; setTimeout(function(){ p.style.display = 'none'; }, 420);
};
window.f5uIr = function(ui){ window.closeGPlanetPanel(); window.closeGalaxyMap(); if(typeof goUnit==='function') goUnit(ui); };
window.showGPlanetPanel = function(idx){
  if(!MUNDO) construir();
  var b = MUNDO.cuerpos[idx]; if(!b) return;
  var g = b.mision;
  $('gPpIcon').textContent = b.icon;
  $('gPpName').textContent = b.name;
  $('gPpSubtitle').textContent = g ? 'MISIÓN '+g.num+' · '+g.titulo : b.category;
  $('gPpDistance').textContent = '🛸 '+(b.distance||'');
  var pc = g ? pctGrupo(g) : null;
  $('gPpPctBox').style.display = g ? 'block' : 'none';
  if(g) $('gPpPct').textContent = pc+'%';
  var desc = b.desc || '';
  if(g) desc = (desc ? desc+' ' : '') + g.intros.join(' ');
  $('gPpDesc').textContent = desc;
  var f = $('gPpFacts'); f.innerHTML = '';
  (b.facts||[]).forEach(function(t){
    var r = document.createElement('div');
    r.style.cssText = 'background:#FFFFFF;border:2px solid '+hex2rgba(b.glow,.5)+';border-radius:10px;padding:10px 12px;font-size:14px;font-weight:700;color:#1A1033;line-height:1.4';
    r.textContent = t; f.appendChild(r);
  });
  var mi = $('f5uMision'), h = '';
  if(g){
    h += '<div style="font-size:12px;font-weight:900;color:#16876A;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">🚀 Tu misión en este '+(tipoBase(b)==='star'?'lugar':'planeta')+'</div>';
    g.uis.forEach(function(ui){
      var u = U()[ui], p = pctU(ui), st = estrellas(bestU(ui));
      var col = p>=70?'linear-gradient(90deg,#16876A,#24C496)':p>=40?'linear-gradient(90deg,#E8650A,#F5C518)':'#C5BFEE';
      h += '<button class="f5sub" onclick="f5uIr('+ui+')"><span style="font-size:26px">'+(u.icon||'📘')+'</span>'
        +  '<span style="flex:1;min-width:0"><b style="display:block;font-size:14px;color:#1A1033">'+esc(u.short||u.name)+'</b>'
        +  '<span style="font-size:11px;color:#6B5E8A;font-weight:700">'+u.topics.length+' temas · '+('⭐'.repeat(st)||'¡por empezar!')+'</span>'
        +  '<span style="display:block;height:7px;background:#E8DBFF;border-radius:4px;overflow:hidden;margin-top:4px"><i style="display:block;height:7px;width:'+p+'%;background:'+col+'"></i></span></span>'
        +  '<span style="font-family:\'Baloo 2\',sans-serif;font-weight:900;color:#fff;background:linear-gradient(135deg,#FF8C2A,#E8650A);border-radius:12px;padding:6px 12px;white-space:nowrap">'+(p>=100?'✅ Repasar':p>0?'▶ Seguir':'🚀 Ir')+'</span></button>';
    });
    h += '<div style="height:8px"></div>';
  }
  mi.innerHTML = h;
  var panel = $('gPlanetPanel');
  panel.style.display = 'block'; setTimeout(function(){ panel.style.transform = 'translateY(0)'; }, 30);
  hablar(String(b.name).replace(/^\S+\s/,'') + (g ? '. Misión '+g.num+': '+g.titulo+'. Llevas '+pc+' por ciento.' : '. '+(b.desc||'')));
};
window.gSetFilter = function(f){ window.f5uFiltro(f); };
window.renderUniverseCards = pintarUniverso;
window.openUniverso3D = function(){ window.openGalaxyMap(); };   // un solo universo: el del libro

/* Tira de planetas en la tarjeta del inicio */
window.buildPlanetRow = function(){
  var row = $('planetRow'); if(!row) return;
  construir();
  var actual = misionActual();
  row.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:10px 6px;padding:.4rem 0';
  row.innerHTML = MUNDO.grupos.map(function(g){
    var b = g.body || {icon:g.icon, color:'#6C28B4', glow:'#C5BFEE'}, p = pctGrupo(g), now = actual===g;
    return '<div title="Misión '+g.num+' · '+esc(g.titulo)+'" style="display:flex;flex-direction:column;align-items:center;gap:3px;width:52px;position:relative">'
      + (now ? '<div style="position:absolute;top:-22px;font-size:18px;animation:float 2s ease-in-out infinite">🧑‍🚀</div>' : '')
      + '<div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:19px;background:radial-gradient(circle at 32% 28%,'+b.glow+','+b.color+' 60%,'+shade(b.color,-50)+');box-shadow:0 0 '+(p>0?14:6)+'px '+b.glow+';opacity:'+(p>0||now?1:.75)+';'+(now?'outline:2px solid #FFE066;outline-offset:2px':'')+'">'+b.icon+'</div>'
      + '<div style="font-size:9px;font-weight:900;color:'+(p>=100?'#6EE7B7':p>0?'#FFE066':'rgba(255,255,255,.55)')+'">'+(p>=100?'✓':p>0?p+'%':'M'+g.num)+'</div></div>';
  }).join('');
};

/* ═══════════════ 2. INICIO PARA NIÑOS ═══════════════ */
var CAT = {
  aprender:{t:'📚 Para aprender', c:['#5C21A6','#8B3EDB'], f:/Conteo|TablasMult|Explicacion|Videos|ConceptoDia|Laboratorio|Abaco|Ábaco|Historia|Glosario|Formul/i},
  jugar:{t:'🎮 Para jugar y ganar', c:['#E8650A','#F5A524'], f:/Minijuegos|Logros|Desafio|Misiones|Trofeos|Album|Tienda|Universo|Galaxy/i},
  evaluar:{t:'📝 Para ponerme a prueba', c:['#0E6BA8','#38BDF8'], f:/Repaso|SABER|Examen|Final|AutoEval/i},
  profes:{t:'👩‍🏫 Profes y familia', c:['#16876A','#24C496'], f:/Docente|Guia|Curriculo|Color|Export|Import|Reporte|report/i}
};
function herramientas(){
  var out = [], vistos = {};
  document.querySelectorAll('#p3Popup button').forEach(function(b){
    var on = b.getAttribute('onclick')||'', sp = b.querySelectorAll('span');
    if(!on || vistos[on]) return; vistos[on] = 1;
    var ico = sp[0] ? sp[0].textContent : '⭐', nom = sp[1] ? sp[1].textContent : (b.title||'');
    if(/Universo 3D/i.test(nom)){ nom = 'Universo'; on = 'openGalaxyMap()'; }
    out.push({on:on, ico:ico, nom:nom, tit:b.title||nom});
  });
  if(!vistos['openGalaxyMap()']) out.push({on:'openGalaxyMap()', ico:'🌌', nom:'Universo', tit:'Universo Fedor'});
  out.push({on:"goScreen('report')", ico:'📊', nom:'Informe', tit:'Informe de progreso'});
  return out;
}
function panelComando(){
  var hs = herramientas(), grupos = {aprender:[], jugar:[], evaluar:[], profes:[], otros:[]};
  hs.forEach(function(h){
    var k = 'otros';
    for(var c in CAT){ if(CAT[c].f.test(h.on+' '+h.nom)){ k = c; break; } }
    grupos[k].push(h);
  });
  var html = '';
  ['aprender','jugar','evaluar','otros','profes'].forEach(function(k){
    var L = grupos[k]; if(!L.length) return;
    var c = CAT[k] ? CAT[k].c : ['#3D1468','#6C28B4'];
    html += '<h4>'+(CAT[k] ? CAT[k].t : '🧰 Más herramientas')+'</h4><div class="f5grid">'
      + L.map(function(h){ return '<button class="f5btn" title="'+esc(h.tit)+'" onclick="'+esc(h.on)+'" style="background:linear-gradient(145deg,'+c[0]+','+c[1]+')"><span>'+h.ico+'</span><span>'+esc(h.nom)+'</span></button>'; }).join('')
      + '</div>';
  });
  return html;
}
function tarjetasMundos(){
  construir();
  var actual = misionActual();
  return MUNDO.grupos.map(function(g){
    var b = g.body || {icon:g.icon, color:'#6C28B4', glow:'#C5BFEE', name:''};
    var p = pctGrupo(g), st = estrellas(bestGrupo(g)), now = actual===g;
    var top = '<div class="f5m-top" style="background:linear-gradient(135deg,'+shade(b.color,-95)+','+shade(b.color,-35)+' 65%,'+shade(b.glow,-20)+')">'
      + '<div class="f5m-orb" style="--gl:'+b.glow+';background:radial-gradient(circle at 32% 28%,'+b.glow+','+b.color+' 55%,'+shade(b.color,-45)+')">'+g.icon+'</div>'
      + '<div class="f5m-num">'+(p>=100?'✓':g.num)+'</div>'
      + '<div class="f5m-kick">Misión '+g.num+' · '+esc(String(b.name||'').replace(/^\S+\s/,''))+'</div>'
      + '<div class="f5m-title">'+esc(g.titulo)+'</div>'
      + '<div class="f5m-stars">'+('⭐'.repeat(st))+('<span style="opacity:.35">'+'⭐'.repeat(5-st)+'</span>')+'</div>'
      + '<div class="f5m-pct">'+p+'%</div>'
      + (now ? '<div class="f5m-now">📍 ¡Estás aquí!</div>' : '')
      + '</div>';
    var body = '<div class="f5m-body">';
    g.uis.forEach(function(ui){
      var u = U()[ui], q = pctU(ui);
      var col = q>=70?'linear-gradient(90deg,#16876A,#24C496)':q>=40?'linear-gradient(90deg,#E8650A,#F5C518)':'linear-gradient(90deg,#8B3EDB,#C5BFEE)';
      if(g.uis.length===1){
        body += '<div class="f5m-temas">' + u.topics.slice(0,6).map(function(t){ return '<span>'+(t.icon||'•')+' '+esc(t.title)+'</span>'; }).join('') + '</div>';
      }
      body += '<button class="f5m-row" onclick="goUnit('+ui+')"><span class="ic">'+(u.icon||'📘')+'</span>'
        + '<span class="tx"><b>'+esc(g.uis.length===1 ? u.topics.length+' temas · 5 niveles cada uno' : (u.short||u.name))+'</b>'
        + '<small>'+(q>=100?'¡Completado! ✅':q>0?'Vas en '+q+'%':'¡Nuevo! Empieza aquí')+'</small>'
        + '<span class="f5m-mini" style="display:block"><i style="width:'+q+'%;background:'+col+'"></i></span></span>'
        + '<span class="f5m-go">'+(q>=100?'Repasar':q>0?'Seguir ▶':'Entrar 🚀')+'</span></button>';
    });
    body += '</div>';
    return '<div class="f5m'+(now?' now':'')+'" id="f5m'+g.num+'">'+top+body+'</div>';
  }).join('');
}
function heroExtra(){
  var hero = document.querySelector('#screen-home .hero-banner'); if(!hero) return;
  var box = $('f5HeroX');
  if(!box){ box = document.createElement('div'); box.id = 'f5HeroX'; box.className = 'f5hero-x'; hero.appendChild(box); }
  var x = xpTot(), rk = {label:'🌱 Explorador', min:0}, sig = null;
  try{ rk = getRank(x); var i = RANKS.indexOf(rk); sig = RANKS[i+1] || null; }catch(e){}
  var pr = sig ? Math.round((x-rk.min)/(sig.min-rk.min)*100) : 100;
  var total = 0, n = U().length; U().forEach(function(u,ui){ total += pctU(ui); });
  var glob = n ? Math.round(total/n) : 0;
  var tro = 0; try{ tro = Object.keys(JSON.parse(localStorage.getItem('fedor5_trofeos')||'{}')).length; }catch(e){}
  construir(); var a = misionActual();
  var cta = a
    ? '<button class="f5go" onclick="goUnit('+(a.uis.filter(function(ui){ return pctU(ui)<100; })[0])+')"><span style="font-size:28px">🚀</span><span>'+(glob>0?'¡Continuar mi misión!':'¡Empezar la aventura!')+'<small>Misión '+a.num+' · '+esc(a.titulo)+'</small></span></button>'
    : '<button class="f5go" onclick="openLogrosFedor&&openLogrosFedor()"><span style="font-size:28px">🏆</span><span>¡Completaste el libro!<small>Mira tus trofeos</small></span></button>';
  box.innerHTML =
    '<div class="f5rank"><b>'+rk.label+'</b><div class="f5bar"><i style="width:'+pr+'%"></i></div><span style="color:#fff;font-weight:900;font-size:12px;white-space:nowrap">'+(sig ? x+'/'+sig.min+' XP' : x+' XP')+'</span></div>'
  + '<div class="f5chips"><span class="f5chip">📚 '+glob+'% del libro</span><span class="f5chip">⚡ '+x+' XP</span><span class="f5chip">🏆 '+tro+' trofeos</span></div>'
  + cta;
}
function montarInicio(){
  var home = $('screen-home'); if(!home) return;
  if(!home.getAttribute('data-f5')){
    home.setAttribute('data-f5','1');
    var gal = $('galaxyMapWrap');
    // Título de la tarjeta de la galaxia
    if(gal){
      var hint = gal.querySelector('div[style*="Toca para explorar"]') ;
      gal.querySelectorAll('div').forEach(function(d){ if(/Toca para explorar/.test(d.textContent) && d.children.length===0) d.innerHTML = '🚀 <b style="color:#FFE066">Abrir el Universo Fedor</b> · 15 misiones, una por unidad'; });
      gal.style.minHeight = '170px';
    }
    // HOY EN FEDOR
    var hoyT = document.createElement('div'); hoyT.className = 'f5sec'; hoyT.innerHTML = '🌟 Hoy en Fedor <small>¡entra cada día!</small>';
    var hoy = document.createElement('div'); hoy.className = 'f5hoy'; hoy.id = 'f5Hoy';
    var dr = $('dailyRewardBtn'), dc = $('dailyChallenge');
    if(dr) hoy.appendChild(dr);
    if(dc) hoy.appendChild(dc);
    var mis = document.createElement('button'); mis.className = 'f5tile'; mis.style.background = 'linear-gradient(135deg,#0E6BA8,#5B21B6)';
    mis.setAttribute('onclick', "typeof openMisionesFedor==='function'?openMisionesFedor():null");
    mis.innerHTML = '<span class="i">🎯</span><span><b>Misiones de hoy</b><small>3 retos nuevos cada día</small></span>';
    hoy.appendChild(mis);
    // PANEL DE COMANDO
    var cmdT = document.createElement('div'); cmdT.className = 'f5sec'; cmdT.innerHTML = '🕹️ Panel de comando <small>todas tus herramientas</small>';
    var cmd = document.createElement('div'); cmd.className = 'f5cmd'; cmd.id = 'f5Cmd';
    // MUNDOS
    var munT = document.createElement('div'); munT.className = 'f5sec'; munT.id = 'f5MunT'; munT.innerHTML = '🪐 Mis mundos de aprendizaje <small>15 misiones · toca para entrar</small>';
    var mun = document.createElement('div'); mun.className = 'f5mundos'; mun.id = 'f5Mundos';
    // Zona de adultos
    var adu = document.createElement('details'); adu.className = 'f5adult'; adu.id = 'f5Adult';
    adu.innerHTML = '<summary>👨‍👩‍👧 Zona de profes y familias <small style="font-family:Nunito;font-size:12px;color:#7A7299;font-weight:800">informes, progreso detallado y guía</small></summary>';
    var qs = $('qs-xp'), teacher = null;
    if(qs){ teacher = qs; while(teacher.parentElement && teacher.parentElement !== home) teacher = teacher.parentElement; }
    var ancla = gal ? gal.nextSibling : null;
    [hoyT, hoy, cmdT, cmd, munT, mun].forEach(function(n){ home.insertBefore(n, ancla); });
    home.appendChild(adu);
    if(teacher && teacher.parentElement===home) adu.appendChild(teacher);
    var brand = home.querySelector('.fedor-brand'); if(brand) adu.appendChild(brand);
    var pg = home.querySelector('.prog-global'); if(pg) adu.appendChild(pg);
    var pm = home.querySelector('.progress-map'); if(pm) adu.appendChild(pm);
    // La lista original de unidades se conserva oculta (el libro la sigue usando)
    var ul = $('unitsList'); if(ul) ul.classList.add('f5hide');
    home.querySelectorAll('.sec-title').forEach(function(t){ if(/Unidades de aprendizaje/i.test(t.textContent)) t.classList.add('f5hide'); });
  }
  refrescarInicio();
}
function refrescarInicio(){
  heroExtra();
  var cmd = $('f5Cmd'); if(cmd) cmd.innerHTML = panelComando();
  var mun = $('f5Mundos'); if(mun) mun.innerHTML = tarjetasMundos();
  try{ window.buildPlanetRow(); }catch(e){}
}
var _rh = window.refreshHome;
window.refreshHome = function(){ var r; try{ r = _rh && _rh.apply(this, arguments); }catch(e){} try{ refrescarInicio(); }catch(e){} return r; };
var _gs = window.goScreen;
if(typeof _gs==='function') window.goScreen = function(n){ var r = _gs.apply(this, arguments); if(n==='home') setTimeout(function(){ try{ refrescarInicio(); }catch(e){} }, 50); return r; };

function iniciar(){ try{ montarUniverso(); }catch(e){} try{ montarInicio(); }catch(e){ try{ console.warn('[F5 H]', e); }catch(x){} } }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ iniciar(); setTimeout(refrescarInicio, 2200); });
else { iniciar(); setTimeout(refrescarInicio, 2200); }
// Etiqueta del menú: "Universo 3D" → "Universo"
setTimeout(function(){ var b = $('f5mU3'); if(b){ b.setAttribute('onclick','openGalaxyMap()'); var s = b.querySelectorAll('span'); if(s[1]) s[1].textContent = 'Universo'; } }, 2000);
try{ console.log('[F5 H] Universo Fedor del 4° + inicio infantil'); }catch(e){}
})();

