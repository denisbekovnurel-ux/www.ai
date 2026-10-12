const siteConfig = window.siteConfig ?? {};
const contactSettings = [
  { key: 'whatsapp', url: siteConfig.whatsappNumber ? `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}` : '', label: 'Написать в WhatsApp' },
  { key: 'instagram', url: siteConfig.instagramUrl, label: 'Мы в Instagram' },
  { key: 'tiktok', url: siteConfig.tiktokUrl, label: 'Мы в TikTok' },
  { key: 'telegram', url: siteConfig.telegramUrl, label: 'Мы в Telegram' },
  { key: 'email', url: siteConfig.email ? `mailto:${siteConfig.email}` : '', label: siteConfig.email || '' },
  { key: 'custom', url: siteConfig.customLinkUrl, label: siteConfig.customLinkLabel || '' },
  { key: 'phone', url: siteConfig.phoneNumber ? `tel:${siteConfig.phoneNumber.replace(/\s/g, '')}` : '', label: siteConfig.phoneDisplay || '' }
];

if (siteConfig.companyDescription) {
  document.querySelector('[data-company-description]')?.replaceChildren(document.createTextNode(siteConfig.companyDescription));
}
document.querySelectorAll('[data-company-name]').forEach((element) => {
  if (siteConfig.companyName && siteConfig.companyName !== 'ВАША КОМПАНИЯ') element.textContent = siteConfig.companyName;
});
contactSettings.forEach(({ key, url, label }) => {
  const link = document.querySelector(`[data-contact="${key}"]`);
  if (!link || !url || !label) {
    link?.classList.add('contact-link-unconfigured');
    return;
  }
  link.href = url;
  if (key !== 'phone') {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  link.querySelector('strong').textContent = label;
  link.classList.remove('contact-link-unconfigured');
});
if (siteConfig.companyName && siteConfig.companyName !== 'ВАША КОМПАНИЯ') {
  document.title = `${siteConfig.companyName} — официальный сайт`;
}
const descriptionMeta = document.querySelector('meta[name="description"]');
if (siteConfig.companyDescription && descriptionMeta) descriptionMeta.content = siteConfig.companyDescription;

const menuButton = document.querySelector('#menuButton');
const navigation = document.querySelector('#siteNavigation');
const progressBar = document.querySelector('#readingProgress');
const backToTop = document.querySelector('.back-to-top');
const navigationLinks = [...navigation.querySelectorAll('a')];

const closeMenu = () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
};

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
});

navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('click', (event) => {
  if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

const updateScrollUI = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  backToTop.classList.toggle('visible', window.scrollY > 500);
};
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

const sections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => {
      const isCurrent = link.hash === `#${entry.target.id}`;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.section-kicker, .about-grid, .services-heading, .info-card, .contact-grid').forEach((element) => {
  element.classList.add('reveal');
  revealObserver.observe(element);
});

const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const heroArt = document.querySelector('.hero-art');

if (motionAllowed && finePointer && heroArt) {
  let pointerFrame = 0;
  window.addEventListener('pointermove', (event) => {
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      const offsetX = (event.clientX / window.innerWidth - 0.5) * 18;
      const offsetY = (event.clientY / window.innerHeight - 0.5) * 18;
      heroArt.style.setProperty('--parallax-x', `${offsetX}px`);
      heroArt.style.setProperty('--parallax-y', `${offsetY}px`);
      const card = event.target.closest?.('.info-card');
      if (card) {
        const bounds = card.getBoundingClientRect();
        const tiltX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -7;
        const tiltY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 7;
        card.style.setProperty('--tilt-x', `${tiltX}deg`);
        card.style.setProperty('--tilt-y', `${tiltY}deg`);
      }
      pointerFrame = 0;
    });
  }, { passive: true });
  document.querySelectorAll('.info-card').forEach((card) => {
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}