/* =========================================================
   FOREST — the 3D world behind every page (Three.js, r160)
   · low-poly pine forest + fog, moon, stars, fireflies, mist
   · distant campfire with embers
   · HOME ONLY: a floating enchanted sword with orbiting runes
   · camera drifts forward as you scroll, leans with the mouse
   Everything is procedural — no model files to download.
   ========================================================= */
(function () {
  'use strict';
  var canvas = document.getElementById('forest');
  if (!canvas || !window.THREE) { document.documentElement.classList.add('no-webgl'); return; }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.innerWidth < 768;
  var page = document.body.getAttribute('data-page');
  var isHome = page === 'home';

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !mobile, powerPreference: 'high-performance' });
  } catch (e) { document.documentElement.classList.add('no-webgl'); return; }

  var pixelRatioMax = mobile ? 1.5 : 1.75;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioMax));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;

  var FOG = 0x0b1d15;
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1912);
  scene.fog = new THREE.FogExp2(FOG, 0.042);

  var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 220);
  camera.position.set(0, 1.7, 8);
  scene.add(camera);

  /* ---- seeded random so the forest looks the same every visit ---- */
  var seed = 1337;
  function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function range(a, b) { return a + (b - a) * rnd(); }

  /* ---- soft glow texture helper ---- */
  function glowTexture(inner, outer) {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d'), grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, inner); grad.addColorStop(0.35, outer); grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }

  /* ---- tiny environment so the metal sword actually shines ---- */
  (function buildEnv() {
    var env = new THREE.Scene();
    var geo = new THREE.SphereGeometry(20, 24, 16), col = [], pos = geo.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      var y = (pos.getY(i) / 20 + 1) / 2;
      var c = new THREE.Color().lerpColors(new THREE.Color(0x120a05), new THREE.Color(0x2c5a49), Math.pow(y, 1.4));
      col.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    env.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
    function panel(w, h, color, intensity, x, y, z) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m);
    }
    panel(10, 6, 0xffb36b, 14, -12, 4, 6);   // warm torch softbox
    panel(14, 3, 0x9ac7ff, 12, 10, 9, -8);   // cool moon strip
    panel(8, 8, 0xffffff, 7, 0, 16, 2);   // sky top
    panel(6, 10, 0xffd9a0, 8, 12, 0, 8);    // side kick
    var pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(env, 0.03).texture;
    pm.dispose();
  })();

  /* ---- lights ---- */
  scene.add(new THREE.HemisphereLight(0x86bba5, 0x10201a, 1.25));
  var moonLight = new THREE.DirectionalLight(0x9cc0ff, 1.35);
  moonLight.position.set(-14, 22, -26); scene.add(moonLight);

  /* ---- ground ---- */
  (function ground() {
    var g = new THREE.PlaneGeometry(140, 190, 70, 95); g.rotateX(-Math.PI / 2);
    var p = g.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), z = p.getZ(i), edge = Math.min(1, Math.max(0, (Math.abs(x) - 2.5) / 6));
      p.setY(i, (Math.sin(x * 0.35) * Math.cos(z * 0.27) * 0.55 + Math.sin(x * 0.9 + z * 0.6) * 0.15) * edge);
    }
    g.computeVertexNormals();
    var m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x143325, roughness: 1, flatShading: true, envMapIntensity: 0.15 }));
    m.position.set(0, 0, -65); scene.add(m);
    var path = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 190), new THREE.MeshStandardMaterial({ color: 0x3a2f1d, roughness: 1, envMapIntensity: 0.05 }));
    path.rotation.x = -Math.PI / 2; path.position.set(0, 0.03, -65); scene.add(path);
  })();

  /* ---- pine trees (instanced = cheap) ---- */
  (function trees() {
    var N = mobile ? 150 : 340;
    var parts = [
      { geo: new THREE.CylinderGeometry(0.1, 0.2, 1.7, 6), y: 0.85, s: 1, c: 0x3a2a1a },
      { geo: new THREE.ConeGeometry(1.5, 2.5, 7), y: 2.1, s: 1, c: 0x1c4a33 },
      { geo: new THREE.ConeGeometry(1.2, 2.2, 7), y: 3.3, s: 1, c: 0x215a3e },
      { geo: new THREE.ConeGeometry(0.85, 1.9, 7), y: 4.4, s: 1, c: 0x2a6b49 }
    ];
    var meshes = parts.map(function (p) {
      var im = new THREE.InstancedMesh(p.geo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, flatShading: true, envMapIntensity: 0.12 }), N);
      scene.add(im); return im;
    });
    var d = new THREE.Object3D(), col = new THREE.Color();
    for (var i = 0; i < N; i++) {
      var side = rnd() < 0.5 ? -1 : 1;
      var x = side * (3.6 + Math.pow(rnd(), 1.7) * 44);
      var z = 4 - rnd() * 130;
      if (Math.abs(x) < 11 && z > -5) z = -5 - rnd() * 12;   /* keep the hero corridor clear */
      var s = range(0.7, 1.55), tilt = range(-0.05, 0.05), rot = rnd() * Math.PI * 2;
      var shade = range(0.65, 1.25);
      parts.forEach(function (p, k) {
        d.position.set(x, p.y * s, z); d.scale.set(s, s, s); d.rotation.set(tilt, rot, tilt); d.updateMatrix();
        meshes[k].setMatrixAt(i, d.matrix);
        col.setHex(p.c).multiplyScalar(shade); meshes[k].setColorAt(i, col);
      });
    }
    meshes.forEach(function (m) { m.instanceMatrix.needsUpdate = true; m.instanceColor.needsUpdate = true; });
  })();

  /* ---- moon + stars ---- */
  var moonGroup = new THREE.Group(); scene.add(moonGroup);
  (function sky() {
    var moon = new THREE.Mesh(new THREE.SphereGeometry(4.2, 32, 24), new THREE.MeshBasicMaterial({ color: 0xf3ecd0, fog: false }));
    var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(210,230,255,.95)', 'rgba(140,180,255,.28)'), blending: THREE.AdditiveBlending, depthWrite: false, fog: false, transparent: true }));
    halo.scale.set(46, 46, 1);
    moonGroup.add(moon, halo); moonGroup.position.set(-44, 24, -120);
    var n = 700, a = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var th = rnd() * Math.PI * 2, ph = Math.acos(range(0.15, 1)), r = 150;
      a[i * 3] = r * Math.sin(ph) * Math.cos(th); a[i * 3 + 1] = r * Math.cos(ph) * 0.9 + 6; a[i * 3 + 2] = -Math.abs(r * Math.sin(ph) * Math.sin(th));
    }
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 1.1, color: 0xdfeaff, sizeAttenuation: false, transparent: true, opacity: 0.8, fog: false, depthWrite: false })));
  })();

  /* ---- fireflies ---- */
  var FF = mobile ? 40 : 80, ffGeo, ffBase = new Float32Array(FF * 3), ffPh = new Float32Array(FF);
  (function fireflies() {
    var pos = new Float32Array(FF * 3);
    for (var i = 0; i < FF; i++) {
      ffBase[i * 3] = range(-15, 15); ffBase[i * 3 + 1] = range(0.4, 5.2); ffBase[i * 3 + 2] = range(-70, 10); ffPh[i] = rnd() * 100;
      pos[i * 3] = ffBase[i * 3]; pos[i * 3 + 1] = ffBase[i * 3 + 1]; pos[i * 3 + 2] = ffBase[i * 3 + 2];
    }
    ffGeo = new THREE.BufferGeometry(); ffGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(ffGeo, new THREE.PointsMaterial({ size: 0.2, opacity: 0.55, map: glowTexture('rgba(255,247,190,1)', 'rgba(210,235,120,.3)'), color: 0xe8f08a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));
  })();

  /* ---- mist ---- */
  var mists = [];
  (function mist() {
    var tex = glowTexture('rgba(160,200,185,.55)', 'rgba(90,140,120,.2)');
    for (var i = 0; i < (mobile ? 8 : 15); i++) {
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: range(0.07, 0.16), depthWrite: false, color: 0x9fc4b2 }));
      var sc = range(14, 26); s.scale.set(sc, sc * 0.35, 1);
      s.position.set(range(-10, 10), range(0.5, 2.2), range(-85, 8)); s.userData = { sp: range(0.05, 0.16), ph: rnd() * 6, x0: s.position.x };
      scene.add(s); mists.push(s);
    }
  })();

  /* ---- campfire far down the path ---- */
  var fire = new THREE.PointLight(0xff8a3c, 6, 26, 1.6), embers, emberGeo, EM = mobile ? 30 : 70, emBase = new Float32Array(EM * 3), emV = new Float32Array(EM);
  (function campfire() {
    var z = -20; fire.position.set(0.3, 1, z); scene.add(fire);
    var flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(255,235,170,1)', 'rgba(255,120,40,.55)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    flame.scale.set(2.6, 3.2, 1); flame.position.set(0.3, 1.1, z); flame.name = 'flame'; scene.add(flame);
    var logs = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.1, 6), new THREE.MeshStandardMaterial({ color: 0x2c1b10, roughness: 1 }));
    logs.rotation.z = Math.PI / 2; logs.position.set(0.3, 0.12, z); scene.add(logs);
    var logs2 = logs.clone(); logs2.rotation.y = 1.1; scene.add(logs2);
    var p = new Float32Array(EM * 3);
    for (var i = 0; i < EM; i++) { emBase[i * 3] = 0.3 + range(-0.5, 0.5); emBase[i * 3 + 1] = range(0.2, 6); emBase[i * 3 + 2] = z + range(-0.5, 0.5); emV[i] = range(0.4, 1.2); p[i * 3] = emBase[i * 3]; p[i * 3 + 1] = emBase[i * 3 + 1]; p[i * 3 + 2] = emBase[i * 3 + 2]; }
    emberGeo = new THREE.BufferGeometry(); emberGeo.setAttribute('position', new THREE.BufferAttribute(p, 3));
    embers = new THREE.Points(emberGeo, new THREE.PointsMaterial({ size: 0.16, map: glowTexture('rgba(255,220,150,1)', 'rgba(255,110,30,.6)'), color: 0xffa24a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(embers);
  })();

  /* ---- HERO: enchanted sword (home page) ---- */
  var heroRig = null, sword, runes = [], halos = [], swordLight, rimLight;
  if (isHome) {
    heroRig = new THREE.Group(); camera.add(heroRig);
    sword = new THREE.Group(); heroRig.add(sword);

    var steel = new THREE.MeshStandardMaterial({ color: 0xdfe6ec, metalness: 1, roughness: 0.2, envMapIntensity: 1.8 });
    var steelDark = new THREE.MeshStandardMaterial({ color: 0x7e8c97, metalness: 1, roughness: 0.35, envMapIntensity: 1.4 });
    var gold = new THREE.MeshStandardMaterial({ color: 0xe0b45a, metalness: 1, roughness: 0.26, envMapIntensity: 1.8 });
    var leather = new THREE.MeshStandardMaterial({ color: 0x3a1c12, roughness: 0.75, metalness: 0.1, envMapIntensity: 0.6 });
    var gemMat = new THREE.MeshStandardMaterial({ color: 0xb3201f, emissive: 0xff3a22, emissiveIntensity: 1.3, roughness: 0.15, metalness: 0.2 });

    var sh = new THREE.Shape();
    sh.moveTo(-0.27, 0); sh.lineTo(-0.25, 4.45); sh.lineTo(0, 5.45); sh.lineTo(0.25, 4.45); sh.lineTo(0.27, 0); sh.lineTo(-0.27, 0);
    var bg = new THREE.ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.05, bevelSegments: 3 });
    bg.translate(0, 0, -0.025);
    var blade = new THREE.Mesh(bg, steel); blade.position.y = 0.2; sword.add(blade);
    var fuller = new THREE.Mesh(new THREE.BoxGeometry(0.075, 3.9, 0.3), steelDark); fuller.position.y = 2.35; sword.add(fuller);
    var guard = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.2, 0.3), gold); guard.position.y = 0.1; sword.add(guard);
    [-1, 1].forEach(function (s) {
      var tip = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.5, 4), gold); tip.rotation.z = -s * Math.PI / 2; tip.position.set(s * 1.28, 0.1, 0); sword.add(tip);
      var wing = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.22), gold); wing.position.set(s * 0.55, 0.28, 0); wing.rotation.z = s * 0.35; sword.add(wing);
    });
    var gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.17), gemMat); gem.scale.set(1, 1.35, 1); gem.position.set(0, 0.12, 0.2); sword.add(gem);
    var grip = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.15, 12), leather); grip.position.y = -0.6; sword.add(grip);
    for (var w = 0; w < 6; w++) { var ring = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 14), gold); ring.rotation.x = Math.PI / 2; ring.position.y = -0.17 - w * 0.19; sword.add(ring); }
    var pommel = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 1), gold); pommel.position.y = -1.3; sword.add(pommel);

    sword.position.y = -0.6; sword.rotation.z = -0.22;

    /* orbiting runes */
    var runeMat = new THREE.MeshStandardMaterial({ color: 0xf3d98e, emissive: 0xf0b84a, emissiveIntensity: 1.4, metalness: 0.6, roughness: 0.3 });
    for (var r = 0; r < 14; r++) {
      var rm = new THREE.Mesh(r % 2 ? new THREE.OctahedronGeometry(0.1) : new THREE.TetrahedronGeometry(0.13), runeMat);
      rm.userData = { a: r / 14 * Math.PI * 2, rad: range(1.9, 2.6), sp: range(0.25, 0.5), y: range(-1.5, 2.6), s: range(0.6, 1.4) };
      heroRig.add(rm); runes.push(rm);
    }
    /* golden halos */
    [[2.7, 0.012, 0.2, 0.2], [3.2, 0.008, 1.1, -0.6]].forEach(function (c) {
      var t = new THREE.Mesh(new THREE.TorusGeometry(c[0], c[1], 8, 120), new THREE.MeshBasicMaterial({ color: 0xf3d98e, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
      t.rotation.set(c[2] + 1, c[3], 0); t.position.y = 0.9; t.userData = { r: c[2] }; heroRig.add(t); halos.push(t);
    });
    var glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(255,225,150,.55)', 'rgba(255,170,70,.12)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
    glow.scale.set(11, 11, 1); glow.position.set(0, 0.8, -1.4); heroRig.add(glow);

    swordLight = new THREE.PointLight(0xffb066, 28, 18, 1.8); swordLight.position.set(-2.2, 2.2, 2.8); heroRig.add(swordLight);
    rimLight = new THREE.PointLight(0x7fb4ff, 22, 18, 1.8); rimLight.position.set(2.8, 3, -2); heroRig.add(rimLight);
  }

  /* ---- state ---- */
  var mouse = { x: 0, y: 0, tx: 0, ty: 0 }, scrollP = 0, scrollT = 0, maxScroll = 1, heroP = 0, time = 0, introStart = 0;
  var clock = new THREE.Clock(), bootT = performance.now();

  function easeOutBack(t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  function layoutHero() {
    if (!heroRig) return;
    var aspect = window.innerWidth / window.innerHeight;
    if (aspect > 1.15) { heroRig.position.set(Math.min(3.7, 1.2 + aspect * 1.2), -0.35, -7.4); heroRig.userData.base = 0.6; }
    else { heroRig.position.set(0, 1.5, -9.5); heroRig.userData.base = 0.44; }
  }
  function measure() { maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
    layoutHero(); measure(); if (reduce) draw();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', function (e) { mouse.tx = e.clientX / window.innerWidth * 2 - 1; mouse.ty = e.clientY / window.innerHeight * 2 - 1; }, { passive: true });
  window.addEventListener('load', measure);
  setInterval(measure, 1500);
  layoutHero(); measure();

  var frames = 0, fpsT = 0, lowDone = false;

  function update(dt) {
    time += dt;
    mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 3.2); mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 3.2);
    scrollT = (window.pageYOffset || 0) / maxScroll; scrollP += (scrollT - scrollP) * Math.min(1, dt * 3.5);
    heroP = Math.min(1, (window.pageYOffset || 0) / (window.innerHeight * 0.75));

    /* camera: glide down the forest path while scrolling */
    var travel = isHome ? 34 : 52;
    camera.position.set(mouse.x * 0.9, 1.7 - mouse.y * 0.3 + Math.sin(time * 0.6) * 0.05, 8 - scrollP * travel);
    camera.lookAt(mouse.x * 0.7, 2.0 - mouse.y * 0.25 + 0.2, camera.position.z - 20);

    /* fireflies */
    var p = ffGeo.attributes.position.array;
    for (var i = 0; i < FF; i++) {
      var ph = ffPh[i];
      p[i * 3] = ffBase[i * 3] + Math.sin(time * 0.35 + ph) * 1.1;
      p[i * 3 + 1] = ffBase[i * 3 + 1] + Math.sin(time * 0.6 + ph * 1.7) * 0.6;
      p[i * 3 + 2] = ffBase[i * 3 + 2] + Math.cos(time * 0.3 + ph) * 0.9;
    }
    ffGeo.attributes.position.needsUpdate = true;

    /* embers */
    var e = emberGeo.attributes.position.array;
    for (var j = 0; j < EM; j++) {
      e[j * 3 + 1] += emV[j] * dt; e[j * 3] += Math.sin(time * 1.3 + j) * dt * 0.25;
      if (e[j * 3 + 1] > 7) { e[j * 3 + 1] = 0.3; e[j * 3] = emBase[j * 3]; }
    }
    emberGeo.attributes.position.needsUpdate = true;

    /* fire flicker */
    var fl = 0.82 + Math.sin(time * 19) * 0.08 + Math.sin(time * 7.3) * 0.1 + Math.random() * 0.06;
    fire.intensity = 6 * fl;
    var flame = scene.getObjectByName('flame'); if (flame) flame.scale.set(2.6 * fl, 3.3 * fl, 1);

    /* mist drift */
    for (var m = 0; m < mists.length; m++) { var ms = mists[m]; ms.position.x = ms.userData.x0 + Math.sin(time * ms.userData.sp + ms.userData.ph) * 3.2; }

    moonGroup.position.x = -44 + mouse.x * -1.5;

    /* hero sword */
    if (heroRig) {
      var it = Math.min(1, Math.max(0, ((performance.now() - bootT) / 1000 - 1.1) / 1.7)), base = heroRig.userData.base || 0.8;
      var k = base * easeOutBack(it) * (1 - heroP * 0.8);
      heroRig.scale.setScalar(Math.max(0.0001, k));
      heroRig.visible = heroP < 0.985;
      heroRig.position.y += 0; // layoutHero sets base; add scroll lift below
      sword.position.y = -0.6 + Math.sin(time * 1.1) * 0.22 + heroP * 2.2;
      sword.rotation.y = Math.sin(time * 0.45) * 0.95 + mouse.x * 0.55 + heroP * 2.4;
      sword.rotation.x = mouse.y * 0.18 + Math.sin(time * 0.8) * 0.03;
      for (var r = 0; r < runes.length; r++) {
        var u = runes[r].userData, a = u.a + time * u.sp;
        runes[r].position.set(Math.cos(a) * u.rad, u.y + Math.sin(time * 0.9 + u.a * 3) * 0.25, Math.sin(a) * u.rad * 0.6);
        runes[r].rotation.x += dt * 1.2; runes[r].rotation.y += dt * 0.9; runes[r].scale.setScalar(u.s * (0.9 + Math.sin(time * 2 + u.a) * 0.15));
      }
      halos[0].rotation.z = time * 0.2; halos[1].rotation.z = -time * 0.15; halos[0].rotation.y = 0.2 + Math.sin(time * 0.4) * 0.25;
      swordLight.intensity = 28 * (0.9 + Math.sin(time * 9) * 0.05 + Math.sin(time * 3.1) * 0.06);
    }
  }

  function draw() { renderer.render(scene, camera); }

  function loop() {
    var dt = Math.min(clock.getDelta(), 0.05);
    update(dt); draw();
    /* adaptive quality: step the pixel ratio down on slow GPUs */
    if (!lowDone) {
      frames++; fpsT += dt;
      if (fpsT > 2.5) {
        var fps = frames / fpsT;
        if (fps < 38 && renderer.getPixelRatio() > 1) renderer.setPixelRatio(1);
        lowDone = true;
      }
    }
    requestAnimationFrame(loop);
  }

  if (reduce) { time = 4; bootT = -1e5; update(0.016); draw(); }
  else { requestAnimationFrame(loop); }

  /* expose for debugging / future use */
  var _sv = new THREE.Vector3();
  /* screen position (css px) of the hero sword, used as the origin of the light beams */
  function swordScreen() {
    if (!sword) return null;
    camera.updateMatrixWorld(true); sword.getWorldPosition(_sv); _sv.project(camera);
    return { x: (_sv.x * 0.5 + 0.5) * window.innerWidth, y: (-_sv.y * 0.5 + 0.5) * window.innerHeight };
  }
  window.Forest = { scene: scene, camera: camera, renderer: renderer, swordScreen: swordScreen };
})();
