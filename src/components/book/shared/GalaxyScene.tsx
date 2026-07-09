'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface GalaxySceneProps {
  planetsProgress: { [unitIndex: number]: number };
  selectedAvatar: string;
  onSelectPlanet: (planetIndex: number) => void;
}

const GALAXY_PLANETS_DATA = [
  { id: 'tierra', name: ' La Tierra', icon: '🌍', color: '#1A6CB4', glow: '#4DA6FF', ring: false, unit: 0, radius: 3.4 },
  { id: 'luna', name: ' La Luna', icon: '🌙', color: '#666666', glow: '#CCCCCC', ring: false, unit: -1, radius: 1.5 },
  { id: 'marte', name: '🔴 Marte', icon: '🔴', color: '#C94B22', glow: '#FF6B3B', ring: false, unit: 1, radius: 2.5 },
  { id: 'saturno', name: '🪐 Saturno', icon: '🪐', color: '#B8860B', glow: '#F5C518', ring: true, unit: 2, radius: 3.0 },
  { id: 'neptuno', name: '🔵 Neptuno', icon: '🔵', color: '#1A4CB4', glow: '#4D8AFF', ring: false, unit: 3, radius: 2.6 },
  { id: 'sol', name: '☀️ El Sol', icon: '☀️', color: '#E8650A', glow: '#FFD700', ring: false, unit: 4, radius: 4.0 },
];

