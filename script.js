const STREAM_URL = "https://radio.megahostec.com/listen/eden/stream";
const NOW_PLAYING_URLS = [
  "https://radio.megahostec.com/api/nowplaying/eden",
  "https://radio.megahostec.com/api/nowplaying/1"
];
const $ = id => document.getElementById(id);
const radio = $("radio"), playBtn = $("playBtn"), miniPlay = $("miniPlay"), statusEl = $("status");
const songTitle = $("songTitle"), artistName = $("artistName"), albumArt = $("albumArt"), miniArtist = $("miniArtist"), miniTitle = $("miniTitle");
let deferredPrompt;
const lang = (navigator.language || "es").toLowerCase().startsWith("en") ? "en" : "es";
const isMobile = matchMedia("(max-width: 899px)").matches;
const copy = {
  es:{tagline:"La fe viene por el oír",home:"Inicio",word:"Palabra",pastVerses:"Versículos pasados",donations:"Donaciones",shop:"Tienda",social:"Redes",shareApp:"Compartir app",live:"EN VIVO",install:"Instalar",tapPlay:"Toca play para escuchar",wordToday:"📖 Palabra para hoy",verseOfDay:"Versículo del día",seePast:"Ver versículos pasados",library:"📚 Biblioteca",donationsText:"Pronto podrás apoyar este ministerio. Puedes conectar Cash App, PayPal, Zelle o Stripe cuando tengas la cuenta lista.",shopText:"Espacio reservado para camisetas, gorras y productos de Edén. Luego se puede conectar con Shopify, Square, PayPal o enlaces directos.",soon:"Próximamente",share:"Compartir",paused:"PAUSADO",connecting:"Conectando...",onair:"EN VIVO",secondTap:"iPhone puede pedir una segunda pulsación para iniciar el audio.",unavailable:"Señal no disponible",webHeadline:"Música cristiana para tu día",supportText:"Apoya este ministerio",nowPlaying:"Ahora en vivo"},
  en:{tagline:"Faith comes by hearing",home:"Home",word:"Word",pastVerses:"Past verses",donations:"Donations",shop:"Shop",social:"Social",shareApp:"Share app",live:"LIVE",install:"Install",tapPlay:"Tap play to listen",wordToday:"📖 Word for today",verseOfDay:"Verse of the day",seePast:"See past verses",library:"📚 Library",donationsText:"Soon you will be able to support this ministry. You can connect Cash App, PayPal, Zelle or Stripe when the account is ready.",shopText:"Reserved for Edén shirts, hats and products. Later it can connect to Shopify, Square, PayPal or direct links.",soon:"Coming soon",share:"Share",paused:"PAUSED",connecting:"Connecting...",onair:"LIVE",secondTap:"iPhone may ask you to tap play one more time to start audio.",unavailable:"Signal unavailable",webHeadline:"Christian music for your day",supportText:"Support this ministry",nowPlaying:"Now live"}
}[lang];
document.documentElement.lang = lang;
document.querySelectorAll("[data-i18n]").forEach(el => { const k = el.dataset.i18n; if (copy[k]) el.textContent = copy[k]; });
$("deviceBadge").textContent = isMobile ? "App" : "Web";
window.addEventListener("load", () => setTimeout(() => $("splash")?.classList.add("hide"), 700));
function setStatus(text){ if(statusEl) statusEl.textContent = text; }
function setPlayingUI(isPlaying){
  [playBtn, miniPlay].forEach(btn => { if(!btn) return; btn.classList.toggle("playing", isPlaying); btn.textContent = btn === miniPlay ? (isPlaying ? "❚❚" : "▶") : ""; });
  if(playBtn) playBtn.innerHTML = `<span>${isPlaying ? "❚❚" : "▶"}</span>`;
}
async function togglePlay(){
  try{
    if(!radio.src){ radio.src = STREAM_URL + "?t=" + Date.now(); radio.load(); }
    if(radio.paused){ setStatus(copy.connecting); await radio.play(); setPlayingUI(true); setStatus(copy.onair); }
    else{ radio.pause(); setPlayingUI(false); setStatus(copy.paused); }
  }catch(err){ setPlayingUI(false); setStatus(copy.tapPlay); if(songTitle) songTitle.textContent = copy.secondTap; if(miniTitle) miniTitle.textContent = copy.secondTap; }
}
playBtn?.addEventListener("click", togglePlay); miniPlay?.addEventListener("click", togglePlay);
radio.addEventListener("playing", () => { setPlayingUI(true); setStatus(copy.onair); });
radio.addEventListener("pause", () => { setPlayingUI(false); setStatus(copy.paused); });
radio.addEventListener("waiting", () => setStatus(copy.connecting));
radio.addEventListener("error", () => { setPlayingUI(false); setStatus(copy.unavailable); });
function cleanMeta(artist,title){
  artist = (artist || "").trim(); title = (title || "").trim();
  artist = artist.replace(/^now on air:*/i,"").trim(); title = title.replace(/^now on air:*/i,"").trim();
  if(title.includes(" - ") && (!artist || /now on air/i.test(artist))){ const p = title.split(" - "); artist = p.shift().trim(); title = p.join(" - ").trim(); }
  if(title.includes(" — ") && (!artist || artist === "Edén")){ const p = title.split(" — "); title = p.shift().trim(); artist = p.join(" — ").trim(); }
  return {artist: artist || "Edén", title: title || "Música cristiana 24/7"};
}
function setTrack(meta, art){
  artistName.textContent = meta.artist; songTitle.textContent = meta.title; miniArtist.textContent = meta.artist; miniTitle.textContent = meta.title;
  if(art && !/megahostec|azuracast|default|logo/i.test(art)){ albumArt.innerHTML = `<img src="${art}" alt="Album art">`; }
  else{ albumArt.innerHTML = '<img src="assets/logo.png" alt="Edén">'; }
}
async function updateNowPlaying(){
  for(const url of NOW_PLAYING_URLS){
    try{
      const res = await fetch(url,{cache:"no-store"}); if(!res.ok) continue;
      const data = await res.json(); const np = data.now_playing || data; const song = np.song || {};
      const meta = cleanMeta(song.artist || np.artist, song.title || np.title || np.text);
      const art = song.art || song.custom_fields?.art || np.art;
      setTrack(meta, art); return;
    }catch(e){}
  }
  setTrack({artist:"Edén", title:"Música cristiana 24/7"}, "assets/logo.png");
}
updateNowPlaying(); setInterval(updateNowPlaying, 30000);
const verses = [
 {date:"Mar 9 2026",ref:"Marcos 12:30",text:"Amarás al Señor tu Dios con todo tu corazón, y con toda tu alma, y con toda tu mente y con todas tus fuerzas.",reflection:"Que todo lo que hagas hoy nazca del amor a Dios."},
 {date:"Mar 10 2026",ref:"Romanos 10:17",text:"La fe viene por el oír, y el oír, por la palabra de Dios.",reflection:"Deja que la Palabra levante tu ánimo y dirija tu día."},
 {date:"Mar 11 2026",ref:"Mateo 6:33",text:"Mas buscad primeramente el reino de Dios y su justicia.",reflection:"Pon a Dios primero; lo demás encuentra su lugar."},
 {date:"Mar 12 2026",ref:"Filipenses 4:13",text:"Todo lo puedo en Cristo que me fortalece.",reflection:"Tu fuerza no nace del cansancio, nace de Cristo."},
 {date:"Mar 13 2026",ref:"Salmos 23:1",text:"Jehová es mi pastor; nada me faltará.",reflection:"Dios sabe cuidar lo que tú no puedes controlar."},
 {date:"Mar 14 2026",ref:"Josué 1:9",text:"Mira que te mando que te esfuerces y seas valiente.",reflection:"Avanza con fe. No caminas solo."},
 {date:"Mar 15 2026",ref:"Salmos 56:3",text:"En el día que temo, yo en ti confío.",reflection:"La confianza en Dios es paz en medio del ruido."}
];
const today = verses[Math.floor(Date.now()/86400000) % verses.length];
function fillToday(v){ $("verseText").textContent = '“' + v.text + '”'; $("verseRef").textContent = v.ref; $("reflection").textContent = v.reflection; $("quickVerse").textContent = v.ref; }
fillToday(today);
const verseList = $("verseList"), verseDetail = $("verseDetail");
function showVerse(i){ const v=verses[i]; verseDetail.innerHTML = `<h3>${v.date}</h3><blockquote>“${v.text}”</blockquote><p class="verse-ref">${v.ref}</p><p class="reflection">${v.reflection}</p>`; }
verses.forEach((v,i)=>{ const b=document.createElement("button"); b.className="verse-item"; b.innerHTML=`${v.date}<span>${v.ref}</span>`; b.onclick=()=>showVerse(i); verseList.appendChild(b); }); showVerse(0);
function go(page){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  $("page-"+page)?.classList.add("active");
  document.querySelectorAll(".nav-btn,.desk-link").forEach(b => b.classList.toggle("active", b.dataset.page === page));
}
document.querySelectorAll("[data-page]").forEach(el => el.addEventListener("click", () => go(el.dataset.page)));
async function shareApp(){ const shareData={title:"Edén La Radio",text:copy.tagline + ". Música cristiana 24/7.",url:location.href}; if(navigator.share){ await navigator.share(shareData); } else { await navigator.clipboard.writeText(location.href); alert(lang === "es" ? "Link copiado" : "Link copied"); } }
["shareBtn","shareBtn2","shareBtn3"].forEach(id => $(id)?.addEventListener("click", shareApp));
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; if($("installBtn")) $("installBtn").hidden = false; });
$("installBtn")?.addEventListener("click", async()=>{ if(!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $("installBtn").hidden = true; });
if("serviceWorker" in navigator){ window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js")); }
