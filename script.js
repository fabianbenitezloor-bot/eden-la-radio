const STREAM_URL='https://radio.megahostec.com/listen/eden/stream';
const META_URL='https://radio.megahostec.com/api/nowplaying/eden';
const SITE_URL='https://fabianbenitezloor-bot.github.io/eden-la-radio/';
const SHARE_TEXT='Plataforma cristiana online. “La fe viene por el oír” (Romanos 10:17). Donde Dios habla al corazón. Adoración y esperanza 24/7.';

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const radio=$('#radio'), playBtn=$('#playBtn'), songTitle=$('#songTitle'), artistName=$('#artistName');
radio.src=STREAM_URL;

const verses=[
 {ref:'Romanos 10:17', text:'Así que la fe es por el oír, y el oír, por la palabra de Dios.', reflection:'Hoy permite que la Palabra fortalezca tu fe.'},
 {ref:'Marcos 12:30', text:'Y amarás al Señor tu Dios con todo tu corazón, y con toda tu alma, y con toda tu mente y con todas tus fuerzas.', reflection:'Dios desea todo tu corazón, no solo una parte.'},
 {ref:'Salmos 56:3', text:'En el día que temo, yo en ti confío.', reflection:'La confianza en Dios es refugio en medio del temor.'},
 {ref:'Mateo 6:33', text:'Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.', reflection:'Ordena tus prioridades: primero Dios.'},
 {ref:'Filipenses 1:6', text:'El que comenzó en vosotros la buena obra, la perfeccionará hasta el día de Jesucristo.', reflection:'Dios no deja incompleto lo que empieza.'},
 {ref:'Josué 1:9', text:'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.', reflection:'La valentía nace de saber que Dios va contigo.'}
];
const todayIndex=Math.floor(Date.now()/86400000)%verses.length;
const v=verses[todayIndex];
['#verseText','#desktopVerseText'].forEach(id=>{const el=$(id); if(el) el.textContent='“'+v.text+'”'});
['#verseRef','#desktopVerseRef'].forEach(id=>{const el=$(id); if(el) el.textContent=v.ref});
['#reflection','#desktopReflection'].forEach(id=>{const el=$(id); if(el) el.textContent=v.reflection});

const lang=(navigator.language||'es').toLowerCase().startsWith('en')?'en':'es';
const dict={
 es:{home:'Inicio',word:'Palabra',prayer:'Oración',donate:'Donar',shop:'Tienda',social:'Redes',slogan:'LA FE VIENE POR EL OÍR',share:'Compartir',now:'AHORA SONANDO',verseTitle:'Versículo del día',shareVerse:'Compartir versículo',needPrayer:'Peticiones y oración',prayerText:'Comparte tu petición por WhatsApp. En Edén Radio creemos que Dios habla al corazón.',sendPrayer:'Enviar petición',support:'Apoya Edén Radio',supportText:'Muy pronto podrás apoyar este ministerio con donaciones en línea.',coming:'Próximamente',store:'Tienda Edén',storeText:'Camisetas y productos de Edén Radio estarán disponibles pronto.',follow:'Síguenos'},
 en:{home:'Home',word:'Word',prayer:'Prayer',donate:'Donate',shop:'Shop',social:'Social',slogan:'FAITH COMES BY HEARING',share:'Share',now:'NOW PLAYING',verseTitle:'Verse of the day',shareVerse:'Share verse',needPrayer:'Prayer requests',prayerText:'Share your prayer request by WhatsApp. At Edén Radio we believe God speaks to the heart.',sendPrayer:'Send request',support:'Support Edén Radio',supportText:'Soon you will be able to support this ministry with online donations.',coming:'Coming soon',store:'Edén Store',storeText:'T-shirts and Edén Radio products will be available soon.',follow:'Follow us'}
};
document.documentElement.lang=lang;
$$('[data-i18n]').forEach(el=>{el.textContent=dict[lang][el.dataset.i18n]||el.textContent});

function go(page){
 $$('.page').forEach(p=>p.classList.toggle('active',p.id===page));
 $$('.nav').forEach(n=>n.classList.toggle('active',n.dataset.page===page));
}
$$('.nav').forEach(btn=>btn.addEventListener('click',()=>go(btn.dataset.page)));
$('#menuBtn')?.addEventListener('click',()=>go('social'));

playBtn.addEventListener('click', async()=>{
 try{
   if(radio.paused){
     radio.src=STREAM_URL+(STREAM_URL.includes('?')?'&':'?')+'t='+Date.now();
     await radio.play();
     playBtn.textContent='Ⅱ';
   } else {
     radio.pause(); playBtn.textContent='▶';
   }
 }catch(e){ alert(lang==='en'?'Tap play again. On iPhone, audio must start with a user tap.':'Toca reproducir otra vez. En iPhone el audio debe iniciar con un toque.'); }
});
radio.addEventListener('playing',()=>playBtn.textContent='Ⅱ');
radio.addEventListener('pause',()=>playBtn.textContent='▶');

async function share(text=SHARE_TEXT){
 const url=location.origin.includes('github.io')?SITE_URL:location.href;
 const payload={title:'Edén Radio',text,url};
 if(navigator.share){ try{ await navigator.share(payload); return; }catch(e){} }
 window.open('https://wa.me/?text='+encodeURIComponent(text+' '+url),'_blank');
}
['#shareBtn','#shareTop','#shareSocial','#shareSide'].forEach(id=>$(id)?.addEventListener('click',()=>share()));
$('#shareVerse')?.addEventListener('click',()=>share(v.text+' — '+v.ref));

function makeSpectrum(){
 const s=$('.spectrum'); if(!s) return;
 for(let i=0;i<78;i++){
  const b=document.createElement('span');
  b.style.animationDelay=(i*0.035)+'s';
  b.style.animationDuration=(.72+(i%9)*.055)+'s';
  s.appendChild(b);
 }
}
makeSpectrum();

function parseTitle(data){
 let song=data?.now_playing?.song;
 let artist=song?.artist || '';
 let title=song?.title || '';
 let raw=song?.text || data?.now_playing?.song?.text || data?.live?.streamer_name || '';
 if(!artist && !title && raw){
  raw=String(raw).replace(/^Now On Air:\s*/i,'').replace(/\s+/g,' ').trim();
  const parts=raw.split(/\s[-–—|/]\s/);
  if(parts.length>=2){ artist=parts[0].trim(); title=parts.slice(1).join(' - ').trim(); }
  else { title=raw; }
 }
 return {artist:artist||'Edén Radio', title:title||'Adoración y esperanza 24/7'};
}
function updateMarquee(){
 $$('.marquee').forEach(el=>{
  el.classList.remove('scroll');
  requestAnimationFrame(()=>{ if(el.scrollWidth > el.clientWidth + 10) el.classList.add('scroll'); });
 });
}
async function updateMeta(){
 try{
  const res=await fetch(META_URL,{cache:'no-store'});
  if(!res.ok) throw new Error('no meta');
  const data=await res.json();
  const meta=parseTitle(data);
  artistName.textContent=meta.artist;
  songTitle.textContent=meta.title;
  updateMarquee();
 }catch(e){ updateMarquee(); }
}
updateMeta(); setInterval(updateMeta,25000); window.addEventListener('resize',updateMarquee);

if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));
