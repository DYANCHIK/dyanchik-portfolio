/* =========================================================
   ИНТЕРАКТИВНОСТЬ
   1) Навигация и мобильное меню
   2) Переключение декоративных слайдов
   3) Карточки проектов, like, соцсети
   4) Режим редактирования текста на странице
   5) Контактная форма — собирает mailto-черновик
   ========================================================= */
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const toast = (message) => {
  const node = $('#toast'); node.textContent = message; node.classList.add('show');
  clearTimeout(window.__toastTimer); window.__toastTimer = setTimeout(()=>node.classList.remove('show'), 2600);
};
$('#year').textContent = new Date().getFullYear();

const nav = $('#nav'), menuToggle = $('#menuToggle');
menuToggle.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
  menuToggle.textContent = opened ? '×' : '☰';
});
$$('.nav a').forEach(link => link.addEventListener('click', () => {
  $$('.nav a').forEach(item=>item.classList.remove('active'));
  link.classList.add('active'); nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded','false'); menuToggle.textContent='☰';
}));
const sections = ['top','portfolio','about','services','contacts'];
const slides = [
  {title:'3D модели и текстуры', bg:'#f8e9e9'},
  {title:'Материалы и свет', bg:'#f7e5ec'},
  {title:'Digital objects', bg:'#f2e8eb'},
  {title:'Candy world', bg:'#fae3eb'},
  {title:'Создаём новое', bg:'#f8e9e9'}
];
let currentSlide=0;
function setSlide(next){
  currentSlide=(next+slides.length)%slides.length;
  $('#slideNumber').textContent=String(currentSlide+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  // Меняем только декоративный оттенок сцены, основной контент остаётся доступен.
  $('.hero').style.setProperty('--slide-tint',slides[currentSlide].bg);
  $('.hero').style.backgroundColor=slides[currentSlide].bg;
  toast('Слайд '+(currentSlide+1)+': '+slides[currentSlide].title);
}
$('#prevSlide').addEventListener('click',()=>setSlide(currentSlide-1));
$('#nextSlide').addEventListener('click',()=>setSlide(currentSlide+1));

$$('[data-project]').forEach(card=>card.addEventListener('click',()=>{
  toast(card.dataset.project);
}));
$$('[data-action="like"]').forEach(btn=>btn.addEventListener('click',()=>{
  const liked=btn.dataset.liked==='true';
  btn.dataset.liked=String(!liked);
  const heart=$('b',btn); heart.textContent=liked?'♥':'♥'; heart.style.color=liked?'#ee7fa8':'#c12d65';
  toast(liked?'Лайк убран':'Спасибо за лайк! ♥');
}));
$$('[data-action="instagram"]').forEach(btn=>btn.addEventListener('click',()=>{
  // Замените URL на ссылку своего профиля.
  window.open('https://www.instagram.com/','_blank','noopener,noreferrer');
}));
$$('[data-action="telegram"]').forEach(btn=>btn.addEventListener('click',()=>{
  // Замените username в ссылке на свой Telegram.
  window.open('https://t.me/','_blank','noopener,noreferrer');
}));

const editToggle=$('#editToggle');
let editMode=false;
editToggle.addEventListener('click',()=>{
  editMode=!editMode;
  document.body.classList.toggle('edit-mode',editMode);
  editToggle.setAttribute('aria-pressed',String(editMode));
  editToggle.textContent=editMode?'✓ Готово':'✎ Редактировать';
  $$('[data-editable="true"]').forEach(el=>{
    el.contentEditable=String(editMode);
    el.spellcheck=editMode;
  });
  toast(editMode?'Режим редактирования включён — нажимайте на текст':'Редактирование завершено');
});

$('#contactForm').addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget);
  const subject=encodeURIComponent('Новый проект — '+data.get('name'));
  const body=encodeURIComponent('Имя: '+data.get('name')+'\nEmail: '+data.get('email')+'\n\nПроект:\n'+data.get('message'));
  window.location.href='mailto:hello@almondcream.studio?subject='+subject+'&body='+body;
  toast('Открываем почтовое приложение…');
});


/* =========================================================
   MOTION / SHOWREEL BEHAVIOUR
   - Parallax очень лёгкий и ограничен сценой hero, чтобы не залезать на текст.
   - Видео воспроизводятся без звука, зацикленно; если файла пока нет, остаётся постер-заглушка.
   ========================================================= */
const hero = $('.hero');
const floatObjects = $$('.heart-glass, .star-ball, .gem, .like-bubble, .ribbon');
let scrollTick = false;
function updateHeroParallax(){
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = hero.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
  // Движение небольшое и не влияет на положение текста и навигации.
  floatObjects.forEach((el, index)=>{
    const speed = 7 + (index % 4) * 3;
    el.style.setProperty('--scroll-drift', `${Math.round(progress * speed)}px`);
  });
  scrollTick = false;
}
window.addEventListener('scroll', ()=>{
  if (!scrollTick) { window.requestAnimationFrame(updateHeroParallax); scrollTick = true; }
}, {passive:true});
window.addEventListener('resize', updateHeroParallax);
updateHeroParallax();

$$('.showreel-card video').forEach(video=>{
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.addEventListener('loadeddata',()=>{
    const card=video.closest('.showreel-card');
    card.classList.add('has-video');
    video.play().catch(()=>{ /* Некоторые браузеры ждут первого действия пользователя. */ });
  });
  video.addEventListener('error',()=>{
    // Пока файла нет, показываем аккуратную графическую заглушку.
    video.closest('.showreel-card').classList.remove('has-video');
  });
  // Повторная попытка запуска при первом касании/клике на устройстве.
  document.addEventListener('pointerdown',()=>{ if(video.readyState>=2) video.play().catch(()=>{}); },{once:true,passive:true});
});
