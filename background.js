


var canvasBkg = document.getElementById('myBkg');
var ctxBkg = canvasBkg.getContext('2d');


var img = new Image();
//img.src = './wall.webp'

const recentImageDataUrl = localStorage.getItem("recent-image");
if (recentImageDataUrl) {
    //document.getElementById("imgPreview").setAttribute("src", recentImageDataUrl);
    img.src = recentImageDataUrl;
}

var canvasWidth = img.naturalWidth;
var canvasHeight = img.naturalHeight;

console.log('naturalWidth: ' + img.naturalWidth + ' naturalHeight: ' + img.naturalHeight)

function drawBackground(width, height) {
    //canvasWidth = width;
    //canvasHeight = height;
    ctxBkg.clearRect(0, 0, canvasWidth, canvasHeight);
}

img.onload = function () { // Draw image only after it has been loaded 
    ctxBkg.drawImage(img, 0, 0, canvasWidth, canvasHeight);
};

/*
document.addEventListener("DOMContentLoaded", () => {
    const recentImageDataUrl = localStorage.getItem("recent-image");
    if (recentImageDataUrl) {
        document.getElementById("imgPreview").setAttribute("src", recentImageDataUrl);
    }
})*/



export { drawBackground };


// image width is set to natural image size. canvase sizing needs reworking. 