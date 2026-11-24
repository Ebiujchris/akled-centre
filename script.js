const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  mainNav.classList.toggle("open", !isOpen);
});

function closeMobileMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  mainNav.classList.remove("open");
}

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMobileMenu();
    menuToggle.focus();
  }
});

document.querySelectorAll(".profile-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".profile-card");
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    card.classList.toggle("open", !isOpen);
    button.childNodes[0].textContent = isOpen ? "Read profile " : "Close profile ";
  });
});

const teamTrack = document.querySelector(".team-grid");
const profileCards = Array.from(teamTrack.querySelectorAll(".profile-card"));
const previousProfile = document.querySelector(".carousel-prev");
const nextProfile = document.querySelector(".carousel-next");
const carouselStatus = document.querySelector(".carousel-status");

function getCurrentProfileIndex() {
  const firstCardOffset = profileCards[0].offsetLeft;
  return profileCards.reduce((closest, card, index) => {
    const cardOffset = card.offsetLeft - firstCardOffset;
    const closestOffset = profileCards[closest].offsetLeft - firstCardOffset;
    return Math.abs(cardOffset - teamTrack.scrollLeft) <
      Math.abs(closestOffset - teamTrack.scrollLeft)
      ? index
      : closest;
  }, 0);
}

function updateCarousel() {
  const currentIndex = getCurrentProfileIndex();
  const maxScroll = teamTrack.scrollWidth - teamTrack.clientWidth;

  carouselStatus.textContent = `${currentIndex + 1} / ${profileCards.length}`;
  previousProfile.disabled = teamTrack.scrollLeft <= 0;
  nextProfile.disabled = teamTrack.scrollLeft >= maxScroll - 1;
}

function moveCarousel(direction) {
  const currentIndex = getCurrentProfileIndex();
  const target = profileCards[Math.max(0, Math.min(profileCards.length - 1, currentIndex + direction))];
  const left = target.offsetLeft - profileCards[0].offsetLeft;
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  teamTrack.scrollTo({ left, behavior });
}

previousProfile.addEventListener("click", () => moveCarousel(-1));
nextProfile.addEventListener("click", () => moveCarousel(1));
teamTrack.addEventListener("scroll", updateCarousel, { passive: true });
window.addEventListener("resize", updateCarousel);
updateCarousel();

document.getElementById("year").textContent = new Date().getFullYear();
