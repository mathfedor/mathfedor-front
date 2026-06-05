'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Ruta del libro interactivo "Matemáticas de Fedor 2°".
 *
 * Sirve el libro digital ORIGINAL íntegro (public/libro-fedor-2/index.html) a
 * pantalla completa, e inyecta un parche (mismo origen) que, SIN modificar el
 * archivo original:
 *  · corrige inconsistencias de datos (figura↔enunciado y opciones duplicadas)
 *  · desbloquea todos los planetas para revisar todo
 *  · ensancha el libro a pantalla completa en escritorio (móvil intacto)
 *  · limita la representación gráfica de números grandes (máx. 20 + "+N más")
 *  · renderiza la galaxia en 2D fiable (planetas siempre visibles, sin WebGL)
 *  · completa el video de entrada "¡BIENVENIDO, CADETE!" con animación CSS
 *  · añade los recursos (laboratorio, tablas, juegos…) al Home y al Perfil
 */
const PATCH = `(function(){
  'use strict';
  if(window.__fedor_patch_extra) return; window.__fedor_patch_extra = true;

  /* ============================================================
     1. CORRECCIONES DE DATOS (figura <-> enunciado · opciones)
     ============================================================ */
  function shapeFromQ(q){q=(q||'').toLowerCase();
    if(/cubo|arista/.test(q))return 'cubo';
    if(/prisma/.test(q))return 'prisma';
    if(/rect[aá]ngulo/.test(q))return 'rectangulo';
    if(/cuadrado/.test(q))return 'cuadrado';
    return null;}
  function fixData(){
    if(typeof UNITS==='undefined')return;
    UNITS.forEach(function(u){(u.topics||[]).forEach(function(t){(t.levels||[]).forEach(function(l){(l.exercises||[]).forEach(function(e){
      if(e.fig_data&&e.fig_data.kind){var sh=shapeFromQ(e.q);if(sh&&sh!==e.fig_data.kind)e.fig_data.kind=sh;}
      if(e.type==='mcq'&&Array.isArray(e.opts)){
        var seen={},out=[];
        e.opts.forEach(function(o){o=String(o);if(!seen[o]){seen[o]=1;out.push(o);}});
        if(out.length<e.opts.length){
          var q=e.q||'',lm=q.match(/largo\\s*=?\\s*(\\d+)/i),am=q.match(/ancho\\s*=?\\s*(\\d+)/i),cand=[];
          if(lm&&am){var Lx=+lm[1],Ax=+am[1];cand=[Lx+Ax,Lx*Ax,2*Lx,2*Ax,Lx+Ax+Lx].map(function(x){return x+'m';});}
          var ci=0;
          while(out.length<e.opts.length){var nx=cand[ci++];if(nx===undefined)nx=(out.length+97)+'m';if(!seen[nx]){seen[nx]=1;out.push(nx);}}
        }
        e.opts=out;
      }
    });});});});
  }
  try{ fixData(); }catch(err){}

  /* Todos los planetas accesibles para revisar (sin bloqueos) */
  try{ if(typeof window.isPlanetUnlocked==='function'){ window.isPlanetUnlocked=function(){return true;}; } }catch(err){}

  /* ============================================================
     2. ESTILOS: ancho completo en escritorio + badge "+N mas"
     (movil queda igual: solo aplica desde 900px)
     ============================================================ */
  var st=document.createElement('style');
  st.textContent =
    '@media(min-width:900px){#app{max-width:min(1280px,95vw)!important}}'+
    '.fedor-count-more{display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;color:#7B2FBE;background:#EEEDFE;border:1.5px solid #C9B8F0;border-radius:10px;padding:4px 10px;margin:2px;vertical-align:middle}';
  document.head.appendChild(st);

  /* ============================================================
     3. NUMEROS GRANDES: limitar la representacion grafica a 20
     objetos visibles + "+N mas" (no altera la respuesta)
     ============================================================ */
  var CAP=20;
  function capCounts(root){
    var groups=(root||document).querySelectorAll('.count-display,.prob-group-objs');
    Array.prototype.forEach.call(groups,function(d){
      var objs=d.querySelectorAll('.count-obj,.prob-obj-big');
      if(objs.length<=CAP) return;
      var hidden=0;
      for(var i=CAP;i<objs.length;i++){ if(objs[i].style.display!=='none'){ objs[i].style.display='none'; hidden++; } }
      if(hidden>0 && !d.querySelector('.fedor-count-more')){
        var s=document.createElement('span');
        s.className='fedor-count-more';
        s.textContent='+'+(objs.length-CAP)+' mas';
        objs[CAP-1].parentNode.insertBefore(s, objs[CAP]);
      }
    });
  }
  try{
    var mo=new MutationObserver(function(muts){
      var doit=false;
      muts.forEach(function(m){ if(m.addedNodes&&m.addedNodes.length) doit=true; });
      if(doit) capCounts(document);
    });
    mo.observe(document.body,{childList:true,subtree:true});
  }catch(err){}
  setTimeout(function(){ try{capCounts(document);}catch(e){} }, 400);

  /* ============================================================
     4. GALAXIA 2D GARANTIZADA (no depende de Three.js/WebGL)
     Dibuja todos los planetas con nombre + % y permite abrirlos.
     ============================================================ */
  function buildGalaxy2D(){
    var canvas=document.getElementById('uCanvas'); if(!canvas) return;
    if(typeof GALAXY_PLANETS==='undefined') return;
    var ctx=canvas.getContext('2d');
    var stars=[]; var i;
    for(i=0;i<150;i++) stars.push({x:Math.random(),y:Math.random(),r:Math.random()*1.6+0.3,t:Math.random()*6.28});
    var t=0;
    function frame(){
      if(!window.__fedorGalaxyOn) return;
      var W=canvas.width=window.innerWidth, H=canvas.height=window.innerHeight;
      var g=ctx.createRadialGradient(W/2,H*0.4,30,W/2,H*0.4,Math.max(W,H));
      g.addColorStop(0,'#1a0a40'); g.addColorStop(1,'#05071c');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      stars.forEach(function(s){ var a=0.35+0.55*Math.abs(Math.sin(s.t+t*2)); ctx.globalAlpha=a; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(s.x*W,s.y*H,s.r,0,6.28); ctx.fill(); });
      ctx.globalAlpha=1;
      /* lineas de ruta entre planetas */
      ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.lineWidth=2; ctx.setLineDash([5,7]);
      ctx.beginPath();
      GALAXY_PLANETS.forEach(function(p,k){ var x=p.cx*W,y=p.cy*H; if(k===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); });
      ctx.stroke(); ctx.setLineDash([]);
      GALAXY_PLANETS.forEach(function(p,k){
        var px=p.cx*W, py=p.cy*H, r=(p.r||30);
        var pct=(p.unit!=null&&p.unit>=0&&typeof getUnitPct==='function')?getUnitPct(p.unit):100;
        var pulse=1+0.05*Math.sin(t*2+k);
        var gg=ctx.createRadialGradient(px,py,r*0.2,px,py,r*2.0*pulse);
        gg.addColorStop(0,'rgba(245,197,24,.30)'); gg.addColorStop(1,'rgba(245,197,24,0)');
        ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(px,py,r*2.0*pulse,0,6.28); ctx.fill();
        ctx.font=(r*1.7)+'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(p.icon||'🪐', px, py);
        ctx.font='700 14px Nunito,system-ui,sans-serif'; ctx.fillStyle='#fff';
        ctx.fillText((p.name||'').replace(/[^A-Za-z0-9À-ſ ]/g,'').trim(), px, py+r+18);
        if(p.unit!=null&&p.unit>=0){ ctx.font='900 12px Nunito,system-ui,sans-serif'; ctx.fillStyle=pct>=70?'#24C496':(pct>=1?'#F5C518':'rgba(255,255,255,.55)'); ctx.fillText(pct+'%', px, py+r+36); }
      });
      t+=0.016;
      window.__fedorGalaxyRAF=requestAnimationFrame(frame);
    }
    canvas.onclick=function(ev){
      var rect=canvas.getBoundingClientRect();
      var W=canvas.width, H=canvas.height;
      var cx=ev.clientX-rect.left, cy=ev.clientY-rect.top;
      for(var k=0;k<GALAXY_PLANETS.length;k++){
        var p=GALAXY_PLANETS[k], px=p.cx*W, py=p.cy*H, r=(p.r||30)+20;
        var dx=cx-px, dy=cy-py;
        if(dx*dx+dy*dy<=r*r){
          if(typeof showGPlanetPanel==='function'){ try{ showGPlanetPanel(k); return; }catch(e){} }
          if(typeof goUnit==='function'&&p.unit>=0){ if(window.closeGalaxyMap) window.closeGalaxyMap(); goUnit(p.unit); }
          return;
        }
      }
    };
    window.__fedorGalaxyOn=true;
    cancelAnimationFrame(window.__fedorGalaxyRAF);
    frame();
  }
  window.openGalaxyMap=function(){
    var modal=document.getElementById('galaxyModal'); if(!modal) return;
    modal.style.display='block'; document.body.style.overflow='hidden';
    try{ if(typeof galaxyOpen!=='undefined') galaxyOpen=true; }catch(e){}
    if(typeof buildJourneyHud==='function'){ try{ buildJourneyHud(); }catch(e){} }
    setTimeout(buildGalaxy2D, 40);
  };
  window.closeGalaxyMap=function(){
    window.__fedorGalaxyOn=false; cancelAnimationFrame(window.__fedorGalaxyRAF);
    var modal=document.getElementById('galaxyModal'); if(modal) modal.style.display='none';
    document.body.style.overflow='';
    try{ if(typeof galaxyOpen!=='undefined') galaxyOpen=false; }catch(e){}
  };

  /* ============================================================
     5. VIDEO DE ENTRADA "BIENVENIDO, CADETE" COMPLETO
     (animacion CSS garantizada: no depende de Three.js/WebGL)
     ============================================================ */
  function ensureCinStyle(){
    if(document.getElementById('fedorCinStyle')) return;
    var s=document.createElement('style'); s.id='fedorCinStyle';
    s.textContent=
      '@keyframes fedorStreak{0%{transform:translateY(-12vh) scaleY(.4);opacity:0}10%{opacity:1}100%{transform:translateY(120vh) scaleY(1.6);opacity:0}}'+
      '@keyframes fedorRocket{0%{transform:translate(-50%,42vh) rotate(-10deg) scale(.7);opacity:0}12%{opacity:1}55%{transform:translate(-50%,-4vh) rotate(-4deg) scale(1.05)}100%{transform:translate(-50%,-34vh) rotate(0) scale(.6);opacity:0}}'+
      '@keyframes fedorFlame{0%,100%{transform:translateX(-50%) scaleY(.8);opacity:.7}50%{transform:translateX(-50%) scaleY(1.3);opacity:1}}'+
      '@keyframes fedorPlanet{0%{transform:translate(-50%,-50%) scale(.08);opacity:0}45%{opacity:.55}100%{transform:translate(-50%,-50%) scale(1.5);opacity:.92}}'+
      '.fedor-cin-bg{position:absolute;inset:0;overflow:hidden;z-index:0;background:radial-gradient(circle at 50% 38%,#10103a,#000010 75%)}'+
      '.fedor-cin-streak{position:absolute;top:0;width:2px;height:70px;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(180,210,255,.95));border-radius:2px;animation:fedorStreak linear infinite}'+
      '.fedor-cin-planet{position:absolute;left:50%;top:40%;font-size:120px;animation:fedorPlanet 6.8s ease-out forwards;z-index:0;filter:drop-shadow(0 0 40px rgba(77,138,255,.7))}'+
      '.fedor-cin-rocket{position:absolute;left:50%;bottom:0;font-size:64px;animation:fedorRocket 6.8s ease-in forwards;z-index:2;filter:drop-shadow(0 0 22px rgba(255,140,42,.85))}'+
      '.fedor-cin-flame{position:absolute;left:50%;top:100%;width:18px;height:34px;background:radial-gradient(circle at 50% 20%,#FFE066,#FF8C2A 60%,rgba(255,80,0,0));border-radius:50% 50% 60% 60%;animation:fedorFlame .25s ease-in-out infinite}';
    document.head.appendChild(s);
  }
  function buildCinBg(ov){
    ensureCinStyle();
    var old=ov.querySelector('.fedor-cin-bg'); if(old) old.parentNode.removeChild(old);
    var bg=document.createElement('div'); bg.className='fedor-cin-bg';
    var html='<div class="fedor-cin-planet">🪐</div>';
    for(var i=0;i<70;i++){
      var l=(Math.random()*100).toFixed(2), d=(Math.random()*2.2+1.1).toFixed(2), de=(Math.random()*3).toFixed(2), op=(Math.random()*0.5+0.5).toFixed(2);
      html+='<div class="fedor-cin-streak" style="left:'+l+'%;opacity:'+op+';animation-duration:'+d+'s;animation-delay:'+de+'s"></div>';
    }
    html+='<div class="fedor-cin-rocket">🚀<span class="fedor-cin-flame"></span></div>';
    bg.innerHTML=html;
    ov.insertBefore(bg, ov.firstChild);
  }
  window.playCinematicIntro=function(){
    var ov=document.getElementById('cinIntro'); if(!ov) return;
    ov.style.display='block';
    buildCinBg(ov);
    var ids=['cinLine1','cinLine2','cinLine3'];
    ids.forEach(function(id,k){ setTimeout(function(){ var el=document.getElementById(id); if(el){ el.style.opacity=1; el.style.transform='translateY(0)'; } }, 350+k*550); });
    clearTimeout(window.__fedorCinEnd);
    window.__fedorCinEnd=setTimeout(function(){ if(typeof window.cinSkip==='function') window.cinSkip(); }, 7200);
  };
  /* permitir ver el intro mejorado al menos una vez mas en este equipo */
  try{ if(!sessionStorage.getItem('fedor_cin_seen')){ sessionStorage.setItem('fedor_cin_seen','1'); localStorage.removeItem('fedor_cin_done'); } }catch(e){}

  /* ============================================================
     6. RECURSOS (laboratorio, tablas, juegos) en Home y Perfil
     ============================================================ */
  var RES=[
    {ico:'📊',lbl:'Laboratorio de Estadística',fn:'openStatsLab'},
    {ico:'🎯',lbl:'Tablas de Multiplicar',fn:'openTablas'},
    {ico:'🎮',lbl:'Mini-juegos',fn:'openMinigamePicker'},
    {ico:'🔢',lbl:'Descomposición',fn:'showDecompList'},
    {ico:'📝',lbl:'Examen Final',fn:'openExamenFinal'},
    {ico:'🚀',lbl:'Reto Espacial',fn:'openEspacial'},
    {ico:'📓',lbl:'Mi Diario',fn:'openDiario'},
    {ico:'🧪',lbl:'Laboratorio',fn:'openLab'}
  ];
  function injectResources(screenId, boxId){
    var p=document.getElementById(screenId); if(!p) return;
    if(document.getElementById(boxId)) return;
    var avail=RES.filter(function(r){return typeof window[r.fn]==='function';});
    if(!avail.length) return;
    var box=document.createElement('div');
    box.id=boxId;
    box.style.cssText='background:linear-gradient(135deg,#1A0A3C,#2A0F60);border:2px solid rgba(91,191,255,.35);border-radius:18px;padding:1rem;margin:1rem 0;box-shadow:0 12px 40px rgba(0,0,0,.45)';
    box.innerHTML='<div style="font-family:Baloo 2,sans-serif;font-weight:900;font-size:15px;color:#FFD66B;margin-bottom:.25rem">⚡ Mis Recursos</div>'+
      '<div style="font-size:11px;color:rgba(255,255,255,.6);font-weight:700;margin-bottom:.75rem">Laboratorios, tablas y juegos disponibles para ti</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+
      avail.map(function(r){return '<button data-fn="'+r.fn+'" style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:10px;color:#fff;font-weight:800;font-size:12px;cursor:pointer;font-family:Nunito,sans-serif;text-align:left"><span style="font-size:22px">'+r.ico+'</span><span>'+r.lbl+'</span></button>';}).join('')+
      '</div>';
    p.insertBefore(box, p.firstChild);
    box.querySelectorAll('button[data-fn]').forEach(function(b){
      b.onclick=function(){ var fn=window[b.getAttribute('data-fn')]; if(typeof fn==='function') fn(); };
    });
  }
  function injectAll(){
    injectResources('screen-home','fedorResHome');
    injectResources('screen-profile','fedorResProfile');
  }
  var _go=window.goScreen;
  if(typeof _go==='function'){
    window.goScreen=function(s){ var r=_go.apply(this,arguments); if(s==='home'||s==='profile') setTimeout(injectAll,60); return r; };
  }
  setTimeout(injectAll,1500);
  setTimeout(injectAll,3500);
})();
`;

