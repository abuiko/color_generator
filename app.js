function init() {
  const generateBtn = document.querySelector(".generate");
  generateBtn.addEventListener("click", randomColors);

  const colors = document.querySelectorAll(".color");
  colors.forEach((color) => {
    const lockButton = color.querySelector(".lock");
    lockButton.addEventListener("click", () => {
      color.classList.toggle("locked");
      lockButton.firstChild.classList.toggle("fa-lock-open");
      lockButton.firstChild.classList.toggle("fa-lock");
    });

    const sliderContainer = color.querySelector(".sliders");
    const closeAdjust = sliderContainer.querySelector(".close-adjustment");
    closeAdjust.addEventListener("click", () => {
      sliderContainer.classList.remove("active");
    });

    const adjustButton = color.querySelector(".adjust");
    adjustButton.addEventListener("click", () => {
      sliderContainer.classList.add("active");
    });
  });
}

// new code starts ============================================
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");

currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});

popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popup.classList.remove("active");
  popupBox.classList.remove("active");
});

function copyToClipboard(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  const popupBox = popup.children[0];
  popup.classList.add("active");
  popupBox.classList.add("active");
}

// new code ends ===================================================

// apply random color/hex to the color div
function randomColors() {
  const colors = document.querySelectorAll(".color");

  colors.forEach((color, index) => {
    if (color.classList.contains("locked")) {
      return;
    }
    const randomColor = generateHex();
    color.style.backgroundColor = randomColor;

    const hexText = color.querySelector(".hex-line");
    hexText.innerText = randomColor;
    checkTextContrast(randomColor, hexText);
  });
}

function generateHex() {
  const colorHex = chroma.random();
  return colorHex;
}

// check the contrast
function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance < 0.5) {
    text.style.color = "#fff";
  } else {
    text.style.color = "#000";
  }
}

init();

randomColors();
