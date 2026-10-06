/* スクロールに合わせて要素をふわっと表示する */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js');
  var targets = document.querySelectorAll(
    '.photo, .section__head, .concept, .values__item, .card, .ai__lead, .ai__item, .ai__note, .info, .history, .cta__inner'
  );
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 3) * 0.08 + 's'; // 横並びの要素を少しずつずらす
    io.observe(el);
  });
})();
