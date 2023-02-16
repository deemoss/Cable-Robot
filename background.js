var canvasBkg = document.getElementById('myBkg');
var ctxBkg = canvasBkg.getContext('2d');

var img = new Image();

var canvasWidth;
var canvasHeight;

function drawBackground() {
    const recentImageDataUrl = localStorage.getItem("recent-image");

    if (!recentImageDataUrl) {
        console.log('recentImageDataUrl: ' + recentImageDataUrl + ' Sample image used.')
        img.src = './sample-wall.jpeg'
    } else {
        img.src = recentImageDataUrl;
    }
    canvasWidth = img.naturalWidth;
    canvasHeight = img.naturalHeight;
    console.log('naturalWidth: ' + img.naturalWidth + ' naturalHeight: ' + img.naturalHeight)
    ctxBkg.clearRect(0, 0, canvasWidth, canvasHeight);
    ctxBkg.drawImage(img, 0, 0, canvasWidth, canvasHeight);
}

/*
img.onload = function () { // Draw image only after it has been loaded 
    ctxBkg.drawImage(img, 0, 0, canvasWidth, canvasHeight);
};*/

/*
document.addEventListener("DOMContentLoaded", () => {
    const recentImageDataUrl = localStorage.getItem("recent-image");
    if (recentImageDataUrl) {
        document.getElementById("imgPreview").setAttribute("src", recentImageDataUrl);
    }
})*/



export { drawBackground };


// image width is set to natural image size. canvase sizing needs reworking.
// needs refreshing to display uploaded image
// calculate pixels to mm