export default function Libro2doPage() {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  const onIframeLoad = () => {
    setLoading(false);
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      const s = doc.createElement('script');
      s.textContent = PATCH;
      doc.body.appendChild(s);
    } catch {
      /* mismo origen requerido; si falla, el libro funciona igual sin el parche */
    }
  };

  const goFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  const btnStyle: CSSProperties = {
    position: 'absolute',
    top: 12,
    zIndex: 3,
    color: '#fff',
    border: '1.5px solid rgba(255,255,255,.35)',
    borderRadius: 12,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
  };

  return (
    <div ref={wrapRef} style={{ position: 'fixed', inset: 0, zIndex: 60, background: '#0E0A24', overflow: 'hidden' }}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            background: 'radial-gradient(circle at 50% 40%, #1A0848, #0E0A24 80%)',
            color: '#fff',
            zIndex: 2,
          }}
        >
          <div style={{ fontSize: 56, animation: 'spin 2.4s linear infinite' }}>🚀</div>
          <div style={{ fontFamily: "'Baloo 2', system-ui, sans-serif", fontWeight: 900, fontSize: 18 }}>
            Cargando Matemáticas de Fedor 2°…
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', fontWeight: 700 }}>Preparando el despegue</div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      <button onClick={() => router.push('/dashboard')} title="Volver al menú" style={{ ...btnStyle, left: 14, background: 'rgba(255,29,78,.92)' }}>
        ← Menú
      </button>
      <button onClick={goFullscreen} title="Pantalla completa" aria-label="Pantalla completa" style={{ ...btnStyle, right: 14, background: 'rgba(108,40,180,.92)' }}>
        ⛶ Pantalla completa
      </button>

      <iframe
        ref={iframeRef}
        src="/libro-fedor-2/index.html"
        title="Matemáticas de Fedor 2°"
        onLoad={onIframeLoad}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
