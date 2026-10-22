/* ЗАМЕНИ эти примеры на реальные мотошколы и клубы */
const SCHOOLS = [
  { city: 'Москва', name: 'Мотошкола (пример)', ll: [55.7558, 37.6173] },
  { city: 'Санкт-Петербург', name: 'Мотоклуб (пример)', ll: [59.9343, 30.3351] },
  { city: 'Казань', name: 'Мотошкола (пример)', ll: [55.7961, 49.1064] },
  { city: 'Екатеринбург', name: 'Мотоклуб (пример)', ll: [56.8389, 60.6057] },
  { city: 'Новосибирск', name: 'Мотошкола (пример)', ll: [55.0084, 82.9357] },
  { city: 'Краснодар', name: 'Мотошкола (пример)', ll: [45.0355, 38.9753] }
];
const map = L.map('map', { scrollWheelZoom: false }).setView([56, 55], 3);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
const marks = SCHOOLS.map(s => L.circleMarker(s.ll, { radius: 11, color: '#fff', weight: 3, fillColor: '#2b4cff', fillOpacity: 1 })
  .addTo(map).bindPopup(`<b>${s.name}</b><br>${s.city}`));
const chips = document.getElementById('chips');
chips.innerHTML = '<button class="on" data-i="-1">Вся страна</button>' + SCHOOLS.map((s, i) => `<button data-i="${i}">${s.city}</button>`).join('');
chips.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  chips.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  const i = +b.dataset.i;
  if (i < 0) map.flyTo([56, 55], 3, { duration: 1.2 });
  else { map.flyTo(SCHOOLS[i].ll, 11, { duration: 1.4 }); marks[i].openPopup(); }
});

/* ===== форма историй =====
   Вариант 1 (рекомендую): зарегистрируйся на formspree.io, создай форму и вставь её адрес сюда.
   Вариант 2: оставь ENDPOINT пустым и впиши свою почту в EMAIL: форма откроет письмо в почтовой программе. */
const ENDPOINT = '';            // например 'https://formspree.io/f/xxxxxxxx'
const EMAIL = 'ТВОЯ_ПОЧТА@example.com';

const form = document.getElementById('storyForm'), msg = document.getElementById('storyMsg');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const text = `Имя: ${d.name}\nГород: ${d.city || '-'}\n\n${d.story}`;
  msg.className = 'note'; msg.textContent = 'Отправляем…';
  if (ENDPOINT) {
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name: d.name, city: d.city, message: d.story }) });
      if (!r.ok) throw new Error();
      form.reset(); msg.className = 'note ok'; msg.textContent = 'Спасибо! История отправлена.';
    } catch (err) {
      msg.className = 'note err'; msg.textContent = 'Не получилось отправить. Проверь интернет и попробуй ещё раз.';
    }
  } else {
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Моя история: первый сезон')}&body=${encodeURIComponent(text)}`;
    msg.className = 'note ok'; msg.textContent = 'Открываем письмо. Нажми «Отправить» в почтовой программе.';
  }
});
