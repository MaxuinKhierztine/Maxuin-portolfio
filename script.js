
const screens = Array.from(document.querySelectorAll(".screen"));
const navigationButtons = document.querySelectorAll("[data-go]");
const backButton = document.getElementById("back-button");
const nextButton = document.getElementById("next-button");
const currentPage = document.getElementById("current-page");

let activeIndex = 0;

function showScreen(index) {
  activeIndex = Math.max(0, Math.min(index, screens.length - 1));

  screens.forEach((screen, i) => {
    const isActive = i === activeIndex;

    screen.classList.toggle("active", isActive);
    screen.setAttribute("aria-hidden", String(!isActive));
    screen.inert = !isActive;
  });

  currentPage.textContent = String(activeIndex + 1).padStart(2, "0");
  backButton.disabled = activeIndex === 0;
  nextButton.disabled = activeIndex === screens.length - 1;

  navigationButtons.forEach((button) => {
    const isCurrent = Number(button.dataset.go) === activeIndex;

    button.classList.toggle("active", isCurrent);

    if (isCurrent) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  const activeScreen = screens[activeIndex];

  if (activeScreen) {
    history.replaceState(null, "", `#${activeScreen.id}`);
  }
}

// Navigation menu
navigationButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    showScreen(Number(button.dataset.go));
  });
});

// Back and Next
backButton.addEventListener("click", () => {
  showScreen(activeIndex - 1);
});

nextButton.addEventListener("click", () => {
  showScreen(activeIndex + 1);
});

// Keyboard controls
document.addEventListener("keydown", (event) => {
  const tag = event.target.tagName;

  if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  if (event.key === "ArrowRight") {
    showScreen(activeIndex + 1);
  } else if (event.key === "ArrowLeft") {
    showScreen(activeIndex - 1);
  } else if (event.key === "Home") {
    showScreen(0);
  }
});

// Start at the screen specified in the URL, if available
const initialHash = window.location.hash;
const initialIndex = screens.findIndex(
  (screen) => `#${screen.id}` === initialHash
);

showScreen(initialIndex >= 0 ? initialIndex : 0);

// Typing animation

const typingText = document.getElementById("typing-text");

if (typingText) {
  const phrases = [
    "Learning the logic.",
    "Exploring the unknown."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeCaption() {
    const phrase = phrases[phraseIndex];

    charIndex += deleting ? -1 : 1;
    typingText.textContent = phrase.substring(0, charIndex);

    let delay = deleting ? 45 : 90;

    if (!deleting && charIndex === phrase.length) {
      deleting = true;
      delay = 1500;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    setTimeout(typeCaption, delay);
  }

  typeCaption();
}


   