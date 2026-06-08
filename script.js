const radio = {
  name: "Edén La Radio",
  subtitle: "La fe viene por el oír",
  stream: "https://radio.megahostec.com:8000/stream",
  metadataApi: "",
  whatsapp: "https://wa.me/?text=Hola%20Ed%C3%A9n%20La%20Radio%2C%20quiero%20pedir%20una%20canci%C3%B3n"
};

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const volume = document.getElementById("volume");
const statusEl = document.getElementById("status");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const sideMenu = document.getElementById("sideMenu");
const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const moreBtn = document.getElementById("moreBtn");
const requestBtn = document.getElementById("requestBtn");
const favBtn = document.getElementById("favBtn");
const shareBtn = document.getElementById("shareBtn");
const installBtn = document.getElementById("installBtn");

let deferredPrompt = null;
audio.src = radio.stream;
audio.volume = Number(volume.value);

window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("splash").classList.add("hidden"), 1200);
});

async function playRadio() {
  try {
    statusEl.textContent = "CARGANDO";
    await audio.play();
    playBtn.textContent = "❚❚";
    statusEl.textContent = "EN VIVO";
    songTitle.textContent = radio.name;
    artistName.textContent = radio.subtitle;
    document.body.classList.add("playing");
  } catch (error) {
    statusEl.textContent = "SIN SEÑAL";
    document.body.classList.remove("playing");
    console.warn("No se pudo reproducir:", error);
  }
}

function pauseRadio() {
  audio.pause();
  playBtn.textContent = "▶";
  statusEl.textContent = "PAUSADO";
  document.body.classList.remove("playing");
}

async function fetchMetadata() {
  if (!radio.metadataApi) return;
  try {
    const response = await fetch(radio.metadataApi, { cache: "no-store" });
    const data = await response.json();
    const song = data?.now_playing?.song;
    if (song) {
      songTitle.textContent = song.title || radio.name;
      artistName.textContent = song.artist || radio.subtitle;
      if (song.art) {
        document.getElementById("cover").innerHTML = `<img src="${song.art}" alt="Portada de ${song.title || radio.name}">`;
      }
    }
  } catch (error) {
    console.log("Metadata no disponible", error);
  }
}

playBtn.addEventListener("click", () => audio.paused ? playRadio() : pauseRadio());
volume.addEventListener("input", () => audio.volume = Number(volume.value));

menuBtn.addEventListener("click", () => sideMenu.classList.add("open"));
closeMenu.addEventListener("click", () => sideMenu.classList.remove("open"));
moreBtn.addEventListener("click", () => sideMenu.classList.add("open"));
requestBtn.addEventListener("click", () => window.open(radio.whatsapp, "_blank"));

favBtn.addEventListener("click", () => {
  localStorage.setItem("favoriteStation", "eden-la-radio");
  alert("Edén La Radio guardada como favorita");
});

shareBtn.addEventListener("click", async () => {
  const shareData = {
    title: radio.name,
    text: `Escucha ${radio.name} en vivo`,
    url: location.href
  };
  if (navigator.share) await navigator.share(shareData);
  else navigator.clipboard.writeText(location.href).then(() => alert("Link copiado"));
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
});

installBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  if (!deferredPrompt) return alert("Abre esta web desde Chrome/Android para instalarla como app.");
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
});

setInterval(fetchMetadata, 15000);
fetchMetadata();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch(console.warn);
}
