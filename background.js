var ctxBkg = document.getElementById('myBkg').getContext('2d');

var img = new Image();
img.src = './wall.webp'


var canvasWidth = 0;
var canvasHeight = 0;

function drawBackground(width, height) {
    canvasWidth = width;
    canvasHeight = height;
    ctxBkg.clearRect(0, 0, canvasWidth, canvasHeight);
}

img.onload = function () { // Draw image only after it has been loaded 
    ctxBkg.drawImage(img, 0, 0, canvasWidth, canvasHeight);
};

export { drawBackground };