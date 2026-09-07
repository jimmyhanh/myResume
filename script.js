// Keep the compact navigation in sync with the section being read.
const navigationLinks = [...document.querySelectorAll('.site-nav a')];
const sections = navigationLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
let updatePending = false;

function updateNavigation() {
  const marker = window.innerHeight * 0.35;
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= marker) current = section;
  }
  for (const link of navigationLinks) {
    if (link.getAttribute('href') === `#${current.id}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  }
  updatePending = false;
}

function scheduleNavigationUpdate() {
  if (!updatePending) {
    updatePending = true;
    requestAnimationFrame(updateNavigation);
  }
}

if (sections.length) {
  window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
  window.addEventListener('resize', scheduleNavigationUpdate);
  updateNavigation();
}
