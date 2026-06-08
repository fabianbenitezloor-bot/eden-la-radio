const STREAM_URL = "https://radio.megahostec.com:8000/stream";
const radio = document.getElementById("radio");
const playBtn = document.getElementById("playBtn");
const statusText = document.getElementById("status");
const nowPlaying = document.getElementById("nowPlaying");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const albumArt = document.getElementById("albumArt");
const splash = document.getElementById("splash");
const menu = document.getElementById("menu");
const installBtn = document.getElementById("installBtn");
let deferredPrompt;
radio.src = STREAM_URL;

window.addEventListener("load", () => setTimeout(() => splash.classList.add("hide"), 1600));

document.getElementById("openMenu").onclick = () => menu.classList.add("open");
document.getElementById("closeMenu").onclick = () => menu.classList.remove("open");

playBtn.addEventListener("click", async () => {
  if (radio.paused) {
    try {
      statusText.textContent = "CARGANDO";
      radio.src = STREAM_URL + "?t=" + Date.now();
      await radio.play();
      playBtn.textContent = "❚❚";
      playBtn.classList.add("playing");
      statusText.textContent = "EN VIVO";
      nowPlaying.textContent = "Señal en vivo";
      updateMetadata();
    } catch (e) {
      statusText.textContent = "SIN SEÑAL";
      nowPlaying.textContent = "Toca play otra vez o revisa el stream.";
    }
  } else {
    radio.pause();
    playBtn.textContent = "▶";
    playBtn.classList.remove("playing");
    statusText.textContent = "PAUSADO";
  }
});


// Metadata: canción y artista en vivo
// Primero intenta leer el status de Icecast del puerto 8000.
// También deja preparadas rutas comunes de AzuraCast por si tu estación tiene API nowplaying.
const METADATA_URLS = [
  "https://radio.megahostec.com:8000/status-json.xsl",
  "https://radio.megahostec.com/api/nowplaying/eden_la_radio",
  "https://radio.megahostec.com/api/nowplaying/eden",
  "https://radio.megahostec.com/api/nowplaying/eden_radio"
];

let lastTrack = "";

function cleanText(value, fallback = "") {
  return String(value || fallback).replace(/\s+/g, " ").trim();
}

function splitTrack(rawTitle) {
  const text = cleanText(rawTitle, "Música cristiana 24/7");
  if (text.includes(" - ")) {
    const [artist, ...titleParts] = text.split(" - ");
    return { artist: cleanText(artist, "Edén La Radio"), title: cleanText(titleParts.join(" - "), text) };
  }
  if (text.includes(" – ")) {
    const [artist, ...titleParts] = text.split(" – ");
    return { artist: cleanText(artist, "Edén La Radio"), title: cleanText(titleParts.join(" – "), text) };
  }
  return { artist: "Edén La Radio", title: text };
}

function readIcecast(data) {
  const source = data?.icestats?.source;
  const current = Array.isArray(source) ? source[0] : source;
  const raw = current?.title || current?.yp_currently_playing || current?.server_name;
  if (!raw) return null;
  return splitTrack(raw);
}

function readAzuraCast(data) {
  const song = data?.now_playing?.song || data?.song_history?.[0]?.song;
  if (!song) return null;
  return {
    artist: cleanText(song.artist, "Edén La Radio"),
    title: cleanText(song.title, "Música cristiana 24/7"),
    art: song.art || data?.station?.art || ""
  };
}

function paintMetadata(track) {
  const title = cleanText(track?.title, "Música cristiana 24/7");
  const artist = cleanText(track?.artist, "Edén La Radio");
  const key = `${artist} - ${title}`;

  songTitle.textContent = title;
  artistName.textContent = artist;
  nowPlaying.textContent = "Señal en vivo";

  if (track?.art && track.art.startsWith("http")) {
    albumArt.innerHTML = `<img src="${track.art}" alt="Portada de ${title}">`;
  } else {
    albumArt.textContent = "♪";
  }

  if (key !== lastTrack) {
    lastTrack = key;
    document.title = `${title} - ${artist} | Edén La Radio`;
  }
}

