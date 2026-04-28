/* ================================================================
   main.js
   Scroll-reveal: any element tagged `.reveal` gets `.visible` added
   the first time it enters the viewport, triggering the fade-in-up
   transition defined in css/base.css. We unobserve after firing so
   each element only animates once.
   ================================================================ */

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
