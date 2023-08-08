const inputFileSelect = document.getElementById("input-file-select")
const imageCanvas = document.getElementById("image-canvas")
const canvasContext = imageCanvas.getContext("2d");

inputFileSelect.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener("load", function () {
        const imageElement = document.createElement("img")
        imageElement.src = fileReader.result
        imageElement.addEventListener("load", function (event) {
            canvasContext.canvas.width = imageElement.width;
            canvasContext.canvas.height = imageElement.height;
            canvasContext.drawImage(imageElement, 0, 0);
        })
    })
    fileReader.readAsDataURL(file);
});

const improveImageButton = document.getElementById("improve-image-button");
improveImageButton.addEventListener("click", function() {
    const imageData = canvasContext.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const histogram = analyzePixels(imageData.data, imageCanvas.width, imageCanvas.height);
    const minMaxByColor = {
        red: [findMinimumColorValue(histogram.red), findMaximumColorValue(histogram.red)],
        green: [findMinimumColorValue(histogram.green), findMaximumColorValue(histogram.green)],
        blue: [findMinimumColorValue(histogram.blue), findMaximumColorValue(histogram.blue)],
    }
});

function analyzePixels(pixels, width, height) {
    const colorArrays = [(new Array(255)).fill(0), (new Array(255)).fill(0), (new Array(255)).fill(0)];

    for (let widthIndex = 0; widthIndex < width; widthIndex++) {
        for (let heightIndex = 0; heightIndex < height; heightIndex++) {
            for (let colorIndex = 0; colorIndex < 4; colorIndex++) {
                const index = colorIndex + widthIndex * 4 + heightIndex * width * 4;

                let colorArray = colorArrays[colorIndex];

                if (colorArray !== undefined) {
                    const colorValue = pixels[index];
                    colorArray[colorValue] += 1;
                }
            }
        }
    }

    return {
        red: colorArrays[0],
        green: colorArrays[1],
        blue: colorArrays[2],
    };
}

function findMinimumColorValue(colorArray) {
    return colorArray.findIndex(colorValue => colorValue > 0);
}

function findMaximumColorValue(colorArray) {
    return colorArray.findLastIndex(colorValue => colorValue > 0);
}

function mapValue(originMin, originMax, value, targetMin, targetMax) {
    const intervalLengthStretchfactor = (targetMax - targetMin) / (originMax - originMin)
    return targetMin + (value - originMin) * intervalLengthStretchfactor;
}