/* ── Nav: mobile menu toggle ─────────────────────────── */
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const aboutDropdown = document.querySelector(".nav-dropdown");
const aboutDropdownToggle = document.querySelector(".nav-dropdown-toggle");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  mainNav.classList.toggle("open", !isOpen);
});

aboutDropdownToggle.addEventListener("click", () => {
  const isOpen = aboutDropdownToggle.getAttribute("aria-expanded") === "true";
  aboutDropdownToggle.setAttribute("aria-expanded", String(!isOpen));
  aboutDropdown.classList.toggle("open", !isOpen);
});

function closeMobileMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  mainNav.classList.remove("open");
  aboutDropdownToggle.setAttribute("aria-expanded", "false");
  aboutDropdown.classList.remove("open");
}

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && aboutDropdownToggle.getAttribute("aria-expanded") === "true") {
    aboutDropdownToggle.setAttribute("aria-expanded", "false");
    aboutDropdown.classList.remove("open");
    aboutDropdownToggle.focus();
  }
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMobileMenu();
    menuToggle.focus();
  }
});

/* ── Sticky header on scroll ─────────────────────────── */
const siteHeader = document.querySelector(".site-header");
function updateHeader() {
  siteHeader.classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* ── Scroll reveal (Intersection Observer) ───────────── */
// Tag elements we want to animate
const revealSelectors = [
  ".section-heading",
  ".service-card",
  ".fieldwork-card",
  ".values-grid > div",
  ".content-card",
  ".content-list li",
  ".director-card",
  ".profile-card",
  ".impact-list > div",
  ".about-story-image",
  ".content-intro > p",
  ".content-intro > h2",
  ".sector-image-card",
  ".service-image-card",
  ".intro-grid > div",
  ".experience-strip",
  ".impact-copy",
  ".subpage-hero-content",
];

revealSelectors.forEach((sel) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add("reveal");
    // Stagger siblings inside grid parents
    const delay = Math.min(i % 5, 4);
    if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ── Impact stat section highlight ───────────────────── */
const impactList = document.querySelector(".impact-list");
if (impactList) {
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          impactList.classList.add("in-view");
          statObserver.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  statObserver.observe(impactList);
}

/* ── Team profile toggle ─────────────────────────────── */
document.querySelectorAll(".profile-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".profile-card");
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    card.classList.toggle("open", !isOpen);
    button.childNodes[0].textContent = isOpen ? "Read profile " : "Close profile ";
  });
});

/* ── Team carousel ───────────────────────────────────── */
const teamTrack = document.querySelector(".team-grid");

if (teamTrack) {
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
}

/* ── Footer nav links (injected dynamically) ─────────── */
const footerDivs = document.querySelectorAll("footer .footer-grid > div:first-child");
footerDivs.forEach((div) => {
  const nav = document.createElement("nav");
  nav.className = "footer-nav";
  nav.setAttribute("aria-label", "Footer navigation");
  nav.innerHTML = `
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="services.html">Services</a>
    <a href="team.html">Team</a>
    <a href="clientele.html">Clientele</a>
  `;
  div.appendChild(nav);
});

/* ── Copyright year ──────────────────────────────────── */
document.getElementById("year").textContent = new Date().getFullYear();
