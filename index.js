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