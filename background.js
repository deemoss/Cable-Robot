var canvasBkg = document.getElementById('myBkg');
var ctxBkg = canvasBkg.getContext('2d');

var img = new Image();

//var canvasWidth;
//var canvasHeight;

img.onload = () => {
    console.log('Image loaded!');
    drawBackground();
    img.onload = null; // stops infinite loop (.src invokes onload)
};

function drawBackground() {
    const recentImageDataUrl = localStorage.getItem("recent-image");

    if (!recentImageDataUrl) {
        console.log('NO image.')
        img.src = './sample-wall.jpeg';
    } else {
        console.log('Shows image')
        img.src = recentImageDataUrl;
    }

    // Calculate canvas height based on window width and image aspect ratio
    //canvasHeight = window.innerWidth;
    canvasHeight = canvasWidth * img.naturalHeight / img.naturalWidth;

    console.log('naturalWidth: ' + img.naturalWidth + ' naturalHeight: ' + img.naturalHeight)

    ctxBkg.clearRect(0, 0, canvasWidth, canvasHeight);
    ctxBkg.drawImage(img, 0, 0, canvasWidth, canvasHeight);
}

export { drawBackground };


// image width is set to natural image size. canvase sizing needs reworking.
// needs refreshing to display uploaded image
// calculate pixels to mm