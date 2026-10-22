const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = n => n.toLocaleString('ru-RU') + ' ₽';

/* шапка + параллакс героя */
const nav = $('#nav'), heroImg = $('#heroImg');
addEventListener('scroll', () => {
  nav.classList.toggle('solid', scrollY > 60);
  if (heroImg && scrollY < innerHeight) heroImg.style.translate = `0 ${scrollY * 0.18}px`;
}, { passive: true });

/* счётчики в герое */
$$('[data-count]').forEach(el => {
  const end = +el.dataset.count, t0 = performance.now(), dur = 1800;
  const tick = t => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

/* появление блоков при скролле */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
$$('.card, blockquote, .calc-out').forEach(el => { el.classList.add('rv'); io.observe(el); });

/* мотоциклист едет по дороге при скролле */
const path = $('#roadPath'), rider = $('#rider'), line = $('.roadline');
function ride() {
  const r = line.getBoundingClientRect();
  const p = Math.min(Math.max((innerHeight - r.top) / (innerHeight + r.height), 0), 1);
  const pt = path.getPointAtLength(p * path.getTotalLength());
  rider.style.left = (pt.x / 1000 * line.clientWidth) + 'px';
  rider.style.top = (pt.y / 120 * line.clientHeight) + 'px';
}
addEventListener('scroll', ride, { passive: true });
addEventListener('resize', ride);
ride();

/* калькулятор */
const colors = ['#ffc933', '#ffffff', '#101418', '#8fa2ff', '#ff7a59'];
const rs = [1, 2, 3, 4, 5].map(n => $('#r' + n));
function calc() {
  const v = rs.map(r => +r.value), sum = v.reduce((a, b) => a + b, 0);
  v.forEach((x, i) => $('#o' + (i + 1)).textContent = fmt(x));
  $('#total').textContent = fmt(sum);
  $('#split').innerHTML = v.map((x, i) => `<div style="width:${x / sum * 100}%;background:${colors[i]}"></div>`).join('');
}
rs.forEach(r => r.addEventListener('input', calc));
calc();

/* чек-лист осмотра */
const items = ['Сверить VIN на раме и в ПТС', 'Проверить документы и владельцев', 'Осмотреть раму и подрамник на следы падений', 'Проверить вилку на подтёки масла', 'Оценить состояние цепи и звёзд', 'Посмотреть шины: дата выпуска и износ', 'Тормозные диски и колодки', 'Запуск на холодном двигателе', 'Нет ли дыма и посторонних звуков', 'Тест-драйв: тормоза, сцепление, переключение'];
const list = $('#checkList'), key = 'pervy-sezon-check';
let saved = [];
try { saved = JSON.parse(localStorage.getItem(key)) || []; } catch (e) {}
list.innerHTML = items.map((t, i) => `<li><label><input type="checkbox" data-i="${i}" ${saved.includes(i) ? 'checked' : ''}><span>${t}</span></label></li>`).join('');
function upd() {
  const on = $$('input:checked', list).map(c => +c.dataset.i);
  try { localStorage.setItem(key, JSON.stringify(on)); } catch (e) {}
  const p = on.length / items.length;
  $('#ringFg').style.strokeDashoffset = 327 * (1 - p);
  $('#ringTxt').textContent = Math.round(p * 100) + '%';
}
list.addEventListener('change', upd);
upd();
