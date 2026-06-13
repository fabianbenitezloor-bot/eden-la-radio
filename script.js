const STREAM_URL='https://radio.megahostec.com/listen/eden/stream';
const META_URL='https://radio.megahostec.com/api/nowplaying/eden';
const SITE_URL='https://fabianbenitezloor-bot.github.io/eden-la-radio/';
const SHARE_TEXT='Plataforma cristiana online. “La fe viene por el oír” (Romanos 10:17). Donde Dios habla al corazón. Adoración y esperanza 24/7.';
const PAYPAL_URL='https://paypal.me/FEMediaGroupGA?country.x=US&locale.x=es_XC';

// Programación editable: cambia aquí nombre, conductor y horario.
const schedule=[
 {name:'MAÑANAS DE FE', host:'Edén Radio', start:'06:00', end:'10:00'},
 {name:'ADORACIÓN Y ESPERANZA', host:'Emma Maldonado', start:'10:00', end:'13:00'},
 {name:'WORSHIP', host:'Edén Radio', start:'13:00', end:'14:00'},
 {name:'PALABRA Y MÚSICA', host:'Edén Radio', start:'14:00', end:'18:00'},
 {name:'NOCHES DE ESPERANZA', host:'Edén Radio', start:'18:00', end:'23:59'},
 {name:'ADORACIÓN CONTINUA', host:'Edén Radio', start:'00:00', end:'06:00'}
];

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
['#homeVerseText','#verseText','#desktopVerseText'].forEach(id=>{const el=$(id); if(el) el.textContent='“'+v.text+'”'});
['#homeVerseRef','#verseRef','#desktopVerseRef'].forEach(id=>{const el=$(id); if(el) el.textContent=v.ref});
['#reflection','#desktopReflection'].forEach(id=>{const el=$(id); if(el) el.textContent=v.reflection});

const lang=(navigator.language||'es').toLowerCase().startsWith('en')?'en':'es';
const dict={
 es:{home:'Inicio',word:'Palabra',prayer:'Oración',supportNav:'Apóyanos',shop:'Tienda',social:'Redes',share:'Compartir',playing:'SONANDO',onAir:'Al aire ahora',host:'Conduce',verseTitle:'Palabra del día',shareVerse:'Compartir Palabra',needPrayer:'Peticiones y oración',prayerText:'Comparte tu petición por WhatsApp. En Edén Radio creemos que Dios habla al corazón.',sendPrayer:'Necesito oración',sendTestimony:'Compartir testimonio',supportTitle:'Apoya Edén Radio',supportText:'Tu apoyo nos ayuda a seguir llevando esperanza, adoración y la Palabra de Dios a más personas cada día.',paypal:'Donar con PayPal',coming:'Próximamente',store:'Tienda Edén',storeText:'Camisetas y productos de Edén Radio estarán disponibles pronto.',follow:'Síguenos'},
 en:{home:'Home',word:'Word',prayer:'Prayer',supportNav:'Support',shop:'Shop',social:'Social',share:'Share',playing:'PLAYING',onAir:'On air now',host:'Host',verseTitle:'Verse of the day',shareVerse:'Share Word',needPrayer:'Prayer requests',prayerText:'Share your prayer request by WhatsApp. At Edén Radio we believe God speaks to the heart.',sendPrayer:'I need prayer',sendTestimony:'Share testimony',supportTitle:'Support Edén Radio',supportText:'Your support helps us continue bringing hope, worship and the Word of God to more people every day.',paypal:'Donate with PayPal',coming:'Coming soon',store:'Edén Store',storeText:'T-shirts and Edén Radio products will be available soon.',follow:'Follow us'}
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
   } else { radio.pause(); playBtn.textContent='▶'; }
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
['#shareBtn','#shareSocial','#shareSide'].forEach(id=>$(id)?.addEventListener('click',()=>share()));

async function makeVerseImage(){
 const canvas=document.createElement('canvas'); canvas.width=1080; canvas.height=1080;
 const ctx=canvas.getContext('2d');
 const grad=ctx.createLinearGradient(0,0,1080,1080); grad.addColorStop(0,'#37116e'); grad.addColorStop(.55,'#ef4774'); grad.addColorStop(1,'#ff74ac');
 ctx.fillStyle=grad; ctx.fillRect(0,0,1080,1080);
 ctx.fillStyle='rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(850,210,420,0,Math.PI*2); ctx.fill();
 ctx.fillStyle='#fff'; ctx.font='900 54px system-ui, sans-serif'; ctx.fillText('📖 PALABRA DEL DÍA',80,130);
 ctx.font='900 64px system-ui, sans-serif';
 const lines=wrapText(ctx,'“'+v.text+'”',80,290,920,78,5);
 ctx.font='900 44px system-ui, sans-serif'; ctx.fillText(v.ref,80,310+(lines*78));
 ctx.font='900 56px system-ui, sans-serif'; ctx.fillText('Edén Radio',80,910);
 ctx.font='700 34px system-ui, sans-serif'; ctx.fillText('La fe viene por el oír · Romanos 10:17',80,965);
 return new Promise(resolve=>canvas.toBlob(resolve,'image/png',.95));
}
function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines){
 const words=text.split(' '); let line='', lines=0;
 for(let n=0;n<words.length;n++){
  const test=line+words[n]+' ';
  if(ctx.measureText(test).width>maxWidth && n>0){ ctx.fillText(line.trim(),x,y); line=words[n]+' '; y+=lineHeight; lines++; if(lines>=maxLines){ ctx.fillText(line.trim()+'...',x,y); return lines+1; } }
  else line=test;
 }
 ctx.fillText(line.trim(),x,y); return lines+1;
}
async function shareVerseImage(){
 const url=location.origin.includes('github.io')?SITE_URL:location.href;
 const text=`${v.text} — ${v.ref}\nEdén Radio · La fe viene por el oír`;
 try{
  const blob=await makeVerseImage();
  const file=new File([blob],`eden-palabra-${v.ref.replace(/\s|:/g,'-')}.png`,{type:'image/png'});
  if(navigator.canShare && navigator.canShare({files:[file]})){
   await navigator.share({title:'Palabra del Día | Edén Radio',text,url,files:[file]}); return;
  }
 }catch(e){}
 share(text);
}
['#shareVerse','#shareHomeVerse','#desktopShareVerse'].forEach(id=>$(id)?.addEventListener('click',shareVerseImage));


function minutes(t){const [h,m]=t.split(':').map(Number); return h*60+m;}
function fmt(t){let [h,m]=t.split(':').map(Number); const ap=h>=12?'PM':'AM'; h=h%12||12; return `${h}:${String(m).padStart(2,'0')} ${ap}`;}
function currentProgram(){
 const now=new Date(); const cur=now.getHours()*60+now.getMinutes();
 return schedule.find(p=>cur>=minutes(p.start)&&cur<minutes(p.end)) || schedule[0];
}
function updateProgram(){
 const p=currentProgram();
 $('#programName').textContent=p.name;
 $('#programHost').textContent=p.host;
 $('#programTime').textContent=`${fmt(p.start)} - ${fmt(p.end)}`;
}
updateProgram(); setInterval(updateProgram,60000);

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
