var ctxBkg = document.getElementById('myBkg').getContext('2d');

var img = new Image();
img.src = './wall.webp'

function drawBackground(width, height) {
    

    // Draw square
    ctxBkg.beginPath();
    ctxBkg.fillStyle = 'red';
    ctxBkg.fillRect(50, 50, 100, 200);
    ctxBkg.closePath();
    ctxBkg.drawImage(img, 0, 0, 50, 50);
}

export { drawBackground };