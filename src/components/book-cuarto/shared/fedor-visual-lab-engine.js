// Motor FZ de Laboratorios Visuales y Manipulativos Pedagógicos de 4° Grado
// Extraído fielmente de public/cuarto/MatematicasDeFedor_4°.html sin alterar datos pedagógicos

/* eslint-disable */

var FZ = {st:{}, n:0};
if (typeof window !== 'undefined') {
  window.FZ = FZ;
}
function $(id){
  if (typeof document === 'undefined') return null;
  return document.getElementById(id);
}
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function limpio(s){ return String(s||'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim(); }
function fmt(n){ if(typeof n!=='number'||!isFinite(n)) return String(n); var neg=n<0; n=Math.abs(n); var p=String(Math.round(n*1e6)/1e6).split('.'); var e=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.'); return (neg?'−':'')+e+(p[1]?','+p[1]:''); }
/* número en formato colombiano: 35.800 · 2,5 · 0,358 */
function aNum(s){ s=String(s).trim(); if(/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s=s.replace(/\./g,''); return parseFloat(s.replace(',','.')); }
var RXN = /\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g;
function nums(t){ return (String(t).match(RXN)||[]).map(aNum); }
function dec(n){ var s=String(n); return s.indexOf('.')<0?0:s.split('.')[1].length; }
function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=a%b; a=b; b=t; } return a; }
function lcm(a,b){ return a/gcd(a,b)*b; }
function divisores(n){ var d=[]; for(var i=1;i<=n;i++) if(n%i===0) d.push(i); return d; }
function factores(n){ var f=[], p=2; while(n>1 && p*p<=n){ while(n%p===0){ f.push(p); n/=p; } p++; } if(n>1) f.push(n); return f; }
function hablar(t){ try{ if(typeof fedor5Hablar==='function') fedor5Hablar(t); }catch(e){} }
function tono(f){ try{ if(typeof fedor5Tono==='function') fedor5Tono(f); }catch(e){} }

/* ═══════════════ ESTILOS ═══════════════ */
var CSS = [
'.fz{margin:12px 0 14px;border-radius:20px;background:linear-gradient(160deg,#F8F5FF,#EEF7FF);border:2.5px solid #D9CCFF;box-shadow:0 8px 22px rgba(60,20,120,.10);overflow:hidden;font-family:Nunito,sans-serif;color:#1A1033;text-align:left}',
'.fz-h{display:flex;align-items:center;gap:8px;padding:8px 12px;background:linear-gradient(90deg,var(--fz1,#5C21A6),var(--fz2,#8B3EDB));color:#fff}',
'.fz-h,.fz-h *,.tm-body .fz-h .t,.tm-body .fz-h small{color:#FFFFFF!important}',
'.fz-h .t{flex:1;font-family:"Baloo 2",Nunito,sans-serif;font-weight:900;font-size:15px;letter-spacing:.01em}',
'.fz-h .t small{font-family:Nunito;font-weight:800;font-size:11px;opacity:.85;margin-left:6px}',
'.fz-h button{background:rgba(255,255,255,.2);border:1.5px solid rgba(255,255,255,.45);color:#fff;border-radius:10px;padding:3px 10px;font-weight:900;cursor:pointer;font-family:Nunito}',
'.fz-b{padding:12px;overflow-x:auto}',
'.fz.min .fz-b,.fz.min .fz-f{display:none}',
'.fz-f{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 12px;align-items:center}',
'.fz-btn{border:none;border-radius:12px;padding:8px 13px;font-weight:900;font-size:13px;cursor:pointer;font-family:Nunito;color:#fff;background:linear-gradient(135deg,#5C21A6,#8B3EDB);box-shadow:0 3px 10px rgba(92,33,166,.3);transition:transform .12s}',
'.fz-btn:hover{transform:translateY(-2px)}',
'.fz-btn.o{background:linear-gradient(135deg,#FF8C2A,#E8650A)}',
'.fz-btn.g{background:linear-gradient(135deg,#16876A,#24C496)}',
'.fz-btn.b{background:linear-gradient(135deg,#0E6BA8,#38BDF8)}',
'.fz-btn.w{background:#FFFFFF;color:#5C21A6;border:2px solid #C5BFEE;box-shadow:none}',
'.fz-btn.on{outline:3px solid #FFE066}',
'.fz-msg{font-weight:900;font-size:14px;color:#3D1468;padding:6px 10px;background:#FFFFFF;border-radius:12px;border:2px dashed #C5BFEE;min-height:20px}',
'.fz-tip{font-size:12px;font-weight:800;color:#6B5E8A;margin-top:8px}',
/* pizarra en columnas */
'.fz-col{border-collapse:separate;border-spacing:4px;margin:0 auto}',
'.fz-col th{font-size:12px;font-weight:900;color:#fff;border-radius:8px;padding:4px 6px;width:44px;min-width:40px}',
'.fz-col td{width:44px;height:44px;text-align:center;font-family:"Baloo 2",sans-serif;font-size:26px;font-weight:900;color:#1A1033;border-radius:10px;background:#FFFFFF;border:2px solid #EEE8FB}',
'.fz-col td.op{background:transparent;border:none;color:#E8650A}',
'.fz-col td.nb{background:transparent;border:none}',
'.fz-col td.cm{width:14px;background:transparent;border:none;font-size:30px;color:#C94B22}',
'.fz-col tr.cr td{height:28px;font-size:15px;background:transparent;border:none}',
'.fz-col input{width:100%;height:100%;border:none;background:transparent;text-align:center;font-family:"Baloo 2",sans-serif;font-size:26px;font-weight:900;color:#16876A;outline:none}',
'.fz-col tr.cr input{font-size:15px;color:#C94B22}',
'.fz-col tr.rs td{background:#FFFBEA;border:2.5px dashed #F5C518}',
'.fz-col tr.rs td.op,.fz-col tr.rs td.cm{background:transparent;border:none}',
'.fz-col tr.ln td{height:4px;background:#1A1033;border:none;border-radius:2px;padding:0}',
'.fz-col td.hl{background:#FFE066!important;transform:scale(1.08);transition:all .2s}',
/* bloques base 10 */
'.fz-blk{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;align-items:flex-end}',
'.fz-blk .g{display:flex;flex-direction:column;align-items:center;gap:4px}',
'.fz-blk .row{display:flex;gap:3px;align-items:flex-end;flex-wrap:wrap;max-width:260px;justify-content:center}',
'.fz-blk .lab{font-weight:900;font-size:13px;color:#3D1468}',
'.fz-c100{width:40px;height:40px;background:repeating-linear-gradient(0deg,#1A6CB4 0 3.6px,#4DA6FF 3.6px 4px),#4DA6FF;border:1.5px solid #0A3D6E;border-radius:3px}',
'.fz-c10{width:6px;height:40px;background:repeating-linear-gradient(0deg,#16876A 0 3.6px,#6EE7B7 3.6px 4px);border:1px solid #074F3A;border-radius:2px}',
'.fz-c1{width:7px;height:7px;background:#FF8C2A;border:1px solid #7A3200;border-radius:2px}',
/* puntos / arreglos */
'.fz-dots{display:inline-grid;gap:5px;padding:8px;background:#FFFFFF;border-radius:14px;border:2px solid #EEE8FB}',
'.fz-dot{width:18px;height:18px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFD27A,#E8650A);box-shadow:0 1px 3px rgba(0,0,0,.25);transition:all .25s}',
'.fz-dot.off{background:#E8DBFF;box-shadow:none}',
'.fz-dot.rest{background:radial-gradient(circle at 35% 30%,#FF9AA2,#C94B22)}',
'.fz-dot.sel{background:radial-gradient(circle at 35% 30%,#8EF0C9,#16876A)}',
/* reparto */
'.fz-plates{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}',
'.fz-plate{min-width:74px;min-height:74px;border-radius:50%;background:radial-gradient(circle,#FFFFFF 55%,#EDE3FF 56%);border:3px solid #C5BFEE;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:2px;padding:10px;position:relative}',
'.fz-plate b{position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);background:#5C21A6;color:#fff;border-radius:8px;font-size:11px;padding:0 6px}',
'.fz-pile{display:flex;flex-wrap:wrap;gap:3px;justify-content:center;padding:8px;background:#FFF6E0;border-radius:14px;border:2px dashed #F5C518;margin-bottom:10px;min-height:30px}',
'.fz-cand{font-size:18px;line-height:1;animation:fzPop .3s ease}',
'@keyframes fzPop{from{transform:scale(0)}to{transform:scale(1)}}',
/* fracciones */
'.fz-frow{display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:center}',
'.fz-bar{display:flex;height:44px;border-radius:10px;overflow:hidden;border:2.5px solid #3D1468;background:#FFFFFF;min-width:160px;max-width:100%}',
'#lesContent .fz [style*="display:flex;gap:10px;align-items:center"]{flex-wrap:wrap;justify-content:center}',
'@media(max-width:560px){.fz-b{padding:8px}.fz-col td{width:34px;height:38px;font-size:22px}.fz-col th{width:34px}.fz-col input{font-size:22px}.fz-h .t{font-size:14px}.fz-btn{padding:7px 10px;font-size:12px}}',
'.fz-bar i{flex:1;border-right:2px solid #3D1468;cursor:pointer;transition:background .2s}',
'.fz-bar i:last-child{border-right:none}',
'.fz-bar i.on{background:linear-gradient(180deg,#FFB547,#FF8C2A)}',
'.fz-bar i.on2{background:linear-gradient(180deg,#6EE7B7,#16876A)}',
'.fz-bar i.gb{border-right-width:5px}',
'.fz-fr{display:inline-flex;flex-direction:column;align-items:center;font-family:"Baloo 2",sans-serif;font-weight:900;font-size:24px;line-height:1;color:#3D1468}',
'.fz-fr span:first-child{border-bottom:3px solid #3D1468;padding:0 6px}',
/* grilla 10x10 */
'.fz-g100{display:inline-grid;grid-template-columns:repeat(10,22px);gap:2px;padding:6px;background:#3D1468;border-radius:10px}',
'.fz-g100 i{width:22px;height:22px;background:#FFFFFF;border-radius:3px;cursor:pointer;transition:background .15s}',
'.fz-g100 i.on{background:linear-gradient(135deg,#FFB547,#FF8C2A)}',
/* chips */
'.fz-chips{display:flex;flex-wrap:wrap;gap:5px;align-items:center}',
'.fz-chip{min-width:34px;padding:5px 9px;border-radius:12px;background:#FFFFFF;border:2px solid #D9CCFF;font-weight:900;font-size:14px;text-align:center;cursor:pointer;transition:all .15s}',
'.fz-chip.on{background:#FFE066;border-color:#F5A524;transform:scale(1.08)}',
'.fz-chip.cm{background:#6EE7B7;border-color:#16876A}',
'.fz-rowlab{font-family:"Baloo 2",sans-serif;font-weight:900;font-size:16px;color:#5C21A6;min-width:88px}',
/* tablero de valor posicional */
'.fz-pv{display:flex;gap:4px;justify-content:center;flex-wrap:wrap}',
'.fz-pv .c{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer}',
'.fz-pv .c .h{font-size:11px;font-weight:900;color:#fff;border-radius:8px;padding:3px 6px;min-width:46px;text-align:center}',
'.fz-pv .c .d{width:48px;height:56px;border-radius:12px;background:#FFFFFF;border:2.5px solid #D9CCFF;display:flex;align-items:center;justify-content:center;font-family:"Baloo 2",sans-serif;font-size:32px;font-weight:900}',
'.fz-pv .c.on .d{background:#FFE066;border-color:#F5A524;transform:translateY(-4px)}',
'.fz-pv .cm{font-size:40px;font-weight:900;color:#C94B22;align-self:flex-end;margin-bottom:6px}',
/* escalera */
'.fz-stairs{display:flex;align-items:flex-end;gap:4px;justify-content:center}',
'.fz-stairs .s{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;width:58px;border-radius:12px 12px 4px 4px;color:#fff;font-weight:900;font-family:"Baloo 2",sans-serif;font-size:17px;padding-top:6px;transition:all .25s}',
'.fz-stairs .s.on{outline:4px solid #FFE066;transform:translateY(-4px)}',
'.fz-stairs .s small{font-family:Nunito;font-size:9px;opacity:.9}',
/* balanza */
'.fz-eq{font-family:"Baloo 2",sans-serif;font-size:24px;font-weight:900;text-align:center;color:#3D1468;margin-top:4px}',
/* recta */
'.fz-svg{display:block;margin:0 auto;max-width:100%;height:auto}',
'.fz-figx{position:relative}',
'.fz-figx svg *{transition:opacity .4s, filter .2s}',
'.fz-figx.anim svg rect,.fz-figx.anim svg circle,.fz-figx.anim svg path,.fz-figx.anim svg polygon,.fz-figx.anim svg line,.fz-figx.anim svg text{animation:fzIn .5s ease both}',
'@keyframes fzIn{from{opacity:0}to{opacity:1}}',
'.fz-figx svg rect:hover,.fz-figx svg circle:hover,.fz-figx svg path:hover,.fz-figx svg polygon:hover{filter:brightness(1.15) drop-shadow(0 0 4px rgba(245,165,36,.9));cursor:pointer}',
'.fz-figx .fzsel{filter:drop-shadow(0 0 6px #F5A524) brightness(1.1)!important;outline:none}',
'.fz-figx tr:hover td{background:#FFF3C4!important;cursor:pointer}',
'.fz-figx tr.fzsel td{background:#FFE066!important}',
'.fz-zoombtn{position:absolute;top:6px;right:6px;border:none;border-radius:10px;padding:5px 9px;font-weight:900;font-size:12px;cursor:pointer;background:#5C21A6;color:#fff;font-family:Nunito;z-index:3}',
'@keyframes fzPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}'
].join('\n');
function ensureFzStyles(){
  if (typeof document !== 'undefined' && document.head && !document.getElementById('fzCSS')) {
    var st = document.createElement('style');
    st.id = 'fzCSS';
    st.textContent = CSS;
    document.head.appendChild(st);
  }
}
if (typeof document !== 'undefined') {
  ensureFzStyles();
}

/* ═══════════════ MARCO COMÚN ═══════════════ */
var PAL = {op:['#5C21A6','#8B3EDB'], blq:['#0E6BA8','#38BDF8'], frac:['#E8650A','#F5A524'], div:['#16876A','#24C496'], pot:['#7C3AED','#C026D3'], med:['#0F766E','#14B8A6'], dec:['#1E40AF','#3B82F6'], pct:['#BE185D','#F472B6'], eq:['#3D1468','#6C28B4'], est:['#B45309','#F59E0B']};
function marco(id, pal, titulo, sub, cuerpo, pie, tip){
  var p = PAL[pal]||PAL.op;
  return '<div class="fz" id="'+id+'" style="--fz1:'+p[0]+';--fz2:'+p[1]+'">'
    + '<div class="fz-h"><span class="t">🧠 '+titulo+'<small>'+(sub||'')+'</small></span><button onclick="FZ.min(\''+id+'\')" title="Mostrar u ocultar">▾</button></div>'
    + '<div class="fz-b">'+cuerpo+(tip?'<div class="fz-tip">👆 '+tip+'</div>':'')+'</div>'
    + (pie?'<div class="fz-f">'+pie+'</div>':'')
    + '</div>';
}
FZ.min = function(id){ var e=$(id); if(e) e.classList.toggle('min'); };
function nuevoId(){ FZ.n++; return 'fz'+FZ.n; }
/* Tocar el gráfico da 20 s extra al reloj del ejercicio (una vez) */
FZ.toque = function(id){
  var s = FZ.st[id]; if(!s || s.modo!=='ex' || s.bono) return;
  s.bono = true;
  try{ if(typeof tLeft!=='undefined'){ tLeft += 20; if(typeof showXPToast==='function') showXPToast('⏱ +20 s para explorar el gráfico'); } }catch(e){}
};

/* ═══════════════ DETECTOR ═══════════════ */
function claveUnidad(){
  try{ var u = UNITS[curUnit]; return (String(u.name)+' '+String(u.short)).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }catch(e){ return ''; }
}
function detectar(q, ctx, uk){
  var t = limpio(q).replace(/^Ejemplo\s*\d+\s*:\s*/i,''), tc = limpio((ctx||'')+' '+q), m, n;
  var tl = t.toLowerCase(), tcl = tc.toLowerCase();
  // ── Detectores añadidos (cobertura) ──
  var NUMX = '(\\d{1,3}(?:\\.\\d{3})+(?:,\\d+)?|\\d+(?:,\\d+)?|\\d+\\s*\\/\\s*\\d+)';
  if((m = t.match(/(\d+)\s*\^\s*(\d+)\s*([×÷])\s*(\d+)\s*\^\s*(\d+)/)) && m[1]===m[4] && +m[2]<=8 && +m[5]<=8) return {k:'potprop', a:+m[1], e1:+m[2], e2:+m[5], op:m[3]};
  if((m = t.match(/√\s*\(\s*(\d+)\s*([×+])\s*(\d+)\s*\)/))){ var ins = m[2]==='×' ? (+m[1])*(+m[3]) : (+m[1])+(+m[3]); if(ins<=900) return {k:'raiz', n:ins}; }
  if((m = tl.match(/multiplicado por s[ií] mismo da (\d+)/))){ n=+m[1]; if(n<=900) return {k:'raiz', n:n}; }
  if(/diagonal|rampa|cometa|escalera|hipotenusa/i.test(t)){ n = nums(t).filter(function(x){ return x>0 && x<=200; }); if(n.length===2 && !/√/.test(t)) return {k:'pitag', a:n[0], b:n[1]}; }
  if((m = t.match(/(\d+,\d+)\s*(mayor|m[aá]s|menos|menor) que\s*(\d+,\d+)/i))){ var inc=aNum(m[1]), base=aNum(m[3]); var mas=/mayor|m[aá]s/i.test(m[2]); if(!(!mas && inc>base)) return {k:'col', a:base, b:inc, op:mas?'+':'-'}; }
  if((m = t.match(/est[aá] entre (\d+,\d+) y (\d+,\d+)/i))) return {k:'rectad', a:aNum(m[1]), b:aNum(m[2])};
  if(/[Oo]rdena|MAYOR entre|MENOR entre|[Cc]u[aá]l (?:n[uú]mero )?es (?:el )?(?:mayor|menor)|¿Cu[aá]l es mayor|¿Cu[aá]l es menor/.test(t)){
    var lst = t.replace(/^[^:]*(?::|entre)/,'').split(/\s*(?:;|,\s(?=\d)|\so\s|\sy\s)\s*/).map(function(x){ return x.replace(/[?¿]/g,'').replace(/\.$/,'').trim(); }).filter(function(x){ return /^(\d{1,3}(\.\d{3})+|\d+)(,\d+)?$|^\d+\s*\/\s*\d+$|^\d+(,\d+)?\s*%$/.test(x); });
    if(lst.length>=2 && lst.length<=6){ var vals = lst.map(valorDe); if(vals.every(function(v){ return v!==null; })){ if(lst.every(function(x){ return /^[\d.,]+$/.test(x); })) return {k:'ordenar', items:lst}; if(Math.max.apply(null,vals)<=3) return {k:'compara', items:lst.map(function(x,i){ return [x, vals[i]]; })}; } }
  }
  if((m = t.match(/(?:[Qq]u[eé] cifra ocupa|[Cc]u[aá]nto vale|[Cc]u[aá]nt[ao]s (?:unidades|decenas|centenas|unidades de mil|decenas de mil|centenas de mil)[^?]*hay|[Cc]ómo se lee)[^?]*?(\d{1,3}(?:\.\d{3})+|\d{3,})(?:,\d+)?\s*\??/))){ var nsx = t.match(/(\d{1,3}(?:\.\d{3})+|\d{2,})(,\d+)?(?=\s*\??\s*(?:\(|$))/); var cand = nsx ? nsx[0] : m[1]; return {k:'pv', v:aNum(cand), s:cand}; }
  if((m = t.match(/n[uú]mero decimal:?\s*(\d+)\s*\/\s*(\d+)/i))) return {k:'frac', a:+m[1], b:+m[2]};
  if(/porcentaje/i.test(t) && !/%/.test(t)){
    var pp = t.match(/(\d{1,3}(?:\.\d{3})+|\d+) de (\d{1,3}(?:\.\d{3})+|\d+)/) , A0, B0;
    if(pp){ A0=aNum(pp[1]); B0=aNum(pp[2]); }
    else { var nn = nums(t).filter(function(x){ return x>0 && x%1===0; }); if(nn.length===2){ A0=Math.min(nn[0],nn[1]); B0=Math.max(nn[0],nn[1]); } }
    if(A0 && B0 && A0<=B0){ if(B0<=100 && 100%B0===0) return {k:'pct', frac:[A0,B0]}; return {k:'pctbar', a:A0, b:B0}; }
  }
  if(/%/.test(t) && !/\d+\s*%\s*de\s*\$?\s*\d/.test(t)){ var pm = t.match(/(\d+(?:,\d+)?)\s*%/g); if(pm && pm.length===1){ var pv0 = aNum(pm[0]); var otros = nums(t.replace(pm[0],'')).filter(function(x){ return x>=10; }); if(otros.length===1 && pv0<=100) return {k:'pct', p:pv0, N:otros[0]}; } }
  if(/coincid|encontrarse|vuelven a/i.test(t) && ctx){ n = nums(tc).filter(function(x){ return x>1 && x<=60; }); if(n.length>=2 && n.length<=3) return {k:'mcdmcm', ns:n, tipo:'mcm'}; }
  if(/cada pedazo|cada parte|cada baldosa|por estante|cada estante|cada grupo|cada bolsa|cada caja/i.test(t) && ctx && /mayor|m[aá]ximo|lo m[aá]s|iguales|sin que sobre/i.test(tc)){ n = nums(tc).filter(function(x){ return x>1 && x<=300 && x%1===0; }); if(n.length>=2 && n.length<=3) return {k:'mcdmcm', ns:n, tipo:'mcd'}; }
  if((m = t.match(/Si (\d{1,3}(?:\.\d{3})+|\d+) [^,]+? (?:en|cuestan|cuesta|reciben|tardan|medía|llenan)\s*\$?(\d{1,3}(?:\.\d{3})+|\d+)[^.]*? y (\d{1,3}(?:\.\d{3})+|\d+) [^.]*?(?:en|cuestan|cuesta|reciben|tardan|medía|llenan|la hacen en|lo llenan en)\s*\$?(\d{1,3}(?:\.\d{3})+|\d+)/i)) || (m = t.match(/A los (\d+) [^,]+? (\d+) [a-z]+ y a los (\d+) [^.]+? (\d+)/i))) return {k:'relacion', pts:[[aNum(m[1]),aNum(m[2])],[aNum(m[3]),aNum(m[4])]]};
  if((m = t.match(/^\?\s*([+\-−])\s*(\d+)\s*=\s*(\d+)$/))){ var eq2 = parsearEc('x '+m[1]+' '+m[2]+' = '+m[3]); if(eq2){ eq2.txt = t; return eq2; } }
  if((m = t.match(/[Ee]scribe con cifras:?\s*«([^»]+)»/))){ var w0=m[1].toLowerCase(); var lug = /mil[eé]simas?/.test(w0)?3:/cent[eé]simas?/.test(w0)?2:/d[eé]cimas?/.test(w0)?1:0; if(lug) return {k:'pvvacio', lug:lug, txt:m[1]}; }
  // ── Cobertura 100 %: más detectores ──
  if(/\?/.test(t) && !/=\s*\?\s*$/.test(t) && !/^\s*\?\s*=/.test(t) && /^[\d.\s+\-−=?]+$/.test(t.replace(/\s/g,' ')) && (t.match(/\?/g)||[]).length===1 && /=/.test(t)){ var eqq = parsearEc(t.replace('?','x')); if(eqq){ eqq.txt=t; return eqq; } }
  if((m = t.match(/(la mitad|el doble|el triple|el cu[aá]druple) de (\d{1,3}(?:\.\d{3})+|\d+)/i))){ var nn2=aNum(m[2]), w2=m[1].toLowerCase(); if(/mitad/.test(w2)) return {k:'div', a:nn2, b:2}; return {k:'mult', a:nn2, b:/doble/.test(w2)?2:/triple/.test(w2)?3:4}; }
  if((m = t.match(/tiene (\d+) [a-záéíóúñ]+ y (?:su [a-záéíóúñ]+ )?le da (\d+) m[aá]s/i))) return {k:'col', a:+m[1], b:+m[2], op:'+', barra:true};
  if((m = t.match(/vende (\d+) [a-záéíóúñ]+ por d[ií]a durante (\d+) d[ií]as/i))) return {k:'mult', a:+m[1], b:+m[2]};
  if((m = t.match(/a \$(\d{1,3}(?:\.\d{3})+|\d+) cada (?:una?|uno)[^?]*?(?:si vende|compra|vende) (\d+)/i)) || (m = t.match(/compra (\d+) [a-záéíóúñ]+ a \$(\d{1,3}(?:\.\d{3})+|\d+) cada/i))){ var pa=aNum(m[1]), pb=aNum(m[2]); return {k:'mult', a:Math.max(pa,pb), b:Math.min(pa,pb)}; }
  if((m = t.match(/a \$(\d{1,3}(?:\.\d{3})+|\d+) cada (?:una?|uno) y recibe \$(\d{1,3}(?:\.\d{3})+|\d+)/i))) return {k:'div', a:aNum(m[2]), b:aNum(m[1]), modo:'agrupar'};
  if((m = t.match(/[Aa]l simplificar (\d+)\s*\/\s*(\d+)/))) return {k:'frac', a:+m[1], b:+m[2], simp:true};
  if((m = t.match(/cuadrad[oa] mide (\d+) (m|dm|cm) de lado/i))) return {k:'rect', l:+m[1], a:+m[1], per:false};
  if((m = t.match(/n[uú]mero decimal:?\s*(\d+)\s*\/\s*(10|100|1000|10000)\b/i))) return {k:'pvvacio', lug:String(m[2]).length-1, txt:m[1]+'/'+m[2]};
  if((m = t.match(/(\d+(?:,\d+)?)\s*÷\s*(\d+,\d+)/))) return {k:'divdec', a:aNum(m[1]), b:aNum(m[2]), sa:m[1], sb:m[2]};
  if((m = t.match(/[Aa]proxima (\d+,\d+) a (una|dos|tres) cifras? decimal/))) return {k:'aprox', v:aNum(m[1]), s:m[1], c:{una:1,dos:2,tres:3}[m[2]]};
  if((m = t.match(/(?:[Ee]scribe|[Cc]u[aá]l fracci[oó]n es igual a|[Qq]u[eé] porcentaje es|tipo de n[uú]mero decimal es|equivalente a)\s*(\d+,\d+)/))) return {k:'pv', v:aNum(m[1]), s:m[1]};
  if((m = t.match(/relaci[oó]n hay entre (?:el n[uú]mero de |la cantidad de |los |las |el |la )?(.+?) y (?:el |la |los |las |lo que )?(.+?)\?/i)) && !/\d/.test(t)) return {k:'relconcepto', a:m[1], b:m[2]};
  var DD = (t.match(/\d+,\d+|\d+(?=\s*(?:m|km|kg|litros?|d[oó]lares|segundos|toneladas|°C))/g)||[]);
  if(DD.length===2 && /,/.test(DD.join(' '))){ var x1=aNum(DD[0]), x2=aNum(DD[1]);
    if(/quedan|sobran|le quedan|m[aá]s tard[oó]|diferencia|el otro|cu[aá]nto m[aá]s|falta/i.test(t) && x1>x2) return {k:'col', a:x1, b:x2, op:'-'};
    if(/total|juntas|juntos|ahora|en total|lleg[oó]|temperatura del medio|pag[oó]/i.test(t)) return {k:'col', a:x1, b:x2, op:'+'};
  }
  // Potencias
  if((m = t.match(/(\d+)\s*\^\s*(\d+)\s*=\s*\?/)) || (m = t.match(/Calcula:?\s*(\d+)\s*\^\s*(\d+)/))){ var a=+m[1], e=+m[2]; if(a<=20 && e<=6) return {k:'pot', a:a, e:e}; }
  // Raíz cúbica / cuadrada
  if((m = t.match(/∛\s*\(?\s*(\d+)/)) || (m = tl.match(/ra[ií]z c[uú]bica de (\d+)/))){ n=+m[1]; if(n<=1000) return {k:'raiz', n:n, c:true}; }
  if(!/[×x+]\s*\d|√\s*\d+\s*[×+]/.test(t.replace(/√\s*\(/,'')) && ((m = t.match(/√\s*\(?\s*(\d+)\s*\)?(?!\s*[×+\-])/)) || (m = tl.match(/ra[ií]z cuadrada de (\d+)/)))){ n=+m[1]; if(n<=900 && !/entre qu[eé] dos/i.test(t)) return {k:'raiz', n:n}; }
  if((m = tl.match(/cuadrad[oa].{0,40}?(?:[aá]rea de|con)\s*(\d+)\s*(?:dm²|m²|cm²|baldosas)/))){ n=+m[1]; if(n<=900) return {k:'raiz', n:n}; }
  // Operaciones con fracciones
  if((m = t.match(/(\d+)\s*\/\s*(\d+)\s*([+\-−×x÷])\s*(\d+)\s*\/\s*(\d+)/)) && !/x\s*=|\)x/.test(t)) return {k:'fracop', a:+m[1], b:+m[2], op:m[3].replace('−','-').replace('x','×'), c:+m[4], d:+m[5]};
  // Ecuaciones (balanza)
  if(/ecuaci|□/i.test(t) || /(^|[\s(])\d*\s*x\s*[+\-−=]/.test(t)){ var eq = parsearEc(t); if(eq) return eq; }
  // Simplificación / fracción sola
  if((m = t.match(/[Ss]implifica(?:r)? la fracci[oó]n (\d+)\s*\/\s*(\d+)/))) return {k:'frac', a:+m[1], b:+m[2], simp:true};
  if((m = t.match(/divide en (\d+) partes iguales\. Si se \S+ (\d+)\s*\/\s*(\d+)/))) return {k:'frac', a:+m[2], b:+m[3], resto:true};
  if((m = tl.match(/(la mitad|la tercera parte|la cuarta parte|la quinta parte)/)) && /fracci[oó]n/.test(tl)){ var den={'la mitad':2,'la tercera parte':3,'la cuarta parte':4,'la quinta parte':5}[m[1]]; return {k:'frac', a:1, b:den, resto:true}; }
  if((m = t.match(/Escribe (\d+)\s*\/\s*(\d+) como (?:n[uú]mero )?decimal/i)) || (m = t.match(/decimal de (\d+)\s*\/\s*(\d+)/i)) || (m = t.match(/mide (\d+)\s*\/\s*(\d+) de/i))) return {k:'frac', a:+m[1], b:+m[2]};
  // Porcentaje
  if((m = t.match(/(\d+(?:,\d+)?)\s*%\s*de\s*\$?\s*(\d{1,3}(?:\.\d{3})+|\d+)/))) return {k:'pct', p:aNum(m[1]), N:aNum(m[2])};
  if((m = t.match(/(\d{1,3}(?:\.\d{3})+|\d+)\s*y tiene un descuento del (\d+)\s*%/))) return {k:'pct', p:+m[2], N:aNum(m[1])};
  if((m = t.match(/(\d+)\s*de\s*(\d+)\s*(?:problemas|preguntas|estudiantes).*porcentaje/i))) return {k:'pct', frac:[+m[1],+m[2]]};
  if((m = t.match(/porcentaje es (\d+)\s*\/\s*(\d+)/i))) return {k:'pct', frac:[+m[1],+m[2]]};
  if((m = t.match(/^El (\d+)\s*%/))) return {k:'pct', p:+m[1]};
  if((m = t.match(/(\d+)\s*(?:estudiantes|personas|partidos|preguntas|problemas)[^.]*[,.]?\s*(?:y\s*)?(\d+)\s*[^.?]*\.\s*¿Qu[eé] porcentaje/i)) || (m = t.match(/[Dd]e (\d+) [^,]+, (\d+) [^?]*¿Qu[eé] porcentaje/))){ var tot=+m[1], par=+m[2]; if(par>tot){ var tmp=tot; tot=par; par=tmp; } if(tot<=100 && 100%tot===0) return {k:'pct', frac:[par,tot]}; }
  if((m = t.match(/(?:equivale a|escribe) (\d+)\s*%/i))) return {k:'pct', p:+m[1]};
  // MCD / MCM
  if(/\bMCD\b|\bMCM\b/.test(t)){ n = nums(t.replace(/MC[DM]/g,'')).filter(function(x){ return x>0 && x<=1000 && x%1===0; }); if(n.length>=2) return {k:'mcdmcm', ns:n.slice(0,3), tipo:/\bMCD\b/.test(t)?'mcd':'mcm'}; }
  if(/sin que sobre|mayor n[uú]mero posible de grupos|lo m[aá]s largos posible/i.test(t)){ n = nums(t).filter(function(x){ return x>0 && x<=500; }); if(n.length>=2) return {k:'mcdmcm', ns:n.slice(0,3), tipo:'mcd'}; }
  if(/coincid|vuelven a|volver[aá]n a/i.test(t) && /cada/.test(t)){ n = nums(t).filter(function(x){ return x>0 && x<=60; }); if(n.length>=2) return {k:'mcdmcm', ns:n.slice(0,3), tipo:'mcm'}; }
  // Divisores / primos / múltiplos
  if(/divisible|divisor|PRIMO|COMPUESTO|primo o compuesto/i.test(t)){
    n = nums(t).filter(function(x){ return x%1===0 && x>1; });
    if(/¿Es (\d+) divisible por (\d+)/i.test(t)){ m=t.match(/¿Es (\d+) divisible por (\d+)/i); return {k:'divis', n:+m[1], prueba:+m[2]}; }
    if(n.length) { var N=Math.max.apply(null,n); if(N<=400) return {k:'divis', n:N}; }
  }
  if(/m[uú]ltiplo/i.test(t)){
    if((m = t.match(/m[uú]ltiplos de (\d+):\s*([\d,\s]+),\s*\?/i))) return {k:'serie', vals:nums(m[2]), paso:+m[1]};
    if((m = t.match(/¿(\d+) es m[uú]ltiplo de (\d+)/i))) return {k:'divis', n:+m[1], prueba:+m[2], mult:true};
    if((m = t.match(/m[uú]ltiplo de (\d+)/i))){ n=+m[1]; if(n<=50) return {k:'mults', n:n}; }
  }
  // Conversión de unidades
  if((m = t.match(/cu[aá]nt[oa]s (km|hm|dam|m|dm|cm|mm|kg|hg|dag|g|dg|cg|mg|kl|hl|dal|l|dl|cl|ml) equivalen ([\d.,]+)\s*(km|hm|dam|m|dm|cm|mm|kg|hg|dag|g|dg|cg|mg|kl|hl|dal|l|dl|cl|ml)\b/i))) return {k:'conv', a:m[3], b:m[1], v:aNum(m[2])};
  // Volumen / área / perímetro
  if((m = t.match(/(\d+)\s*m\s*×\s*(\d+)\s*m\s*×\s*(\d+)\s*m/))) return {k:'vol', l:+m[1], a:+m[2], h:+m[3]};
  if((m = t.match(/cubo cuyo lado mide (\d+)/i))) return {k:'vol', l:+m[1], a:+m[1], h:+m[1]};
  if((m = t.match(/(\d+)\s*m\s*×\s*(\d+)\s*m/))) return {k:'rect', l:+m[1], a:+m[2], per:/per[ií]metro/i.test(t)};
  if((m = t.match(/cuadrado (?:tiene|cuyo) lado (?:mide )?(\d+)\s*m/i))) return {k:'rect', l:+m[1], a:+m[1], per:/per[ií]metro/i.test(t)};
  if((m = t.match(/catetos de (\d+)\s*m? y (\d+)/i))) return {k:'pitag', a:+m[1], b:+m[2]};
  // Datos
  if((m = t.match(/de:\s*([\d,\s]+\d)\s*[.?]?\s*$/)) && /MODA|MEDIANA|SUMA|MEDIA|PROMEDIO|RANGO/i.test(t)){ var vs = m[1].split(/\s*,\s*/).map(Number).filter(function(x){ return !isNaN(x); }); if(vs.length>=3 && vs.length<=15) return {k:'datos', vals:vs, que:(t.match(/MODA|MEDIANA|SUMA|MEDIA|PROMEDIO|RANGO/i)||[''])[0].toUpperCase()}; }
  // Geometría: ángulos y polígonos
  var POLI = {'triángulo':3,'triangulo':3,'cuadrilátero':4,'cuadrado':4,'pentágono':5,'pentagono':5,'hexágono':6,'hexagono':6,'heptágono':7,'heptagono':7,'octágono':8,'octagono':8,'eneágono':9,'eneagono':9,'decágono':10,'decagono':10};
  if(/[aá]ngulo|grados|vuelta|complementari|suplementari/i.test(t) && !/tri[aá]ngulo rect[aá]ngulo|hipotenusa/i.test(t)){
    var ga = t.match(/(\d+)\s*°/);
    var tipo = /complementari|recto/i.test(t) && ga ? 90 : /suplementari|llano/i.test(t) && ga ? 180 : 0;
    if(ga) return {k:'angulo', g:+ga[1], ref:tipo};
    if(/recto|llano|completo|vuelta/i.test(t)) return {k:'angulo', g:45, ref:0, libre:true};
  }
  if((m = tl.match(/(tri[aá]ngulo|cuadril[aá]tero|pent[aá]gono|hex[aá]gono|hept[aá]gono|oct[aá]gono|ene[aá]gono|dec[aá]gono)/)) && /lados|v[eé]rtices|diagonales/.test(tl)){ return {k:'poligono', n:POLI[m[1].normalize('NFC')]||POLI[m[1]]}; }
  if((m = tl.match(/pol[ií]gono regular de (\d+) lados/))) return {k:'poligono', n:+m[1]};
  // Probabilidad: monedas y casos
  if(/moneda/i.test(t)) return {k:'moneda', n:/2 monedas|dos monedas/i.test(t)?2:1};
  if((m = t.match(/hay (\d+) casos posibles y (\d+) de ellos/i))) return {k:'frac', a:+m[2], b:+m[1]};
  // Probabilidad
  if((m = t.match(/hay (\d+) bolas y (\d+) son (\w+)/i))) return {k:'bolsa', grupos:[{n:+m[2], c:m[3]},{n:+m[1]-(+m[2]), c:'otras'}]};
  if(/bolas? (rojas?|verdes?|azules?|blancas?|amarillas?|negras?)/i.test(t) && /hay/i.test(t)){ var gs=[], rx=/(\d+)\s*(?:bolas?\s*)?(rojas?|verdes?|azules?|blancas?|amarillas?|negras?)/gi, mm; while((mm=rx.exec(t))) gs.push({n:+mm[1], c:mm[2]}); if(gs.length>=2) return {k:'bolsa', grupos:gs}; }
  if(/dado de 6 caras/i.test(t)) return {k:'dado'};
  // Series
  if((m = t.match(/(\d[\d.]*)\s*,\s*(\d[\d.]*)\s*,\s*(\d[\d.]*)\s*,\s*\?/))){ var sv=[aNum(m[1]),aNum(m[2]),aNum(m[3])]; if(sv[1]-sv[0]===sv[2]-sv[1] && sv[1]!==sv[0]) return {k:'serie', vals:sv, paso:sv[1]-sv[0]}; }
  if((m = t.match(/(\d[\d.]*)\s*,\s*(\d[\d.]*)\s*,\s*\?\s*,\s*(\d[\d.]*)/))){ var s2=[aNum(m[1]),aNum(m[2])]; return {k:'serie', vals:s2, paso:s2[1]-s2[0], hueco:aNum(m[3])}; }
  // Valor posicional
  if((m = t.match(/(?:En el n[uú]mero|n[uú]mero)\s+(\d{1,3}(?:\.\d{3})+|\d{2,})\b.*(cifra|valor|posici)/i)) || (m = t.match(/(cifra).*n[uú]mero\s+(\d{1,3}(?:\.\d{3})+|\d{2,})/i))){ var numStr = /^\d/.test(m[1]) ? m[1] : m[2]; return {k:'pv', v:aNum(numStr)}; }
  if((m = t.match(/n[uú]mero (anterior|siguiente|posterior) a (\d{1,3}(?:\.\d{3})+|\d+)/i))) return {k:'recta', v:aNum(m[2])};
  if((m = t.match(/parte (entera|decimal) de (\d{1,3}(?:\.\d{3})*,\d+|\d+,\d+)/i))) return {k:'pv', v:aNum(m[2]), s:m[2]};
  if((m = t.match(/fracci[oó]n decimal:?\s*(\d+,\d+)/i))) return {k:'pv', v:aNum(m[1]), s:m[1]};
  // Comparar dos cantidades (fracción, decimal o porcentaje)
  if((m = t.match(/(?:mayor|menor)[^:]*:\s*([\d,\/]+\s*%?)\s*o\s*([\d,\/]+\s*%?)\s*\??$/i))){ var v1=valorDe(m[1]), v2=valorDe(m[2]); if(v1!==null && v2!==null && v1<=3 && v2<=3) return {k:'compara', items:[[m[1].trim(),v1],[m[2].trim(),v2]]}; }
  if((m = t.match(/cu[aá]nt[ao]s (d[eé]cimas|cent[eé]simas|mil[eé]simas) hay en (\d+,\d+)/i)) || (m = t.match(/(lugar|descomposici[oó]n|lee)[^\d]*(\d+,\d+)/i))) return {k:'pv', v:aNum(m[2]), s:m[2]};
  // Operaciones con decimales
  if((m = t.match(/(\d+(?:,\d+)?)\s*([+\-−×x÷])\s*(\d+(?:,\d+)?)\s*=\s*\?/)) && /,/.test(m[0])){ var da=aNum(m[1]), db=aNum(m[3]), op=m[2].replace('−','-').replace('x','×'); if(op==='+'||op==='-') return {k:'col', a:da, b:db, op:op}; if(op==='×') return {k:'multdec', a:da, b:db, sa:m[1], sb:m[3]}; }
  // Operaciones explícitas con enteros
  if((m = t.match(/(\d{1,3}(?:\.\d{3})+|\d+)\s*([+\-−×x÷])\s*(\d{1,3}(?:\.\d{3})+|\d+)(?!\s*\/)/)) && !/\^|√|%/.test(t)){
    var A=aNum(m[1]), B=aNum(m[3]), o=m[2].replace('−','-').replace('x','×');
    if(o==='+'||o==='-'){ if(A<1e7 && B<1e7 && !(o==='-'&&B>A)) return {k:'col', a:A, b:B, op:o}; }
    if(o==='×') return {k:'mult', a:A, b:B};
    if(o==='÷' && B>0) return {k:'div', a:A, b:B};
  }
  // Problemas de palabras (según unidad)
  var W = nums(t).filter(function(x){ return x>0; });
  if(W.length<2 && ctx){ var Wc = nums(tc).filter(function(x){ return x>0; });
    if(Wc.length>=2 && Wc.length<=4){
      if(/quedan|queda\b|le queda|sobran/i.test(t) && Wc.length===2 && Wc[0]>Wc[1]) return {k:'barras', partes:[Wc[0],Wc[1]], op:'-'};
      if(/en total|entre l[oa]s|hay en la clase|cu[aá]nt[oa]s hay/i.test(t)) return {k:'barras', partes:Wc, op:'+'};
      if(/en cada|cada uno|por (persona|ni[nñ]o)/i.test(t) && Wc.length===2 && Wc[1]>0 && Wc[0]%Wc[1]===0) return {k:'div', a:Wc[0], b:Wc[1]};
    } }
  if((m = t.match(/hay (\d+) [^.]+ y llegan (\d+)/i)) || (m = t.match(/gast[oó] \$(\d+) en [^$]+\$(\d+)/i))) return {k:'col', a:+m[1], b:+m[2], op:'+', barra:true};
  if(W.length===2){
    var a1=W[0], b1=W[1];
    if(/llegaron .* adicionales|m[aá]s tarde|recibi[oó] .* y .* m[aá]s|gan[aó] .* m[aá]s|en total\?$/i.test(t) && /adicion|suma/.test(uk)) return {k:'col', a:a1, b:b1, op:'+', barra:true};
    if(/(se usaron|usaron|se sacan|se vendieron|se ocupan|gast[oó]|quedan|le quedan)/i.test(t) && a1>b1 && /sustrac|resta|problema/.test(uk)) return {k:'col', a:a1, b:b1, op:'-', barra:true};
    if((m = t.match(/en (\d+) grupos iguales y coloc[oó] (\d+)/i))) return {k:'mult', a:+m[2], b:+m[1]};
    if((m = t.match(/Cada caja tiene (\d+)[^.]*\. Hay (\d+) cajas/i))) return {k:'mult', a:+m[1], b:+m[2]};
    if((m = t.match(/Tiene (\d+) .*grupos de (\d+)/i))) return {k:'div', a:+m[1], b:+m[2], modo:'agrupar'};
    if((m = t.match(/Tiene (\d+) .*entre (\d+) grupos/i))) return {k:'div', a:+m[1], b:+m[2]};
    if((m = t.match(/[Ss]e reparten (\d+) .* entre (\d+)/))) return {k:'div', a:+m[1], b:+m[2]};
  }
  // Proporciones "Halla x" y razón a:b con un dato
  if((m = t.match(/(\d+|x)\s*\/\s*(\d+|x)\s*=\s*(\d+|x)\s*\/\s*(\d+|x)/)) && /Halla x/i.test(t)){ var g=[m[1],m[2],m[3],m[4]].map(function(v){ return v==='x'?null:{v:+v,u:''}; }); return {k:'r3', f:[[g[0],g[1]],[g[2],g[3]]], titulo:'Proporción'}; }
  if((m = t.match(/raz[oó]n (?:de )?([a-záéíóúñ ]+?) a ([a-záéíóúñ ]+?) (?:en [^.]*?)?es (\d+)\s*:\s*(\d+)/i)) || (m = t.match(/([a-záéíóúñ]+) y ([a-záéíóúñ]+) en raz[oó]n (\d+)\s*:\s*(\d+)/i))){
    var n1=m[1].trim().split(' ').pop(), n2=m[2].trim().split(' ').pop(), ra=+m[3], rb=+m[4];
    var rest = t.slice(t.indexOf(m[0])+m[0].length), mm = rest.match(/(\d+)\s*(?:kilos de |tazas de )?([a-záéíóúñ]+)/i);
    if(mm){ var val=+mm[1], w=mm[2].toLowerCase(); var c1 = w.slice(0,4)===n1.toLowerCase().slice(0,4), c2 = w.slice(0,4)===n2.toLowerCase().slice(0,4);
      if(c1!==c2) return {k:'r3', f:[[{v:ra,u:n1},{v:rb,u:n2}], c1?[{v:val,u:n1},null]:[null,{v:val,u:n2}]], titulo:'Razón '+ra+':'+rb}; }
  }
  if((m = t.match(/raz[oó]n[^.]*?(\d+)\s*:\s*(\d+)\.\s*Si (?:el|la) (primer[oa]?|segund[oa])[^\d]*(\d+)/i))){ var pr=/primer/i.test(m[3]); return {k:'r3', f:[[{v:+m[1],u:'primero'},{v:+m[2],u:'segundo'}], pr?[{v:+m[4],u:''},null]:[null,{v:+m[4],u:''}]], titulo:'Razón '+m[1]+':'+m[2]}; }
  if((m = t.match(/raz[oó]n (\d+)\s*:\s*(\d+) entre (?:el |la )?([a-záéíóúñ]+) y (?:el |la )?([a-záéíóúñ]+)\. Si (?:el |la )?([a-záéíóúñ]+) mide (\d+)/i))){ var c1=m[5].slice(0,4)===m[3].slice(0,4); return {k:'r3', f:[[{v:+m[1],u:m[3]},{v:+m[2],u:m[4]}], c1?[{v:+m[6],u:m[3]},null]:[null,{v:+m[6],u:m[4]}]], titulo:'Escala '+m[1]+':'+m[2]}; }
  // Razones
  if((m = t.match(/hay (\d+) ([a-záéíóúñ ]+?) y (\d+) ([a-záéíóúñ ]+?)\.\s*¿Cu[aá]l es la raz[oó]n/i))){ var r1=+m[1], r2=+m[3]; if(r1<=30 && r2<=30) return {k:'razon', a:r1, b:r2, na:m[2].trim(), nb:m[4].trim()}; }
  if((m = t.match(/[Ss]implifica la raz[oó]n (\d+)\s*:\s*(\d+)/))){ if(+m[1]<=30 && +m[2]<=30) return {k:'razon', a:+m[1], b:+m[2], na:'', nb:''}; }
  // Magnitudes: "cada uno"
  if((m = t.match(/Si (\d+) [a-záéíóúñ]+ reciben (\d+) [a-záéíóúñ]+ cada/i))) return {k:'mult', a:+m[2], b:+m[1]};
  if((m = t.match(/Hay (\d{1,3}(?:\.\d{3})+|\d+) [^.]+\. Si a cada uno le tocan (\d+)/i))) return {k:'div', a:aNum(m[1]), b:+m[2], modo:'agrupar'};
  // Regla de tres
  if(/proporc|regla de tres|magnitud|razon/i.test(uk)){
    var r3 = parsearR3(t); if(r3) return r3;
  }
  return null;
}
function ladoEc(L){
  L = L.replace(/□/g,'x').replace(/\s+/g,'');
  if(/[\/()×÷*]/.test(L)) return null;
  var toks = L.match(/[+-]?[^+-]+/g); if(!toks) return null;
  var cx=0, k=0;
  for(var i=0;i<toks.length;i++){
    var tk = toks[i], sg = tk[0]==='-'?-1:1; tk = tk.replace(/^[+-]/,'');
    if(/^\d*x$/.test(tk)){ cx += sg*(tk==='x'?1:+tk.replace('x','')); }
    else if(/^(\d{1,3}(\.\d{3})+|\d+)$/.test(tk)){ k += sg*aNum(tk); }
    else return null;
  }
  return {x:cx, k:k};
}
function parsearEc(t){
  var limpioT = t.replace(/Resuelve la ecuaci[oó]n:?/i,'').replace(/¿Qu[eé] n[uú]mero falta para que la igualdad sea verdadera\?/i,'').trim();
  var txt = limpioT.replace(/−/g,'-');
  var m = txt.match(/soluci[oó]n de la ecuaci[oó]n\s+(.+?)\?/i); if(m) txt = m[1];
  if(/[a-wyzA-Z]{2,}/.test(txt.replace(/x/g,''))) return null;
  var parts = txt.split('='); if(parts.length!==2) return null;
  var I = ladoEc(parts[0]), D = ladoEc(parts[1]); if(!I||!D) return null;
  if(I.x<0 && D.x===0){ I = {x:-I.x, k:D.k}; D = {x:0, k:ladoEc(parts[0]).k}; }
  else if(D.x<0 && I.x===0){ var I2 = {x:-D.x, k:I.k}; D = {x:0, k:ladoEc(parts[1]).k}; I = I2; }
  if(I.x<0 || D.x<0) return null;
  if(I.x===0 && D.x===0) return null;
  if(I.x < D.x){ var tmp=I; I=D; D=tmp; }     // la x que más pesa, a la izquierda
  if(I.x===D.x) return null;
  var sol = (D.k - I.k)/(I.x - D.x);
  if(!(sol>0) || sol%1) return null;
  return {k:'eq', xl:I.x, kl:I.k, xr:D.x, kr:D.k, txt:limpioT};
}
function valorDe(s){
  s = String(s).trim(); var m;
  if((m = s.match(/^(\d+)\s*\/\s*(\d+)$/))) return +m[2] ? +m[1]/+m[2] : null;
  if((m = s.match(/^(\d+(?:,\d+)?)\s*%$/))) return aNum(m[1])/100;
  if(/^\d+(,\d+)?$/.test(s)) return aNum(s);
  return null;
}
function parsearR3(t){
  if(/aument|disminu|se van|se retiran|m[aá]s gallinas|y .* m[aá]s/i.test(t)) return null;
  var rx = /(\d{1,3}(?:\.\d{3})+|\d+(?:,\d+)?)\s*([a-záéíóúñ/]+)?/gi, m, L=[];
  var PAL = {un:1,una:1,uno:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12};
  var tt = t.replace(/^(Una|Un|Uno|Dos|Tres|Cuatro|Cinco|Seis|Siete|Ocho|Nueve|Diez|Once|Doce)\s+/i, function(w){ return PAL[w.trim().toLowerCase()]+' '; });
  tt = tt.replace(/\bun paquete de \d+ [a-záéíóúñ]+/i,'1 paquete');
  while((m = rx.exec(tt))) L.push({v:aNum(m[1]), u:(m[2]||'').toLowerCase()});
  if(L.length!==3){ L=[]; rx.lastIndex=0; while((m = rx.exec(t))) L.push({v:aNum(m[1]), u:(m[2]||'').toLowerCase()}); }
  if(L.length!==3) return null;
  if(L[0].u && L[2].u && L[0].u.slice(0,4)===L[2].u.slice(0,4) && L[0].u!==L[1].u) return {k:'r3', f:[[L[0],L[1]],[L[2],null]]};
  if(L[1].u && L[2].u && L[1].u.slice(0,4)===L[2].u.slice(0,4) && L[0].u!==L[1].u) return {k:'r3', f:[[L[1],L[0]],[L[2],null]]};
  if(L[0].u && !L[2].u && /cuestan|cuesta/.test(t) && L[1].u==='' ) return null;
  return null;
}

function isoCubos(L, A, H, S, cols){
  var mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9, body='';
  for(var z=0;z<H;z++) for(var y=A-1;y>=0;y--) for(var x=0;x<L;x++){
    var px=(x-y)*S*.87, py=(x+y)*S*.5-z*S;
    mnx=Math.min(mnx,px); mxx=Math.max(mxx,px+S*1.74); mny=Math.min(mny,py-S*.5); mxy=Math.max(mxy,py+S*1.5);
    body+='<path d="M'+px.toFixed(1)+' '+py.toFixed(1)+' l'+(S*.87)+' '+(-S*.5)+' l'+(S*.87)+' '+(S*.5)+' l'+(-S*.87)+' '+(S*.5)+'z" fill="'+cols[0]+'" stroke="'+cols[3]+'" stroke-width=".7"/>'
      +'<path d="M'+px.toFixed(1)+' '+py.toFixed(1)+' l'+(S*.87)+' '+(S*.5)+' v'+S+' l'+(-S*.87)+' '+(-S*.5)+'z" fill="'+cols[1]+'" stroke="'+cols[3]+'" stroke-width=".7"/>'
      +'<path d="M'+(px+S*1.74).toFixed(1)+' '+py.toFixed(1)+' l'+(-S*.87)+' '+(S*.5)+' v'+S+' l'+(S*.87)+' '+(-S*.5)+'z" fill="'+cols[2]+'" stroke="'+cols[3]+'" stroke-width=".7"/>';
  }
  var w=mxx-mnx+8, h=mxy-mny+8;
  return '<svg class="fz-svg" viewBox="'+(mnx-4).toFixed(1)+' '+(mny-4).toFixed(1)+' '+w.toFixed(1)+' '+h.toFixed(1)+'" width="'+Math.min(340, Math.round(w*1.3))+'">'+body+'</svg>';
}
/* ═══════════════ WIDGETS ═══════════════ */
var W = {};

/* ── 1. Pizarra en columnas (suma / resta, enteros o decimales) ── */
var PLC = ['U','D','C','UM','DM','CM','UMill','DMill'], PLCOL = ['#E8650A','#16876A','#C94B22','#1A6CB4','#7C3AED','#BE185D','#0F766E','#B45309'];
var PLDEC = ['d','c','m','dm'], PLDCOL = ['#0EA5E9','#6366F1','#A855F7','#EC4899'];
W.col = function(d, modo, id){
  var da = Math.max(dec(d.a), dec(d.b)), f = Math.pow(10,da);
  var A = Math.round(d.a*f), B = Math.round(d.b*f);
  var R = d.op==='+' ? A+B : A-B;
  var nd = Math.max(String(A).length, String(B).length, String(R).length) + (d.op==='+'?0:0);
  if(nd>9) return null;
  var ent = nd - da;
  var digs = function(v){ var s=String(v); while(s.length<nd) s=' '+s; return s.split(''); };
  var cA = digs(A), cB = digs(B);
  // encabezados de lugar
  var hs = [];
  for(var i=0;i<nd;i++){ var pos = nd-1-i; if(pos<da){ var k=da-1-pos; hs.push([PLDEC[k]||'', PLDCOL[k]||'#888']); } else { var k2=pos-da; hs.push([PLC[k2]||'', PLCOL[k2]||'#888']); } }
  function fila(cls, celdas){ return '<tr class="'+cls+'"><td class="op"></td>'+celdas.map(function(c,i){ return (da && i===ent ? '<td class="cm">'+(cls==='ln'?'':',')+'</td>' : '')+c; }).join('')+'</tr>'; }
  var h = '<table class="fz-col"><tr><th style="background:none"></th>'+hs.map(function(x,i){ return (da&&i===ent?'<th style="background:none;width:14px"></th>':'')+'<th style="background:'+x[1]+'">'+x[0]+'</th>'; }).join('')+'</tr>';
  h += fila('cr', cA.map(function(_,i){ return '<td><input maxlength="1" id="'+id+'c'+i+'" oninput="FZ.toque(\''+id+'\')" title="'+(d.op==='+'?'Lo que llevas':'Préstamo')+'"></td>'; }));
  h += fila('', cA.map(function(c,i){ return '<td id="'+id+'a'+i+'" style="color:'+(c===' '?'':hs[i][1])+'">'+(c===' '?'':c)+'</td>'; })).replace('<td class="op"></td>','<td class="op"></td>');
  h += fila('', cB.map(function(c,i){ return '<td id="'+id+'b'+i+'" style="color:'+(c===' '?'':hs[i][1])+'">'+(c===' '?'':c)+'</td>'; })).replace('<td class="op"></td>','<td class="op">'+(d.op==='+'?'+':'−')+'</td>');
  h += fila('ln', cA.map(function(){ return '<td></td>'; }));
  h += fila('rs', cA.map(function(_,i){ return '<td><input maxlength="1" inputmode="numeric" id="'+id+'r'+i+'" oninput="FZ.colIn(\''+id+'\','+i+',this)"></td>'; }));
  h += '</table>';
  FZ.st[id] = {modo:modo, nd:nd, A:A, B:B, R:R, op:d.op, da:da, a:d.a, b:d.b};
  var blq = (!da && d.a<=999 && d.b<=999);
  var pie = '<button class="fz-btn w" onclick="FZ.colVoz(\''+id+'\')">🔊 ¿Cómo se hace?</button>'
    + (blq ? '<button class="fz-btn b" onclick="FZ.bloques(\''+id+'\')">🧱 Ver con bloques</button>' : '')
    + (d.barra ? '<button class="fz-btn o" onclick="FZ.barra(\''+id+'\')">📊 Modelo de barras</button>' : '')
    + (modo==='ej' ? '<button class="fz-btn g" onclick="FZ.colAnim(\''+id+'\')">▶ Resolver animado</button>' : '')
    + '<span class="fz-msg" id="'+id+'m">Empieza por la columna de la derecha (unidades) ➜ ⬅</span>';
  var extra = '<div id="'+id+'x" style="margin-top:10px"></div>';
  return marco(id, 'op', d.op==='+'?'Pizarra de suma':'Pizarra de resta', 'columna por columna', h+extra, pie, 'Escribe en las casillas amarillas de derecha a izquierda. Arriba, en rojo, anota lo que '+(d.op==='+'?'llevas':'pides prestado')+'.');
};
FZ.colIn = function(id, i, el){
  FZ.toque(id);
  el.value = el.value.replace(/[^0-9]/g,'');
  if(el.value && i>0){ var p = $(id+'r'+(i-1)); if(p) p.focus(); }
};
FZ.colVoz = function(id){
  var s = FZ.st[id]; if(!s) return;
  hablar(s.op==='+' ? 'Suma columna por columna, empezando por las unidades. Si una columna pasa de nueve, escribe las unidades y lleva una decena a la columna de la izquierda.' : 'Resta columna por columna, empezando por las unidades. Si arriba el número es menor, pide prestada una decena a la columna de la izquierda.');
};
FZ.colAnim = function(id){
  var s = FZ.st[id]; if(!s || s.anim) return; s.anim = true;
  var dA = String(s.A).padStart(s.nd,'0').split('').map(Number), dB = String(s.B).padStart(s.nd,'0').split('').map(Number);
  var dR = String(s.R).padStart(s.nd,'0').split('');
  var carry = 0, i = s.nd-1, pasos = [];
  for(; i>=0; i--){
    var t;
    if(s.op==='+'){ t = dA[i]+dB[i]+carry; pasos.push({i:i, txt:dA[i]+' + '+dB[i]+(carry?' + '+carry+' que llevaba':'')+' = '+t+(t>9?' → escribo '+(t%10)+' y llevo 1':''), c:(t>9&&i>0)?1:0}); carry = t>9?1:0; }
    else { var top = dA[i]-carry; var pres = top<dB[i]; t = (pres?top+10:top)-dB[i]; pasos.push({i:i, txt:(pres?'Pido prestado: '+(top+10):top)+' − '+dB[i]+' = '+t, c:pres&&i>0?1:0}); carry = pres?1:0; }
  }
  var k = 0;
  (function paso(){
    if(!$(id)){ s.anim=false; return; }
    if(k>=pasos.length){ var m=$(id+'m'); if(m) m.textContent = '✅ Resultado: '+fmt(s.op==='+'?s.a+s.b:s.a-s.b); s.anim=false; hablar('Resultado: '+fmt(s.op==='+'?s.a+s.b:s.a-s.b)); return; }
    var p = pasos[k++];
    document.querySelectorAll('#'+id+' td.hl').forEach(function(x){ x.classList.remove('hl'); });
    [$(id+'a'+p.i), $(id+'b'+p.i)].forEach(function(x){ if(x) x.classList.add('hl'); });
    var r = $(id+'r'+p.i); if(r){ var lead = (p.i < s.nd-String(s.R).length); r.value = lead ? '' : dR[p.i]; }
    if(p.c && p.i>0){ var c = $(id+'c'+(p.i-1)); if(c) c.value = s.op==='+'?'1':'-1'; }
    var m = $(id+'m'); if(m) m.textContent = p.txt;
    tono(); hablar(p.txt.replace('−','menos'));
    setTimeout(paso, 2300);
  })();
};
FZ.bloques = function(id){
  var s = FZ.st[id]; var x = $(id+'x'); if(!s||!x) return; FZ.toque(id);
  if(x.innerHTML){ x.innerHTML=''; return; }
  function blq(v){ var c=Math.floor(v/100), d=Math.floor(v%100/10), u=v%10, h='';
    h += '<div class="row">'+Array(c+1).join('<span class="fz-c100"></span>')+Array(d+1).join('<span class="fz-c10"></span>')+'</div>';
    h += '<div class="row" style="max-width:90px">'+Array(u+1).join('<span class="fz-c1"></span>')+'</div>';
    return h; }
  x.innerHTML = '<div class="fz-blk"><div class="g">'+blq(s.a)+'<span class="lab">'+s.a+' = '+Math.floor(s.a/100)+' C · '+Math.floor(s.a%100/10)+' D · '+(s.a%10)+' U</span></div>'
    + '<div style="font-size:30px;font-weight:900;color:#E8650A;align-self:center">'+(s.op==='+'?'+':'−')+'</div>'
    + '<div class="g">'+blq(s.b)+'<span class="lab">'+s.b+' = '+Math.floor(s.b/100)+' C · '+Math.floor(s.b%100/10)+' D · '+(s.b%10)+' U</span></div></div>'
    + '<div class="fz-tip" style="text-align:center">🟦 centena = 100 · 🟩 decena = 10 · 🟧 unidad = 1 · Cada 10 unidades se cambian por 1 decena.</div>';
};
FZ.barra = function(id){
  var s = FZ.st[id]; var x = $(id+'x'); if(!s||!x) return; FZ.toque(id);
  if(x.innerHTML){ x.innerHTML=''; return; }
  var W0 = 440, tot = s.op==='+' ? s.a+s.b : s.a, wa = s.op==='+' ? W0*s.a/tot : W0*(s.a-s.b)/tot, wb = W0 - wa;
  var svg = '<svg class="fz-svg" viewBox="0 0 480 120" width="480">';
  if(s.op==='+'){
    svg += '<rect x="20" y="40" width="'+wa+'" height="40" rx="8" fill="#8B3EDB"/><text x="'+(20+wa/2)+'" y="66" fill="#fff" font-size="16" font-weight="900" text-anchor="middle">'+fmt(s.a)+'</text>'
      + '<rect x="'+(20+wa)+'" y="40" width="'+wb+'" height="40" rx="8" fill="#FF8C2A"/><text x="'+(20+wa+wb/2)+'" y="66" fill="#fff" font-size="16" font-weight="900" text-anchor="middle">'+fmt(s.b)+'</text>'
      + '<path d="M20 30 v-10 h'+W0+' v10" stroke="#3D1468" stroke-width="3" fill="none"/><text x="'+(20+W0/2)+'" y="16" fill="#3D1468" font-size="18" font-weight="900" text-anchor="middle">Total = ?</text>';
  } else {
    svg += '<rect x="20" y="40" width="'+W0+'" height="40" rx="8" fill="#E8DBFF" stroke="#8B3EDB" stroke-width="2"/>'
      + '<rect x="'+(20+wa)+'" y="40" width="'+wb+'" height="40" rx="8" fill="#FF8C2A"/><text x="'+(20+wa+wb/2)+'" y="66" fill="#fff" font-size="15" font-weight="900" text-anchor="middle">se van '+fmt(s.b)+'</text>'
      + '<text x="'+(20+wa/2)+'" y="66" fill="#3D1468" font-size="18" font-weight="900" text-anchor="middle">¿quedan?</text>'
      + '<path d="M20 30 v-10 h'+W0+' v10" stroke="#3D1468" stroke-width="3" fill="none"/><text x="'+(20+W0/2)+'" y="16" fill="#3D1468" font-size="16" font-weight="900" text-anchor="middle">Al inicio: '+fmt(s.a)+'</text>';
  }
  svg += '</svg>';
  x.innerHTML = svg;
};

/* ── 2. Multiplicación: arreglo o modelo de área ── */
W.mult = function(d, modo, id){
  var a = d.a, b = d.b;
  FZ.st[id] = {modo:modo, a:a, b:b, fil:0};
  if(a<=12 && b<=12){
    var h = '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;justify-content:center"><div class="fz-dots" style="grid-template-columns:repeat('+a+',18px)">';
    for(var r=0;r<b;r++) for(var c=0;c<a;c++) h += '<span class="fz-dot off" data-r="'+r+'" onclick="FZ.multFila(\''+id+'\','+r+')"></span>';
    h += '</div><div><div class="fz-eq" id="'+id+'e">'+b+' filas de '+a+'</div><div class="fz-msg" id="'+id+'m" style="margin-top:6px">Toca las filas para ir contando</div></div></div>';
    var pie = '<button class="fz-btn" onclick="FZ.multFila(\''+id+'\',-1)">➕ Una fila más</button><button class="fz-btn w" onclick="FZ.multReset(\''+id+'\')">↺ Empezar</button>'
      + (modo==='ej' ? '<button class="fz-btn g" onclick="FZ.multTodo(\''+id+'\')">▶ Resolver animado</button>':'');
    return marco(id, 'op', 'Arreglo de multiplicación', b+' × '+a, h, pie, 'Cada fila tiene '+a+'. Multiplicar es sumar filas iguales.');
  }
  // Modelo de área (partes por valor posicional)
  function partes(n){ var s=String(n), p=[]; for(var i=0;i<s.length;i++){ var v=+s[i]*Math.pow(10,s.length-1-i); if(v) p.push(v); } return p.slice(0,4); }
  var pa = partes(a), pb = partes(b);
  if(pa.length*pb.length>12) return null;
  var h2 = '<table class="fz-col" style="border-spacing:5px"><tr><td class="op">×</td>'+pa.map(function(v){ return '<td style="background:#EDE3FF;font-size:18px;min-width:70px">'+fmt(v)+'</td>'; }).join('')+'</tr>';
  pb.forEach(function(w,j){ h2 += '<tr><td style="background:#FFE8CC;font-size:18px;min-width:60px">'+fmt(w)+'</td>'+pa.map(function(v,i){ return '<td style="background:#FFFFFF;min-width:70px"><input id="'+id+'p'+j+'_'+i+'" style="font-size:16px" placeholder="?" oninput="FZ.toque(\''+id+'\')"></td>'; }).join('')+'</tr>'; });
  h2 += '</table>';
  FZ.st[id].pa = pa; FZ.st[id].pb = pb;
  var pie2 = '<span class="fz-msg" id="'+id+'m">Multiplica cada pareja y al final suma todas las casillas</span>'
    + (modo==='ej' ? '<button class="fz-btn g" onclick="FZ.areaTodo(\''+id+'\')">▶ Resolver animado</button>':'');
  return marco(id, 'op', 'Modelo de área', fmt(a)+' × '+fmt(b)+' por partes', h2, pie2, 'Descompón cada número (ej. 42 = 40 + 2) y multiplica las partes.');
};
FZ.multFila = function(id, r){
  var s = FZ.st[id]; if(!s) return; FZ.toque(id);
  s.fil = r<0 ? Math.min(s.b, s.fil+1) : r+1;
  document.querySelectorAll('#'+id+' .fz-dot').forEach(function(d){ d.classList.toggle('off', +d.getAttribute('data-r') >= s.fil); });
  var m = $(id+'m'); if(m) m.textContent = s.fil+' fila'+(s.fil>1?'s':'')+' de '+s.a+' = '+(s.fil*s.a);
  tono();
};
FZ.multReset = function(id){ var s=FZ.st[id]; if(!s) return; s.fil=0; document.querySelectorAll('#'+id+' .fz-dot').forEach(function(d){ d.classList.add('off'); }); var m=$(id+'m'); if(m) m.textContent='Toca las filas para ir contando'; };
FZ.multTodo = function(id){ var s=FZ.st[id]; if(!s) return; s.fil=0; var t=setInterval(function(){ if(!$(id)){ clearInterval(t); return; } FZ.multFila(id,-1); if(s.fil>=s.b){ clearInterval(t); hablar(s.b+' por '+s.a+' es '+(s.a*s.b)); } }, 500); };
FZ.areaTodo = function(id){
  var s = FZ.st[id]; if(!s) return; var tot=0, k=0, L=[];
  s.pb.forEach(function(w,j){ s.pa.forEach(function(v,i){ L.push([j,i,v*w]); }); });
  var t = setInterval(function(){
    if(k>=L.length){ clearInterval(t); var m=$(id+'m'); if(m) m.textContent='Suma de las partes: '+L.map(function(x){ return fmt(x[2]); }).join(' + ')+' = '+fmt(tot); hablar('Sumamos las partes: el resultado es '+fmt(tot)); return; }
    if(!$(id)){ clearInterval(t); return; }
    var x = L[k++]; tot += x[2]; var e = $(id+'p'+x[0]+'_'+x[1]); if(e) e.value = fmt(x[2]); tono();
  }, 700);
};

/* ── 3. División: reparto o galera ── */
W.div = function(d, modo, id){
  var a = d.a, b = d.b;
  FZ.st[id] = {modo:modo, a:a, b:b, ronda:0};
  if(a<=60 && b>=2 && b<=10){
    var ag = d.modo==='agrupar';
    var h = '<div class="fz-pile" id="'+id+'pile"></div><div class="fz-plates" id="'+id+'pl"></div>';
    var pie = '<button class="fz-btn o" onclick="FZ.repartir(\''+id+'\')">🍬 '+(ag?'Formar un grupo':'Repartir una ronda')+'</button><button class="fz-btn w" onclick="FZ.divReset(\''+id+'\')">↺ Empezar</button>'
      + (modo==='ej' ? '<button class="fz-btn g" onclick="FZ.divTodo(\''+id+'\')">▶ Resolver animado</button>':'')
      + '<span class="fz-msg" id="'+id+'m">Tienes '+a+(ag?' · haz grupos de '+b:' para repartir entre '+b)+'</span>';
    FZ.st[id].ag = ag;
    setTimeout(function(){ FZ.divReset(id); }, 0);
    return marco(id, 'div', ag?'Hacer grupos':'Repartir en partes iguales', a+' ÷ '+b, h, pie, ag?'Cada toque forma un grupo de '+b+'. ¿Cuántos grupos salen?':'Cada toque da uno a cada plato. Lo que no alcanza es el residuo.');
  }
  // Galera + tabla del divisor
  var h2 = '<div style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap;justify-content:center">'
    + '<div style="font-family:\'Baloo 2\',sans-serif;font-size:30px;font-weight:900;display:flex;align-items:flex-start"><span style="padding:4px 10px;letter-spacing:4px">'+fmt(a).replace(/\./g,'')+'</span><span style="border-left:4px solid #1A1033;border-bottom:4px solid #1A1033;padding:4px 12px;color:#E8650A">'+b+'</span></div>'
    + '<div><div style="font-weight:900;color:#16876A;margin-bottom:6px">📋 Tabla del '+b+' (toca para marcar)</div><div class="fz-chips">';
  for(var i=1;i<=10;i++) h2 += '<span class="fz-chip" onclick="this.classList.toggle(\'on\');FZ.toque(\''+id+'\')">'+b+'×'+i+' = '+fmt(b*i)+'</span>';
  h2 += '</div></div></div>';
  return marco(id, 'div', 'Galera de la división', fmt(a)+' ÷ '+b, h2, '<span class="fz-msg">Busca en la tabla cuántas veces cabe '+b+' en las primeras cifras</span>', 'Baja cifra por cifra: ¿cuántas veces cabe el divisor? multiplica, resta y baja la siguiente.');
};
FZ.divReset = function(id){
  var s = FZ.st[id]; if(!s) return; s.ronda = 0; s.quedan = s.a;
  var pile = $(id+'pile'), pl = $(id+'pl'); if(!pile||!pl) return;
  pile.innerHTML = Array(s.a+1).join('<span class="fz-cand">🍬</span>');
  pl.innerHTML = s.ag ? '' : Array(s.b+1).join('x').split('').map(function(_,i){ return '<div class="fz-plate" id="'+id+'p'+i+'"><b>'+(i+1)+'</b></div>'; }).join('');
  var m=$(id+'m'); if(m) m.textContent='Tienes '+s.a+(s.ag?' · haz grupos de '+s.b:' para repartir entre '+s.b);
};
FZ.repartir = function(id){
  var s = FZ.st[id]; if(!s) return; FZ.toque(id);
  var pile = $(id+'pile'), pl = $(id+'pl'), m = $(id+'m');
  if(!pile || !pl) return false;
  if(s.quedan < s.b){ if(m) m.textContent = s.quedan ? '¡Ya no alcanza! Sobran '+s.quedan+' (residuo)' : '¡Repartido todo! No sobra nada'; tono(); return false; }
  s.quedan -= s.b; s.ronda++;
  for(var k=0;k<s.b;k++){ if(pile.lastChild) pile.removeChild(pile.lastChild); }
  if(s.ag){ var g=document.createElement('div'); g.className='fz-plate'; g.innerHTML=Array(s.b+1).join('<span class="fz-cand">🍬</span>')+'<b>'+s.ronda+'</b>'; pl.appendChild(g); }
  else for(var i=0;i<s.b;i++){ var p=$(id+'p'+i); if(p){ var c=document.createElement('span'); c.className='fz-cand'; c.textContent='🍬'; p.insertBefore(c, p.lastChild); } }
  if(m) m.textContent = s.ag ? s.ronda+' grupo'+(s.ronda>1?'s':'')+' · quedan '+s.quedan : 'Ronda '+s.ronda+': cada plato tiene '+s.ronda+' · quedan '+s.quedan;
  tono(); return true;
};
FZ.divTodo = function(id){ FZ.divReset(id); var s=FZ.st[id]; var t=setInterval(function(){ if(!$(id)){ clearInterval(t); return; } if(!FZ.repartir(id)){ clearInterval(t); hablar(s.ag?('Se forman '+s.ronda+' grupos'+(s.quedan?' y sobran '+s.quedan:'')):('A cada uno le tocan '+s.ronda+(s.quedan?' y sobran '+s.quedan:''))); } }, 700); };

/* ── 4. Fracción (círculo + barra) ── */
function pastel(a, b, R, col){
  var cx=R+4, cy=R+4, svg='<svg class="fz-svg" viewBox="0 0 '+(2*R+8)+' '+(2*R+8)+'" width="'+(2*R+8)+'">';
  if(b===1){ svg += '<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="'+(a>=1?col:'#fff')+'" stroke="#3D1468" stroke-width="3"/>'; return svg+'</svg>'; }
  for(var i=0;i<b;i++){
    var a0 = -Math.PI/2 + i*2*Math.PI/b, a1 = a0 + 2*Math.PI/b;
    var x0=cx+R*Math.cos(a0), y0=cy+R*Math.sin(a0), x1=cx+R*Math.cos(a1), y1=cy+R*Math.sin(a1);
    svg += '<path d="M'+cx+' '+cy+' L'+x0.toFixed(1)+' '+y0.toFixed(1)+' A'+R+' '+R+' 0 0 1 '+x1.toFixed(1)+' '+y1.toFixed(1)+' Z" fill="'+(i<a?col:'#FFFFFF')+'" stroke="#3D1468" stroke-width="2.5"/>';
  }
  return svg+'</svg>';
}
function barra(id, a, b, clase, grupo, click){
  var h = '<div class="fz-bar" style="width:'+Math.min(460, Math.max(220, b*26))+'px">';
  for(var i=0;i<b;i++) h += '<i class="'+(i<a?clase:'')+(grupo && (i+1)%grupo===0 && i<b-1?' gb':'')+'" '+(click?'onclick="FZ.fracClic(\''+id+'\','+i+',this)"':'')+'></i>';
  return h+'</div>';
}
function frac(a,b){ return '<span class="fz-fr"><span>'+a+'</span><span>'+b+'</span></span>'; }
W.frac = function(d, modo, id){
  var a=d.a, b=d.b; if(b>40 || a>b*3) return null;
  FZ.st[id] = {modo:modo, a:a, b:b, sh:a};
  var enteros = Math.floor(a/b), resto = a%b, pies = '';
  for(var w=0; w<enteros; w++) pies += pastel(b, b, 52, '#FF8C2A');
  if(resto || !enteros) pies += pastel(resto, b, 52, '#FF8C2A');
  var h = '<div class="fz-frow"><div style="display:flex;gap:6px;flex-wrap:wrap">'+pies+'</div><div>'+frac(a,b)+'</div></div>'
    + '<div style="margin-top:12px;display:flex;flex-direction:column;align-items:center;gap:6px"><div id="'+id+'bar">'+barra(id, Math.min(a,b), b, 'on', 0, true)+'</div><div class="fz-msg" id="'+id+'m">'+Math.min(a,b)+' de '+b+' partes pintadas</div></div>';
  var comunes = divisores(gcd(a,b)).filter(function(k){ return k>1; });
  var pie = '<button class="fz-btn w" onclick="FZ.fracVoz(\''+id+'\')">🔊 Leer la fracción</button>';
  if(d.simp){
    pie += '<span style="font-weight:900;color:#3D1468">Agrupar de a:</span>';
    [2,3,4,5,6,7].forEach(function(k){ pie += '<button class="fz-btn b" onclick="FZ.agrupar(\''+id+'\','+k+')">'+k+'</button>'; });
    if(modo==='ej' && comunes.length) pie += '<button class="fz-btn g" onclick="FZ.agrupar(\''+id+'\','+gcd(a,b)+',1)">▶ Resolver animado</button>';
  }
  return marco(id, 'frac', 'Fracción en dibujo', a+'/'+b, h, pie, d.simp ? 'Prueba agrupar las partes: si el grupo cabe exacto arriba y abajo, la fracción se simplifica.' : 'Toca las partes de la barra para pintarlas.');
};
FZ.fracClic = function(id, i, el){ var s=FZ.st[id]; if(!s) return; FZ.toque(id); el.classList.toggle('on'); s.sh = document.querySelectorAll('#'+id+'bar i.on').length; var m=$(id+'m'); if(m) m.textContent = s.sh+' de '+s.b+' partes pintadas'; tono(); };
FZ.fracVoz = function(id){ var s=FZ.st[id]; if(!s) return; hablar(s.a+' de '+s.b+' partes. El denominador dice en cuántas partes iguales se divide la unidad; el numerador, cuántas se toman.'); };
FZ.agrupar = function(id, k, anim){
  var s = FZ.st[id]; if(!s) return; FZ.toque(id);
  var m = $(id+'m'), bar = $(id+'bar');
  if(s.a%k || s.b%k){ if(m) m.textContent = '❌ Con grupos de '+k+' no queda exacto ('+s.a+' ÷ '+k+' o '+s.b+' ÷ '+k+' no es exacta)'; tono(); return; }
  bar.innerHTML = barra(id, Math.min(s.a,s.b), s.b, 'on', k, false);
  if(m) m.innerHTML = '✅ Grupos de '+k+': '+frac(s.a,s.b)+' = '+frac(s.a/k, s.b/k);
  hablar('Con grupos de '+k+', '+s.a+' sobre '+s.b+' es igual a '+(s.a/k)+' sobre '+(s.b/k)); tono();
};

/* ── 5. Operaciones con fracciones ── */
W.fracop = function(d, modo, id){
  var a=d.a,b=d.b,c=d.c,e=d.d, op=d.op;
  if(b>30||e>30) return null;
  FZ.st[id] = {modo:modo, a:a,b:b,c:c,e:e,op:op};
  var h='', pie='';
  if(op==='+'||op==='-'){
    var L = lcm(b,e);
    h = '<div style="display:flex;flex-direction:column;gap:10px;align-items:center" id="'+id+'bars">'
      + '<div style="display:flex;gap:10px;align-items:center">'+frac(a,b)+barra(id,a,b,'on',0,false)+'</div>'
      + '<div style="font-size:28px;font-weight:900;color:#E8650A">'+(op==='+'?'+':'−')+'</div>'
      + '<div style="display:flex;gap:10px;align-items:center">'+frac(c,e)+barra(id,c,e,'on2',0,false)+'</div></div>';
    if(b===e){
      h += '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:12px"><div style="font-weight:900;color:#3D1468">Arma tu respuesta: toca las partes</div><div id="'+id+'bar">'+barra(id,0,b,'on',0,true)+'</div><div class="fz-msg" id="'+id+'m">0 de '+b+'</div></div>';
      FZ.st[id].b = b; FZ.st[id].sh = 0;
      pie = modo==='ej' ? '<button class="fz-btn g" onclick="FZ.fopRes(\''+id+'\')">▶ Resolver animado</button>' : '';
    } else {
      pie = '<button class="fz-btn b" onclick="FZ.fopComun(\''+id+'\')">🔍 Partir en denominador común ('+L+')</button>' + (modo==='ej' ? '<button class="fz-btn g" onclick="FZ.fopComun(\''+id+'\',1)">▶ Resolver animado</button>':'') + '<span class="fz-msg" id="'+id+'m">Denominadores distintos: primero hay que igualarlos</span>';
    }
    return marco(id, 'frac', op==='+'?'Sumar fracciones':'Restar fracciones', b===e?'mismo denominador':'distinto denominador', h, pie, b===e?'Con el mismo denominador, se '+(op==='+'?'suman':'restan')+' las partes pintadas.':'Busca el mínimo común múltiplo de '+b+' y '+e+'.');
  }
  if(op==='×' && b<=12 && e<=12){
    var S = 26, svg = '<svg class="fz-svg" viewBox="0 0 '+(e*S+8)+' '+(b*S+8)+'" width="'+Math.min(360,e*S+8)+'">';
    for(var r=0;r<b;r++) for(var q=0;q<e;q++){ var inA = r<a, inB = q<c; svg += '<rect x="'+(4+q*S)+'" y="'+(4+r*S)+'" width="'+S+'" height="'+S+'" fill="'+(inA&&inB?'#7C3AED':inA?'#FFD08A':inB?'#A7F3D0':'#FFFFFF')+'" stroke="#3D1468" stroke-width="1.5" class="fzc" style="opacity:'+(modo==='ej'?1:(inA&&inB?.25:1))+'"/>'; }
    svg += '</svg>';
    h = '<div class="fz-frow"><div>'+svg+'</div><div style="display:flex;flex-direction:column;gap:8px"><div>🟧 filas: '+frac(a,b)+'</div><div>🟩 columnas: '+frac(c,e)+'</div><div>🟪 = donde se cruzan</div></div></div>';
    pie = '<button class="fz-btn" onclick="document.querySelectorAll(\'#'+id+' .fzc\').forEach(function(x){x.style.opacity=1});FZ.toque(\''+id+'\')">✨ Mostrar el cruce</button><span class="fz-msg">Cuenta los cuadros morados y el total de cuadros</span>';
    return marco(id, 'frac', 'Multiplicar fracciones', 'modelo de área', h, pie, 'La parte de una parte: el cruce de las dos fracciones.');
  }
  if(op==='÷'){
    h = '<div style="display:flex;flex-direction:column;gap:10px;align-items:center"><div style="display:flex;gap:10px;align-items:center">'+frac(a,b)+barra(id,a,b,'on',0,false)+'</div><div style="font-size:26px;font-weight:900;color:#E8650A">÷</div><div style="display:flex;gap:10px;align-items:center">'+frac(c,e)+barra(id,c,e,'on2',0,false)+'</div></div>';
    pie = '<span class="fz-msg">¿Cuántas veces cabe '+c+'/'+e+' en '+a+'/'+b+'? Multiplica por el inverso: '+a+'/'+b+' × '+e+'/'+c+'</span>';
    return marco(id, 'frac', 'Dividir fracciones', '¿cuántas veces cabe?', h, pie, 'Dividir es multiplicar por la fracción invertida.');
  }
  return null;
};
FZ.fopComun = function(id, anim){
  var s = FZ.st[id]; if(!s) return; FZ.toque(id);
  var L = lcm(s.b,s.e), A = s.a*L/s.b, C = s.c*L/s.e;
  var cont = $(id+'bars'); if(!cont) return;
  cont.innerHTML = '<div style="display:flex;gap:10px;align-items:center">'+frac(s.a,s.b)+' = '+frac(A,L)+barra(id,A,L,'on',0,false)+'</div>'
    + '<div style="font-size:28px;font-weight:900;color:#E8650A">'+(s.op==='+'?'+':'−')+'</div>'
    + '<div style="display:flex;gap:10px;align-items:center">'+frac(s.c,s.e)+' = '+frac(C,L)+barra(id,C,L,'on2',0,false)+'</div>';
  var m = $(id+'m');
  if(anim){ var R = s.op==='+'?A+C:A-C; cont.innerHTML += '<div style="font-size:28px;font-weight:900">=</div><div style="display:flex;gap:10px;align-items:center">'+frac(R,L)+barra(id,Math.min(R,L),L,'on',0,false)+'</div>'; if(m) m.textContent = '✅ '+A+'/'+L+(s.op==='+'?' + ':' − ')+C+'/'+L+' = '+R+'/'+L; hablar('Resultado '+R+' sobre '+L); }
  else if(m) m.textContent = 'Ahora las dos barras tienen '+L+' partes iguales';
  tono();
};
FZ.fopRes = function(id){ var s=FZ.st[id]; if(!s) return; var R = s.op==='+'?s.a+s.c:s.a-s.c; var bar=$(id+'bar'); if(bar) bar.innerHTML = barra(id,Math.min(R,s.b),s.b,'on',0,true); var m=$(id+'m'); if(m) m.textContent='✅ '+s.a+'/'+s.b+(s.op==='+'?' + ':' − ')+s.c+'/'+s.b+' = '+R+'/'+s.b; hablar('Resultado '+R+' sobre '+s.b); };

/* ── 6. Divisores (rectángulos) y múltiplos (saltos) ── */
W.divis = function(d, modo, id){
  var n = d.n; if(n>144) return W.probador(d, modo, id);
  FZ.st[id] = {modo:modo, n:n};
  var h = '<div style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start;justify-content:center"><div class="fz-dots" id="'+id+'g" style="grid-template-columns:repeat(10,18px)">'+Array(n+1).join('<span class="fz-dot"></span>')+'</div>'
    + '<div style="max-width:230px"><div class="fz-msg" id="'+id+'m">'+n+' puntos. ¿En filas de cuántos quedan exactos?</div><div style="font-size:12px;font-weight:900;color:#16876A;margin-top:8px">Divisores encontrados:</div><div class="fz-chips" id="'+id+'lst" style="margin-top:4px"><span class="fz-chip cm" title="El 1 es divisor de todos los números"> 1 </span></div><div class="fz-tip">☝️ El 1 es divisor de todos los números.</div></div></div>';
  var pie = '<span style="font-weight:900;color:#16876A">Filas de:</span>';
  for(var k=2;k<=Math.min(12,n);k++) pie += '<button class="fz-btn g" onclick="FZ.filas(\''+id+'\','+k+')">'+k+'</button>';
  if(d.prueba && d.prueba>12) pie += '<button class="fz-btn o" onclick="FZ.filas(\''+id+'\','+d.prueba+')">'+d.prueba+'</button>';
  if(modo==='ej') pie += '<button class="fz-btn o" onclick="FZ.divisTodo(\''+id+'\')">▶ Resolver animado</button>';
  return marco(id, 'div', d.mult?'¿Es múltiplo?':'Buscador de divisores', 'rectángulos de '+n, h, pie, 'Si los puntos forman un rectángulo sin que sobre ninguno, ese número es divisor.');
};
FZ.filas = function(id, k){
  var s = FZ.st[id]; if(!s) return; FZ.toque(id);
  var g = $(id+'g'), m = $(id+'m'), n = s.n, q = Math.floor(n/k), r = n%k; if(!g||!m) return;
  var filasDeQ = q>0 && q<=26;
  var cols = filasDeQ ? q : k, dz = cols>12 ? 12 : 18;
  g.style.gridTemplateColumns = 'repeat('+cols+','+dz+'px)';
  g.querySelectorAll('.fz-dot').forEach(function(x){ x.style.width = dz+'px'; x.style.height = dz+'px'; });
  var ds = g.querySelectorAll('.fz-dot'); ds.forEach(function(x,i){ x.className = 'fz-dot'+(i>=n-r && r ? ' rest':''); });
  var desc = filasDeQ ? k+' filas de '+q : q+' filas de '+k;
  if(r===0){ m.textContent = '✅ '+n+' = '+desc+' → '+k+' es divisor de '+n; var l=$(id+'lst'); if(l && l.textContent.indexOf(' '+k+' ')<0){ l.innerHTML += '<span class="fz-chip cm"> '+k+' </span>'; } }
  else m.textContent = '❌ '+desc+' y sobran '+r+' → '+k+' no es divisor';
  tono();
};
FZ.divisTodo = function(id){ var s=FZ.st[id]; if(!s) return; var k=2; var t=setInterval(function(){ if(!$(id+'g')){ clearInterval(t); return; } if(k>Math.min(12,s.n)){ clearInterval(t); hablar('Los divisores encontrados están en verde'); return; } FZ.filas(id,k++); }, 800); };
W.probador = function(d, modo, id){
  FZ.st[id] = {modo:modo, n:d.n};
  var h = '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center"><span class="fz-eq">'+fmt(d.n)+' ÷</span><input id="'+id+'k" type="number" min="1" style="width:90px;font-size:22px;font-weight:900;padding:6px;border-radius:12px;border:2px solid #C5BFEE;text-align:center" value="'+(d.prueba||2)+'"><button class="fz-btn g" onclick="FZ.probar(\''+id+'\')">Probar</button></div><div class="fz-msg" id="'+id+'m" style="margin-top:8px;text-align:center">Escribe un número y prueba si divide exacto</div>';
  return marco(id, 'div', 'Probador de divisores', fmt(d.n), h, '', 'Si el residuo es 0, es divisor.');
};
FZ.probar = function(id){ var s=FZ.st[id]; var k=+($(id+'k').value||0); var m=$(id+'m'); if(!s||!k) return; FZ.toque(id); var q=Math.floor(s.n/k), r=s.n%k; m.textContent = fmt(s.n)+' ÷ '+k+' = '+fmt(q)+(r?' y sobran '+r+' ❌ no es divisor':' exacto ✅ sí es divisor'); tono(); };
W.mults = function(d, modo, id){
  FZ.st[id] = {modo:modo, n:d.n, k:0};
  var top = d.n*12, svg = '<svg class="fz-svg" id="'+id+'s" viewBox="0 0 520 110" width="520"><line x1="20" y1="80" x2="500" y2="80" stroke="#3D1468" stroke-width="3"/>';
  for(var i=0;i<=12;i++){ var x=20+i*40; svg += '<line x1="'+x+'" y1="72" x2="'+x+'" y2="88" stroke="#3D1468" stroke-width="2"/><text x="'+x+'" y="104" font-size="12" font-weight="900" text-anchor="middle" fill="#3D1468" id="'+id+'L'+i+'">'+(i<=1?i*d.n:'')+'</text>'; }
  svg += '<g id="'+id+'j"></g></svg>';
  return marco(id, 'div', 'Saltos de múltiplos', 'de '+d.n+' en '+d.n, svg, '<button class="fz-btn g" onclick="FZ.saltar(\''+id+'\')">🐸 Saltar +'+d.n+'</button><span class="fz-msg" id="'+id+'m">Los múltiplos son los saltos: '+d.n+' × 1, '+d.n+' × 2…</span>', 'Cada salto suma '+d.n+'.');
};
FZ.saltar = function(id){ var s=FZ.st[id]; if(!s||s.k>=12) return; FZ.toque(id); var g=$(id+'j'); var x0=20+s.k*40, x1=x0+40; g.innerHTML += '<path d="M'+x0+' 72 Q'+(x0+20)+' 20 '+x1+' 72" stroke="#16876A" stroke-width="3" fill="none"/><circle cx="'+x1+'" cy="80" r="6" fill="#16876A"/>'; s.k++; var lb=$(id+'L'+s.k); if(lb) lb.textContent = s.n*s.k; var m=$(id+'m'); if(m) m.textContent = s.n+' × '+s.k+' = '+(s.n*s.k); tono(); };

/* ── 7. MCD / MCM con listas ── */
W.mcdmcm = function(d, modo, id){
  var ns = d.ns, tipo = d.tipo;
  FZ.st[id] = {modo:modo, ns:ns, tipo:tipo};
  var h = '';
  ns.forEach(function(n, i){
    var L = tipo==='mcd' ? divisores(n) : (function(){ var o=[], lim=Math.min(ns.reduce(lcm), n*15); for(var k=1;k*n<=Math.max(lim, n*10);k++) o.push(k*n); return o.slice(0,18); })();
    h += '<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap"><span class="fz-rowlab">'+(tipo==='mcd'?'Div.':'Múlt.')+' de '+n+'</span><div class="fz-chips">'+L.map(function(v){ return '<span class="fz-chip" data-v="'+v+'" onclick="FZ.marcar(\''+id+'\','+v+')">'+v+'</span>'; }).join('')+'</div></div>';
  });
  h += '<div id="'+id+'arb" style="margin-top:6px"></div>';
  var pie = '<button class="fz-btn g" onclick="FZ.comunes(\''+id+'\')">✨ Resaltar los comunes</button><button class="fz-btn b" onclick="FZ.arbol(\''+id+'\')">🌳 Árbol de factores</button>'
    + (modo==='ej' ? '<button class="fz-btn o" onclick="FZ.comunes(\''+id+'\',1)">▶ Resolver animado</button>' : '')
    + '<span class="fz-msg" id="'+id+'m">'+(tipo==='mcd'?'Busca el divisor MÁS GRANDE que esté en todas las filas':'Busca el múltiplo MÁS PEQUEÑO que esté en todas las filas')+'</span>';
  return marco(id, 'div', tipo==='mcd'?'Máximo común divisor':'Mínimo común múltiplo', ns.join(' · '), h, pie, 'Toca un número para ver si aparece en las otras filas.');
};
FZ.marcar = function(id, v){ FZ.toque(id); document.querySelectorAll('#'+id+' .fz-chip').forEach(function(c){ c.classList.toggle('on', +c.getAttribute('data-v')===v); }); tono(); };
FZ.comunes = function(id, fin){
  var s = FZ.st[id]; if(!s) return; FZ.toque(id);
  var sets = []; document.querySelectorAll('#'+id+' .fz-chips').forEach(function(r){ var st={}; r.querySelectorAll('.fz-chip').forEach(function(c){ st[c.getAttribute('data-v')]=1; }); sets.push(st); });
  var com = Object.keys(sets[0]).filter(function(v){ return sets.every(function(x){ return x[v]; }); }).map(Number);
  document.querySelectorAll('#'+id+' .fz-chip').forEach(function(c){ c.classList.toggle('cm', com.indexOf(+c.getAttribute('data-v'))>=0); });
  var m = $(id+'m');
  if(fin){ var r = s.tipo==='mcd' ? s.ns.reduce(gcd) : s.ns.reduce(lcm); if(m) m.textContent = '✅ '+(s.tipo==='mcd'?'MCD':'MCM')+' = '+r; hablar((s.tipo==='mcd'?'El máximo común divisor es ':'El mínimo común múltiplo es ')+r); }
  else if(m) m.textContent = 'En verde: los comunes ('+com.length+'). ¿Cuál es el '+(s.tipo==='mcd'?'mayor':'menor')+'?';
  tono();
};
FZ.arbol = function(id){
  var s = FZ.st[id]; var x = $(id+'arb'); if(!s||!x) return; FZ.toque(id);
  if(x.innerHTML){ x.innerHTML=''; return; }
  x.innerHTML = '<div style="display:flex;gap:18px;flex-wrap:wrap;justify-content:center">'+s.ns.map(function(n){
    var f = factores(n), cur = n, h = '<div style="background:#FFFFFF;border-radius:14px;border:2px solid #D9CCFF;padding:8px 12px"><div style="font-family:\'Baloo 2\';font-weight:900;font-size:18px;color:#5C21A6">'+n+'</div>';
    f.forEach(function(p){ h += '<div style="display:flex;gap:10px;font-weight:900"><span style="min-width:44px;text-align:right">'+cur+'</span><span style="border-left:3px solid #3D1468;padding-left:8px;color:#E8650A">'+p+'</span></div>'; cur/=p; });
    return h+'<div style="font-weight:900;padding-left:36px">1</div><div style="font-size:12px;font-weight:800;color:#16876A;margin-top:4px">'+n+' = '+f.join(' × ')+'</div></div>'; }).join('')+'</div>';
};

/* ── 8. Potencias ── */
W.pot = function(d, modo, id){
  var a=d.a, e=d.e; FZ.st[id] = {modo:modo, a:a, e:e, k:1};
  var cadena = Array(e+1).join('x').split('').map(function(){ return '<span class="fz-chip" style="font-size:20px">'+a+'</span>'; }).join('<b style="color:#E8650A;font-size:20px">×</b>');
  var dib = '';
  if(e===2 && a<=15){ var S=Math.min(22, Math.floor(240/a)), sv='<svg class="fz-svg" viewBox="0 0 '+(a*S+4)+' '+(a*S+4)+'" width="'+(a*S+4)+'">'; for(var r=0;r<a;r++) for(var c=0;c<a;c++) sv+='<rect x="'+(2+c*S)+'" y="'+(2+r*S)+'" width="'+S+'" height="'+S+'" fill="'+(r===0||c===0?'#C4B5FD':'#EDE9FE')+'" stroke="#5B21B6" stroke-width="1.2"/>'; dib = sv+'</svg><div class="fz-tip" style="text-align:center">Un cuadrado de '+a+' por '+a+'</div>'; }
  if(e===3 && a<=6){ dib = isoCubos(a,a,a,Math.max(10,Math.round(60/a)),['#C4B5FD','#8B5CF6','#6D28D9','#5B21B6'])+'<div class="fz-tip" style="text-align:center">Un cubo de '+a+' × '+a+' × '+a+'</div>'; }
  var h = '<div style="text-align:center"><div class="fz-eq">'+a+'<sup>'+e+'</sup> = </div><div class="fz-chips" style="justify-content:center;margin:8px 0">'+cadena+'</div><div class="fz-msg" id="'+id+'m">La base '+a+' se multiplica '+e+' veces</div>'+(dib?'<div style="margin-top:10px">'+dib+'</div>':'')+'</div>';
  var pie = '<button class="fz-btn" onclick="FZ.potPaso(\''+id+'\')">✖ Multiplicar un paso</button><button class="fz-btn w" onclick="FZ.potReset(\''+id+'\')">↺ Empezar</button>'+(modo==='ej'?'<button class="fz-btn g" onclick="FZ.potTodo(\''+id+'\')">▶ Resolver animado</button>':'');
  return marco(id, 'pot', 'Potencia', 'base '+a+' · exponente '+e, h, pie, 'El exponente dice cuántas veces se multiplica la base por sí misma.');
};
FZ.potPaso = function(id){ var s=FZ.st[id]; if(!s) return; FZ.toque(id); if(s.k>=s.e) return false; s.k++; var m=$(id+'m'); var v=Math.pow(s.a,s.k); if(m) m.textContent = Array(s.k+1).join('x').split('').map(function(){return s.a;}).join(' × ')+' = '+fmt(v); var ch=document.querySelectorAll('#'+id+' .fz-chips .fz-chip'); ch.forEach(function(c,i){ c.classList.toggle('on', i<s.k); }); tono(); return true; };
FZ.potReset = function(id){ var s=FZ.st[id]; if(!s) return; s.k=1; document.querySelectorAll('#'+id+' .fz-chips .fz-chip').forEach(function(c){ c.classList.remove('on'); }); var m=$(id+'m'); if(m) m.textContent='La base '+s.a+' se multiplica '+s.e+' veces'; };
FZ.potTodo = function(id){ FZ.potReset(id); var s=FZ.st[id]; var t=setInterval(function(){ if(!$(id) || !FZ.potPaso(id)){ clearInterval(t); hablar(s.a+' elevado a la '+s.e+' es '+fmt(Math.pow(s.a,s.e))); } }, 900); };

/* ── 9. Raíz: arma el cuadrado ── */
W.raiz = function(d, modo, id){
  var n=d.n, c=!!d.c; FZ.st[id] = {modo:modo, n:n, c:c, s:1};
  var max = c ? 10 : Math.min(30, Math.ceil(Math.sqrt(n))+3);
  var h = '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center"><div id="'+id+'d"></div><div style="min-width:200px"><div class="fz-eq">'+(c?'∛':'√')+n+'</div>'
    + '<input type="range" min="1" max="'+max+'" value="1" style="width:200px" oninput="FZ.raizLado(\''+id+'\',+this.value)"><div class="fz-msg" id="'+id+'m" style="margin-top:6px"></div></div></div>';
  setTimeout(function(){ FZ.raizLado(id,1,true); }, 0);
  var pie = modo==='ej' ? '<button class="fz-btn g" onclick="FZ.raizTodo(\''+id+'\')">▶ Resolver animado</button>' : '';
  return marco(id, 'pot', c?'Arma el cubo':'Arma el cuadrado', 'con '+n+(c?' cubitos':' cuadritos'), h, pie, 'Mueve la barra: busca el lado que forma '+(c?'un cubo':'un cuadrado')+' con exactamente '+n+'.');
};
FZ.raizLado = function(id, L, quieto){
  var s=FZ.st[id]; if(!s) return; if(!quieto) FZ.toque(id); s.s=L;
  var tot = s.c ? L*L*L : L*L, d=$(id+'d'), m=$(id+'m'); if(!d) return;
  if(!s.c){ var S=Math.max(6, Math.min(24, Math.floor(220/L))), sv='<svg class="fz-svg" viewBox="0 0 '+(L*S+4)+' '+(L*S+4)+'" width="'+(L*S+4)+'">'; for(var r=0;r<L;r++) for(var c=0;c<L;c++) sv+='<rect x="'+(2+c*S)+'" y="'+(2+r*S)+'" width="'+S+'" height="'+S+'" fill="'+(tot===s.n?'#6EE7B7':tot>s.n?'#FCA5A5':'#C4B5FD')+'" stroke="#3D1468" stroke-width="1"/>'; d.innerHTML = sv+'</svg>'; }
  else d.innerHTML = '<div style="font-size:'+Math.min(60,16+L*4)+'px">🧊</div>';
  if(m) m.textContent = 'Lado '+L+': '+(s.c?L+' × '+L+' × '+L:L+' × '+L)+' = '+tot+(tot===s.n?' ✅ ¡exacto!':tot>s.n?' → te pasaste':' → faltan '+(s.n-tot));
  if(tot===s.n) tono();
};
FZ.raizTodo = function(id){ var s=FZ.st[id]; var L=1; var t=setInterval(function(){ if(!$(id+'d')){ clearInterval(t); return; } FZ.raizLado(id,L,true); var tot=s.c?L*L*L:L*L; if(tot>=s.n){ clearInterval(t); hablar(tot===s.n?'La raíz es '+L:'No es exacta'); } L++; }, 600); };

/* ── 10. Escalera de unidades ── */
var ESC = {l:['km','hm','dam','m','dm','cm','mm'], g:['kg','hg','dag','g','dg','cg','mg'], L:['kl','hl','dal','l','dl','cl','ml']};
W.conv = function(d, modo, id){
  var a=d.a.toLowerCase(), b=d.b.toLowerCase(), fam=null;
  for(var f in ESC) if(ESC[f].indexOf(a)>=0 && ESC[f].indexOf(b)>=0) fam=ESC[f];
  if(!fam) return null;
  var ia=fam.indexOf(a), ib=fam.indexOf(b);
  FZ.st[id] = {modo:modo, fam:fam, ia:ia, ib:ib, v:d.v, cur:ia};
  var cols = ['#7C3AED','#6D28D9','#4F46E5','#E8650A','#0EA5E9','#0891B2','#0F766E'];
  var h = '<div class="fz-stairs">'+fam.map(function(u,i){ return '<div class="s'+(i===ia?' on':'')+'" id="'+id+'s'+i+'" style="height:'+(140-i*15)+'px;background:'+cols[i]+'">'+u+'<small>'+(i<3?'múltiplo':i===3?'base':'submúltiplo')+'</small></div>'; }).join('')+'</div>'
    + '<div class="fz-eq" id="'+id+'v">'+fmt(d.v)+' '+a+'</div>';
  var dir = ib>ia ? 'bajar' : 'subir';
  var pie = '<button class="fz-btn o" onclick="FZ.escalon(\''+id+'\')">'+(ib>ia?'⬇ Bajar un escalón (× 10)':'⬆ Subir un escalón (÷ 10)')+'</button><button class="fz-btn w" onclick="FZ.escReset(\''+id+'\')">↺</button>'
    + '<span class="fz-msg" id="'+id+'m">De '+a+' a '+b+': '+Math.abs(ib-ia)+' escalón'+(Math.abs(ib-ia)>1?'es':'')+' para '+dir+'</span>';
  return marco(id, 'med', 'Escalera de unidades', a+' → '+b, h, pie, 'Bajar un escalón multiplica por 10; subir divide entre 10.');
};
FZ.escalon = function(id){
  var s=FZ.st[id]; if(!s) return; FZ.toque(id);
  if(s.cur===s.ib){ tono(); return; }
  var paso = s.ib>s.cur ? 1 : -1; s.cur += paso;
  s.val = (s.val===undefined? s.v : s.val) * (paso>0?10:0.1); s.val = Math.round(s.val*1e6)/1e6;
  document.querySelectorAll('#'+id+' .fz-stairs .s').forEach(function(x,i){ x.classList.toggle('on', i===s.cur); });
  var v=$(id+'v'); if(v) v.textContent = fmt(s.val)+' '+s.fam[s.cur];
  var m=$(id+'m'); if(m) m.textContent = s.cur===s.ib ? '🎯 Llegaste a '+s.fam[s.ib] : (paso>0?'× 10':'÷ 10')+' → sigue';
  tono();
};
FZ.escReset = function(id){ var s=FZ.st[id]; if(!s) return; s.cur=s.ia; s.val=undefined; document.querySelectorAll('#'+id+' .fz-stairs .s').forEach(function(x,i){ x.classList.toggle('on', i===s.ia); }); var v=$(id+'v'); if(v) v.textContent=fmt(s.v)+' '+s.fam[s.ia]; };

/* ── 11. Rectángulo: área y perímetro · Prisma: volumen ── */
W.rect = function(d, modo, id){
  var l=d.l, a=d.a; FZ.st[id] = {modo:modo, l:l, a:a};
  var grid = l<=20 && a<=20;
  var S = grid ? Math.max(12, Math.min(28, Math.floor(360/Math.max(l,a)))) : 0;
  var Wd = grid ? l*S : 320, Hd = grid ? a*S : Math.max(60, Math.round(320*a/l)); if(!grid && Hd>220){ Hd=220; Wd=Math.round(220*l/a); }
  var sv = '<svg class="fz-svg" viewBox="-40 -30 '+(Wd+80)+' '+(Hd+60)+'" width="'+(Wd+80)+'">';
  if(grid){ for(var r=0;r<a;r++) for(var c=0;c<l;c++) sv += '<rect class="fzq" data-i="'+(r*l+c)+'" x="'+(c*S)+'" y="'+(r*S)+'" width="'+S+'" height="'+S+'" fill="#FFFFFF" stroke="#C4B5FD" stroke-width="1"/>'; }
  else sv += '<rect x="0" y="0" width="'+Wd+'" height="'+Hd+'" fill="#ECFDF5"/>';
  sv += '<rect id="'+id+'bd" x="0" y="0" width="'+Wd+'" height="'+Hd+'" fill="none" stroke="#0F766E" stroke-width="4" stroke-dasharray="'+(2*(Wd+Hd))+'" stroke-dashoffset="0"/>';
  sv += '<text x="'+(Wd/2)+'" y="-10" font-size="16" font-weight="900" text-anchor="middle" fill="#0F766E">'+fmt(l)+' m</text><text x="-10" y="'+(Hd/2)+'" font-size="16" font-weight="900" text-anchor="end" fill="#0F766E">'+fmt(a)+' m</text></svg>';
  var pie = (grid ? '<button class="fz-btn g" onclick="FZ.pintarArea(\''+id+'\')">🟩 Contar cuadritos (área)</button>' : '')
    + '<button class="fz-btn o" onclick="FZ.borde(\''+id+'\')">🐜 Recorrer el borde (perímetro)</button>'
    + '<span class="fz-msg" id="'+id+'m">Área = largo × ancho · Perímetro = suma de los 4 lados</span>';
  return marco(id, 'med', d.per?'Perímetro':'Área', fmt(l)+' m × '+fmt(a)+' m', sv, pie, grid?'Cada cuadrito es 1 m².':'El dibujo está a escala.');
};
FZ.pintarArea = function(id){
  var s=FZ.st[id]; if(!s) return; FZ.toque(id);
  var q = document.querySelectorAll('#'+id+' .fzq'), k=0, m=$(id+'m'), tot=q.length;
  var fila = s.l, t = setInterval(function(){
    if(!$(id)){ clearInterval(t); return; }
    for(var j=0;j<fila && k<tot;j++,k++) q[k].setAttribute('fill','#6EE7B7');
    if(m) m.textContent = Math.ceil(k/s.l)+' fila'+(k>s.l?'s':'')+' de '+s.l+' cuadritos';
    tono(); if(k>=tot){ clearInterval(t); }
  }, 250);
};
FZ.borde = function(id){
  var s=FZ.st[id]; if(!s) return; FZ.toque(id);
  var b=$(id+'bd'), m=$(id+'m'); if(!b) return;
  var L = +b.getAttribute('stroke-dasharray'); b.style.transition='none'; b.setAttribute('stroke-dashoffset', L); b.setAttribute('stroke','#E8650A');
  setTimeout(function(){ b.style.transition='stroke-dashoffset 2.5s linear'; b.setAttribute('stroke-dashoffset','0'); }, 30);
  var lados=[s.l,s.a,s.l,s.a], k=0; var t=setInterval(function(){ if(!$(id)){ clearInterval(t); return; } k++; if(m) m.textContent = 'Lados: '+lados.slice(0,k).map(fmt).join(' + '); tono(); if(k>=4) clearInterval(t); }, 625);
};
W.vol = function(d, modo, id){
  var l=d.l, a=d.a, h=d.h; if(l>10||a>10||h>10) return W.rect({l:l,a:a}, modo, id);
  FZ.st[id] = {modo:modo, l:l, a:a, h:h, cap:1};
  var hh = '<div style="text-align:center"><div id="'+id+'d"></div><input type="range" min="1" max="'+h+'" value="1" style="width:220px" oninput="FZ.capas(\''+id+'\',+this.value)"><div class="fz-msg" id="'+id+'m" style="margin-top:6px"></div></div>';
  setTimeout(function(){ FZ.capas(id,1,true); }, 0);
  return marco(id, 'med', 'Volumen con cubitos', l+' × '+a+' × '+h, hh, '', 'Mueve la barra para apilar capas. Cada capa tiene '+l+' × '+a+' cubitos.');
};
FZ.capas = function(id, c, quieto){
  var s=FZ.st[id]; if(!s || !$(id+'d')) return; if(!quieto) FZ.toque(id);
  $(id+'d').innerHTML = isoCubos(s.l, s.a, c, Math.max(12, Math.round(110/Math.max(s.l,s.a,s.h))), ['#99F6E4','#2DD4BF','#0D9488','#0F766E']);

  var m=$(id+'m'); if(m) m.textContent = c+' capa'+(c>1?'s':'')+' de '+(s.l*s.a)+' cubitos';
};
W.pitag = function(d, modo, id){
  var a=d.a, b=d.b, K = 200/Math.max(a,b);
  var sv = '<svg class="fz-svg" viewBox="-20 -20 '+(a*K+120)+' '+(b*K+60)+'" width="'+(a*K+120)+'"><path d="M0 '+(b*K)+' h'+(a*K)+' L0 0 Z" fill="#DBEAFE" stroke="#1E40AF" stroke-width="3"/><rect x="0" y="'+(b*K-14)+'" width="14" height="14" fill="none" stroke="#1E40AF" stroke-width="2"/>'
    + '<text x="'+(a*K/2)+'" y="'+(b*K+22)+'" font-size="16" font-weight="900" text-anchor="middle" fill="#1E40AF">'+a+'</text><text x="-8" y="'+(b*K/2)+'" font-size="16" font-weight="900" text-anchor="end" fill="#1E40AF">'+b+'</text><text x="'+(a*K/2+14)+'" y="'+(b*K/2-6)+'" font-size="18" font-weight="900" fill="#E8650A">¿?</text></svg>';
  return marco(id, 'med', 'Teorema de Pitágoras', 'catetos '+a+' y '+b, sv, '<span class="fz-msg">'+(modo==='ej' ? 'hipotenusa² = '+a+'² + '+b+'² = '+(a*a)+' + '+(b*b) : 'hipotenusa² = cateto² + cateto²')+'</span>', 'Luego saca la raíz cuadrada del resultado.');
};

/* ── 12. Valor posicional (enteros y decimales) y recta ── */
W.pv = function(d, modo, id){
  var s = d.s || fmt(d.v), ent = s.split(',')[0].replace(/\./g,''), de = (s.split(',')[1]||'');
  if(ent.length>8) return null;
  FZ.st[id] = {modo:modo};
  var h = '<div class="fz-pv">';
  ent.split('').forEach(function(c,i){ var p=ent.length-1-i; h += '<div class="c" onclick="FZ.pvClic(\''+id+'\',this,'+c+','+Math.pow(10,p)+',\''+PLC[p]+'\')"><span class="h" style="background:'+PLCOL[p]+'">'+PLC[p]+'</span><span class="d" style="color:'+PLCOL[p]+'">'+c+'</span></div>'; });
  if(de){ h += '<span class="cm">,</span>'; de.split('').forEach(function(c,i){ h += '<div class="c" onclick="FZ.pvClic(\''+id+'\',this,'+c+','+Math.pow(10,-(i+1))+',\''+PLDEC[i]+'\')"><span class="h" style="background:'+(PLDCOL[i]||'#888')+'">'+(PLDEC[i]||'')+'</span><span class="d" style="color:'+(PLDCOL[i]||'#888')+'">'+c+'</span></div>'; }); }
  h += '</div><div class="fz-msg" id="'+id+'m" style="margin-top:10px;text-align:center">Toca una cifra para ver cuánto vale según su lugar</div>';
  var nom = {U:'unidades',D:'decenas',C:'centenas',UM:'unidades de mil',DM:'decenas de mil',CM:'centenas de mil',UMill:'unidades de millón',d:'décimas',c:'centésimas',m:'milésimas'};
  FZ.st[id].nom = nom;
  return marco(id, 'dec', 'Tablero de valor posicional', s, h, '', 'Cada lugar vale 10 veces más que el de su derecha.');
};
FZ.pvClic = function(id, el, c, v, lab){
  var s=FZ.st[id]; if(!s) return; FZ.toque(id);
  document.querySelectorAll('#'+id+' .fz-pv .c').forEach(function(x){ x.classList.remove('on'); }); el.classList.add('on');
  var val = Math.round(c*v*1e6)/1e6, m=$(id+'m'); if(m) m.textContent = c+' en las '+(s.nom[lab]||lab)+' = '+fmt(val);
  hablar(c+' '+(s.nom[lab]||lab)+', vale '+fmt(val)); tono();
};
W.recta = function(d, modo, id){
  var v=d.v, sv='<svg class="fz-svg" viewBox="0 0 520 100" width="520"><line x1="20" y1="60" x2="500" y2="60" stroke="#3D1468" stroke-width="3"/>';
  for(var i=-3;i<=3;i++){ var x=260+i*75; sv += '<line x1="'+x+'" y1="50" x2="'+x+'" y2="70" stroke="#3D1468" stroke-width="2"/><text x="'+x+'" y="90" font-size="13" font-weight="900" text-anchor="middle" fill="'+(i===0?'#E8650A':'#3D1468')+'">'+(i===0?fmt(v):(Math.abs(i)===1?(i<0?'?':'?'):''))+'</text>'; }
  sv += '<circle cx="260" cy="60" r="9" fill="#E8650A"/><text x="185" y="36" font-size="13" font-weight="900" text-anchor="middle" fill="#16876A">− 1</text><text x="335" y="36" font-size="13" font-weight="900" text-anchor="middle" fill="#16876A">+ 1</text></svg>';
  return marco(id, 'dec', 'Recta numérica', fmt(v), sv, '', 'El anterior está un paso a la izquierda (− 1) y el siguiente un paso a la derecha (+ 1).');
};

/* ── 13. Multiplicación con decimales ── */
W.multdec = function(d, modo, id){
  var ca = dec(d.a), cb = dec(d.b);
  var h = '<div style="text-align:center"><div class="fz-eq">'+d.sa+' × '+d.sb+'</div><div class="fz-chips" style="justify-content:center;margin:10px 0"><span class="fz-chip">'+d.sa+' → '+ca+' cifra'+(ca!==1?'s':'')+' decimal'+(ca!==1?'es':'')+'</span><span class="fz-chip">'+d.sb+' → '+cb+' cifra'+(cb!==1?'s':'')+' decimal'+(cb!==1?'es':'')+'</span><span class="fz-chip on">El resultado lleva '+(ca+cb)+'</span></div>'
    + ([10,100,1000,10000].indexOf(d.b)>=0 ? '<div class="fz-msg">Por '+fmt(d.b)+' la coma se mueve '+(String(d.b).length-1)+' lugar'+(d.b>10?'es':'')+' a la derecha</div></div>' : '')
    + ([10,100,1000,10000].indexOf(d.b)>=0 ? '' : '<div class="fz-msg">1) Multiplica sin la coma: '+String(d.sa).replace(',','').replace(/^0+(?=\d)/,'')+' × '+String(d.sb).replace(',','').replace(/^0+(?=\d)/,'')+' &nbsp; 2) Cuenta '+(ca+cb)+' cifras desde la derecha y pon la coma</div></div>');
  return marco(id, 'dec', 'Multiplicar decimales', 'dónde va la coma', h, '', 'Por 10, 100 o 1.000 la coma corre a la derecha 1, 2 o 3 lugares.');
};

/* ── 14. Porcentaje: cuadrícula de 100 ── */
W.pct = function(d, modo, id){
  var p = d.p, h='';
  if(d.frac){ var fa=d.frac[0], fb=d.frac[1]; if(100%fb!==0 || fb>100) return null; FZ.st[id]={modo:modo, n:0};
    h = '<div class="fz-frow"><div class="fz-g100" id="'+id+'g">'+Array(101).join('<i onclick="FZ.celda(\''+id+'\',this)"></i>')+'</div><div style="max-width:220px"><div class="fz-eq">'+frac(fa,fb)+'</div><div class="fz-msg" id="'+id+'m" style="margin-top:8px">'+(modo==='ej'?'Cada '+(100/fb)+' cuadritos = 1/'+fb+'. Pinta '+fa+' veces '+(100/fb)+'.':'Parte los 100 cuadritos en '+fb+' grupos iguales y pinta '+fa+' grupo'+(fa>1?'s':'')+'.')+'</div></div></div>';
    return marco(id, 'pct', 'De fracción a porcentaje', fa+'/'+fb+' = ?%', h, '', 'El porcentaje es cuántos de 100.');
  }
  if(p===undefined || p>100) return null;
  FZ.st[id] = {modo:modo, n:0};
  h = '<div class="fz-frow"><div class="fz-g100" id="'+id+'g">'+Array(101).join('x').split('').map(function(_,i){ return '<i class="'+(i<Math.round(p)?'on':'')+'" onclick="FZ.celda(\''+id+'\',this)"></i>'; }).join('')+'</div>'
    + '<div style="max-width:240px"><div class="fz-eq">'+fmt(p)+' %</div><div class="fz-msg" id="'+id+'m" style="margin-top:8px">'+fmt(p)+' de cada 100 cuadritos</div>';
  if(d.N){ var N=d.N; h += '<div style="margin-top:10px;font-weight:900;color:#BE185D">El total es '+fmt(N)+'. Pártelo en 10 partes iguales: cada parte es el 10 %.'+(modo==='ej'?' Aquí cada parte vale '+fmt(N/10)+'.':'')+'</div>'; }
  h += '</div></div>';
  return marco(id, 'pct', 'Cuadrícula del 100 %', fmt(p)+' %'+(d.N?' de '+fmt(d.N):''), h, '', 'Toca los cuadritos para pintar o borrar. 10 % es una columna; 1 % es un cuadrito.');
};
FZ.celda = function(id, el){ FZ.toque(id); el.classList.toggle('on'); var n=document.querySelectorAll('#'+id+'g i.on').length; var m=$(id+'m'); if(m) m.textContent = n+' de 100 = '+n+' %'; tono(); };

/* ── 15. Balanza (ecuaciones) ── */
W.eq = function(d, modo, id){
  FZ.st[id] = {modo:modo, xl:d.xl, kl:d.kl, xr:d.xr, kr:d.kr, o:[d.xl,d.kl,d.xr,d.kr]};
  var h = '<div id="'+id+'d"></div><div class="fz-eq" id="'+id+'e"></div>';
  setTimeout(function(){ FZ.balDib(id); }, 0);
  var pie = '<span id="'+id+'bt"></span>'+(modo==='ej'?'<button class="fz-btn g" onclick="FZ.balTodo(\''+id+'\')">▶ Resolver animado</button>':'')+'<button class="fz-btn w" onclick="FZ.balReset(\''+id+'\')">↺</button><span class="fz-msg" id="'+id+'m">Lo que hagas en un lado, hazlo también en el otro</span>';
  return marco(id, 'eq', 'Balanza de la ecuación', d.txt||'', h, pie, 'La balanza debe quedar en equilibrio. Deja la x sola.');
};
function platillo(x0, nx, k){
  var h='', px=x0;
  if(nx>0){ if(nx<=6){ for(var i=0;i<nx;i++){ h += '<g transform="translate('+px+',0)"><rect x="0" y="-34" width="28" height="34" rx="6" fill="#8B3EDB"/><text x="14" y="-11" font-size="17" font-weight="900" fill="#fff" text-anchor="middle">x</text></g>'; px += 31; } }
    else { h += '<g transform="translate('+px+',0)"><rect x="0" y="-40" width="64" height="40" rx="8" fill="#8B3EDB"/><text x="32" y="-14" font-size="17" font-weight="900" fill="#fff" text-anchor="middle">'+nx+' x</text></g>'; px += 68; } }
  if(k>0){ var t=fmt(k), w=18+t.length*10; h += '<g transform="translate('+(px+4)+',0)"><rect x="0" y="-30" width="'+w+'" height="30" rx="6" fill="#16876A"/><text x="'+(w/2)+'" y="-9" font-size="15" font-weight="900" fill="#fff" text-anchor="middle">'+t+'</text></g>'; }
  if(k<0){ var t2='−'+fmt(-k), w2=18+t2.length*10; h += '<g transform="translate('+(px+4)+',0)"><rect x="0" y="-30" width="'+w2+'" height="30" rx="6" fill="#C94B22"/><text x="'+(w2/2)+'" y="-9" font-size="15" font-weight="900" fill="#fff" text-anchor="middle">'+t2+'</text></g>'; }
  return h;
}
function ladoTxt(x, k){ var a = x ? (x>1?x:'')+'x' : ''; if(k>0) a += (a?' + ':'')+fmt(k); else if(k<0) a += (a?' − ':'−')+fmt(-k); return a || '0'; }
FZ.balDib = function(id){
  var s=FZ.st[id]; if(!s || !$(id+'d')) return;
  var sv = '<svg class="fz-svg" viewBox="0 0 520 200" width="520"><polygon points="260,190 240,150 280,150" fill="#3D1468"/><line x1="260" y1="150" x2="260" y2="70" stroke="#3D1468" stroke-width="6"/><line x1="40" y1="70" x2="480" y2="70" stroke="#3D1468" stroke-width="6" stroke-linecap="round"/>'
    + '<line x1="60" y1="70" x2="40" y2="110" stroke="#6C28B4" stroke-width="2"/><line x1="200" y1="70" x2="220" y2="110" stroke="#6C28B4" stroke-width="2"/><path d="M26 110 Q130 150 234 110 Z" fill="#E9D5FF" stroke="#6C28B4" stroke-width="4"/>'
    + '<line x1="320" y1="70" x2="300" y2="110" stroke="#6C28B4" stroke-width="2"/><line x1="460" y1="70" x2="480" y2="110" stroke="#6C28B4" stroke-width="2"/><path d="M286 110 Q390 150 494 110 Z" fill="#E9D5FF" stroke="#6C28B4" stroke-width="4"/>'
    + '<g transform="translate(0,108)">'+platillo(34, s.xl, s.kl)+'</g><g transform="translate(0,108)">'+platillo(296, s.xr, s.kr)+'</g></svg>';
  $(id+'d').innerHTML = sv;
  $(id+'e').textContent = ladoTxt(s.xl,s.kl)+' = '+ladoTxt(s.xr,s.kr);
  var bt = '';
  if(s.xr>0) bt = '<button class="fz-btn o" onclick="FZ.balOp(\''+id+'\',\'qx\')">➖ Quitar '+(s.xr>1?s.xr:'')+'x de cada lado</button>';
  else if(s.kl>0) bt = '<button class="fz-btn o" onclick="FZ.balOp(\''+id+'\',\'q\')">➖ Quitar '+fmt(s.kl)+' de cada lado</button>';
  else if(s.kl<0) bt = '<button class="fz-btn o" onclick="FZ.balOp(\''+id+'\',\'p\')">➕ Poner '+fmt(-s.kl)+' en cada lado</button>';
  else if(s.xl>1) bt = '<button class="fz-btn o" onclick="FZ.balOp(\''+id+'\',\'d\')">➗ Repartir en '+s.xl+' grupos iguales</button>';
  $(id+'bt').innerHTML = bt;
  var m=$(id+'m'); if(!bt && m) m.textContent='🎯 ¡La x quedó sola!';
};
FZ.balOp = function(id, op){
  var s=FZ.st[id]; if(!s) return; FZ.toque(id); var m=$(id+'m');
  if(op==='qx'){ s.xl -= s.xr; s.xr = 0; if(m) m.textContent='Quitamos las x de la derecha en los dos lados'; }
  else if(op==='q'){ s.kr -= s.kl; if(m) m.textContent='Quitamos '+fmt(s.kl)+' de cada lado'; s.kl = 0; }
  else if(op==='p'){ s.kr += -s.kl; if(m) m.textContent='Ponemos '+fmt(-s.kl)+' en cada lado'; s.kl = 0; }
  else if(op==='d'){ if(m) m.textContent='Repartimos en '+s.xl+' grupos: cada x vale '+fmt(s.kr)+' ÷ '+s.xl; s.kr = Math.round(s.kr/s.xl*1000)/1000; s.xl = 1; }
  tono(); FZ.balDib(id);
};
FZ.balReset = function(id){ var s=FZ.st[id]; if(!s) return; s.xl=s.o[0]; s.kl=s.o[1]; s.xr=s.o[2]; s.kr=s.o[3]; FZ.balDib(id); var m=$(id+'m'); if(m) m.textContent='Lo que hagas en un lado, hazlo también en el otro'; };
FZ.balTodo = function(id){ var s=FZ.st[id]; if(!s) return; FZ.balReset(id); var t=setInterval(function(){ if(!$(id)){ clearInterval(t); return; } var b=document.querySelector('#'+id+'bt button'); if(!b){ clearInterval(t); hablar('x es igual a '+fmt(s.kr)); return; } b.click(); }, 1500); };

/* ── 16. Bolsa de bolas y dado ── */
var COLB = {roja:'#EF4444',rojas:'#EF4444',verde:'#22C55E',verdes:'#22C55E',azul:'#3B82F6',azules:'#3B82F6',blanca:'#F8FAFC',blancas:'#F8FAFC',amarilla:'#FACC15',amarillas:'#FACC15',negra:'#1F2937',negras:'#1F2937',otras:'#C4B5FD'};
W.bolsa = function(d, modo, id){
  var tot = d.grupos.reduce(function(s,g){ return s+g.n; },0); if(tot>80||tot<2) return null;
  FZ.st[id] = {modo:modo, g:d.grupos, tot:tot, cuenta:{}, n:0};
  var h = '<div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;justify-content:center"><div style="position:relative;width:200px;padding:16px 10px 10px;background:radial-gradient(ellipse at top,#F5E1C0,#D6A96A);border-radius:30px 30px 60px 60px;border:3px solid #7A4B16;display:flex;flex-wrap:wrap;gap:3px;justify-content:center">';
  d.grupos.forEach(function(g){ for(var i=0;i<g.n;i++) h += '<span style="width:16px;height:16px;border-radius:50%;background:'+(COLB[g.c.toLowerCase()]||'#C4B5FD')+';border:1.5px solid #3D1468"></span>'; });
  h += '</div><div><div class="fz-chips">'+d.grupos.map(function(g){ return '<span class="fz-chip"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:'+(COLB[g.c.toLowerCase()]||'#C4B5FD')+';border:1px solid #333"></span> '+g.n+' '+g.c+'</span>'; }).join('')+(modo==='ej'?'<span class="fz-chip on">Total '+tot+'</span>':'')+'</div><div id="'+id+'r" style="margin-top:10px"></div><div class="fz-msg" id="'+id+'m" style="margin-top:8px">Saca bolas al azar (se devuelven a la bolsa)</div></div></div>';
  var pie = '<button class="fz-btn o" onclick="FZ.sacar(\''+id+'\',1)">🎲 Sacar 1</button><button class="fz-btn" onclick="FZ.sacar(\''+id+'\',20)">🎲 Sacar 20</button>';
  return marco(id, 'est', 'Bolsa de la suerte', 'experimento aleatorio', h, pie, 'Probabilidad = casos favorables ÷ casos posibles.');
};
FZ.sacar = function(id, k){
  var s=FZ.st[id]; if(!s) return; FZ.toque(id);
  for(var j=0;j<k;j++){ var r=Math.random()*s.tot, acc=0; for(var i=0;i<s.g.length;i++){ acc+=s.g[i].n; if(r<acc){ s.cuenta[s.g[i].c]=(s.cuenta[s.g[i].c]||0)+1; break; } } s.n++; }
  var h=''; s.g.forEach(function(g){ var c=s.cuenta[g.c]||0; h += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;font-weight:900;font-size:12px"><span style="min-width:60px">'+g.c+'</span><span style="height:14px;border-radius:7px;background:'+(COLB[g.c.toLowerCase()]||'#C4B5FD')+';border:1px solid #333;width:'+Math.max(4, Math.round(c/s.n*160))+'px"></span>'+c+'</div>'; });
  $(id+'r').innerHTML = h; var m=$(id+'m'); if(m) m.textContent = s.n+' sacadas en total'; tono();
};
W.dado = function(d, modo, id){
  FZ.st[id] = {modo:modo, c:[0,0,0,0,0,0], n:0};
  var h = '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center"><div id="'+id+'d" style="font-size:72px;line-height:1">🎲</div><div id="'+id+'r" style="display:flex;gap:6px;align-items:flex-end;height:150px;padding-top:24px;box-sizing:border-box"></div></div><div class="fz-msg" id="'+id+'m" style="margin-top:8px">Lanza el dado y mira qué sale</div>';
  return marco(id, 'est', 'Dado de 6 caras', '6 resultados posibles', h, '<button class="fz-btn o" onclick="FZ.lanzar(\''+id+'\',1)">🎲 Lanzar</button><button class="fz-btn" onclick="FZ.lanzar(\''+id+'\',30)">🎲 Lanzar 30</button>', 'Cada cara tiene la misma posibilidad: 1 de 6.');
};
FZ.lanzar = function(id, k){
  var s=FZ.st[id]; if(!s) return; FZ.toque(id); var caras=['⚀','⚁','⚂','⚃','⚄','⚅'], v=0;
  for(var j=0;j<k;j++){ v=Math.floor(Math.random()*6); s.c[v]++; s.n++; }
  $(id+'d').textContent = caras[v];
  var mx = Math.max.apply(null, s.c)||1;
  $(id+'r').innerHTML = s.c.map(function(c,i){ return '<div style="display:flex;flex-direction:column;align-items:center;gap:2px"><span style="font-size:12px;font-weight:900;background:#FFFFFF;border-radius:6px;padding:0 4px">'+c+'</span><span style="width:22px;height:'+Math.round(c/mx*80)+'px;background:linear-gradient(180deg,#F59E0B,#B45309);border-radius:5px"></span><span style="font-size:18px">'+caras[i]+'</span></div>'; }).join('');
  var m=$(id+'m'); if(m) m.textContent = s.n+' lanzamientos'; tono();
};

/* ── 17. Datos: ordenar y ver ── */
W.datos = function(d, modo, id){
  FZ.st[id] = {modo:modo, v:d.vals.slice(), q:d.que};
  var h = '<div class="fz-chips" id="'+id+'c" style="justify-content:center">'+d.vals.map(function(v,i){ return '<span class="fz-chip" data-i="'+i+'" onclick="this.classList.toggle(\'on\');FZ.toque(\''+id+'\')">'+v+'</span>'; }).join('')+'</div>'
    + '<div id="'+id+'g" style="margin-top:12px"></div><div class="fz-msg" id="'+id+'m" style="margin-top:8px;text-align:center">'+d.vals.length+' datos</div>';
  var pie = '<button class="fz-btn o" onclick="FZ.ordenar(\''+id+'\')">↕ Ordenar de menor a mayor</button><button class="fz-btn" onclick="FZ.puntos(\''+id+'\')">📊 Gráfico de puntos</button>';
  return marco(id, 'est', 'Mesa de datos', d.que, h, pie, d.que==='MODA'?'La moda es el dato que más se repite.':d.que==='MEDIANA'?'La mediana es el dato del centro cuando están ordenados.':'Toca los datos para marcarlos mientras sumas.');
};
FZ.ordenar = function(id){ var s=FZ.st[id]; if(!s) return; FZ.toque(id); var o=s.v.slice().sort(function(a,b){ return a-b; }), n=o.length, mid=[Math.floor((n-1)/2), Math.ceil((n-1)/2)];
  $(id+'c').innerHTML = o.map(function(v,i){ return '<span class="fz-chip'+(s.q==='MEDIANA'&&mid.indexOf(i)>=0?' cm':'')+'" style="animation:fzPop .3s ease '+(i*.08)+'s both">'+v+'</span>'; }).join('');
  var m=$(id+'m'); if(m) m.textContent = s.q==='MEDIANA' ? 'En verde: el centro de la fila ordenada' : 'Datos ordenados'; tono(); };
FZ.puntos = function(id){ var s=FZ.st[id]; if(!s) return; FZ.toque(id); var c={}; s.v.forEach(function(v){ c[v]=(c[v]||0)+1; }); var ks=Object.keys(c).map(Number).sort(function(a,b){return a-b;});
  $(id+'g').innerHTML = '<div style="display:flex;gap:10px;align-items:flex-end;justify-content:center;flex-wrap:wrap">'+ks.map(function(k){ return '<div style="display:flex;flex-direction:column;align-items:center;gap:3px">'+Array(c[k]+1).join('<span style="width:16px;height:16px;border-radius:50%;background:#F59E0B;border:1.5px solid #B45309"></span>')+'<b style="border-top:3px solid #3D1468;padding-top:2px;min-width:24px;text-align:center">'+k+'</b></div>'; }).join('')+'</div>'; tono(); };

/* ── 18. Series en la recta (saltos) ── */
W.serie = function(d, modo, id){
  var v=d.vals, p=d.paso; if(!p) return null;
  var pts = v.slice(); FZ.st[id] = {modo:modo, v:v, p:p, k:0};
  var n = pts.length + 2, W0 = 480, dx = W0/(n), sv = '<svg class="fz-svg" viewBox="0 0 520 120" width="520"><line x1="20" y1="80" x2="500" y2="80" stroke="#3D1468" stroke-width="3"/>';
  for(var i=0;i<n;i++){ var x=30+i*dx; var lab = i<pts.length ? fmt(pts[i]) : '?'; sv += '<circle cx="'+x+'" cy="80" r="'+(i<pts.length?8:10)+'" fill="'+(i<pts.length?'#8B3EDB':'#FFE066')+'" stroke="#3D1468" stroke-width="2"/><text x="'+x+'" y="108" font-size="14" font-weight="900" text-anchor="middle" fill="#3D1468" id="'+id+'t'+i+'">'+lab+'</text>'; if(i>0 && i<pts.length) sv += '<path d="M'+(x-dx+6)+' 70 Q'+(x-dx/2)+' 26 '+(x-6)+' 70" stroke="#16876A" stroke-width="3" fill="none"/><text x="'+(x-dx/2)+'" y="34" font-size="13" font-weight="900" text-anchor="middle" fill="#16876A">+'+fmt(p)+'</text>'; }
  sv += '<g id="'+id+'j"></g></svg>';
  FZ.st[id].dx = dx; FZ.st[id].np = pts.length;
  return marco(id, 'op', 'Saltos de la serie', 'de '+fmt(p)+' en '+fmt(p), sv, '<button class="fz-btn g" onclick="FZ.serieSalto(\''+id+'\')">🐸 Dar el siguiente salto</button><span class="fz-msg" id="'+id+'m">¿Cuánto aumenta cada salto?</span>', 'Mira los saltos verdes: todos son iguales.');
};
FZ.serieSalto = function(id){ var s=FZ.st[id]; if(!s || s.k>=2) return; FZ.toque(id); var i=s.np+s.k, x=30+i*s.dx; $(id+'j').innerHTML += '<path d="M'+(x-s.dx+6)+' 70 Q'+(x-s.dx/2)+' 26 '+(x-6)+' 70" stroke="#E8650A" stroke-width="3" fill="none" stroke-dasharray="5 4"/><text x="'+(x-s.dx/2)+'" y="34" font-size="13" font-weight="900" text-anchor="middle" fill="#E8650A">+'+fmt(s.p)+'</text>'; var t=$(id+'t'+i); if(t) t.textContent = fmt(s.v[s.v.length-1]+s.p*(s.k+1)); s.k++; tono(); };

/* ── 19. Tabla de proporción (regla de tres) ── */
W.r3 = function(d, modo, id){
  var f=d.f, c = function(x){ return x ? fmt(x.v) : '?'; }, st = function(x){ return x ? '' : ' style="background:#FFFBEA;border:2.5px dashed #F5C518"'; };
  var hA = (f[0][0]&&f[0][0].u)||(f[1][0]&&f[1][0].u)||'Magnitud 1', hB = (f[0][1]&&f[0][1].u)||(f[1][1]&&f[1][1].u)||'Magnitud 2';
  var h = '<table class="fz-col" style="border-spacing:6px"><tr><th style="background:#0F766E;width:130px">'+esc(hA)+'</th><th style="background:#E8650A;width:130px">'+esc(hB)+'</th></tr>'
    + '<tr><td'+st(f[0][0])+'>'+c(f[0][0])+'</td><td'+st(f[0][1])+'>'+c(f[0][1])+'</td></tr><tr><td'+st(f[1][0])+'>'+c(f[1][0])+'</td><td'+st(f[1][1])+'>'+c(f[1][1])+'</td></tr></table>';
  var cono = (f[0][0]&&f[1][0]) ? [f[0][0].v, f[1][0].v] : (f[0][1]&&f[1][1]) ? [f[0][1].v, f[1][1].v] : null;
  h += '<div class="fz-msg" style="margin-top:8px;text-align:center">'+(cono?'Mira la columna completa: '+fmt(cono[0])+' → '+fmt(cono[1])+'. ¿Por cuánto se multiplicó o dividió?':'Compara las filas: las dos razones deben ser iguales')+'</div>';
  return marco(id, 'med', d.titulo||'Tabla de proporción', 'regla de tres', h, '<span class="fz-msg">Directa: si una sube, la otra sube igual. Inversa: si una sube, la otra baja.</span>', 'Lo que le pasa a una columna le pasa a la otra.');
};


/* ── 20. Comparar cantidades en la misma escala ── */
W.compara = function(d, modo, id){
  var mx = Math.max(1, Math.ceil(Math.max(d.items[0][1], d.items[1][1])));
  FZ.st[id] = {modo:modo, d:d, mx:mx};
  var cols = ['#FF8C2A','#16876A'];
  var h = '<div style="display:flex;flex-direction:column;gap:12px">' + d.items.map(function(it,i){
    return '<div style="display:flex;align-items:center;gap:10px"><span class="fz-rowlab" style="min-width:70px">'+esc(it[0])+'</span><div style="flex:1;height:34px;background:#FFFFFF;border:2.5px solid #3D1468;border-radius:10px;position:relative;overflow:hidden">'
      + '<div id="'+id+'b'+i+'" style="height:100%;width:0%;background:linear-gradient(90deg,'+cols[i]+','+cols[i]+'AA);transition:width 1.2s"></div>'
      + Array(mx*10).join('x').split('').map(function(_,k){ return '<i style="position:absolute;top:0;bottom:0;left:'+((k+1)*100/(mx*10))+'%;border-left:1px solid rgba(61,20,104,'+((k+1)%10===0?.8:.2)+')"></i>'; }).join('')
      + '</div></div>'; }).join('')
    + '<div style="display:flex;justify-content:space-between;font-weight:900;color:#3D1468;padding-left:80px"><span>0</span>'+(mx>1?'<span>'+Math.floor(mx/2)+'</span>':'<span>½</span>')+'<span>'+mx+'</span></div></div>';
  return marco(id, 'dec', 'Comparador', 'en la misma regla', h, '<button class="fz-btn o" onclick="FZ.comparar(\''+id+'\')">📏 Medir las dos</button><span class="fz-msg">Las dos barras usan la misma unidad</span>', 'Pasa todo a la misma forma (decimal, fracción o %) para comparar.');
};
FZ.comparar = function(id){ var s=FZ.st[id]; if(!s) return; FZ.toque(id); s.d.items.forEach(function(it,i){ var b=$(id+'b'+i); if(b) b.style.width = Math.min(100, it[1]/s.mx*100)+'%'; }); tono(); };

/* ── 21. Razón con fichas ── */
W.razon = function(d, modo, id){
  var a=d.a, b=d.b, g=gcd(a,b); FZ.st[id] = {modo:modo, a:a, b:b};
  function fila(n, c, ic){ return '<div class="fz-chips" id="'+id+ic+'">'+Array(n+1).join('<span style="width:20px;height:20px;border-radius:'+(ic==='A'?'50%':'5px')+';background:'+c+';border:1.5px solid #3D1468;display:inline-block"></span>')+'</div>'; }
  var h = '<div style="display:flex;flex-direction:column;gap:10px"><div style="display:flex;gap:10px;align-items:center"><span class="fz-rowlab">'+(esc(d.na)||'A')+'</span>'+fila(a,'#FF8C2A','A')+'</div><div style="display:flex;gap:10px;align-items:center"><span class="fz-rowlab">'+(esc(d.nb)||'B')+'</span>'+fila(b,'#6366F1','B')+'</div></div><div class="fz-eq" id="'+id+'e">'+a+' : '+b+'</div>';
  var pie = '<span style="font-weight:900;color:#3D1468">Agrupar de a:</span>'+[2,3,4,5,6,7].map(function(k){ return '<button class="fz-btn b" onclick="FZ.razGrupo(\''+id+'\','+k+')">'+k+'</button>'; }).join('')+'<span class="fz-msg" id="'+id+'m">Primero va la cantidad que se nombra primero</span>';
  return marco(id, 'eq', 'Razón con fichas', a+' a '+b, h, pie, 'Una razón compara dos cantidades. Si puedes agrupar las dos filas igual, se simplifica.');
};
FZ.razGrupo = function(id, k){ var s=FZ.st[id]; if(!s) return; FZ.toque(id); var m=$(id+'m');
  if(s.a%k||s.b%k){ if(m) m.textContent='❌ Con grupos de '+k+' no quedan exactas las dos filas'; tono(); return; }
  ['A','B'].forEach(function(r){ var sp=document.querySelectorAll('#'+id+r+' span'); sp.forEach(function(x,i){ x.style.marginRight = ((i+1)%k===0)?'12px':'0'; }); });
  if(m) m.textContent = '✅ '+s.a+' : '+s.b+' = '+(s.a/k)+' : '+(s.b/k)+' (grupos de '+k+')'; tono(); };

/* ── 22. Modelo de barras (varios datos) ── */
W.barras = function(d, modo, id){
  var P = d.partes, tot = d.op==='+' ? P.reduce(function(x,y){ return x+y; },0) : P[0];
  if(!tot || P.some(function(x){ return x<=0; })) return null;
  var cols = ['#8B3EDB','#FF8C2A','#16876A','#0EA5E9'], W0=440, x=20;
  var sv = '<svg class="fz-svg" viewBox="0 0 480 120" width="480">';
  if(d.op==='+'){ P.forEach(function(v,i){ var w=Math.max(40, W0*v/tot); if(x+w>460) w=460-x; sv += '<rect x="'+x+'" y="44" width="'+w+'" height="40" rx="8" fill="'+cols[i%4]+'" stroke="#fff" stroke-width="2"/><text x="'+(x+w/2)+'" y="70" fill="#fff" font-size="15" font-weight="900" text-anchor="middle">'+fmt(v)+'</text>'; x+=w; });
    sv += '<path d="M20 34 v-10 h'+(x-20)+' v10" stroke="#3D1468" stroke-width="3" fill="none"/><text x="'+((x+20)/2)+'" y="18" fill="#3D1468" font-size="17" font-weight="900" text-anchor="middle">Total = ?</text>'; }
  else { var wb = Math.max(60, W0*P[1]/tot); sv += '<rect x="20" y="44" width="'+W0+'" height="40" rx="8" fill="#E8DBFF" stroke="#8B3EDB" stroke-width="2"/><rect x="'+(20+W0-wb)+'" y="44" width="'+wb+'" height="40" rx="8" fill="#FF8C2A"/><text x="'+(20+W0-wb/2)+'" y="70" fill="#fff" font-size="14" font-weight="900" text-anchor="middle">'+fmt(P[1])+'</text><text x="'+(20+(W0-wb)/2)+'" y="70" fill="#3D1468" font-size="17" font-weight="900" text-anchor="middle">¿queda?</text>'
    + '<path d="M20 34 v-10 h'+W0+' v10" stroke="#3D1468" stroke-width="3" fill="none"/><text x="'+(20+W0/2)+'" y="18" fill="#3D1468" font-size="15" font-weight="900" text-anchor="middle">Al inicio: '+fmt(P[0])+'</text>'; }
  sv += '</svg>';
  return marco(id, 'op', 'Modelo de barras', d.op==='+'?'juntar':'quitar', sv, '<span class="fz-msg">'+(d.op==='+'?'Junta todas las partes: '+P.map(fmt).join(' + '):'Al total le quitas la parte naranja')+'</span>', 'Dibujar el problema ayuda a saber qué operación hacer.');
};

/* ── 23. Ordenar números en el tablero (cifra por cifra) ── */
W.ordenar = function(d, modo, id){
  var it = d.items, ent = 0, dc = 0;
  it.forEach(function(x){ var p = x.split(','); ent = Math.max(ent, p[0].replace(/\./g,'').length); dc = Math.max(dc, (p[1]||'').length); });
  if(ent+dc>9) return null;
  FZ.st[id] = {modo:modo, it:it, ent:ent, dc:dc, col:-1};
  var head = '<tr><th style="background:none"></th>';
  for(var i=0;i<ent;i++){ var pos=ent-1-i; head += '<th style="background:'+PLCOL[pos]+'" onclick="FZ.ordCol(\''+id+'\','+i+')">'+PLC[pos]+'</th>'; }
  if(dc){ head += '<th style="background:none;width:14px"></th>'; for(var j=0;j<dc;j++) head += '<th style="background:'+PLDCOL[j]+'" onclick="FZ.ordCol(\''+id+'\','+(ent+j)+')">'+PLDEC[j]+'</th>'; }
  var rows = it.map(function(x, r){
    var p = x.split(','), e = p[0].replace(/\./g,''), de = p[1]||'', h = '<tr><td class="op" style="font-size:14px;color:#5C21A6">'+String.fromCharCode(65+r)+'</td>';
    for(var i=0;i<ent;i++){ var c = e[e.length-ent+i]; h += '<td id="'+id+'r'+r+'c'+i+'">'+(c===undefined?'':c)+'</td>'; }
    if(dc){ h += '<td class="cm">'+(de?',':'')+'</td>'; for(var j=0;j<dc;j++) h += '<td id="'+id+'r'+r+'c'+(ent+j)+'" style="'+(de[j]===undefined?'color:#C4B5FD':'')+'">'+(de[j]===undefined?'0':de[j])+'</td>'; }
    return h+'</tr>'; }).join('');
  var hh = '<table class="fz-col">'+head+rows+'</table><div class="fz-msg" id="'+id+'m" style="margin-top:8px;text-align:center">Compara columna por columna, empezando por la izquierda</div>';
  var pie = '<button class="fz-btn o" onclick="FZ.ordPaso(\''+id+'\')">👉 Comparar la siguiente columna</button><button class="fz-btn w" onclick="FZ.ordReset(\''+id+'\')">↺</button>';
  return marco(id, 'dec', 'Tablero para comparar', it.join(' · '), hh, pie, dc?'Los ceros grises a la derecha no cambian el valor: 0,4 = 0,40.':'Gana el que tenga la cifra mayor en la primera columna diferente.');
};
FZ.ordCol = function(id, c){ var s=FZ.st[id]; if(!s) return; FZ.toque(id); s.col = c; document.querySelectorAll('#'+id+' td.hl').forEach(function(x){ x.classList.remove('hl'); }); s.it.forEach(function(_,r){ var e=$(id+'r'+r+'c'+c); if(e) e.classList.add('hl'); }); var m=$(id+'m'); if(m){ var vs = s.it.map(function(_,r){ var e=$(id+'r'+r+'c'+c); return e?e.textContent||'0':'0'; }); m.textContent = 'En esta columna: '+vs.map(function(v,r){ return String.fromCharCode(65+r)+' tiene '+v; }).join(' · '); } tono(); };
FZ.ordPaso = function(id){ var s=FZ.st[id]; if(!s) return; FZ.ordCol(id, Math.min(s.ent+s.dc-1, s.col+1)); };
FZ.ordReset = function(id){ var s=FZ.st[id]; if(!s) return; s.col=-1; document.querySelectorAll('#'+id+' td.hl').forEach(function(x){ x.classList.remove('hl'); }); };

/* ── 24. Recta decimal con zoom ── */
W.rectad = function(d, modo, id){
  var a=d.a, b=d.b; if(!(b>a)) return null;
  var paso = Math.pow(10, Math.floor(Math.log10(b-a))-1), n = Math.round((b-a)/paso); if(n>20||n<2) return null;
  FZ.st[id] = {modo:modo};
  var sv = '<svg class="fz-svg" viewBox="0 0 540 110" width="540"><line x1="20" y1="60" x2="520" y2="60" stroke="#1E40AF" stroke-width="3"/>';
  for(var i=0;i<=n;i++){ var x=20+i*500/n, big=(i===0||i===n); sv += '<line x1="'+x+'" y1="'+(big?46:52)+'" x2="'+x+'" y2="'+(big?74:68)+'" stroke="#1E40AF" stroke-width="'+(big?3:1.5)+'"/>'; if(big) sv += '<text x="'+x+'" y="96" font-size="15" font-weight="900" text-anchor="middle" fill="#1E40AF">'+fmt(a+i*paso)+'</text>'; else sv += '<circle cx="'+x+'" cy="60" r="7" fill="#FFFFFF" stroke="#E8650A" stroke-width="2" style="cursor:pointer" onclick="FZ.rdClic(\''+id+'\',this,\''+fmt(Math.round((a+i*paso)*1e6)/1e6)+'\')"/>'; }
  sv += '<text id="'+id+'lab" x="270" y="30" font-size="16" font-weight="900" text-anchor="middle" fill="#E8650A"></text></svg>';
  return marco(id, 'dec', 'Recta con lupa', fmt(a)+' a '+fmt(b), sv, '<span class="fz-msg">Entre '+fmt(a)+' y '+fmt(b)+' hay '+(n-1)+' marcas más pequeñas</span>', 'Toca los circulitos para ver qué número es cada marca.');
};
FZ.rdClic = function(id, el, v){ FZ.toque(id); el.setAttribute('fill','#FFE066'); var l=$(id+'lab'); if(l){ l.textContent = v; l.setAttribute('x', el.getAttribute('cx')); } tono(); hablar(v.replace(',',' coma ')); };

/* ── 25. Barra de porcentaje (parte de un total) ── */
W.pctbar = function(d, modo, id){
  var a=d.a, b=d.b, W0=460, wa=W0*a/b;
  var sv = '<svg class="fz-svg" viewBox="0 0 500 120" width="500"><rect x="20" y="36" width="'+W0+'" height="40" rx="8" fill="#FCE7F3" stroke="#BE185D" stroke-width="2"/><rect x="20" y="36" width="'+wa.toFixed(1)+'" height="40" rx="8" fill="#F472B6"/>'
    + '<text x="'+(20+wa/2)+'" y="62" font-size="15" font-weight="900" text-anchor="middle" fill="#fff">'+fmt(a)+'</text><text x="'+(20+W0/2)+'" y="24" font-size="14" font-weight="900" text-anchor="middle" fill="#BE185D">Total: '+fmt(b)+' = 100 %</text>';
  [0,25,50,75,100].forEach(function(p){ var x=20+W0*p/100; sv += '<line x1="'+x+'" y1="80" x2="'+x+'" y2="90" stroke="#3D1468" stroke-width="2"/>'+((p===0||p===100||modo==='ej')?'<text x="'+x+'" y="106" font-size="12" font-weight="900" text-anchor="middle" fill="#3D1468">'+p+' %</text>':''); });
  sv += '</svg>';
  return marco(id, 'pct', 'Barra del 100 %', fmt(a)+' de '+fmt(b), sv, '<span class="fz-msg">Porcentaje = parte ÷ total × 100</span>', 'Mira qué tanto de la barra ocupa la parte rosada.');
};

/* ── 26. Propiedades de potencias (misma base) ── */
W.potprop = function(d, modo, id){
  FZ.st[id] = {modo:modo, d:d, tach:0};
  function cad(n, g){ return Array(n+1).join('x').split('').map(function(_,i){ return '<span class="fz-chip" data-g="'+g+'" data-i="'+i+'" onclick="FZ.ppClic(\''+id+'\',this)">'+d.a+'</span>'; }).join('<b style="color:#E8650A">×</b>'); }
  var h = d.op==='×'
    ? '<div class="fz-eq">'+d.a+'<sup>'+d.e1+'</sup> × '+d.a+'<sup>'+d.e2+'</sup></div><div class="fz-chips" style="justify-content:center;margin:8px 0">'+cad(d.e1,1)+'<b style="font-size:22px;color:#7C3AED;margin:0 6px">×</b>'+cad(d.e2,2)+'</div><div class="fz-msg" id="'+id+'m" style="text-align:center">Cuenta cuántas veces está el '+d.a+' en total</div>'
    : '<div class="fz-eq">'+d.a+'<sup>'+d.e1+'</sup> ÷ '+d.a+'<sup>'+d.e2+'</sup></div><div style="display:flex;flex-direction:column;align-items:center;gap:4px;margin:8px 0"><div class="fz-chips" style="justify-content:center">'+cad(d.e1,1)+'</div><div style="width:80%;height:3px;background:#3D1468"></div><div class="fz-chips" style="justify-content:center">'+cad(d.e2,2)+'</div></div><div class="fz-msg" id="'+id+'m" style="text-align:center">Toca un '+d.a+' de arriba y uno de abajo para tacharlos (se cancelan)</div>';
  return marco(id, 'pot', d.op==='×'?'Juntar potencias':'Dividir potencias', 'misma base '+d.a, h, '', d.op==='×'?'Con la misma base, al multiplicar se suman los exponentes.':'Con la misma base, al dividir se restan los exponentes.');
};
FZ.ppClic = function(id, el){
  var s=FZ.st[id]; if(!s) return; FZ.toque(id);
  if(s.d.op==='×'){ el.classList.toggle('on'); var n=document.querySelectorAll('#'+id+' .fz-chip.on').length; var m=$(id+'m'); if(m) m.textContent = 'Llevas '+n+' de '+(s.d.e1+s.d.e2); tono(); return; }
  if(el.style.textDecoration) return;
  var g = el.getAttribute('data-g'); s.sel = s.sel || {};
  el.style.textDecoration='line-through'; el.style.opacity='.35'; s.sel[g]=(s.sel[g]||0)+1;
  var m=$(id+'m'); if(m) m.textContent = 'Tachados arriba: '+(s.sel['1']||0)+' · abajo: '+(s.sel['2']||0);
  tono();
};

/* ── 27. ¿Directa o inversa? (tabla + gráfica) ── */
W.relacion = function(d, modo, id){
  var P = d.pts, mx = Math.max(P[0][0],P[1][0])*1.25, my = Math.max(P[0][1],P[1][1])*1.25;
  var X = function(v){ return 50+v/mx*400; }, Y = function(v){ return 210-v/my*180; };
  var sv = '<svg class="fz-svg" viewBox="0 0 480 240" width="480"><line x1="50" y1="210" x2="460" y2="210" stroke="#3D1468" stroke-width="2"/><line x1="50" y1="210" x2="50" y2="20" stroke="#3D1468" stroke-width="2"/>'
    + '<line x1="'+X(P[0][0])+'" y1="'+Y(P[0][1])+'" x2="'+X(P[1][0])+'" y2="'+Y(P[1][1])+'" stroke="#E8650A" stroke-width="3" stroke-dasharray="6 5"/>';
  P.forEach(function(p){ sv += '<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="8" fill="#0F766E"/><text x="'+(X(p[0])+10)+'" y="'+(Y(p[1])-10)+'" font-size="13" font-weight="900" fill="#0F766E">('+fmt(p[0])+', '+fmt(p[1])+')</text>'; });
  sv += '</svg>';
  var h = '<table class="fz-col" style="border-spacing:6px;margin-bottom:8px"><tr><th style="background:#0F766E;width:110px">Primera</th><th style="background:#E8650A;width:110px">Segunda</th></tr>'+P.map(function(p){ return '<tr><td style="font-size:20px">'+fmt(p[0])+'</td><td style="font-size:20px">'+fmt(p[1])+'</td></tr>'; }).join('')+'</table>'+sv;
  return marco(id, 'med', '¿Directa o inversa?', 'tabla y gráfica', h, '<span class="fz-msg">Si al aumentar una la otra también aumenta en la misma proporción → directa. Si una aumenta y la otra disminuye → inversa.</span>', 'Mira hacia dónde va la línea: ¿sube o baja?');
};

/* ── 28. Probador de primos con las opciones ── */
W.primos = function(d, modo, id){
  FZ.st[id] = {modo:modo};
  var h = '<div class="fz-chips" style="justify-content:center">'+d.ns.map(function(n){ return '<button class="fz-btn g" onclick="FZ.primoVer(\''+id+'\','+n+')">'+n+'</button>'; }).join('')+'</div><div class="fz-msg" id="'+id+'m" style="margin-top:8px;text-align:center">Toca cada número para ver todos sus divisores</div>';
  return marco(id, 'div', 'Detector de primos', 'cuenta los divisores', h, '', 'Primo: solo 2 divisores (1 y él mismo). Compuesto: más de 2.');
};
FZ.primoVer = function(id, n){ FZ.toque(id); var dv=divisores(n); var m=$(id+'m'); if(m) m.innerHTML = 'Divisores de '+n+': '+dv.map(function(x){ return '<span class="fz-chip cm" style="display:inline-block;margin:2px">'+x+'</span>'; }).join(' ')+' → '+dv.length+' divisor'+(dv.length>1?'es':''); tono(); };

/* ── 29. Transportador (ángulos) ── */
W.angulo = function(d, modo, id){
  FZ.st[id] = {modo:modo, g:d.g, ref:d.ref};
  var h = '<div style="text-align:center"><svg class="fz-svg" viewBox="0 0 360 210" width="360" id="'+id+'s"></svg>'
    + '<input type="range" min="0" max="'+(d.libre?360:180)+'" value="'+d.g+'" style="width:260px" oninput="FZ.angDib(\''+id+'\',+this.value,1)"><div class="fz-msg" id="'+id+'m" style="margin-top:6px"></div></div>';
  setTimeout(function(){ FZ.angDib(id, d.g); }, 0);
  var pie = modo==='ej' ? '<span class="fz-chip" style="background:#DBEAFE">agudo &lt; 90°</span><span class="fz-chip" style="background:#DCFCE7">recto = 90°</span><span class="fz-chip" style="background:#FEF3C7">obtuso &gt; 90°</span><span class="fz-chip" style="background:#FCE7F3">llano = 180°</span>' : '<span class="fz-chip" style="background:#DBEAFE">agudo</span><span class="fz-chip" style="background:#DCFCE7">recto</span><span class="fz-chip" style="background:#FEF3C7">obtuso</span><span class="fz-chip" style="background:#FCE7F3">llano</span>';
  return marco(id, 'med', 'Transportador', d.libre?'explora los ángulos':d.g+'°', h, pie, d.ref ? 'El '+(d.ref===90?'ángulo recto':'ángulo llano')+' está marcado. ¿Cuánto falta para llegar?' : 'Mueve la barra para abrir o cerrar el ángulo.');
};
FZ.angDib = function(id, g, toca){
  var s=FZ.st[id]; if(!s || !$(id+'s')) return; if(toca) FZ.toque(id); s.g=g;
  var cx=180, cy=180, R=150, sv='';
  sv += '<path d="M'+(cx-R)+' '+cy+' A'+R+' '+R+' 0 0 1 '+(cx+R)+' '+cy+' Z" fill="#EFF6FF" stroke="#1E40AF" stroke-width="2"/>';
  for(var a=0;a<=180;a+=10){ var r=a*Math.PI/180, l=a%30===0?14:7; sv += '<line x1="'+(cx+R*Math.cos(r))+'" y1="'+(cy-R*Math.sin(r))+'" x2="'+(cx+(R-l)*Math.cos(r))+'" y2="'+(cy-(R-l)*Math.sin(r))+'" stroke="#1E40AF" stroke-width="1.5"/>'; if(a%30===0) sv += '<text x="'+(cx+(R-26)*Math.cos(r))+'" y="'+(cy-(R-26)*Math.sin(r)+4)+'" font-size="11" font-weight="900" text-anchor="middle" fill="#1E40AF">'+a+'</text>'; }
  if(s.ref){ var rr=s.ref*Math.PI/180; sv += '<path d="M'+cx+' '+cy+' L'+(cx+R)+' '+cy+' A'+R+' '+R+' 0 0 0 '+(cx+R*Math.cos(rr))+' '+(cy-R*Math.sin(rr))+' Z" fill="rgba(245,197,24,.18)"/>'; }
  var gg = Math.min(g,360), r2 = gg*Math.PI/180, arc = gg>180 ? 1 : 0;
  sv += '<path d="M'+(cx+44)+' '+cy+' A44 44 0 '+arc+' 0 '+(cx+44*Math.cos(r2)).toFixed(1)+' '+(cy-44*Math.sin(r2)).toFixed(1)+'" fill="none" stroke="#E8650A" stroke-width="4"/>';
  sv += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+R)+'" y2="'+cy+'" stroke="#3D1468" stroke-width="4" stroke-linecap="round"/>';
  sv += '<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+R*Math.cos(r2)).toFixed(1)+'" y2="'+(cy-R*Math.sin(r2)).toFixed(1)+'" stroke="#E8650A" stroke-width="5" stroke-linecap="round"/><circle cx="'+cx+'" cy="'+cy+'" r="6" fill="#3D1468"/>';
  $(id+'s').innerHTML = sv;
  var tipo = g===0?'nulo':g<90?'agudo':g===90?'recto':g<180?'obtuso':g===180?'llano':g<360?'mayor que un llano':'completo';
  var m=$(id+'m'); if(m) m.textContent = s.modo==='ex' ? 'Ángulo de '+g+'°' : g+'° → ángulo '+tipo;
};

/* ── 30. Polígono regular ── */
W.poligono = function(d, modo, id){
  var n=d.n; if(!n||n<3||n>12) return null;
  FZ.st[id] = {modo:modo, n:n, c:0};
  var R=90, cx=110, cy=105, pts=[];
  for(var i=0;i<n;i++){ var a=-Math.PI/2+i*2*Math.PI/n; pts.push([cx+R*Math.cos(a), cy+R*Math.sin(a)]); }
  var sv = '<svg class="fz-svg" viewBox="0 0 220 210" width="220"><polygon points="'+pts.map(function(p){ return p[0].toFixed(1)+','+p[1].toFixed(1); }).join(' ')+'" fill="#CCFBF1" stroke="#0F766E" stroke-width="4"/>';
  pts.forEach(function(p,i){ sv += '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="10" fill="#FFFFFF" stroke="#E8650A" stroke-width="3" style="cursor:pointer" onclick="FZ.vert(\''+id+'\',this)"/>'; });
  sv += '</svg>';
  return marco(id, 'med', 'Polígono', 'toca y cuenta', '<div style="display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap">'+sv+'<div class="fz-msg" id="'+id+'m">Toca cada vértice (esquina) para contarlo</div></div>', '', 'En un polígono hay tantos lados como vértices.');
};
FZ.vert = function(id, el){ var s=FZ.st[id]; if(!s || el.getAttribute('data-ok')) return; FZ.toque(id); el.setAttribute('data-ok','1'); el.setAttribute('fill','#FFB547'); s.c++; var m=$(id+'m'); if(m) m.textContent = 'Llevas '+s.c+' vértice'+(s.c>1?'s':''); tono(); };

/* ── 31. Monedas ── */
W.moneda = function(d, modo, id){
  FZ.st[id] = {modo:modo, n:d.n, c:{}, tot:0};
  var h = '<div style="display:flex;gap:16px;align-items:center;justify-content:center;flex-wrap:wrap"><div id="'+id+'d" style="display:flex;gap:10px"></div><div id="'+id+'r" style="min-width:200px"></div></div>'
    + (d.n===2 ? '<div class="fz-tip" style="text-align:center">Resultados posibles con 2 monedas: 🙂🙂 · 🙂🏛️ · 🏛️🙂 · 🏛️🏛️</div>' : '<div class="fz-tip" style="text-align:center">Resultados posibles: 🙂 cara · 🏛️ sello</div>')
    + '<div class="fz-msg" id="'+id+'m" style="margin-top:6px;text-align:center">Lanza y observa</div>';
  setTimeout(function(){ var dd=$(id+'d'); if(dd) dd.innerHTML = Array(d.n+1).join('<span style="font-size:54px">🪙</span>'); }, 0);
  return marco(id, 'est', d.n===2?'Dos monedas':'Lanzar una moneda', 'experimento aleatorio', h, '<button class="fz-btn o" onclick="FZ.moneda(\''+id+'\',1)">🪙 Lanzar</button><button class="fz-btn" onclick="FZ.moneda(\''+id+'\',20)">🪙 Lanzar 20 veces</button>', 'Probabilidad = casos favorables ÷ casos posibles.');
};
FZ.moneda = function(id, k){
  var s=FZ.st[id]; if(!s || !$(id+'d')) return; FZ.toque(id); var ult='';
  for(var j=0;j<k;j++){ var r=''; for(var i=0;i<s.n;i++) r += Math.random()<.5 ? '🙂' : '🏛️'; if(s.n===2){ r = r.indexOf('🙂')>=0 && r.indexOf('🏛️')>=0 ? '🙂🏛️' : r; } s.c[r]=(s.c[r]||0)+1; s.tot++; ult=r; }
  $(id+'d').innerHTML = '<span style="font-size:54px">'+ult+'</span>';
  var mx = Math.max.apply(null, Object.keys(s.c).map(function(x){ return s.c[x]; }))||1;
  $(id+'r').innerHTML = Object.keys(s.c).map(function(x){ return '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;font-weight:900"><span style="min-width:60px;font-size:20px">'+x+'</span><span style="height:14px;border-radius:7px;background:#F59E0B;width:'+Math.round(s.c[x]/mx*140)+'px"></span>'+s.c[x]+'</div>'; }).join('');
  var m=$(id+'m'); if(m) m.textContent = s.tot+' lanzamientos'; tono();
};

/* ── 32. Tablero vacío para escribir un decimal ── */
W.pvvacio = function(d, modo, id){
  FZ.st[id] = {modo:modo};
  var cols = [['U','#E8650A','unidades']].concat([['d','#0EA5E9','décimas'],['c','#6366F1','centésimas'],['m','#A855F7','milésimas']].slice(0,Math.max(d.lug,1)));
  var h = '<div class="fz-pv">'+cols.map(function(c,i){ return (i===1?'<span class="cm">,</span>':'')+'<div class="c"><span class="h" style="background:'+c[1]+'">'+c[0]+'</span><input maxlength="1" inputmode="numeric" oninput="FZ.toque(\''+id+'\');this.value=this.value.replace(/[^0-9]/g,\'\')" style="width:48px;height:56px;border-radius:12px;border:2.5px solid #D9CCFF;text-align:center;font-family:\'Baloo 2\',sans-serif;font-size:32px;font-weight:900;color:'+c[1]+'"><small style="font-size:10px;font-weight:900;color:#6B5E8A">'+c[2]+'</small></div>'; }).join('')+'</div>'
    + '<div class="fz-msg" style="margin-top:10px;text-align:center">«'+esc(d.txt)+'»: la última cifra va en la columna de las '+cols[cols.length-1][2]+'</div>';
  return marco(id, 'dec', 'Tablero para escribir el decimal', d.txt, h, '', 'Décimas: 1 lugar después de la coma · centésimas: 2 · milésimas: 3. Completa con ceros si hace falta.');
};

/* ── 33. División con decimales: correr la coma ── */
W.divdec = function(d, modo, id){
  FZ.st[id] = {modo:modo, a:d.a, b:d.b, k:0};
  var h = '<div class="fz-eq" id="'+id+'e">'+d.sa+' ÷ '+d.sb+'</div><div class="fz-msg" id="'+id+'m" style="margin-top:8px;text-align:center">El divisor tiene coma. Multiplica los DOS números por 10 hasta que el divisor no tenga coma.</div>';
  return marco(id, 'dec', 'Quitar la coma del divisor', d.sa+' ÷ '+d.sb, h, '<button class="fz-btn o" onclick="FZ.ddPaso(\''+id+'\')">✖ Multiplicar los dos por 10</button><button class="fz-btn w" onclick="FZ.ddReset(\''+id+'\')">↺</button>', 'La división no cambia si multiplicas dividendo y divisor por el mismo número.');
};
FZ.ddPaso = function(id){ var s=FZ.st[id]; if(!s||!$(id+'e')) return; FZ.toque(id); if(Math.abs(s.b*Math.pow(10,s.k)-Math.round(s.b*Math.pow(10,s.k)))<1e-9){ var m=$(id+'m'); if(m) m.textContent='🎯 ¡El divisor ya no tiene coma! Ahora divide normalmente.'; return; } s.k++; var f=Math.pow(10,s.k); $(id+'e').textContent = fmt(Math.round(s.a*f*1e6)/1e6)+' ÷ '+fmt(Math.round(s.b*f*1e6)/1e6); var m2=$(id+'m'); if(m2) m2.textContent='Multiplicamos por '+fmt(f)+' los dos números'; tono(); };
FZ.ddReset = function(id){ var s=FZ.st[id]; if(!s) return; s.k=0; $(id+'e').textContent = fmt(s.a)+' ÷ '+fmt(s.b); };

/* ── 34. Aproximar en la recta ── */
W.aprox = function(d, modo, id){
  var f=Math.pow(10,d.c), lo=Math.floor(d.v*f)/f, hi=lo+1/f;
  var sv = '<svg class="fz-svg" viewBox="0 0 520 110" width="520"><line x1="30" y1="60" x2="490" y2="60" stroke="#1E40AF" stroke-width="3"/>';
  for(var i=0;i<=10;i++){ var x=30+i*46; sv += '<line x1="'+x+'" y1="'+(i%5===0?44:52)+'" x2="'+x+'" y2="'+(i%5===0?76:68)+'" stroke="#1E40AF" stroke-width="'+(i%5===0?3:1.5)+'"/>'; }
  sv += '<text x="30" y="98" font-size="15" font-weight="900" text-anchor="middle" fill="#1E40AF">'+fmt(Math.round(lo*1e6)/1e6)+'</text><text x="490" y="98" font-size="15" font-weight="900" text-anchor="middle" fill="#1E40AF">'+fmt(Math.round(hi*1e6)/1e6)+'</text><text x="260" y="98" font-size="12" font-weight="900" text-anchor="middle" fill="#6B5E8A">mitad</text>';
  var px = 30 + (d.v-lo)/(hi-lo)*460;
  sv += '<circle cx="'+px.toFixed(1)+'" cy="60" r="9" fill="#E8650A"/><text x="'+px.toFixed(1)+'" y="34" font-size="14" font-weight="900" text-anchor="middle" fill="#E8650A">'+d.s+'</text></svg>';
  return marco(id, 'dec', 'Aproximar en la recta', d.s+' a '+d.c+' cifra'+(d.c>1?'s':''), sv, '<span class="fz-msg">¿A cuál de los dos extremos está más cerca el punto naranja?</span>', 'Si la cifra siguiente es 5 o más, se aproxima hacia arriba.');
};

/* ── 35. ¿Directa o inversa? (sin datos: predice) ── */
W.relconcepto = function(d, modo, id){
  FZ.st[id] = {modo:modo};
  var a=esc(d.a), b=esc(d.b);
  var h = '<div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap"><div class="fz-chip on" style="font-size:15px">'+a+'</div><span style="font-size:26px">⬆️</span><span style="font-weight:900;color:#3D1468">entonces</span><div class="fz-chip" style="font-size:15px">'+b+'</div><span id="'+id+'f" style="font-size:26px">❓</span></div>'
    + '<div style="display:flex;gap:10px;justify-content:center;margin-top:12px"><button class="fz-btn g" onclick="FZ.relPred(\''+id+'\',1)">⬆️ también aumenta</button><button class="fz-btn o" onclick="FZ.relPred(\''+id+'\',-1)">⬇️ disminuye</button></div><div class="fz-msg" id="'+id+'m" style="margin-top:10px;text-align:center">Imagina la situación: si aumenta «'+a+'», ¿qué pasa con «'+b+'»?</div>';
  return marco(id, 'med', 'Piensa la relación', 'directa o inversa', h, '', 'Directa: las dos suben juntas. Inversa: una sube y la otra baja.');
};
FZ.relPred = function(id, dir){ FZ.toque(id); var f=$(id+'f'); if(f) f.textContent = dir>0?'⬆️':'⬇️'; var m=$(id+'m'); if(m) m.textContent = dir>0 ? 'Si las dos aumentan en la misma proporción, la relación es DIRECTA.' : 'Si una aumenta y la otra disminuye, la relación es INVERSA.'; tono(); };

/* ── 36. Pizarra de apoyo (para todo lo demás) ── */
W.pizarra = function(d, modo, id){
  FZ.st[id] = {modo:modo, col:'#5C21A6'};
  var chips = d.datos.length ? '<div style="font-weight:900;color:#3D1468;margin-bottom:6px">🔎 Datos del problema:</div><div class="fz-chips" style="margin-bottom:8px">'+d.datos.map(function(x){ return '<span class="fz-chip" onclick="this.classList.toggle(\'on\');FZ.toque(\''+id+'\')">'+esc(x)+'</span>'; }).join('')+'</div>' : '';
  var form = d.formula ? '<div style="background:#FFF7E6;border:2px dashed #F5A524;border-radius:12px;padding:8px 12px;font-weight:900;color:#7A3200;margin-bottom:8px">🧠 '+esc(d.formula)+'</div>' : '';
  var h = chips + form + '<canvas id="'+id+'cv" width="640" height="220" style="width:100%;height:220px;background:#FFFFFF;border-radius:14px;border:2.5px solid #D9CCFF;touch-action:none;cursor:crosshair;background-image:linear-gradient(#EEE8FB 1px,transparent 1px),linear-gradient(90deg,#EEE8FB 1px,transparent 1px);background-size:22px 22px"></canvas>';
  var pie = ['#5C21A6','#E8650A','#16876A','#1E40AF','#C94B22'].map(function(c){ return '<button onclick="FZ.pizCol(\''+id+'\',\''+c+'\')" style="width:28px;height:28px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px '+c+';background:'+c+';cursor:pointer"></button>'; }).join('')
    + '<button class="fz-btn w" onclick="FZ.pizBorrar(\''+id+'\')">🧽 Borrar</button><span class="fz-msg">Escribe o dibuja aquí tu proceso con el dedo o el ratón</span>';
  setTimeout(function(){ FZ.pizIni(id); }, 30);
  return marco(id, 'eq', 'Pizarra de apoyo', 'haz tus cuentas aquí', h, pie, 'Subraya los datos tocándolos y haz la operación en la pizarra.');
};
FZ.pizIni = function(id){
  var cv = $(id+'cv'); if(!cv || cv._ok) return; cv._ok = true;
  var ctx = cv.getContext('2d'), dib = false, s = FZ.st[id];
  function pos(e){ var r = cv.getBoundingClientRect(), p = e.touches ? e.touches[0] : e; return [(p.clientX-r.left)*cv.width/r.width, (p.clientY-r.top)*cv.height/r.height]; }
  function ini(e){ e.preventDefault(); dib = true; var p=pos(e); ctx.beginPath(); ctx.moveTo(p[0],p[1]); FZ.toque(id); }
  function mov(e){ if(!dib) return; e.preventDefault(); var p=pos(e); ctx.lineTo(p[0],p[1]); ctx.strokeStyle=s.col; ctx.lineWidth=4; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke(); }
  function fin(){ dib = false; }
  cv.addEventListener('mousedown', ini); cv.addEventListener('mousemove', mov); window.addEventListener('mouseup', fin);
  cv.addEventListener('touchstart', ini, {passive:false}); cv.addEventListener('touchmove', mov, {passive:false}); cv.addEventListener('touchend', fin);
};
FZ.pizCol = function(id, c){ var s=FZ.st[id]; if(s) s.col=c; };
FZ.pizBorrar = function(id){ var cv=$(id+'cv'); if(cv) cv.getContext('2d').clearRect(0,0,cv.width,cv.height); };

/* ═══════════════ API ═══════════════ */
FZ.crear = function(ex, modo){
  try{
    var uk = claveUnidad();
    var d = detectar(ex.q, ex.ctx, uk);
    var ql = limpio(ex.q);
    if(!d && Array.isArray(ex.opts)){
      var on = ex.opts.map(function(o){ return String(o).trim(); });
      if(/estos n[uú]meros es (PRIMO|COMPUESTO)/i.test(ql) && on.every(function(o){ return /^\d+$/.test(o) && +o<=500; })) d = {k:'primos', ns:on.map(Number)};
      else if(/^¿Cu[aá]l es (MAYOR|MENOR|el mayor|el menor)\?$/i.test(ql) && on.every(function(o){ return /^(\d{1,3}(\.\d{3})+|\d+)(,\d+)?$/.test(o); })) d = {k:'ordenar', items:on};
    }
    var id = nuevoId();
    var h = (d && W[d.k]) ? W[d.k](d, modo, id) : '';
    if(!h && !ex.svgFig){
      // Pizarra de apoyo con los datos del propio enunciado y la fórmula del tema
      var tx = limpio((ex.ctx||'')+' '+ex.q);
      var datos = (tx.match(/\$?\s?\d{1,3}(?:\.\d{3})+(?:,\d+)?\s*%?|\$?\s?\d+(?:,\d+)?(?:\s*\/\s*\d+)?\s*%?|«[^»]+»/g)||[]).map(function(x){ return x.trim(); }).filter(function(x,i,a){ return x && a.indexOf(x)===i; }).slice(0,8);
      var formula = ''; try{ var tp = UNITS[curUnit].topics[curTopicIdx]; if(tp && tp.formula) formula = limpio(tp.formula); }catch(e){}
      if(formula && modo==='ex' && ex.ans!==undefined && String(ex.ans).trim().length && formula.indexOf(String(ex.ans).trim())>=0) formula = '';
      id = nuevoId();
      h = W.pizarra({datos:datos, formula:formula}, modo, id);
    }
    return h || '';
  }catch(e){ try{ console.warn('[FZ]', e); }catch(x){} return ''; }
};
FZ.detectar = function(q, ctx){ return detectar(q, ctx, claveUnidad()); };


/* Figuras que ya traía el libro: animación de entrada, tocar para resaltar y ampliar */
function animarFigura(cont){
  if(!cont || cont.getAttribute('data-fzfig')) return;
  cont.setAttribute('data-fzfig','1'); cont.classList.add('fz-figx','anim');
  var k=0; cont.querySelectorAll('svg rect, svg circle, svg path, svg polygon, svg line, svg text').forEach(function(e){ if(k<120) e.style.animationDelay = (k++*0.02)+'s'; });
  cont.addEventListener('click', function(ev){
    var t = ev.target; if(t.classList && t.classList.contains('fz-zoombtn')) return;
    var tr = t.closest && t.closest('tr'); if(tr){ tr.classList.toggle('fzsel'); tono(); return; }
    if(/^(rect|circle|path|polygon)$/i.test(t.tagName)){ t.classList.toggle('fzsel'); tono(); }
  });
  var b = document.createElement('button'); b.className='fz-zoombtn'; b.textContent='🔍 Ampliar';
  b.onclick = function(ev){ ev.stopPropagation(); var clon = cont.cloneNode(true); clon.querySelectorAll('.fz-zoombtn').forEach(function(x){ x.remove(); });
    if(typeof openToolModal==='function'){ openToolModal('🔍 Figura ampliada', '<div style="zoom:1.8;display:flex;justify-content:center">'+clon.innerHTML+'</div><div class="fz-tip" style="text-align:center">Toca partes de la figura para resaltarlas</div>'); var ms=document.querySelectorAll('.tool-modal'); var mm=ms[ms.length-1]; if(mm){ mm.style.maxWidth='900px'; var bd=mm.querySelector('.tm-body > div'); if(bd) animarFigura(bd); } } };
  cont.appendChild(b);
}
FZ.figuras = function(raiz){
  (raiz||document).querySelectorAll('div').forEach(function(dv){ var st = dv.getAttribute('style')||''; if(/background:#F7F4FF;border-radius:12px;border:1\.5px solid var\(--border\)/.test(st) && (dv.querySelector('svg')||dv.querySelector('table'))) animarFigura(dv); });
};

/* Ejercicios: el gráfico va debajo de la pregunta */
function enEjercicio(){
  var lc = $('lesContent'); if(!lc || lc.querySelector('.fz')) return;
  var ex = null;
  try{ var lv = UNITS[curUnit].topics[curTopicIdx].levels[curLevelIdx]; ex = (lv._sh||lv.exercises)[curEx]; }catch(e){}
  if(!ex) return;
  var h = FZ.crear(ex, 'ex'); if(!h) return;
  var q = lc.querySelector('.ex-question'), box = document.createElement('div'); box.innerHTML = h;
  var nodo = box.firstChild;
  if(q && q.parentNode) q.parentNode.insertBefore(nodo, q.nextSibling); else { var b = lc.querySelector('.ex-body'); if(b) b.appendChild(nodo); }
}
if (typeof window !== 'undefined') {
  var _se = window.showEx;
  if(typeof _se==='function') window.showEx = function(){ var r = _se.apply(this, arguments); try{ enEjercicio(); }catch(e){} try{ FZ.figuras($('lesContent')); }catch(e){} return r; };
}

/* Ejemplos: botón "🎮 Explorar" en cada tarjeta, con resolución animada */
function enEjemplos(ti, li){
  var lc = $('lesContent'); if(!lc) return;
  var topic = UNITS[curUnit].topics[ti], key = topic.id ? topic.id+'-n'+(li+1) : 'u'+curUnit+'t'+ti+'-n'+(li+1);
  var exs = (typeof LEVEL_EXAMPLES!=='undefined' && LEVEL_EXAMPLES[key]) || [];
  var cards = [];
  lc.querySelectorAll('div').forEach(function(dv){ var st = dv.getAttribute('style')||''; if(/border-radius:16px;padding:1rem;margin-bottom:\.65rem/.test(st)) cards.push(dv); });
  if(cards.length !== exs.length) return;
  cards.forEach(function(card, i){
    try{ var sv0 = card.querySelector('svg'); if(sv0 && sv0.parentNode) animarFigura(sv0.parentNode); }catch(x){}
    var e = exs[i]; var dprev = FZ.crear(e, 'ej'); if(!dprev) return;
    var bt = document.createElement('button');
    bt.className = 'fz-btn o'; bt.style.cssText = 'margin-top:8px;font-size:14px';
    bt.innerHTML = '🎮 Explorar con el laboratorio visual';
    bt.onclick = function(){
      var ya = card.querySelector('.fz'); if(ya){ ya.remove(); bt.innerHTML='🎮 Explorar con el laboratorio visual'; return; }
      var h = FZ.crear(e, 'ej'); if(!h) return;
      var box = document.createElement('div'); box.innerHTML = h; card.insertBefore(box.firstChild, bt.nextSibling); bt.innerHTML = '✖ Cerrar laboratorio';
      tono();
    };
    card.appendChild(bt);
  });
}
if (typeof window !== 'undefined') {
  var _sp = window.showExamplesPanel;
  if(typeof _sp==='function') window.showExamplesPanel = function(ti, li){ var r = _sp.apply(this, arguments); try{ enEjemplos(ti, li); }catch(e){} return r; };

  /* Pruebas (Mi Repaso, exámenes, SABER): el quiz del paquete C usa #f5QuizQ */
  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
    try{
      var _mo = new MutationObserver(function(){
        var q = document.getElementById('f5QuizQ');
        if(q && !q.getAttribute('data-fz') && FZ._quizEx){ q.setAttribute('data-fz','1'); var h = FZ.crear(FZ._quizEx, 'ex'); if(h){ var b=document.createElement('div'); b.innerHTML=h; q.parentNode.insertBefore(b.firstChild, q.nextSibling); } }
      });
      if (document.body) {
        _mo.observe(document.body, {childList:true, subtree:true});
      }
    }catch(e){}
  }
}

if (typeof window !== 'undefined') {
  window.FZ = FZ;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FZ };
}
