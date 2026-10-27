const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'primero', 'MatematicasDeFedor_1.html');
let content = fs.readFileSync(targetPath, 'utf8');

const edits = [
  {
    name: 'wrapper openLaunchIntro condition',
    target: `        // Disparar la intro nueva Tierra→Luna, sólo si nunca se vio y existe.
        if(!localStorage.getItem('fedor1_intro_seen') && typeof window.openLaunchIntro==='function'){
          setTimeout(function(){
            try{ window.openLaunchIntro(); }catch(e){}
          }, 400);
        }`,
    replacement: `        // Disparar la intro de Primero (Laboratorio Espacial -> Despegue -> Luna)
        if(typeof window.openLaunchIntro === 'function'){
          setTimeout(function(){
            try{ window.openLaunchIntro(); }catch(e){}
          }, 250);
        }`
  },
  {
    name: 'runIntro & endIntro visibility and reset',
    target: `  /* ─── RUNNER ─── */
  function runIntro(){
    introWrap.classList.add('on');
    var scenes = [sceneLab, sceneWalk, sceneRamp, sceneCount, sceneLiftoff, sceneSpace, sceneMoonArrive, sceneFinal];
    var i = 0;
    function next(){
      if(i>=scenes.length){ endIntro(); return; }
      scenes[i++](next);
    }
    next();
  }
  function endIntro(){
    clearAllTimers();
    introWrap.style.transition = 'opacity .6s';
    introWrap.style.opacity = '0';
    setTimeout(function(){
      introWrap.classList.remove('on');
      introWrap.style.opacity = '1';
      clearStage();
      try{ localStorage.setItem('fedor1_intro_seen','1'); }catch(e){}
    }, 700);
  }`,
    replacement: `  /* ─── RUNNER ─── */
  function runIntro(){
    clearAllTimers();
    introWrap.style.transition = 'none';
    introWrap.style.opacity = '1';
    introWrap.style.display = 'block';
    introWrap.classList.add('on');
    var scenes = [sceneLab, sceneWalk, sceneRamp, sceneCount, sceneLiftoff, sceneSpace, sceneMoonArrive, sceneFinal];
    var i = 0;
    function next(){
      if(i>=scenes.length){ endIntro(); return; }
      scenes[i++](next);
    }
    next();
  }
  function endIntro(){
    clearAllTimers();
    introWrap.style.transition = 'opacity .6s';
    introWrap.style.opacity = '0';
    setTimeout(function(){
      introWrap.classList.remove('on');
      introWrap.style.display = 'none';
      introWrap.style.opacity = '1';
      clearStage();
      try{ localStorage.setItem('fedor1_intro_seen','1'); }catch(e){}
    }, 700);
  }`
  },
  {
    name: 'fedor1IntroBG z-index',
    target: `'#fedor1IntroBG{position:fixed;inset:0;z-index:99995;background:#000;display:none;overflow:hidden;font-family:Baloo 2,Nunito,sans-serif}',`,
    replacement: `'#fedor1IntroBG{position:fixed;inset:0;z-index:100000;background:#000;display:none;overflow:hidden;font-family:Baloo 2,Nunito,sans-serif}',`
  },
  {
    name: 'autoSkipIntro premature fedor1_intro_seen',
    target: `  // 2. Auto-skip intro después de 12 segundos por si se queda enganchado
  function autoSkipIntro(){
    setTimeout(function(){
      try{
        localStorage.setItem('fedor1_intro_seen', '1');
      }catch(e){}
      var intro = document.getElementById('fedor1IntroBG');
      if(intro && intro.classList.contains('on')){
        // Buscar el botón skip
        var skip = document.getElementById('f1IntroSkip');
        if(skip){ skip.click(); }
        else{
          // Fallback: ocultar directamente
          intro.classList.remove('on');
          intro.style.display = 'none';
        }
      }
    }, 12000);
  }`,
    replacement: `  // 2. Auto-skip intro watchdog si la animación lleva demasiado tiempo activa
  function autoSkipIntro(){
    setTimeout(function(){
      var intro = document.getElementById('fedor1IntroBG');
      if(intro && intro.classList.contains('on')){
        var skip = document.getElementById('f1IntroSkip');
        if(skip){ skip.click(); }
        else{
          intro.classList.remove('on');
          intro.style.display = 'none';
        }
      }
    }, 45000);
  }`
  }
];

let applied = 0;
for (const edit of edits) {
  if (!content.includes(edit.target)) {
    console.error(`Target not found for: ${edit.name}`);
  } else {
    content = content.replace(edit.target, edit.replacement);
    console.log(`Applied: ${edit.name}`);
    applied++;
  }
}

if (applied === edits.length) {
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log('All 4 remaining edits successfully applied to MatematicasDeFedor_1.html!');
} else {
  console.error(`Only applied ${applied}/${edits.length} edits. Aborting save.`);
  process.exit(1);
}
