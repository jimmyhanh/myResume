const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const cursorGlow = document.querySelector('.cursor-glow');

if (cursorGlow) {
  window.addEventListener('mousemove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });

  window.addEventListener('mousedown', () => {
    cursorGlow.style.transform = 'translate(-50%, -50%) scale(0.92)';
  });

  window.addEventListener('mouseup', () => {
    cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
  });
}

const pipeCount = 40;
const pipePropCount = 8;
const pipePropsLength = pipeCount * pipePropCount;
const turnCount = 8;
const turnAmount = (360 / turnCount) * (Math.PI / 180);
const turnChanceRange = 58;
const baseSpeed = 0.55;
const rangeSpeed = 1.2;
const baseTTL = 75;
const rangeTTL = 200;
const baseWidth = 2;
const rangeWidth = 4.5;
const baseHue = 200;
const rangeHue = 60;
const backgroundColor = 'hsla(0, 0%, 97%, 1)';

let pipeContainer;
let pipeCanvas;
let pipeCtx;
let center;
let tick;
let pipeProps;

function rand(range) {
  return Math.random() * range;
}

function fadeInOut(life, ttl) {
  const half = ttl / 2;
  return life < half ? life / half : 1 - (life - half) / half;
}

function setupPipes() {
  pipeContainer = document.querySelector('.content--canvas');
  if (!pipeContainer) return;

  pipeCanvas = {
    a: document.createElement('canvas'),
    b: document.createElement('canvas')
  };

  pipeCanvas.b.style = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  `;

  pipeContainer.appendChild(pipeCanvas.b);

  pipeCtx = {
    a: pipeCanvas.a.getContext('2d'),
    b: pipeCanvas.b.getContext('2d')
  };

  center = [];
  tick = 0;
  pipeProps = new Float32Array(pipePropsLength);

  for (let i = 0; i < pipePropsLength; i += pipePropCount) {
    initPipe(i);
  }

  resizePipes();
  drawPipes();
}

function initPipe(i) {
  const x = rand(window.innerWidth);
  const y = center[1] || window.innerHeight / 2;
  const direction = Math.random() > 0.5 ? Math.PI / 2 : 2 * Math.PI - Math.PI / 2;
  const speed = baseSpeed + rand(rangeSpeed);
  const life = 0;
  const ttl = baseTTL + rand(rangeTTL);
  const width = baseWidth + rand(rangeWidth);
  const hue = baseHue + rand(rangeHue);

  pipeProps.set([x, y, direction, speed, life, ttl, width, hue], i);
}

function updatePipes() {
  tick++;

  for (let i = 0; i < pipePropsLength; i += pipePropCount) {
    updatePipe(i);
  }
}

function updatePipe(i) {
  const i2 = 1 + i;
  const i3 = 2 + i;
  const i4 = 3 + i;
  const i5 = 4 + i;
  const i6 = 5 + i;
  const i7 = 6 + i;
  const i8 = 7 + i;

  let x = pipeProps[i];
  let y = pipeProps[i2];
  let direction = pipeProps[i3];
  const speed = pipeProps[i4];
  let life = pipeProps[i5];
  const ttl = pipeProps[i6];
  const width = pipeProps[i7];
  const hue = pipeProps[i8];

  drawPipe(x, y, life, ttl, width, hue);

  life++;
  x += Math.cos(direction) * speed;
  y += Math.sin(direction) * speed;

  const turnChance = !(tick % Math.round(rand(turnChanceRange))) && (!(Math.round(x) % 6) || !(Math.round(y) % 6));
  const turnBias = Math.round(rand(1)) ? -1 : 1;
  direction += turnChance ? turnAmount * turnBias : 0;

  pipeProps[i] = x;
  pipeProps[i2] = y;
  pipeProps[i3] = direction;
  pipeProps[i5] = life;

  if (x > pipeCanvas.a.width) x = 0;
  if (x < 0) x = pipeCanvas.a.width;
  if (y > pipeCanvas.a.height) y = 0;
  if (y < 0) y = pipeCanvas.a.height;

  if (life > ttl) initPipe(i);
}

function drawPipe(x, y, life, ttl, width, hue) {
  pipeCtx.a.save();
  pipeCtx.a.strokeStyle = `hsla(${hue}, 85%, 55%, ${fadeInOut(life, ttl) * 0.24})`;
  pipeCtx.a.lineWidth = width;
  pipeCtx.a.lineCap = 'round';
  pipeCtx.a.lineJoin = 'round';
  pipeCtx.a.beginPath();
  pipeCtx.a.arc(x, y, width * 0.6, 0, Math.PI * 2);
  pipeCtx.a.stroke();
  pipeCtx.a.closePath();
  pipeCtx.a.restore();
}

function resizePipes() {
  const { innerWidth, innerHeight } = window;

  pipeCanvas.a.width = innerWidth;
  pipeCanvas.a.height = innerHeight;
  pipeCtx.a.drawImage(pipeCanvas.b, 0, 0);

  pipeCanvas.b.width = innerWidth;
  pipeCanvas.b.height = innerHeight;
  pipeCtx.b.drawImage(pipeCanvas.a, 0, 0);

  center[0] = 0.5 * pipeCanvas.a.width;
  center[1] = 0.5 * pipeCanvas.a.height;
}

function renderPipes() {
  pipeCtx.b.save();
  pipeCtx.b.fillStyle = backgroundColor;
  pipeCtx.b.fillRect(0, 0, pipeCanvas.b.width, pipeCanvas.b.height);
  pipeCtx.b.restore();

  pipeCtx.b.save();
  pipeCtx.b.filter = 'blur(8px)';
  pipeCtx.b.globalAlpha = 0.7;
  pipeCtx.b.drawImage(pipeCanvas.a, 0, 0);
  pipeCtx.b.restore();

  pipeCtx.b.save();
  pipeCtx.b.globalAlpha = 0.9;
  pipeCtx.b.drawImage(pipeCanvas.a, 0, 0);
  pipeCtx.b.restore();
}

function drawPipes() {
  updatePipes();
  renderPipes();
  window.requestAnimationFrame(drawPipes);
}

window.addEventListener('load', setupPipes);
window.addEventListener('resize', resizePipes);
