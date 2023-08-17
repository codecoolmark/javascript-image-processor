export function improveImage(imageData) {
    const histogram = analyzePixels(imageData.data, imageData.width, imageData.height);
    const minMaxByColor = {
        red: [findMinimumColorValue(histogram.red), findMaximumColorValue(histogram.red)],
        green: [findMinimumColorValue(histogram.green), findMaximumColorValue(histogram.green)],
        blue: [findMinimumColorValue(histogram.blue), findMaximumColorValue(histogram.blue)],
    }

    const newPixels = mapPixels(imageData.data, imageData.width, imageData.height, minMaxByColor);
    const newImageData = new ImageData(newPixels, imageData.width, imageData.height);
    return newImageData;
}

function analyzePixels(pixels, width, height) {
    const colorArrays = [(new Array(255)).fill(0), (new Array(255)).fill(0), (new Array(255)).fill(0)];

    iteratePixels(pixels, width, height, function(widthIndex, heightIndex, colorIndex, index, colorValue) {
        const colorArray = colorArrays[colorIndex];

        if (colorArray !== undefined) {
            colorArray[colorValue] += 1;
        }
    });

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
    const intervalLengthStretchfactor = (targetMax - targetMin) / (originMax - originMin);
    return targetMin + (value - originMin) * intervalLengthStretchfactor;
}

function mapPixels(pixels, width, height, minMaxByColor) {
    const minMaxByColorIndex = [minMaxByColor.red, minMaxByColor.green, minMaxByColor.blue];

    const newPixels = new Uint8ClampedArray(pixels.length)

    iteratePixels(pixels, width, height, function(widthIndex, heightIndex, colorIndex, index, colorValue) {
        const minMax = minMaxByColorIndex[colorIndex];

        if (minMax !== undefined) {
            const [min, max] = minMax;
            const newColorValue = mapValue(min, max, colorValue, 0, 255);
            newPixels[index] = newColorValue;
        } else {
            newPixels[index] = 255;
        }
    });

    return newPixels
}

function iteratePixels(pixels, width, height, pixelCallback) {
    for (let widthIndex = 0; widthIndex < width; widthIndex++) {
        for (let heightIndex = 0; heightIndex < height; heightIndex++) {
            for (let colorIndex = 0; colorIndex < 4; colorIndex++) {
                const index = colorIndex + widthIndex * 4 + heightIndex * width * 4;
                const colorValue = pixels[index];
                
                pixelCallback(widthIndex, heightIndex, colorIndex, index, colorValue);
            }
        }
    }
}