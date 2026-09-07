import * as THREE from './vendor/three.module.min.js';
import { mobileScreen } from './project-screens.js';

const motion = matchMedia('(prefers-reduced-motion: reduce)');

function roundedShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2, y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

async function initialize(host) {
  const canvas = host.querySelector('canvas');
  const image = new Image(); image.src = host.querySelector('.phone-fallback').getAttribute('src');
  await image.decode();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, .1, 30);
  camera.position.set(0, 0, 9.2);
  const phone = new THREE.Group(); scene.add(phone);
  const silver = new THREE.MeshStandardMaterial({ color: '#d7d3cc', metalness: .72, roughness: .28 });
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(2.13, 4.48, .28), {
    depth: .12, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: .055, bevelThickness: .04, curveSegments: 12
  }), silver);
  phone.add(body);
  const bezel = new THREE.Mesh(new THREE.ShapeGeometry(roundedShape(2.1, 4.45, .27), 20), new THREE.MeshStandardMaterial({ color: '#fcfaf6', roughness: .35 }));
  bezel.position.z = .167; phone.add(bezel);
  const screenGeometry = new THREE.ShapeGeometry(roundedShape(1.98, 4.28, .22), 24);
  const positions = screenGeometry.attributes.position;
  const uv = screenGeometry.attributes.uv;
  for (let i = 0; i < positions.count; i++) uv.setXY(i, (positions.getX(i) + .99) / 1.98, (positions.getY(i) + 2.14) / 4.28);
  const texture = mobileScreen(image, host.dataset.project);
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  const screen = new THREE.Mesh(screenGeometry, new THREE.MeshBasicMaterial({ map: texture }));
  screen.position.z = .171; phone.add(screen);
  const island = new THREE.Mesh(new THREE.ShapeGeometry(roundedShape(.5, .11, .055)), new THREE.MeshBasicMaterial({ color: '#252526' }));
  island.position.set(0, 2.015, .18); phone.add(island);
  for (const [x, y, height] of [[-1.12, .8, .3], [-1.12, .3, .3], [1.12, .55, .5]]) {
    const button = new THREE.Mesh(new THREE.BoxGeometry(.04, height, .075), silver);
    button.position.set(x, y, .055); phone.add(button);
  }
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb2a195, 3));
  const light = new THREE.DirectionalLight(0xffffff, 4); light.position.set(-3, 5, 6); scene.add(light);
  const rim = new THREE.DirectionalLight(0xe4edff, 3); rim.position.set(4, 1, -2); scene.add(rim);
  const direction = host.dataset.project === 'dental' ? -1 : 1;
  let pointerX = 0, pointerY = 0, frame = 0, visible = false, lost = false;
  function render() {
    frame = 0;
    if (lost || document.hidden || !visible) return;
    const rect = host.getBoundingClientRect();
    const progress = THREE.MathUtils.clamp((innerHeight / 2 - (rect.top + rect.height / 2)) / innerHeight, -1, 1);
    phone.rotation.set(motion.matches ? -.07 : -.07 + pointerY * .08, motion.matches ? -.3 * direction : -.3 * direction + pointerX * .16 + progress * .24, -.13 * direction);
    renderer.render(scene, camera);
  }
  function requestRender() { if (!frame && !lost && visible && !document.hidden) frame = requestAnimationFrame(render); }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1);
    camera.position.z = camera.aspect < .7 ? 10.4 : 9.2;
    camera.updateProjectionMatrix(); requestRender();
  }
  host.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const rect = host.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - .5;
    pointerY = (event.clientY - rect.top) / rect.height - .5;
    requestRender();
  });
  host.addEventListener('pointerleave', () => { pointerX = pointerY = 0; requestRender(); });
  window.addEventListener('scroll', requestRender, { passive: true });
  document.addEventListener('visibilitychange', requestRender);
  motion.addEventListener('change', requestRender);
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; requestRender(); }).observe(host);
  canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); lost = true; host.classList.remove('is-ready'); });
  canvas.addEventListener('webglcontextrestored', () => { lost = false; host.classList.add('is-ready'); resize(); });
  resize(); renderer.render(scene, camera); host.classList.add('is-ready');
}

// Each phone loads independently as its project approaches the viewport.
const loader = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const host = entry.target;
    loader.unobserve(host);
    initialize(host).catch((error) => {
      host.classList.remove('is-ready');
      console.warn('Phone preview unavailable; keeping the screenshot.', error);
    });
  }
}, { rootMargin: '300px' });
document.querySelectorAll('.phone-preview').forEach((host) => loader.observe(host));

