/* Тёмная/светлая тема: запоминается в браузере */
(function () {
  var t = 'light';
  try { t = localStorage.getItem('ps-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch (e) {}
  document.documentElement.dataset.theme = t;
  addEventListener('DOMContentLoaded', function () {
    var b = document.createElement('button');
    b.className = 'tg'; b.setAttribute('aria-label', 'Сменить тему');
    function set(v) {
      document.documentElement.dataset.theme = v;
      b.textContent = v === 'dark' ? '☀️' : '🌙';
      try { localStorage.setItem('ps-theme', v); } catch (e) {}
      document.dispatchEvent(new Event('themechange'));
    }
    set(t);
    b.onclick = function () { set(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); };
    document.querySelector('.nav').appendChild(b);
  });
})();
