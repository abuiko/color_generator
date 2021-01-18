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
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");

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
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);

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
function openLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
}
function closeLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
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

    // new code starts
    const colorDiv = chroma(randomColor);
    const sliders = color.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(colorDiv, hue, brightness, saturation);

    // new code ends
  });
}

// new code starts
function colorizeSliders(colorDiv, hue, brightness, saturation) {
  // scale saturation
  const noSat = colorDiv.set("hsl.s", 0);
  const fullSat = colorDiv.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, colorDiv, fullSat]);
  //   scale brightness
  const midBright = colorDiv.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  //  update input colors

  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )}, ${scaleSat(1)})`;

  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )}, ${scaleBright(0.5)},${scaleBright(1)})`;

  hue.style.backgroundImage = `linear-gradient(to right, rgb(255, 0, 0), rgb(255,255 ,0),rgb(0, 255, 0),rgb(0, 255, 255),rgb(0,0,255),rgb(255,0,255),rgb(255,0,0))`;
}
// new code ends

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
