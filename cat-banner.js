import * as THREE from './vendor/three.module.min.js';
import { createCatAccessories } from './cat-accessories.js';

const hero = document.querySelector('.hero');
const canvas = document.querySelector('#cat-canvas');
const stage = document.querySelector('.cat-stage');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Original mesh sculpture: no remote model or texture requests.
function createCat() {
  const cat = new THREE.Group();
  const fur = new THREE.MeshStandardMaterial({ color: '#24252b', roughness: 0.48 });
  const points = new THREE.MeshStandardMaterial({ color: '#24252b', roughness: 0.5 });
  const cream = new THREE.MeshStandardMaterial({ color: '#40414a', roughness: 0.6 });
  const pink = new THREE.MeshStandardMaterial({ color: '#d38d92', roughness: 0.6 });
  const iris = new THREE.MeshStandardMaterial({ color: '#b9cd73', roughness: 0.3 });
  const pupil = new THREE.MeshStandardMaterial({ color: '#111116', roughness: 0.25 });
  const shine = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const stripes = { value: 0 };
  fur.onBeforeCompile = (shader) => {
    shader.uniforms.stripeStrength = stripes;
    shader.vertexShader = 'varying vec3 catPosition;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\ncatPosition = position;');
    shader.fragmentShader = 'uniform float stripeStrength;\nvarying vec3 catPosition;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      float bands = smoothstep(0.65, 0.83, sin(catPosition.y * 25.0 + sin(catPosition.x * 7.0) * 1.8));
      diffuseColor.rgb *= 1.0 - bands * stripeStrength * 0.52;
    `);
  };
  const sphere = new THREE.SphereGeometry(1, 32, 24);
  function oval(parent, material, position, scale) {
    const mesh = new THREE.Mesh(sphere, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  }
  oval(cat, fur, [0, -0.38, 0], [0.7, 0.94, 0.57]);
  oval(cat, cream, [0, -0.48, 0.46], [0.43, 0.6, 0.16]);
  const head = new THREE.Group();
  head.position.set(0, 0.65, 0.05);
  cat.add(head);
  oval(head, fur, [0, 0, 0], [0.88, 0.73, 0.66]);
  // Rounded, cupped ears: a continuous mesh joins the fur rim and pink interior.
  const earOutline = new THREE.Shape();
  earOutline.moveTo(-.3,-.3);
  earOutline.quadraticCurveTo(0,-.38,.3,-.3);
  earOutline.bezierCurveTo(.28,-.02,.13,.4,.035,.45);
  earOutline.quadraticCurveTo(0,.48,-.035,.45);
  earOutline.bezierCurveTo(-.13,.4,-.28,-.02,-.3,-.3);
  const outline = earOutline.getSpacedPoints(64).slice(0,-1);
  const earGeometry = new THREE.BufferGeometry();
  const vertices = [], furIndices = [], pinkIndices = [];
  const rings = [[1,.025],[.88,.095],[.66,.03],[.34,-.025]];
  const count = outline.length;
  for (const [radius, depth] of rings) {
    for (const point of outline) {
      const y = -.06 + (point.y + .06) * radius;
      vertices.push(point.x * radius, y, depth * (1 - Math.max(0,y) * .5));
    }
  }
  for (let ring=0;ring<rings.length-1;ring++) {
    const indices = ring < 2 ? furIndices : pinkIndices;
    for (let i=0;i<count;i++) {
      const next=(i+1)%count;
      const a=ring*count+i,b=ring*count+next,c=(ring+1)*count+next,d=(ring+1)*count+i;
      indices.push(a,b,c,a,c,d);
    }
  }
  const frontCenter=vertices.length/3;
  vertices.push(0,-.06,-.04);
  const backCenter=vertices.length/3;
  vertices.push(0,-.06,-.15);
  for (let i=0;i<count;i++) {
    const next=(i+1)%count;
    pinkIndices.push(3*count+i,3*count+next,frontCenter);
    furIndices.push(next,i,backCenter);
  }
  earGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  earGeometry.setIndex([...furIndices,...pinkIndices]);
  earGeometry.addGroup(0,furIndices.length,0);
  earGeometry.addGroup(furIndices.length,pinkIndices.length,1);
  earGeometry.computeVertexNormals();
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(earGeometry, [points, pink]);
    ear.name = side < 0 ? 'left-ear' : 'right-ear';
    ear.position.set(side * 0.55, 0.61, 0.035);
    ear.rotation.set(-0.08, side * 0.06, side * -0.16);
    head.add(ear);
    oval(head, points, [side * 0.35, 0.03, 0.51], [0.33, 0.32, 0.16]);
    oval(head, iris, [side * 0.35, 0.08, 0.646], [0.2, 0.23, 0.055]);
    oval(head, pupil, [side * 0.35, 0.08, 0.693], [0.057, 0.17, 0.023]);
    oval(head, shine, [side * 0.35 - 0.04, 0.16, 0.716], [0.041, 0.046, 0.013]);
    oval(head, cream, [side * 0.16, -0.26, 0.59], [0.24, 0.17, 0.13]);
    const arm = oval(cat, fur, [side * 0.64, -0.51, 0.08], [0.23, 0.57, 0.25]);
    arm.rotation.z = side * 0.27;
    oval(cat, points, [side * 0.76, -0.97, 0.12], [0.24, 0.23, 0.27]);
    oval(cat, points, [side * 0.4, -1.15, 0.29], [0.33, 0.26, 0.42]);
    // Fine curved whiskers are actual 3D tubes, visible from every angle.
    for (let i = 0; i < 3; i++) {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(side * 0.3, -0.24, 0.64),
        new THREE.Vector3(side * 0.65, -0.2 + i * 0.06, 0.72),
        new THREE.Vector3(side * 1.04, -0.34 + i * 0.14, 0.57)
      );
      head.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.012, 5, false), cream));
    }
  }
  oval(head, pink, [0, -0.2, 0.748], [0.11, 0.07, 0.05]);
  oval(head, pupil, [0, -0.36, 0.697], [0.04, 0.03, 0.015]);
  const tail = new THREE.Group();
  tail.name = 'tail';
  // Sway around a root embedded inside the body, rather than the cat's origin.
  tail.position.set(.22, -.72, -.2);
  const tailPoints = [
    new THREE.Vector3(.22, -.72, -.2), new THREE.Vector3(.6, -.78, -.36),
    new THREE.Vector3(1, -.8, -.5), new THREE.Vector3(1.36, -.15, -.45),
    new THREE.Vector3(1.24, .4, -.35), new THREE.Vector3(.98, .39, -.27)
  ].map((point) => point.sub(tail.position));
  const tailCurve = new THREE.CatmullRomCurve3(tailPoints);
  const tailMesh = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 56, .16, 16, false), points);
  tailMesh.name = 'tail-tube';
  tail.add(tailMesh);
  oval(tail, points, tailCurve.getPoint(1).toArray(), [.16, .16, .16]);
  cat.add(tail);
  const coats = [
    { name: '01 / BLACK CAT', fur: '#24252b', points: '#24252b', cream: '#44444d', iris: '#c9d977', stripes: 0 },
    { name: '02 / GINGER TABBY', fur: '#de9953', points: '#c07939', cream: '#ffdfaf', iris: '#8eac70', stripes: 1 },
    { name: '03 / SIAMESE', fur: '#e9d8bd', points: '#4c3c39', cream: '#f3e5cf', iris: '#71bce5', stripes: 0 }
  ];
  const colors = coats.map((coat) => Object.fromEntries(['fur', 'points', 'cream', 'iris'].map((key) => [key, new THREE.Color(coat[key])])));
  function setCoat(progress) {
    const position = THREE.MathUtils.clamp(progress, 0, 1) * 2;
    const index = Math.min(1, Math.floor(position));
    const mix = THREE.MathUtils.smoothstep(position - index, 0.2, 0.8);
    for (const [key, material] of Object.entries({ fur, points, cream, iris })) {
      material.color.copy(colors[index][key]).lerp(colors[index + 1][key], mix);
    }
    stripes.value = THREE.MathUtils.lerp(coats[index].stripes, coats[index + 1].stripes, mix);
    // Siamese has a slightly leaner silhouette as well as darker points.
    cat.scale.setScalar(1);
    cat.scale.x = 1 - THREE.MathUtils.smoothstep(progress, 0.6, 1) * 0.08;
    return coats[Math.round(position)].name;
  }
  return { cat, head, tail, setCoat };
}

function startBanner() {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
  camera.position.set(0, 0.3, 7.5);
  camera.lookAt(0, 0.12, 0);
  scene.add(new THREE.HemisphereLight(0xf3f6ff, 0x8e8581, 2.5));
  const key = new THREE.DirectionalLight(0xfff2e1, 4);
  key.position.set(-3, 5, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xc4dcff, 3);
  rim.position.set(3, 2, -3); scene.add(rim);
  const { cat, head, tail, setCoat } = createCat();
  scene.add(cat);
  const accessories = createCatAccessories(scene);
  const titleWord = document.querySelector('.hero-changing-word');
  const titleWords = ['CREATIVE', 'WEB', 'UI', 'AI'];
  let titleIndex = -1;
  function updateTitle(clock) {
    const cycle = clock / 3.2;
    const index = Math.floor(cycle) % titleWords.length;
    const phase = cycle % 1;
    if (index !== titleIndex) {
      titleWord.textContent = titleWords[index];
      titleIndex = index;
    }
    const entrance = THREE.MathUtils.smoothstep(phase, 0, .14);
    const exit = THREE.MathUtils.smoothstep(phase, .84, 1);
    const angle = (1 - entrance) * -85 + exit * 85;
    titleWord.style.transform = `perspective(700px) rotateX(${angle}deg) rotateY(-8deg)`;
    titleWord.style.opacity = String(Math.min(1, entrance * 2, (1 - exit) * 2));
  }
  const toolbar = document.querySelector('.cat-toolbar');
  const label = document.querySelector('.cat-name');
  const pause = document.querySelector('.cat-pause');
  let paused = false;
  let visible = true;
  let frame = 0;
  let previous = 0;
  let time = 0;
  let progress = 0;
  let lost = false;
  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.position.z = camera.aspect < 1.1 ? 8.4 : 7.5;
    camera.updateProjectionMatrix();
    accessories.resize(camera);
    requestFrame();
  }
  function scrollProgress() {
    const rect = hero.getBoundingClientRect();
    const stickyTop = parseFloat(getComputedStyle(document.querySelector('.site-header')).height);
    const runway = hero.offsetHeight - document.querySelector('.hero-frame').offsetHeight;
    return THREE.MathUtils.clamp((stickyTop - rect.top) / Math.max(runway, hero.offsetHeight * 0.6, 1), 0, 1);
  }
  function render(now) {
    frame = 0;
    if (lost || !visible || document.hidden) { previous = 0; return; }
    const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 1 / 60;
    previous = now;
    const animate = !paused && !reducedMotion.matches;
    if (animate) {
      time += dt;
      progress = THREE.MathUtils.lerp(progress, scrollProgress(), 1 - Math.exp(-dt * 8));
    }
    cat.rotation.set(animate ? Math.sin(time * 0.65) * 0.065 : 0, -0.22 + progress * Math.PI * 4, animate ? Math.sin(time * 0.8) * 0.06 : 0);
    cat.position.y = animate ? Math.sin(time * 1.4) * 0.1 : 0;
    head.rotation.z = animate ? Math.sin(time * 0.7) * 0.035 : 0;
    tail.rotation.y = animate ? Math.sin(time * 1.2) * 0.06 : 0;
    label.textContent = setCoat(progress);
    accessories.update(reducedMotion.matches ? 0 : time, progress);
    if (reducedMotion.matches) {
      titleWord.textContent = 'CREATIVE'; titleIndex = -1;
      titleWord.style.transform = ''; titleWord.style.opacity = '1';
    } else if (animate) {
      updateTitle(time + .6);
    }
    renderer.render(scene, camera);
    if (animate) requestFrame();
  }
  function requestFrame() { if (!frame && !lost && visible && !document.hidden) frame = requestAnimationFrame(render); }
  pause.addEventListener('click', () => {
    paused = !paused;
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Resume motion' : 'Pause motion';
    requestFrame();
  });
  function motionPreference() {
    pause.hidden = reducedMotion.matches;
    document.querySelector('.cat-instruction').textContent = reducedMotion.matches ? 'A little companion for the journey' : 'Scroll to meet the others';
    if (reducedMotion.matches) progress = 0;
    resize();
  }
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; requestFrame(); });
  observer.observe(stage);
  document.addEventListener('visibilitychange', requestFrame);
  window.addEventListener('scroll', requestFrame, { passive: true });
  reducedMotion.addEventListener('change', motionPreference);
  new ResizeObserver(resize).observe(stage);
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0;
    hero.classList.remove('cat-ready'); toolbar.hidden = true;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    lost = false; hero.classList.add('cat-ready'); toolbar.hidden = false; resize();
  });
  // Render before enabling the sticky runway; unsupported devices keep the fallback.
  resize(); renderer.render(scene, camera);
  hero.classList.add('cat-ready'); toolbar.hidden = false;
  motionPreference();
}

try { startBanner(); } catch (error) {
  hero.classList.remove('cat-ready');
  document.querySelector('.cat-toolbar').hidden = true;
  console.warn('3D banner unavailable; using the cat image instead.', error);
}

window.dispatchEvent(new Event('portfolio:hero-ready'));
