(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(
    ".page-hero .container > *, .hero-copy, .hero-visual, .section-head, .work-card, .service-row, .service-card, .value-card, .price-card, .timeline-item, .process-step, .about-media, .about-copy, .quote-band, .cta-band, .faq-item, .contact-intro, .contact-form-wrap"
  );

  if (reduceMotion || !("IntersectionObserver" in window)) {
    return;
  }

  document.documentElement.classList.add("has-reveal");

  targets.forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.setProperty("--reveal-delay", (i % 4) * 80 + "ms");
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
