/* ══════════════════════════════════════════════════════════════════
   SCRIPT.JS — вся интерактивность
   ══════════════════════════════════════════════════════════════════
   Что редактировать:
     → CONFIG ниже — портфолио, email, скорость карусели
   Остальной код (обработчики, меню) трогать не нужно.
   ══════════════════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════════════════
   ▓▓▓  ГЛАВНЫЕ НАСТРОЙКИ  ▓▓▓
   Меняйте только значения после двоеточия.
   ══════════════════════════════════════════════════════════════════ */
const CONFIG = {

  /* ──────── КОНТАКТНЫЙ EMAIL ──────── */
  email: 'onlydamnnikitina@gmail.com',

  /* ──────── ПОРТФОЛИО (ВЕРХНЯЯ КАРУСЕЛЬ) ──────── 
     Здесь 9 карточек для первой ленты. 
     Меняйте img, label и title под себя. */
  portfolioTop: [
    { img: 'videos/1 (1).mp4', label: 'карточка 1', title: 'название' },
    { img: 'images/1 (2).jpg', label: 'карточка 2', title: 'название' },
    { img: 'images/1 (3).jpg', label: 'карточка 3', title: 'название' },
    { img: 'images/1 (4).jpg', label: 'карточка 4', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 5', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 6', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 7', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 8', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 9', title: 'название' },
  ],

  /* ──────── ПОРТФОЛИО (НИЖНЯЯ КАРУСЕЛЬ) ──────── 
     Здесь 9 карточек для второй ленты. 
     Сюда можно вставить совершенно другие картинки. */
  portfolioBottom: [
    { img: 'images/1 (3).jpg', label: 'карточка 1', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 2', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 3', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 4', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 5', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 6', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 7', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 8', title: 'название' },
    { img: 'images/Photo 1.png', label: 'карточка 9', title: 'название' },
  ],

  /* ──────── ПАРАЛЛАКС HERO ──────── */
  parallax: true,
};


/* ══════════════════════════════════════════════════════════════════
   ⚙️  ДАЛЬШЕ ИДЁТ ЛОГИКА — трогать не нужно
   ══════════════════════════════════════════════════════════════════ */

/* Утилиты */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

let toastTimer;
const toast = (msg) => {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
};

/* Год в подвале */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ──────── МЕНЮ ──────── */
const nav = $('#nav');
const menuToggle = $('#menuToggle');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(opened));
    menuToggle.textContent = opened ? '×' : '☰';
  });
}

$$('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    $$('.nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    if (nav) nav.classList.remove('open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    }
  });
});


/* ──────── КАРУСЕЛИ ────────
   Строит DOM-структуру карточек из CONFIG.portfolioTop / portfolioBottom.
   Поддерживает картинки (png, jpg, gif) и видео (mp4, webm). */
function buildSlider(el, items) {
  if (!el || !items.length) return;
  el.style.setProperty('--quantity', items.length);

  const list = document.createElement('div');
  list.className = 'list';

  items.forEach((item, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'item';
    wrap.style.setProperty('--position', i + 1); // фаза анимации

    // Проверяем, является ли файл видео по его расширению
    const isVideo = /\.(mp4|webm|ogg)$/i.test(item.img);

    // Если это видео — создаем тег video, иначе — img
    const mediaTag = isVideo 
      ? `<video src="${item.img}" autoplay muted loop playsinline></video>` 
      : `<img src="${item.img}" alt="${item.label || item.title || ''}">`;

    wrap.innerHTML = `
      <div class="card">
        ${mediaTag}
        <div class="card-text">
          <p>${item.label || ''}</p>
          <p>${item.title || ''}</p>
        </div>
      </div>`;
    list.appendChild(wrap);
  });

  el.appendChild(list);
}

buildSlider($('#sliderRight'), CONFIG.portfolioTop);
buildSlider($('#sliderLeft'),  CONFIG.portfolioBottom);


/* ──────── ЛАЙК ──────── */
$$('[data-action="like"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const liked = btn.dataset.liked === 'true';
    btn.dataset.liked = String(!liked);
    const heart = $('b', btn);
    if (heart) heart.style.color = liked ? '#ee7fa8' : '#c12d65';
    toast(liked ? 'Лайк убран' : 'Спасибо за лайк! ♥');
  });
});


/* ──────── ФОРМА (mailto) ──────── */
const contactForm = $('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);

    const subject = encodeURIComponent('Новый проект — ' + data.get('name'));
    const body = encodeURIComponent(
      'Имя: '   + data.get('name')  + '\n' +
      'Email: ' + data.get('email') + '\n\n' +
      'Проект:\n' + data.get('message')
    );

    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
    toast('Открываем почтовое приложение…');
  });
}