async function updateMetadata() {
  for (const url of METADATA_URLS) {
    try {
      const response = await fetch(`${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) continue;
      const data = await response.json();
      const track = readAzuraCast(data) || readIcecast(data);
      if (track?.title) {
        paintMetadata(track);
        return;
      }
    } catch (error) {
      // Si una ruta falla por CORS o no existe, probamos la siguiente.
    }
  }

  // Fallback si el servidor todavía no entrega metadata pública.
  songTitle.textContent = "Música cristiana 24/7";
  artistName.textContent = "Edén La Radio";
  nowPlaying.textContent = radio.paused ? "Toca play para escuchar" : "Señal en vivo";
  albumArt.textContent = "♪";
}

updateMetadata();
setInterval(updateMetadata, 15000);

const verses = [
  {t:"Busquen primeramente el reino de Dios y su justicia, y todas estas cosas les serán añadidas.",r:"Mateo 6:33",f:"Pon a Dios primero; lo demás encuentra su lugar."},
  {t:"Todo lo puedo en Cristo que me fortalece.",r:"Filipenses 4:13",f:"La fuerza de hoy no nace de la presión, nace de Cristo."},
  {t:"El Señor es mi pastor; nada me faltará.",r:"Salmos 23:1",f:"Dios no solo guía tu camino, también sostiene tu corazón."},
  {t:"No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios.",r:"Isaías 41:10",f:"No caminas solo. Su presencia va contigo."},
  {t:"Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.",r:"1 Pedro 5:7",f:"Lo que pesa en tu mente, ponlo en las manos de Dios."},
  {t:"Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia.",r:"Proverbios 3:5",f:"Confiar también es descansar cuando no lo entiendes todo."},
  {t:"La fe es por el oír, y el oír, por la palabra de Dios.",r:"Romanos 10:17",f:"La Palabra que escuchas hoy puede levantar tu fe."},
  {t:"Jehová es mi luz y mi salvación; ¿de quién temeré?",r:"Salmos 27:1",f:"Cuando Dios alumbra tu vida, el miedo pierde fuerza."},
  {t:"Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.",r:"Mateo 11:28",f:"Jesús no te pide fingir fuerza; te ofrece descanso."},
  {t:"Porque para Dios no hay nada imposible.",r:"Lucas 1:37",f:"Lo imposible no intimida al Dios que te ama."},
  {t:"Jehová peleará por vosotros, y vosotros estaréis tranquilos.",r:"Éxodo 14:14",f:"Hay batallas que se ganan aprendiendo a confiar."},
  {t:"Encomienda a Jehová tu camino, y confía en él; y él hará.",r:"Salmos 37:5",f:"Entrega el proceso. Dios sabe obrar a tiempo."},
  {t:"Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.",r:"Salmos 118:24",f:"Hoy también tiene propósito en las manos de Dios."},
  {t:"Mas buscad primeramente el reino de Dios y su justicia.",r:"Mateo 6:33",f:"Que tu prioridad marque la dirección de tu día."},
  {t:"Amarás al Señor tu Dios con todo tu corazón, y con toda tu alma, y con toda tu mente y con todas tus fuerzas.",r:"Marcos 12:30",f:"La vida cambia cuando Dios ocupa el centro completo."},
  {t:"El gozo de Jehová es vuestra fuerza.",r:"Nehemías 8:10",f:"Tu fuerza puede renacer donde menos lo esperas: en el gozo de Dios."},
  {t:"Crea en mí, oh Dios, un corazón limpio, y renueva un espíritu recto dentro de mí.",r:"Salmos 51:10",f:"Dios no solo restaura caminos; también renueva corazones."},
  {t:"Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz.",r:"Jeremías 29:11",f:"Dios no improvisa contigo; Él tiene propósito."},
  {t:"Si Dios es por nosotros, ¿quién contra nosotros?",r:"Romanos 8:31",f:"No midas tu vida solo por la oposición, mírala desde el respaldo de Dios."},
  {t:"Mi paz os dejo, mi paz os doy; yo no os la doy como el mundo la da.",r:"Juan 14:27",f:"La paz de Cristo permanece aun cuando todo se mueve."},
  {t:"Lámpara es a mis pies tu palabra, y lumbrera a mi camino.",r:"Salmos 119:105",f:"La Palabra no solo inspira: también dirige."},
  {t:"Clama a mí, y yo te responderé.",r:"Jeremías 33:3",f:"Orar es abrir la puerta a la respuesta de Dios."},
  {t:"Jehová está cerca de los quebrantados de corazón.",r:"Salmos 34:18",f:"Dios no se aleja de tu dolor; se acerca."},
  {t:"Bástate mi gracia; porque mi poder se perfecciona en la debilidad.",r:"2 Corintios 12:9",f:"Tu debilidad puede convertirse en el escenario de Su poder."},
  {t:"Sed firmes y valientes; no temáis ni tengáis miedo.",r:"Deuteronomio 31:6",f:"La valentía cristiana nace de saber que Dios va contigo."},
  {t:"El amor nunca deja de ser.",r:"1 Corintios 13:8",f:"Lo que nace del amor de Dios permanece."},
  {t:"Bienaventurados los de limpio corazón, porque ellos verán a Dios.",r:"Mateo 5:8",f:"La pureza del corazón abre los ojos espirituales."},
  {t:"Gustad, y ved que es bueno Jehová.",r:"Salmos 34:8",f:"La bondad de Dios no solo se explica; se experimenta."},
  {t:"Mas gracias sean dadas a Dios, que nos da la victoria por medio de nuestro Señor Jesucristo.",r:"1 Corintios 15:57",f:"La victoria verdadera tiene nombre: Jesucristo."},
  {t:"Todo lo que hacéis, hacedlo de corazón, como para el Señor.",r:"Colosenses 3:23",f:"Cuando trabajas para Dios, hasta lo ordinario toma valor eterno."}
];
function dayOfYear(d=new Date()){const start=new Date(d.getFullYear(),0,0);return Math.floor((d-start)/86400000)}
const verse = verses[dayOfYear() % verses.length];
document.getElementById("verseText").textContent = `“${verse.t}”`;
document.getElementById("verseRef").textContent = verse.r;
document.getElementById("reflection").textContent = verse.f;

document.getElementById("shareBtn").onclick = async () => {
  const data={title:"Edén La Radio",text:"Escucha Edén La Radio",url:location.href};
  if(navigator.share) await navigator.share(data); else navigator.clipboard.writeText(location.href);
};

window.addEventListener("beforeinstallprompt", e => {e.preventDefault(); deferredPrompt=e; installBtn.hidden=false;});
installBtn.onclick = async () => { if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt=null; installBtn.hidden=true; }};
if("serviceWorker" in navigator){ navigator.serviceWorker.register("service-worker.js").catch(()=>{}); }
