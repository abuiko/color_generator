// global variables and selectors
const colors = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");

const lockButton = document.querySelectorAll(".lock");
const sliderContainers = document.querySelectorAll(".sliders");
const adjustButton = document.querySelectorAll(".adjust");
const closeAdjustment = document.querySelectorAll(".close-adjustment");
const currentHexes = document.querySelectorAll(".color h2");
let initialColors;
// event listeners
generateBtn.addEventListener("click", randomColors);
lockButton.forEach((button, index) => {
  button.addEventListener("click", () => {
    addLockClass(button, index);
  });
});
adjustButton.forEach((button, index) => {
  button.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});
closeAdjustment.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
});
// functions

// generate random color
function generateHex() {
  const colorHex = chroma.random();
  return colorHex;
}
// change the lock/unlock icons
function addLockClass(button, index) {
  colors[index].classList.toggle(`locked`);
  lockButton[index].firstChild.classList.toggle(`fa-lock-open`);
  lockButton[index].firstChild.classList.toggle(`fa-lock`);
}

// apply random color/hex to the color div
function randomColors() {
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

// check the contrast
function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance < 0.5) {
    text.style.color = "#fff";
  } else {
    text.style.color = "#000";
  }
}
// Open adjustment panel
function openAdjustmentPanel(index) {
  sliderContainers[index].classList.add("active");
}
// close adjustment panel
function closeAdjustmentPanel(index) {
  sliderContainers[index].classList.remove("active");
}

randomColors();