/* ──────── ПАРАЛЛАКС HERO ──────── */
const hero = $('.hero');
const floatObjects = $$('.heart-glass, .star-ball, .gem, .like-bubble, .ribbon');
let scrollTick = false;

function updateHeroParallax() {
  if (!CONFIG.parallax) return;
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rect = hero.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1,
    (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
  ));

  floatObjects.forEach((el, i) => {
    const speed = 7 + (i % 4) * 3;
    el.style.setProperty('--scroll-drift', Math.round(progress * speed) + 'px');
  });
  scrollTick = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTick) {
    requestAnimationFrame(updateHeroParallax);
    scrollTick = true;
  }
}, { passive: true });
window.addEventListener('resize', updateHeroParallax);
updateHeroParallax();


/* ──────── ВИДЕО ШОУРИЛОВ ──────── */
$$('.showreel-card video').forEach(video => {
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  video.addEventListener('loadeddata', () => {
    video.closest('.showreel-card')?.classList.add('has-video');
    video.play().catch(() => {});
  });

  video.addEventListener('error', () => {
    video.closest('.showreel-card')?.classList.remove('has-video');
  });

  document.addEventListener('pointerdown', () => {
    if (video.readyState >= 2) video.play().catch(() => {});
  }, { once: true, passive: true });
});

/* ══════════════════════════════════════════════════════════════════
   3D ПАРАЛЛАКС КАРТОЧКА
   ══════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    // 1. НАСТРОЙКИ СЛОЕВ
    const LAYER_SETTINGS = {
        'bg':           { x: 0, y: 0, scale: 0, depth: -50, radius: 20, blur: 2, opacity: 1, clip: true },
        'chains-back':  { x: 0, y: 0, scale: 1.3,    depth: 10,  radius: 20, blur: 0, opacity: 1, clip: true },
        'hand':         { x: 0, y: 0, scale: 0.7,  depth: 50,  radius: 20, blur: 0, opacity: 1, clip: true },
        'card-frame':   { x: 0, y: 0, scale: 1,    depth: 100,  radius: 20, blur: 0, opacity: 1, clip: true },
        'chains-front': { x: 0, y: 30, scale: 0.6,  depth: 150, radius: 20, blur: 0, opacity: 1, clip: true}
    };

    // 2. ПРИМЕНЕНИЕ НАСТРОЕК
    const wrappers = document.querySelectorAll('.layer-wrapper');
    wrappers.forEach(wrapper => {
        const layerName = wrapper.dataset.layer;
        const settings = LAYER_SETTINGS[layerName];
        if (!settings) return; 

        const img = wrapper.querySelector('img');
        wrapper.style.transform = `translate(${settings.x}%, ${settings.y}%) scale(${settings.scale})`;
        img.style.transform = `translateZ(${settings.depth}px)`;
        img.style.filter = `blur(${settings.blur}px)`;
        img.style.opacity = settings.opacity;

        if (settings.clip) {
            img.style.clipPath = `inset(0 round ${settings.radius}px)`;
        } else {
            img.style.clipPath = 'none';
        }
    });

    // 3. ЭФФЕКТ НАКЛОНА
    const scene = document.getElementById('scene');
    const card = document.getElementById('card');
    
    if (scene && card) {
        const MAX_ROTATE = 15; 
        
        let currentX = 0, currentY = 0;
        let targetX = 0, targetY = 0;

        // --- ПК (Мышка) ---
        // Слушаем движение мышки по ВСЕМУ ОКНУ, чтобы увеличить радиус действия
        window.addEventListener('mousemove', (e) => {
            // Вычисляем позицию мышки относительно центра экрана
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;
            
            targetX = y * -MAX_ROTATE;
            targetY = x * MAX_ROTATE;
        });

        // --- ТЕЛЕФОН (Палец) ---
        // Слушаем касания по всей ширине окна, чтобы было удобно водить пальцем
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0]; 
                const x = (touch.clientX / window.innerWidth) - 0.5;
                const y = (touch.clientY / window.innerHeight) - 0.5;
                
                targetX = y * -MAX_ROTATE;
                targetY = x * MAX_ROTATE;
            }
        }, { passive: true });

        // Возврат в исходное положение, когда мышка или палец уходят
        window.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
        });
        
        window.addEventListener('touchend', () => {
            targetX = 0;
            targetY = 0;
        });

        // --- АНИМАЦИЯ (с инерцией) ---
        function animate() {
            // Плавно догоняем цель (0.1 - это скорость догоняния, можно менять)
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;

            card.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
            
            requestAnimationFrame(animate);
        }
        animate(); 
    }
});
