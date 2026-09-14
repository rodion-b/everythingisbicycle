const yearLine = document.getElementById("year-line");
if (yearLine) {
  yearLine.textContent = `© ${new Date().getFullYear()}`;
}

const discordCta = document.querySelector(".discord-cta");
const baseTrack = discordCta.querySelector(":scope > .orbit-track");
const bikeField = document.querySelector(".bike-field");
const bikeCounter = document.getElementById("bike-counter");
const lapCounter = document.getElementById("lap-counter");
const lapFlag = discordCta.querySelector(".lap-flag");
const lapSuccess = discordCta.querySelector(".lap-success");
const baseBikeImg = baseTrack.querySelector(".bicycle");
const ctaText = discordCta.querySelector(".cta-text");
const BASE_BIKE_COUNT = document.querySelectorAll(".bicycle").length;
const MAX_BIKES = 67;
let bikeCount = BASE_BIKE_COUNT;
let lapCount = 0;
const activeBikes = [];

function updateBikeCounter() {
  if (bikeCounter) bikeCounter.textContent = `Number of trips: ${bikeCount}`;
}

function updateLapCounter() {
  lapCounter.textContent = `Laps: ${lapCount}`;
}

baseTrack.addEventListener("animationiteration", () => {
  lapCount++;
  updateLapCounter();

  if (baseBikeImg) baseBikeImg.classList.toggle("flipped");
  if (ctaText) ctaText.classList.toggle("flipped");

  if (lapSuccess) {
    lapSuccess.animate(
      [
        { opacity: 0, transform: "translate(-50%, -100%) scale(0.5)" },
        { opacity: 1, transform: "translate(-50%, -160%) scale(1.3)", offset: 0.4 },
        { opacity: 0, transform: "translate(-50%, -220%) scale(1)" },
      ],
      { duration: 700, easing: "ease-out" }
    );
  }
});

function addBike(originX, originY) {
  if (bikeCount >= MAX_BIKES) return;

  let originPxX = originX;
  let originPxY = originY;
  if (originPxX === undefined || originPxY === undefined) {
    const rect = discordCta.getBoundingClientRect();
    originPxX = rect.left + rect.width / 2;
    originPxY = rect.top + rect.height / 2;
  }

  const centerX = (originPxX / window.innerWidth) * 100;
  const centerY = (originPxY / window.innerHeight) * 100;

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
  const anim = baseTrack.getAnimations()[0];
  if (anim) anim.playbackRate = 3;
  addBike();
  addBike();
  addBike();
});

discordCta.addEventListener("mouseleave", () => {
  const anim = baseTrack.getAnimations()[0];
  if (anim) anim.playbackRate = 1;
});

if (bikeCounter) bikeCounter.addEventListener("click", resetBikes);

document.addEventListener("click", (event) => {
  addBike(event.clientX, event.clientY);
});

function alignBaseBikeToButton() {
  const baseBike = baseTrack && baseTrack.querySelector(".bicycle");
  if (!baseTrack || !baseBike) return;

  const w = discordCta.offsetWidth;
  const h = discordCta.offsetHeight;
  const r0 = h / 2;
  const margin = baseBike.offsetHeight / 2 + 3;
  const r = r0 + margin;
  const midTop = w / 2;

  baseTrack.style.offsetPath = `path("M ${midTop} ${-margin} L ${w - r0} ${-margin} A ${r} ${r} 0 0 1 ${w - r0} ${h + margin} L ${r0} ${h + margin} A ${r} ${r} 0 0 1 ${r0} ${-margin} L ${midTop} ${-margin}")`;

  if (lapFlag) {
    lapFlag.style.left = `${midTop}px`;
    lapFlag.style.top = "0px";
  }
  if (lapSuccess) {
    const flagHeight = lapFlag ? lapFlag.offsetHeight : 0;
    lapSuccess.style.left = `${midTop}px`;
    lapSuccess.style.top = `${-flagHeight}px`;
  }
}

alignBaseBikeToButton();
window.addEventListener("resize", alignBaseBikeToButton);

function scheduleRandomBike() {
  const delay = 2000 + Math.random() * 6000;
  setTimeout(() => {
    addBike();
    scheduleRandomBike();
  }, delay);
}

scheduleRandomBike();