export default function GalaxyScene({ planetsProgress, selectedAvatar, onSelectPlanet }: GalaxySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Canvas
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.outline = 'none';
    container.appendChild(canvas);

    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05071c);
    scene.fog = new THREE.FogExp2(0x05071c, 0.0035);

    const camera = new THREE.PerspectiveCamera(58, w / h, 0.1, 2000);
    camera.position.set(0, 12, 28);
    camera.lookAt(0, 0, 0);

    // Lights
    scene.add(new THREE.AmbientLight(0x6a4ab0, 0.55));

    const sunLight = new THREE.PointLight(0xffd58a, 1.7, 240);
    sunLight.position.set(28, 18, -8);
    scene.add(sunLight);

    const blueLight = new THREE.PointLight(0x4d8aff, 1.0, 160);
    blueLight.position.set(-26, -6, 6);
    scene.add(blueLight);

    const pinkLight = new THREE.PointLight(0xff5ec5, 0.55, 180);
    pinkLight.position.set(0, -22, -30);
    scene.add(pinkLight);

    // Twinkling stars generator
    const makeStarLayer = (count: number, radius: number, size: number, opacity: number, color: number) => {
      const g = new THREE.BufferGeometry();
      const pos: number[] = [];
      const ofs: number[] = [];
      for (let i = 0; i < count; i++) {
        const r = radius + Math.random() * radius * 0.4;
        const t = Math.random() * Math.PI * 2;
        const p = (Math.random() - 0.5) * Math.PI;
        pos.push(r * Math.cos(p) * Math.cos(t), r * Math.sin(p), r * Math.cos(p) * Math.sin(t));
        ofs.push(Math.random() * Math.PI * 2);
      }
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const m = new THREE.PointsMaterial({
        color,
        size,
        sizeAttenuation: true,
        transparent: true,
        opacity,
        depthWrite: false,
      });
      const pts = new THREE.Points(g, m);
      pts.userData = { ofs, baseOpacity: opacity };
      return pts;
    };

    const starsFar = makeStarLayer(2200, 380, 0.55, 0.55, 0xffffff);
    const starsMid = makeStarLayer(900, 260, 0.85, 0.75, 0xfff4d6);
    const starsNear = makeStarLayer(380, 170, 1.30, 0.92, 0xffffff);
    scene.add(starsFar);
    scene.add(starsMid);
    scene.add(starsNear);

    // Canvas Textures Generators
    const _emojiTexture = (emoji: string, size = 256) => {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, size, size);
        const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.5);
        grad.addColorStop(0, 'rgba(255,224,102,0.45)');
        grad.addColorStop(0.5, 'rgba(255,140,42,0.18)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        ctx.font = 'bold ' + size * 0.66 + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji || '🧑‍🚀', size / 2, size * 0.55);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      return tex;
    };

    const _shootingStarTexture = () => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 32;
      const ctx = c.getContext('2d');
      if (ctx) {
        const g = ctx.createLinearGradient(0, 16, 128, 16);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(0.6, 'rgba(255,224,102,.7)');
        g.addColorStop(0.95, 'rgba(255,255,255,1)');
        g.addColorStop(1, 'rgba(255,255,255,1)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 12, 128, 8);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter;
      return tex;
    };

    const _spiralGalaxyTexture = (hue: number) => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.translate(256, 256);
        const arms = 4;
        for (let i = 0; i < 2400; i++) {
          const t = Math.random();
          const r = 30 + Math.pow(t, 0.55) * 220;
          const armTwist = Math.log(r / 8) * 1.6;
          const arm = Math.floor(Math.random() * arms);
          const a = (arm / arms) * Math.PI * 2 + armTwist + (Math.random() - 0.5) * 0.4;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          const lum = 70 - t * 45;
          ctx.fillStyle = 'hsla(' + hue + ',' + (80 - t * 30) + '%,' + lum + '%,' + (0.18 + (1 - t) * 0.7) + ')';
          ctx.beginPath();
          ctx.arc(x, y, 1 + (1 - t) * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 90);
        core.addColorStop(0, 'hsla(' + hue + ',60%,90%,0.85)');
        core.addColorStop(0.4, 'hsla(' + hue + ',70%,60%,0.4)');
        core.addColorStop(1, 'hsla(' + hue + ',70%,30%,0)');
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(0, 0, 90, 0, Math.PI * 2);
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter;
      return tex;
    };

    // Distant spiral galaxies
    [['200', '#a770ff'], ['38', '#ffba6a'], ['340', '#ff6a8e']].forEach((spec, idx) => {
      const tex = _spiralGalaxyTexture(parseFloat(spec[0]));
      const size = 80 + Math.random() * 40;
      const spr = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.55, color: 0xffffff, depthWrite: false })
      );
      spr.scale.set(size, size, 1);
      const ang = (idx / 3) * Math.PI * 2 + Math.random() * 0.6;
      spr.position.set(Math.cos(ang) * 220, 60 + Math.random() * 40, Math.sin(ang) * 220);
      scene.add(spr);
    });

    // Nebula clouds
    const nebColors = [0xa450ff, 0x4d8aff, 0xff5ec5, 0xffba6a, 0x60d8ff];
    for (let n = 0; n < 10; n++) {
      const nebGeo = new THREE.PlaneGeometry(60 + Math.random() * 40, 60 + Math.random() * 40);
      const nebMat = new THREE.MeshBasicMaterial({
        color: nebColors[n % nebColors.length],
        transparent: true,
        opacity: 0.06 + Math.random() * 0.06,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const neb = new THREE.Mesh(nebGeo, nebMat);
      neb.position.set((Math.random() - 0.5) * 180, (Math.random() - 0.5) * 60, -80 - Math.random() * 60);
      neb.rotation.z = Math.random() * Math.PI;
      scene.add(neb);
    }

    // Planets setup
    const positions3D = [
      new THREE.Vector3(-14, -7, 5), // Tierra
      new THREE.Vector3(-7, -3, -1), // Luna
      new THREE.Vector3(0, 0, -5), // Marte
      new THREE.Vector3(7, 3, -2), // Saturno
      new THREE.Vector3(14, 5, 3), // Neptuno
      new THREE.Vector3(21, 9, 8), // Sol
    ];

    const planets: THREE.Mesh[] = [];
    GALAXY_PLANETS_DATA.forEach((p, i) => {
      const pos = positions3D[i];
      const radius = p.radius;
      const col = new THREE.Color(p.color);
      const geo = new THREE.SphereGeometry(radius, 48, 48);
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.55,
        metalness: 0.18,
        emissive: col.clone().multiplyScalar(0.22),
      });
      const planet = new THREE.Mesh(geo, mat);
      planet.position.copy(pos);
      planet.userData = { idx: i, name: p.name, unit: p.unit, baseY: pos.y, radius };
      scene.add(planet);

      // Glow halo
      const haloGeo = new THREE.SphereGeometry(radius * 1.22, 32, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(p.glow),
        transparent: true,
        opacity: 0.22,
        side: THREE.BackSide,
        depthWrite: false,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      planet.userData.halo = halo;
      scene.add(halo);

      // Saturn ring
      if (p.ring) {
        const ringGeo = new THREE.RingGeometry(radius * 1.5, radius * 2.4, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xf5c518, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.rotation.x = Math.PI / 2 - 0.45;
        scene.add(ring);
        planet.userData.ring = ring;
      }

      // Planet name label sprite
      (() => {
        const lc = document.createElement('canvas');
        lc.width = 512;
        lc.height = 128;
        const lctx = lc.getContext('2d');
        if (lctx) {
          lctx.fillStyle = 'rgba(0,0,0,0)';
          lctx.fillRect(0, 0, 512, 128);
          lctx.font = '900 56px "Baloo 2","Nunito",sans-serif';
          lctx.textAlign = 'center';
          lctx.textBaseline = 'middle';
          lctx.shadowColor = 'rgba(0,0,0,0.85)';
          lctx.shadowBlur = 12;
          lctx.fillStyle = '#FFE066';
          lctx.fillText(p.name.replace(/^[^\sa-zA-Z]+\s*/, ''), 256, 64);
        }
        const sprMat = new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(lc),
          transparent: true,
          depthWrite: false,
          depthTest: false,
        });
        const spr = new THREE.Sprite(sprMat);
        spr.scale.set(8, 2, 1);
        spr.position.set(pos.x, pos.y + radius + 1.6, pos.z);
        spr.userData.basePos = spr.position.clone();
        spr.renderOrder = 10;
        scene.add(spr);
        planet.userData.label = spr;
      })();

      planets.push(planet);
    });

    // Route segments and level milestone markers
    const routeSegments: Array<{ tube: THREE.Mesh; mat: THREE.MeshBasicMaterial; Curve: THREE.QuadraticBezierCurve3 }> = [];
    const routeMarkers: Array<Array<{ mesh: THREE.Mesh; halo: THREE.Mesh; level: number; basePos: THREE.Vector3 }>> = [];

    for (let s = 0; s < positions3D.length - 1; s++) {
      const a = positions3D[s];
      const b = positions3D[s + 1];
      const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
      mid.y += 1.2;
      const segCurve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const tubeGeo = new THREE.TubeGeometry(segCurve, 80, 0.10, 10, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.18, depthWrite: false });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      const markers = [];
      for (let k = 0; k < 3; k++) {
        const t = (k + 1) / 4;
        const mp = segCurve.getPoint(t);
        const mGeo = new THREE.SphereGeometry(0.22, 16, 16);
        const mMat = new THREE.MeshStandardMaterial({ color: 0x444466, emissive: 0x222244, emissiveIntensity: 0.3 });
        const ms = new THREE.Mesh(mGeo, mMat);
        ms.position.copy(mp);
        scene.add(ms);

        const mh = new THREE.Mesh(
          new THREE.SphereGeometry(0.42, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0, side: THREE.BackSide, depthWrite: false })
        );
        mh.position.copy(mp);
        scene.add(mh);

        markers.push({ mesh: ms, halo: mh, level: k, basePos: mp.clone() });
      }

      routeSegments.push({ tube, mat: tubeMat, Curve: segCurve });
      routeMarkers.push(markers);
    }

    // Ship and Avatar Billboard
    const astGroup = new THREE.Group();
    // Hull
    const hullGeo = new THREE.ConeGeometry(0.55, 1.4, 24);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      metalness: 0.55,
      roughness: 0.25,
      emissive: 0xff8c2a,
      emissiveIntensity: 0.18,
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.rotation.x = Math.PI / 2;
    astGroup.add(hull);

    // Wings
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0xff8c2a,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0xff6a00,
      emissiveIntensity: 0.2,
    });
    [-1, 1].forEach((side) => {
      const wGeo = new THREE.ConeGeometry(0.32, 0.7, 4);
      const w = new THREE.Mesh(wGeo, wingMat);
      w.position.set(side * 0.45, 0, -0.25);
      w.rotation.z = (side * Math.PI) / 2;
      astGroup.add(w);
    });

    // Visor dome
    const domeGeo = new THREE.SphereGeometry(0.32, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x1e3870,
      metalness: 0.85,
      roughness: 0.05,
      emissive: 0x4d8aff,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.9,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 0, 0.45);
    dome.rotation.x = -Math.PI / 2;
    astGroup.add(dome);

    // Engine flame
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffba6a, transparent: true, opacity: 0.85, depthWrite: false });
    const flameGeo = new THREE.ConeGeometry(0.25, 1.0, 16);
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0, 0, -0.95);
    flame.rotation.x = -Math.PI / 2;
    astGroup.add(flame);

    const flameInner = new THREE.Mesh(
      new THREE.ConeGeometry(0.13, 0.55, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false })
    );
    flameInner.position.set(0, 0, -0.78);
    flameInner.rotation.x = -Math.PI / 2;
    astGroup.add(flameInner);

    // Backpack glow
    const shipGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1.3, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xff8c2a, transparent: true, opacity: 0.16, side: THREE.BackSide, depthWrite: false })
    );
    astGroup.add(shipGlow);

    // Emoji sprite billboard
    const emojiTex = _emojiTexture(selectedAvatar || '🧑‍🚀', 256);
    const emojiSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: emojiTex, transparent: true, depthWrite: false }));
    emojiSpr.scale.set(2.2, 2.2, 1);
    emojiSpr.position.set(0, 1.6, 0);
    astGroup.add(emojiSpr);
    scene.add(astGroup);

    // Comets
    const makeComet = () => {
      const g = new THREE.Group();
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xfff4d6, emissive: 0xffe066, emissiveIntensity: 1.0 })
      );
      g.add(head);

      const tailLen = 26;
      const tailPos = new Float32Array(tailLen * 3);
      const tailGeo = new THREE.BufferGeometry();
      tailGeo.setAttribute('position', new THREE.BufferAttribute(tailPos, 3));
      const tailMat = new THREE.LineBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.85 });
      const tail = new THREE.Line(tailGeo, tailMat);
      g.add(tail);

      g.userData = {
        head,
        tail,
        tailPos,
        tailLen,
        history: [] as number[][],
        vel: new THREE.Vector3(),
        pos: new THREE.Vector3(),
      };
      return g;
    };

    const comet = makeComet();
    const cometAngle = Math.random() * Math.PI * 2;
    comet.userData.pos.set(Math.cos(cometAngle) * 60, 22 + Math.random() * 15, Math.sin(cometAngle) * 60);
    comet.userData.vel.set(-Math.cos(cometAngle) * 0.45, -0.18, -Math.sin(cometAngle) * 0.45);
    scene.add(comet);

    // Asteroids Belt
    const asteroids = new THREE.Group();
    for (let ai = 0; ai < 55; ai++) {
      const orbitR = 26 + Math.random() * 16;
      const orbitA = Math.random() * Math.PI * 2;
      const rockGeo = new THREE.DodecahedronGeometry(0.18 + Math.random() * 0.45, 0);
      const rockMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.07 + Math.random() * 0.05, 0.5, 0.35 + Math.random() * 0.2),
        roughness: 0.9,
        metalness: 0.05,
      });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.userData = {
        orbitR,
        orbitA,
        orbitS: 0.001 + Math.random() * 0.003,
        orbitTilt: (Math.random() - 0.5) * 0.7,
        spinAxis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        spinS: 0.005 + Math.random() * 0.02,
        yOff: (Math.random() - 0.5) * 4,
      };
      asteroids.add(rock);
    }
    scene.add(asteroids);

    // Shooting Stars
    const shootingPool: THREE.Mesh[] = [];
    const shTex = _shootingStarTexture();
    for (let ssi = 0; ssi < 8; ssi++) {
      const sm = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 0.4),
        new THREE.MeshBasicMaterial({
          map: shTex,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        })
      );
      sm.visible = false;
      sm.userData = { alive: false, vel: new THREE.Vector3(), life: 0, maxLife: 1 };
      scene.add(sm);
      shootingPool.push(sm);
    }
    let lastShootSpawn = 0;

    const _spawnShootingStar = (time: number) => {
      const free = shootingPool.find((s) => !s.userData.alive);
      if (!free) return;
      free.userData.alive = true;
      free.visible = true;
      const startSide = Math.random() < 0.5 ? -1 : 1;
      const startX = startSide * 38 + (Math.random() - 0.5) * 6;
      const startY = 12 + Math.random() * 10;
      const startZ = -10 + (Math.random() - 0.5) * 30;
      free.position.set(startX, startY, startZ);
      const vx = -startSide * (0.7 + Math.random() * 0.5);
      const vy = -(0.25 + Math.random() * 0.3);
      const vz = (Math.random() - 0.5) * 0.4;
      free.userData.vel.set(vx, vy, vz);

      const dir = free.userData.vel.clone().normalize();
      const theta = Math.atan2(dir.y, dir.x);
      free.rotation.set(0, 0, theta);
      (free.material as THREE.MeshBasicMaterial).opacity = 0;
      free.userData.life = 0;
      free.userData.maxLife = 1.4 + Math.random() * 0.6;
    };

    // Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check clicks on planets
      const hits = raycaster.intersectObjects(planets);
      if (hits.length) {
        const p = hits[0].object;
        onSelectPlanet(p.userData.idx);
      }
    };
    canvas.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Handle Resize
    const handleResize = () => {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Get current progress index of astronaut
    const getCurrentPlanetIndex = () => {
      let best = 0;
      const units = [0, -1, 1, 2, 3, 4];
      for (let i = 0; i < units.length; i++) {
        const u = units[i];
        if (u < 0 || (planetsProgress[u] || 0) > 0) {
          best = i;
        }
      }
      return best;
    };

    // Render loop variables
    let running = true;
    let animId = 0;
    let time = 0;

    const render = () => {
      if (!running) return;

      time += 0.012;
      const t = time;

      // Twinkle stars
      [starsFar, starsMid, starsNear].forEach((layer) => {
        if (!layer) return;
        const mat = layer.material as THREE.PointsMaterial;
        mat.opacity = layer.userData.baseOpacity * (0.85 + 0.15 * Math.sin(t * 2 + layer.userData.baseOpacity * 10));
        layer.rotation.y += 0.0003;
      });

      // Rotate and bob planets
      planets.forEach((planet, idx) => {
        planet.rotation.y += 0.005 + idx * 0.0008;
        planet.position.y = (planet.userData.baseY || 0) + Math.sin(t * 0.6 + idx * 0.7) * 0.20;
        if (planet.userData.halo) {
          planet.userData.halo.position.copy(planet.position);
          planet.userData.halo.scale.setScalar(1 + Math.sin(t * 1.5 + idx) * 0.05);
        }
        if (planet.userData.ring) {
          planet.userData.ring.position.copy(planet.position);
          planet.userData.ring.rotation.z += 0.002;
        }
        if (planet.userData.label) {
          const bp = planet.userData.label.userData.basePos;
          planet.userData.label.position.set(bp.x, bp.y + Math.sin(t * 0.6 + idx * 0.7) * 0.20 + Math.sin(t * 2 + idx) * 0.1, bp.z);
        }
      });

      // Route coloring depending on progress
      const curIdx = getCurrentPlanetIndex();
      routeSegments.forEach((seg, si) => {
        const status = si < curIdx ? 'done' : si === curIdx ? 'active' : 'locked';
        if (status === 'done') {
          seg.mat.color.setHex(0xffe066);
          seg.mat.opacity = 0.55;
        } else if (status === 'active') {
          seg.mat.color.setHex(0xffba6a);
          seg.mat.opacity = 0.45 + Math.sin(t * 4) * 0.25;
        } else {
          seg.mat.color.setHex(0x66557a);
          seg.mat.opacity = 0.10;
        }
      });

      routeMarkers.forEach((markers, si) => {
        const destPlanet = GALAXY_PLANETS_DATA[si + 1];
        const pct = destPlanet.unit >= 0 ? (planetsProgress[destPlanet.unit] || 0) : 100;
        const levelsDone = Math.floor((pct / 100) * 3 + 0.0001);
        markers.forEach((mk, kk) => {
          const lit = kk < levelsDone;
          const nextOne = kk === levelsDone && si === curIdx;
          const meshMat = mk.mesh.material as THREE.MeshStandardMaterial;
          const haloMat = mk.halo.material as THREE.MeshBasicMaterial;

          if (lit) {
            meshMat.color.setHex(0xfff4d6);
            meshMat.emissive.setHex(0xffe066);
            meshMat.emissiveIntensity = 1.2;
            haloMat.opacity = 0.5 + Math.sin(t * 2 + kk) * 0.1;
            mk.halo.scale.setScalar(1 + Math.sin(t * 3 + kk) * 0.08);
          } else if (nextOne) {
            meshMat.color.setHex(0xffba6a);
            meshMat.emissive.setHex(0xff8c2a);
            meshMat.emissiveIntensity = 0.7 + Math.sin(t * 5) * 0.4;
            haloMat.opacity = 0.35 + Math.sin(t * 4) * 0.2;
            mk.halo.scale.setScalar(1.2 + Math.sin(t * 4) * 0.2);
          } else {
            meshMat.color.setHex(0x444466);
            meshMat.emissive.setHex(0x222244);
            meshMat.emissiveIntensity = 0.3;
            haloMat.opacity = 0;
          }
          mk.mesh.position.y = mk.basePos.y + Math.sin(t * 1.4 + si + kk * 0.7) * 0.12;
          mk.halo.position.copy(mk.mesh.position);
        });
      });

      // Ship & Astronaut orbit targeting
      const target = planets[curIdx];
      if (target) {
        const orbitR = target.userData.radius + 2.2;
        const tx = target.position.x + Math.cos(t * 1.0) * orbitR;
        const ty = target.position.y + 1.6 + Math.sin(t * 1.3) * 0.4;
        const tz = target.position.z + Math.sin(t * 1.0) * orbitR;
        astGroup.position.x += (tx - astGroup.position.x) * 0.06;
        astGroup.position.y += (ty - astGroup.position.y) * 0.06;
        astGroup.position.z += (tz - astGroup.position.z) * 0.06;
        astGroup.lookAt(target.position);
        astGroup.rotation.z = Math.sin(t * 2) * 0.15;

        // Animate engine flame
        const flick = 0.7 + Math.sin(t * 22) * 0.15 + Math.sin(t * 7) * 0.08;
        flame.scale.set(flick, flick * 1.1, flick);
        (flame.material as THREE.MeshBasicMaterial).opacity = 0.65 + Math.sin(t * 16) * 0.18;
        flameInner.scale.set(0.8 + Math.sin(t * 30) * 0.15, 1 + Math.sin(t * 22) * 0.15, 0.8 + Math.sin(t * 30) * 0.15);
        shipGlow.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
      }

      // Comet physics
      const ud = comet.userData;
      ud.pos.add(ud.vel);
      ud.vel.x += -ud.pos.x * 0.00006;
      ud.vel.y += -ud.pos.y * 0.00004;
      ud.vel.z += -ud.pos.z * 0.00006;
      comet.position.copy(ud.pos);

      ud.history.unshift([ud.pos.x, ud.pos.y, ud.pos.z]);
      if (ud.history.length > ud.tailLen) ud.history.length = ud.tailLen;
      const tp = ud.tailPos;
      for (let ti = 0; ti < ud.tailLen; ti++) {
        const hp = ud.history[ti] || ud.history[ud.history.length - 1] || [ud.pos.x, ud.pos.y, ud.pos.z];
        tp[ti * 3 + 0] = hp[0];
        tp[ti * 3 + 1] = hp[1];
        tp[ti * 3 + 2] = hp[2];
      }
      ud.tail.geometry.attributes.position.needsUpdate = true;

      const cometDist = ud.pos.length();
      if (cometDist < 6 || cometDist > 90) {
        const ang = Math.random() * Math.PI * 2;
        ud.pos.set(Math.cos(ang) * 70 + 5, 22 + Math.random() * 15, Math.sin(ang) * 70 + 5);
        ud.vel.set(-Math.cos(ang) * 0.45, -0.18, -Math.sin(ang) * 0.45);
        ud.history.length = 0;
      }

      // Asteroids rotation
      asteroids.children.forEach((rock) => {
        const d = rock.userData;
        d.orbitA += d.orbitS;
        rock.position.set(
          Math.cos(d.orbitA) * d.orbitR,
          d.yOff + Math.sin(d.orbitA + d.orbitTilt) * 1.2,
          Math.sin(d.orbitA) * d.orbitR
        );
        rock.rotateOnAxis(d.spinAxis, d.spinS);
      });

      // Shooting stars
      if (t - lastShootSpawn > 0.4 + Math.random() * 1.0) {
        lastShootSpawn = t;
        _spawnShootingStar(t);
        if (Math.random() < 0.25) _spawnShootingStar(t);
      }
      shootingPool.forEach((s) => {
        if (!s.userData.alive) return;
        s.userData.life += 0.012;
        s.position.add(s.userData.vel);
        const lf = s.userData.life / s.userData.maxLife;
        const op = lf < 0.18 ? lf / 0.18 : 1 - (lf - 0.18) / 0.82;
        (s.material as THREE.MeshBasicMaterial).opacity = Math.max(0, op);
        if (s.userData.life >= s.userData.maxLife) {
          s.userData.alive = false;
          s.visible = false;
        }
      });

      // Camera Orbit following player target
      const camAngle = t * 0.06;
      const dynamicTarget = target ? target.position : new THREE.Vector3();
      const camTargetX = dynamicTarget.x - 9 + Math.cos(camAngle) * 5;
      const camTargetZ = dynamicTarget.z + 16 + Math.sin(camAngle) * 5;
      const camTargetY = dynamicTarget.y + 6 + Math.sin(t * 0.4) * 0.6;
      camera.position.x += (camTargetX - camera.position.x) * 0.035;
      camera.position.y += (camTargetY - camera.position.y) * 0.035;
      camera.position.z += (camTargetZ - camera.position.z) * 0.035;
      camera.lookAt(dynamicTarget);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      running = false;
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      starsFar.geometry.dispose();
      (starsFar.material as THREE.PointsMaterial).dispose();
      starsMid.geometry.dispose();
      (starsMid.material as THREE.PointsMaterial).dispose();
      starsNear.geometry.dispose();
      (starsNear.material as THREE.PointsMaterial).dispose();
      planets.forEach((p) => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
        if (p.userData.halo) {
          p.userData.halo.geometry.dispose();
          (p.userData.halo.material as THREE.Material).dispose();
        }
        if (p.userData.ring) {
          p.userData.ring.geometry.dispose();
          (p.userData.ring.material as THREE.Material).dispose();
        }
      });
      container.innerHTML = '';
    };
  }, [planetsProgress, selectedAvatar, onSelectPlanet]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
