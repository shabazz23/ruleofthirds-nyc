// Golden Hour Loft — interactions

(function () {
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('menuToggle');
  var overlay = document.getElementById('menuOverlay');

  // Sticky header background on scroll
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Fullscreen mobile menu
  function setMenu(open) {
    toggle.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () {
    setMenu(!overlay.classList.contains('open'));
  });
  overlay.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) setMenu(false);
  });

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // Current year in footer
  var copy = document.querySelector('.footer-copy');
  if (copy) copy.textContent = copy.textContent.replace('2026', String(new Date().getFullYear()));
})();
