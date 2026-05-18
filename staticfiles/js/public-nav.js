(function () {
  var btn = document.getElementById('menuToggle');
  var nav = document.getElementById('publicNav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    nav.classList.toggle('hidden');
    nav.classList.toggle('flex');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth < 768) {
        nav.classList.add('hidden');
        nav.classList.remove('flex');
      }
    });
  });
})();
