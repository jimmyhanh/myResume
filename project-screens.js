import * as THREE from './vendor/three.module.min.js';

// A mobile layout adapted from the supplied desktop screenshot, not a live embed.
export function mobileScreen(image, project) {
  const surface = document.createElement('canvas');
  surface.width = 780; surface.height = 1688;
  const ctx = surface.getContext('2d');
  ctx.scale(2, 2);
  if (project === 'dental') return dentalScreen(ctx, surface, image);
  if (project === 'pomodoro') return pomodoroScreen(ctx, surface, image);
  ctx.fillStyle = '#f5f0e8'; ctx.fillRect(0, 0, 390, 844);
  ctx.fillStyle = '#47342b'; ctx.font = '600 12px Arial';
  ctx.fillText('9:41', 25, 26); ctx.fillText('•••  ▰', 325, 26);
  ctx.fillStyle = '#794a3a'; ctx.font = 'bold 19px Arial';
  ctx.fillText('Tilted Lab Inc.', 24, 76);
  ctx.font = '22px Arial'; ctx.fillText('☰', 342, 76);
  const gradient = ctx.createLinearGradient(0, 100, 390, 750);
  gradient.addColorStop(0, '#e7c5ad'); gradient.addColorStop(1, '#f1e3d2');
  ctx.fillStyle = gradient; ctx.fillRect(0, 100, 390, 656);
  ctx.save(); ctx.beginPath(); ctx.roundRect(24, 124, 342, 190, 12); ctx.clip();
  ctx.drawImage(image, image.width * .353, image.height * .089, image.width * .289, image.height * .280, 24, 124, 342, 190);
  ctx.restore();
  ctx.textAlign = 'center'; ctx.fillStyle = '#704737'; ctx.font = 'bold 30px Arial';
  ctx.fillText('Everything you need', 195, 363);
  ctx.fillText('to manage', 195, 401);
  ctx.fillStyle = '#b24d2b';
  ctx.fillText('your mental wellness', 195, 445);
  ctx.fillText('journey', 195, 483);
  ctx.fillStyle = '#795846'; ctx.font = '15px Arial';
  ['Access self-care tools, join supportive', 'communities, get AI-powered guidance,', 'and track your progress—all in one place.'].forEach((line, i) => ctx.fillText(line, 195, 527 + i * 24));
  ctx.fillStyle = '#bc5a39'; ctx.beginPath(); ctx.roundRect(75, 616, 240, 48, 8); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 15px Arial'; ctx.fillText('Get started free', 195, 646);
  ctx.fillStyle = '#865844'; ctx.font = '13px Arial'; ctx.fillText('Secure & private  ·  Easy to use', 195, 698);
  ctx.fillStyle = '#ae5839'; ctx.font = 'bold 27px Arial'; ctx.fillText('24/7', 98, 792); ctx.fillText('4+', 292, 792);
  ctx.fillStyle = '#795846'; ctx.font = '12px Arial'; ctx.fillText('AI support', 98, 815); ctx.fillText('Self-care tools', 292, 815);
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function screenTexture(surface) {
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function dentalScreen(ctx, surface, image) {
  ctx.fillStyle = '#f8f9fa'; ctx.fillRect(0, 0, 390, 844);
  ctx.fillStyle = '#263342'; ctx.font = '600 12px Arial';
  ctx.fillText('9:41', 25, 26); ctx.fillText('LTE', 333, 26);
  // Reuse the logo from the supplied screenshot.
  ctx.drawImage(image, image.width * .168, image.height * .013, image.width * .027, image.height * .058, 24, 50, 44, 50);
  ctx.font = 'bold 16px Arial'; ctx.fillText('Boston Dental Hub', 82, 80);
  ctx.font = '22px Arial'; ctx.fillText('\u2630', 342, 80);
  const gradient = ctx.createLinearGradient(0, 110, 390, 670);
  gradient.addColorStop(0, '#383e45'); gradient.addColorStop(1, '#586c7b');
  ctx.fillStyle = gradient; ctx.fillRect(0, 110, 390, 560);
  ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.font = 'bold 37px Georgia';
  ctx.fillText('Boston Hub', 195, 228); ctx.fillText('Dental Group', 195, 278);
  ctx.fillStyle = '#ffec16'; ctx.font = 'bold 40px Georgia'; ctx.fillText('Dental Care', 195, 340);
  ctx.fillStyle = '#e4e9ee'; ctx.font = '17px Arial';
  ['Comprehensive, compassionate', 'dental services for the whole family.', 'From routine checkups to advanced', 'treatments, all under one roof', 'in Garden Grove.'].forEach((line, i) => ctx.fillText(line, 195, 397 + i * 27));
  ctx.fillStyle = '#ef1925'; ctx.beginPath(); ctx.roundRect(71, 566, 248, 47, 24); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 15px Arial'; ctx.fillText('Book Appointment', 195, 595);
  ctx.textAlign = 'left';
  const services = [['GENERAL', 'DENTISTRY'], ['IMPLANT', 'DENTISTRY']];
  services.forEach(([label, title], i) => {
    ctx.fillStyle = i ? '#a71920' : '#d52027'; ctx.fillRect(0, 670 + i * 87, 390, 87);
    ctx.fillStyle = '#f4d9d9'; ctx.font = '12px Arial'; ctx.fillText(label, 27, 700 + i * 87);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 21px Arial'; ctx.fillText(title, 27, 729 + i * 87);
  });
  return screenTexture(surface);
}

function pomodoroScreen(ctx, surface, image) {
  const gradient = ctx.createLinearGradient(0, 0, 390, 844);
  gradient.addColorStop(0, '#ffe2e2'); gradient.addColorStop(1, '#fccaca');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 390, 844);
  ctx.fillStyle = '#753e43'; ctx.font = '600 12px Arial';
  ctx.fillText('9:41', 25, 26); ctx.fillText('LTE', 333, 26);
  // Preserve the actual timer interface, including its controls and typography.
  // The centered card is cropped out of the desktop screenshot without distortion.
  const sx = image.width * .4403, sy = image.height * .3013;
  const sw = image.width * .2771, sh = image.height * .4227;
  const width = 350, height = width * sh / sw;
  ctx.save();
  ctx.shadowColor = '#aa515129'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 14;
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(20, (844 - height) / 2, width, height, 8); ctx.fill();
  ctx.restore();
  ctx.drawImage(image, sx, sy, sw, sh, 20, (844 - height) / 2, width, height);
  return screenTexture(surface);
}
