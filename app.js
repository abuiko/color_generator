function init() {
    // generate colors on click of generate button
    const generateBtn = document.querySelector(".generate-btn");
    generateBtn.addEventListener("click", randomColors);

    // open library button
    const libraryBtn = document.querySelector(".library-btn");
    libraryBtn.addEventListener("click", openLibrary);

    // close library button
    const closeLibraryBtn = document.querySelector(".close-library");
    closeLibraryBtn.addEventListener("click", closeLibrary);

    // save button
    const saveBtn = document.querySelector(".save");
    saveBtn.addEventListener('click', openSave);

    // close save container
    const closeSaveBtn = document.querySelector('.close-save');
    closeSaveBtn.addEventListener('click', closeSave);

    // save palette button
    const submitSave = document.querySelector(".submit-save");
    submitSave.addEventListener("click", savePalette);

    // remove copy notification on transition end
    const copyNote = document.querySelector(".copy-container");
    const copyPopup = copyNote.querySelector(".copy-popup");
    copyNote.addEventListener('transitionend', () => {
        copyPopup.classList.remove("active");
        copyNote.classList.remove("active");
    });

    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener("input", hslControls);
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


function openSave() {
    const saveContainer = document.querySelector('.save-container');
    const savePopup = document.querySelector('.save-popup');
    saveContainer.classList.add('active');
    savePopup.classList.add('active');
}

function closeSave() {
    const saveContainer = document.querySelector('.save-container');
    const savePopup = document.querySelector('.save-popup');
    saveContainer.classList.remove('active');
    savePopup.classList.remove('active');

}

function generateHex() {
    const colorHex = chroma.random();
    return colorHex;
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

// change bgcolor when change input color
function hslControls(e) {

    const slider = e.target.parentElement;

    const bright = slider.querySelector('.bright-input');
    const hue = slider.querySelector('.hue-input');
    const sat = slider.querySelector('.sat-input');

    let bgColor = slider.parentElement.style.backgroundColor;

    let color = chroma(bgColor)
        .set("hsl.s", sat.value)
        .set("hsl.l", bright.value)
        .set("hsl.h", hue.value);

    slider.parentElement.style.backgroundColor = color;

    colorizeSliders(color, hue, bright, sat);

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

// check the contrast
function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if (luminance < 0.5) {
        text.style.color = "#fff";
    } else {
        text.style.color = "#000";
    }
}

let savedPalettes = [];

function savePalette() {

    const saveContainer = document.querySelector(".save-container");
    const savePopup = document.querySelector('.save-popup');
    const saveInput = document.querySelector(".save-container input");


    saveContainer.classList.remove("active");
    savePopup.classList.remove("active");
    const name = saveInput.value;
    const colors = [];
    const currentHexes = document.querySelectorAll('.hex-line');
    currentHexes.forEach(hex => {
        colors.push(hex.innerText);
    });

    // generate object
    let paletteNumber = savedPalettes.length;
    const paletteObj = {
        name,
        colors,
        number: paletteNumber
    };
    savedPalettes.push(paletteObj);

    // save to local storage
    saveToLocal(paletteObj);
    saveInput.value = "";

    createPalette(paletteObj, paletteObj.name, paletteObj.number);



    // // select button functionality
    // selectBtn.addEventListener("click", e => {
    //     closeLibrary();
    //     const paletteIndex = e.target.classList[1];
    //     // initialColors = [];
    //     savedPalettes[paletteIndex].colors.forEach((color, index) => {
    //         // initialColors.push(color);
    //         const colorDivs = document.querySelectorAll('.color');
    //         colorDivs[index].style.backgroundColor = color;
    //         const text = colorDivs[index].children[0];
    //         checkTextContrast(color, text);
    //         // updateTextUI(index);
    //     });
    //     // resetInputs();
    // });

    // // delete button functionality
    // deleteBtn.addEventListener('click', e => {
    //     closeLibrary();
    // })
}

function saveToLocal(paletteObj) {
    let localPalettes;

    //check if there are palettes in local storage
    if (localStorage.getItem("palettes") === null) {
        localPalettes = [];
    } else {
        localPalettes = JSON.parse(localStorage.getItem("palettes"));
    }
    localPalettes.push(paletteObj);
    localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function createPalette(obj, paletteName, number) {
    // generate palette for library
    const palette = document.createElement("div");
    palette.classList.add("custom-palette");
    const title = document.createElement("h4");
    title.innerText = paletteName;
    const preview = document.createElement("div");
    preview.classList.add("small-preview");

    obj.colors.forEach(smallColor => {
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
    });

    // choose selected area btn
    const selectBtn = document.createElement("div");
    selectBtn.classList.add("pick-palette-btn");
    selectBtn.classList.add(number);
    const selectIcon = document.createElement('i');
    selectIcon.classList.add('fas');
    selectIcon.classList.add('fa-check');
    selectBtn.appendChild(selectIcon);

    // delete selected palette btn

    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('delete-palette-btn');
    const deleteIcon = document.createElement('i');
    deleteBtn.classList.add('far');
    deleteBtn.classList.add('fa-trash-alt');
    deleteBtn.appendChild(deleteIcon);

    // append to library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(selectBtn);
    palette.appendChild(deleteBtn);
    const libraryPopup = document.querySelector('.library-popup');
    libraryPopup.appendChild(palette);

    selectColors(selectBtn);
    deleteColors(deleteBtn);
}

function selectColors(button) {
    button.addEventListener("click", e => {
        closeLibrary();
        // const paletteIndex = e.target.classList[1];

        // // initialColors = [];
        // savedPalettes[paletteIndex].colors.forEach((color, index) => {
        //     // initialColors.push(color);
        //     const colorDivs = document.querySelectorAll('.color');
        //     colorDivs[index].style.backgroundColor = color;
        //     const text = colorDivs[index].children[0];
        //     checkTextContrast(color, text);
        //     // updateTextUI(index);
        // });
        // resetInputs();
    });
}

function deleteColors(button) {
    button.addEventListener('click', e => {
        closeLibrary();
    })
}


function getLocal() {
    if (localStorage.getItem("palettes") === null) {
        localPalette = [];
    } else {
        const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
        paletteObjects.forEach(paletteObj => {
            createPalette(paletteObj, paletteObj.name, paletteObj.number);


            // // select button functionality
            // selectBtn.addEventListener("click", e => {
            //     closeLibrary();
            //     const paletteIndex = e.target.classList[1];

            //     // initialColors = [];
            //     paletteObjects[paletteIndex].colors.forEach((color, index) => {
            //         // initialColors.push(color);
            //         const colorDivs = document.querySelectorAll('.color');
            //         colorDivs[index].style.backgroundColor = color;
            //         const text = colorDivs[index].children[0];
            //         checkTextContrast(color, text);
            //         // updateTextUI(index);
            //     });
            //     // resetInputs();
            // });

            //     // delete button functionality
            //     deleteBtn.addEventListener('click', e => {
            //         closeLibrary();
            //     })

            // });
        })
    }

}


// function resetInputs() {
//     const colorDivs = document.querySelectorAll('.color');
//     colorDivs.forEach((div, i) => {
//         const color = initialColors[i],
//             hueValue = chroma(color).hsl()[0],
//             satValue = chroma(color).hsl()[1],
//             brightValue = chroma(color).hsl()[2];
//         sliders[0 + 3 * i].value = Math.floor(hueValue);
//         sliders[1 + 3 * i].value = Math.floor(brightValue * 100) / 100;
//         sliders[2 + 3 * i].value = Math.floor(satValue * 100) / 100;
//     });
// }



// function updateTextUI(index) {
//     const activeDiv = colorDivs[index];
//     const color = chroma(activeDiv.style.backgroundColor);
//     const textHex = activeDiv.querySelector("h2");
//     const icons = activeDiv.querySelectorAll(".controls button");
//     textHex.innerText = color.hex();
//     //   check contrast
//     checkTextContrast(color, textHex);
//     for (icon of icons) {
//       checkTextContrast(color, icon);
//     }
//   }

getLocal();

init();

randomColors();