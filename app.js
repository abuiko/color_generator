function init() {
    // generate colors on click
    const generateBtn = document.querySelector(".generate-btn");
    generateBtn.addEventListener("click", randomColors);

    // open library button
    const libraryBtn = document.querySelector(".library-btn");
    libraryBtn.addEventListener("click", openLibrary);

    // close library button
    const closeLibraryBtn = document.querySelector(".close-library");
    closeLibraryBtn.addEventListener("click", closeLibrary);

    // remove copy notification on transition end
    const copyNote = document.querySelector(".copy-container");
    const copyPopup = copyNote.querySelector(".copy-popup");
    copyNote.addEventListener('transitionend', () => {
        copyPopup.classList.remove("active");
        copyNote.classList.remove("active");
    });

    // loop through color divs
    const colors = document.querySelectorAll(".color");
    colors.forEach((color) => {

        // copy hexes on click
        const currentHex = color.querySelector(".hex-line");
        currentHex.addEventListener("click", () => {
            const el = document.createElement("textarea");
            el.value = currentHex.innerHTML;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);

            //add copy notification box 
            copyPopup.classList.add("active");
            copyNote.classList.add("active");
        });

        // lock/unlock color when click lock button
        const lockButton = color.querySelector(".lock");
        lockButton.addEventListener("click", () => {
            color.classList.toggle("locked");
            const icon = lockButton.querySelector(".fas");
            icon.classList.toggle("fa-lock-open");
            icon.classList.toggle("fa-lock");
        });

        // add adjust popup box when click adjust button
        const adjustButton = color.querySelector(".adjust");
        adjustButton.addEventListener("click", () => {
            sliderContainer.classList.add("active");
        });

        // remove adjust popup box when click close-adjustment button
        const sliderContainer = color.querySelector(".sliders");
        const closeAdjust = sliderContainer.querySelector(".close-adjustment");
        closeAdjust.addEventListener("click", () => {
            sliderContainer.classList.remove("active");
        });




    });
}

function openLibrary() {
    const libraryContainer = document.querySelector(".library-container");
    const popup = libraryContainer.children[0];
    libraryContainer.classList.add("active");
    popup.classList.add("active");
}

function closeLibrary() {
    const libraryContainer = document.querySelector(".library-container");
    const popup = libraryContainer.children[0];
    libraryContainer.classList.remove("active");
    popup.classList.remove("active");
}

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


        const colorDiv = chroma(randomColor);
        const sliders = color.querySelectorAll(".sliders input");
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(colorDiv, hue, brightness, saturation);


    });
}


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