const yearLine = document.getElementById("year-line");
if (yearLine) {
  yearLine.textContent = `© ${new Date().getFullYear()}`;
}

const discordCta = document.querySelector(".discord-cta");
const bikeField = document.querySelector(".bike-field");
const bikeCounter = document.getElementById("bike-counter");
const BASE_BIKE_COUNT = document.querySelectorAll(".bicycle").length;
const MAX_BIKES = 67;
let bikeCount = BASE_BIKE_COUNT;
const activeBikes = [];

function updateBikeCounter() {
  bikeCounter.textContent = `Number of trips: ${bikeCount}`;
}

function addBike() {
  if (bikeCount >= MAX_BIKES) return;

  const rect = discordCta.getBoundingClientRect();
  const centerX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
  const centerY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

  const rx = 15 + Math.random() * 45;
  const ry = 15 + Math.random() * 45;
  const duration = 3 + Math.random() * 9;
  const size = 0.7 + Math.random() * 5;

  const track = document.createElement("span");
  track.className = "orbit-track";
  track.style.offsetPath = `ellipse(${rx}% ${ry}% at ${centerX}% ${centerY}%)`;
  track.style.animationDuration = `${duration}s`;
  track.style.animationDelay = `-${Math.random() * duration}s`;

  const img = document.createElement("img");
  img.className = "bicycle";
  img.src = "b.png";
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  img.style.setProperty("--bike-w", `${size}rem`);

  track.appendChild(img);
  bikeField.appendChild(track);
  bikeCount++;
  updateBikeCounter();

  const ttl = 5000 + Math.random() * 10000;

  const entry = { track };
  entry.fadeTimeout = setTimeout(() => {
    track.classList.add("fade-out");
    entry.removeTimeout = setTimeout(() => {
      track.remove();
      bikeCount--;
      updateBikeCounter();
      const idx = activeBikes.indexOf(entry);
      if (idx !== -1) activeBikes.splice(idx, 1);
    }, 3000);
  }, ttl);
  activeBikes.push(entry);
}

function resetBikes() {
  activeBikes.forEach((entry) => {
    clearTimeout(entry.fadeTimeout);
    clearTimeout(entry.removeTimeout);
    entry.track.remove();
  });
  activeBikes.length = 0;
  bikeCount = BASE_BIKE_COUNT;
  updateBikeCounter();
}

discordCta.addEventListener("mouseenter", () => {
  addBike();
  addBike();
  addBike();
});

bikeCounter.addEventListener("click", resetBikes);

function alignBaseBikeToButton() {
  const baseTrack = discordCta.querySelector(":scope > .orbit-track");
  const baseBike = baseTrack && baseTrack.querySelector(".bicycle");
  if (!baseTrack || !baseBike) return;

  const w = discordCta.offsetWidth;
  const h = discordCta.offsetHeight;
  const r0 = h / 2;
  const margin = baseBike.offsetHeight / 2 + 3;
  const r = r0 + margin;

  baseTrack.style.offsetPath = `path("M ${r0} ${-margin} L ${w - r0} ${-margin} A ${r} ${r} 0 0 1 ${w - r0} ${h + margin} L ${r0} ${h + margin} A ${r} ${r} 0 0 1 ${r0} ${-margin} Z")`;
}

alignBaseBikeToButton();
window.addEventListener("resize", alignBaseBikeToButton);
