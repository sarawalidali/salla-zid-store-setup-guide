(function () {
  // mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // reading progress
  var bar = document.querySelector('.progress span');
  function onScroll() {
    if (!bar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // active section in the table of contents
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[decodeURIComponent(a.getAttribute('href').slice(1))] = a; });
    var heads = Array.prototype.slice.call(document.querySelectorAll('.prose h2[id]'));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('active'); });
          var a = map[e.target.id];
          if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    heads.forEach(function (h) { io.observe(h); });
  }

  // close the mobile toc after choosing a section
  document.querySelectorAll('.toc-mobile a').forEach(function (a) {
    a.addEventListener('click', function () { var d = a.closest('details'); if (d) d.open = false; });
  });

  // lightbox
  var lb = document.querySelector('.lightbox');
  var lbImg = lb && lb.querySelector('img');
  function closeLb() { if (lb) { lb.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; } }
  document.querySelectorAll('a.zoom').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      if (!lb) return;
      ev.preventDefault();
      var img = a.querySelector('img');
      lbImg.src = a.getAttribute('href');
      lbImg.alt = img ? img.alt : '';
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });
  if (lb) {
    lb.addEventListener('click', closeLb);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  }

  // remember checklist ticks per page (this browser only)
  var key = 'checklist:' + location.pathname;
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.task input[type=checkbox]'));
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { saved = []; }
  boxes.forEach(function (b, i) {
    b.checked = !!saved[i];
    b.addEventListener('change', function () {
      try { localStorage.setItem(key, JSON.stringify(boxes.map(function (x) { return x.checked; }))); } catch (e) {}
    });
  });
})();
