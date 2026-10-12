const siteConfig = window.siteConfig ?? {};
const contactSettings = [
  { key: 'whatsapp', url: siteConfig.whatsappNumber ? `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}` : '', label: 'Написать в WhatsApp' },
  { key: 'instagram', url: siteConfig.instagramUrl, label: 'Мы в Instagram' },
  { key: 'tiktok', url: siteConfig.tiktokUrl, label: 'Мы в TikTok' },
  { key: 'phone', url: siteConfig.phoneNumber ? `tel:${siteConfig.phoneNumber.replace(/\s/g, '')}` : '', label: siteConfig.phoneDisplay || '' }
];

document.querySelectorAll('[data-company-name]').forEach((element) => {
  if (siteConfig.companyName) element.textContent = siteConfig.companyName;
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
