const STREAM_URL = "https://radio.megahostec.com:8000/stream";
const METADATA_API = "https://radio.megahostec.com/api/nowplaying/eden_la_radio"; // cámbialo si tu ID de AzuraCast es otro

const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const statusEl = document.getElementById('status');
const favBtn = document.getElementById('favBtn');
const volumeBtn = document.getElementById('volumeBtn');
const volumePanel = document.getElementById('volumePanel');
const volumeSlider = document.getElementById('volumeSlider');
const titleEl = document.getElementById('songTitle');
const artistEl = document.getElementById('artistName');
const coverEl = document.getElementById('coverArt');

audio.src = STREAM_URL;
audio.volume = Number(localStorage.getItem('eden-volume') || .9);
volumeSlider.value = audio.volume;
favBtn.textContent = localStorage.getItem('eden-fav') === 'yes' ? '♥' : '♡';

function setStatus(text){ statusEl.textContent = text; }
function setPlayingUI(isPlaying){
  document.body.classList.toggle('playing', isPlaying);
  playBtn.textContent = isPlaying ? '❚❚' : '▶';
  setStatus(isPlaying ? 'EN VIVO' : 'PAUSADO');
}

playBtn.addEventListener('click', async () => {
  if(audio.paused){
    try{ setStatus('CARGANDO'); await audio.play(); setPlayingUI(true); }
    catch(e){ setStatus('TOCA OTRA VEZ'); }
  } else { audio.pause(); setPlayingUI(false); }
});

audio.addEventListener('waiting', () => setStatus('CARGANDO'));
audio.addEventListener('playing', () => setPlayingUI(true));
audio.addEventListener('pause', () => setPlayingUI(false));
audio.addEventListener('error', () => setStatus('SIN SEÑAL'));

favBtn.addEventListener('click', () => {
  const fav = localStorage.getItem('eden-fav') === 'yes';
  localStorage.setItem('eden-fav', fav ? 'no' : 'yes');
  favBtn.textContent = fav ? '♡' : '♥';
});
volumeBtn.addEventListener('click', () => volumePanel.classList.toggle('show'));
volumeSlider.addEventListener('input', e => {
  audio.volume = Number(e.target.value);
  localStorage.setItem('eden-volume', audio.volume);
});

async function loadMetadata(){
  try{
    const res = await fetch(METADATA_API, {cache:'no-store'});
    if(!res.ok) return;
    const data = await res.json();
    const song = data.now_playing?.song || {};
    titleEl.textContent = song.title || 'Edén La Radio';
    artistEl.textContent = song.artist || 'Música cristiana en vivo';
    if(song.art) coverEl.src = song.art;
  }catch(e){}
}
loadMetadata();
setInterval(loadMetadata, 30000);

const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');
document.getElementById('openMenu').onclick = () => { sideMenu.classList.add('open'); overlay.classList.add('show'); };
document.getElementById('closeMenu').onclick = closeMenu;
overlay.onclick = closeMenu;
function closeMenu(){ sideMenu.classList.remove('open'); overlay.classList.remove('show'); }

document.getElementById('shareBtn').onclick = async () => {
  const shareData = {title:'Edén La Radio', text:'Escucha Edén La Radio', url:location.href};
  if(navigator.share) await navigator.share(shareData);
  else { await navigator.clipboard.writeText(location.href); alert('Enlace copiado'); }
};

setTimeout(()=>document.getElementById('splash').classList.add('hide'), 1800);
if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js').catch(()=>{}); }
