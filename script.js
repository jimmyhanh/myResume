const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

// Create animated cat
function createCats() {
  const catsContainer = document.querySelector('.cats-container');
  if (!catsContainer) return;

  // Add memorial text
  const text = document.createElement('div');
  text.className = 'cat-memorial';
  text.textContent = 'In loving Memory Kuro';
  catsContainer.appendChild(text);

  // Add cat image
  const cat = document.createElement('div');
  cat.className = 'cat';
  const img = document.createElement('img');
  img.src = 'cat icon.png';
  img.alt = 'Kuro';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'contain';
  cat.appendChild(img);
  catsContainer.appendChild(cat);
}

createCats();

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
