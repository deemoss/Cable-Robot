var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var img = new Image();
img.src = 'wall.webp';

var myReq;
var stepTime = 1000;
var moveToSCanRatio = 0.5; 

// Read coockies
function getCookie(name) {
  var cookieArr = document.cookie.split(";");
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null; // Return null if not found
}

// Canvas read stored dimentions
var canvasWidth;
var canvasHeight;

function setupCanvas() {
  canvasWidth = getCookie('canvasWidth')
  if (canvasWidth == null) {
    canvasWidth = 800;
  }
  canvasHeight = getCookie('canvasHeight')
  if (canvasHeight == null) {
    canvasHeight = 600;
  }
}

setupCanvas();
window.onload = setBackround;

var running = false;

// Left origin top left
var L = {
  x: 0,
  y: 0
};

// Right origin top right
var R = {
  x: canvasWidth,
  y: 0
};

// Given position coordinates
var P = {
  x: 0,
  y: 0
};

// Left and right lengths
var len_L = 0;
var len_R = 0;

// Left and right angles
var theta_L = 0;
var theta_R = 0;

var x = canvasWidth / 2;
var y = canvasHeight / 2;
var previous_x = x;
var previous_y = y;

// scanner dimentions
var S = {
  x: 20,
  y: 20
};



// Parameters
var lineW = 3

document.getElementById("myCanvas").width = canvasWidth;
document.getElementById("myCanvas").height = canvasHeight;
document.getElementById("canv").style.width = canvasWidth + 'px';
document.getElementById("widthID").value = canvasWidth;
document.getElementById("heightID").value = canvasHeight;

draw();

function setBackround() {
  ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
}

// Linear Interpolation. Also known as "lerp" or "mix"
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function easeInOut(t) {
  return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}

// Function to draw line of length at angle
function lineAtAngle() {
  var radians = theta_L * (Math.PI / 180);
  x = Math.cos(radians) * len_L;
  y = Math.sin(radians) * len_L;
}

function draw() {


  // Interpolate position of P
  //previous_x = lerp(previous_x, x, 0.2);
  //previous_y = lerp(previous_y, y, 0.2);
  // Interpolate position of P with easing
  //previous_x = lerp(previous_x, x, easeInOut(0.2));
  //previous_y = lerp(previous_y, y, easeInOut(0.2));


  previous_x = previous_x + 2;
  //previous_y = previous_y + 2;

  framesToGo = x - previous_x -1;


  if (framesToGo <= 0) {
    cancelAnimationFrame(myReq);
    framesToGo = 0;
    previous_x = x;
    previous_y = y;

    return;
  }

  console.log(' framesToGo: ' + framesToGo +' previous_x: ' + previous_x + ' x: ' + x );

  // Clear
  ctx.clearRect(0, 0, c.width, c.height);
  setBackround();


  // Draw L leg
  ctx.beginPath();
  ctx.lineWidth = lineW;
  ctx.strokeStyle = 'yellow';
  ctx.moveTo(L.x, L.y);
  ctx.lineTo(previous_x, previous_y);
  ctx.stroke();
  ctx.closePath();

  // Draw R leg
  ctx.beginPath();
  ctx.lineWidth = lineW;
  ctx.strokeStyle = 'yellow';
  ctx.moveTo(R.x, R.y);
  ctx.lineTo(previous_x, previous_y);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.lineWidth = lineW;
  ctx.strokeStyle = 'yellow';
  ctx.fillStyle = "white";
  ctx.fillRect(previous_x - S.x / 2, previous_y, S.x, S.y);
  ctx.strokeRect(previous_x - S.x / 2, previous_y, S.x, S.y);
  ctx.stroke();
  ctx.closePath();

  // Draw square
  var solidColor;
  if (Math.abs(previous_x - x) < 1) {
    solidColor = 'white'
  } else {
    solidColor = 'black'
  }

  ctx.beginPath();
  ctx.lineWidth = lineW;
  ctx.strokeStyle = 'yellow';
  ctx.fillStyle = solidColor;
  ctx.fillRect(previous_x - S.x / 2, previous_y, S.x, S.y);
  ctx.strokeRect(previous_x - S.x / 2, previous_y, S.x, S.y);
  ctx.stroke();
  ctx.closePath();

  myReq = requestAnimationFrame(draw);
}

async function iteratePositions(delay) {
  for (let j = 1; j < 10; j++) {
    P.y = 0 + canvasHeight / 10 * j;
    for (let i = 1; i < 20; i += 1) {
      P.x = 0 + canvasWidth / 20 * i;

      // Calculate lengthas from left ancor point (L), right ancor point (R) and the required position point (P)
      len_L = Math.hypot(Math.abs(P.x - L.x), Math.abs(P.y - L.y))
      len_R = Math.hypot(Math.abs(P.x - R.x), Math.abs(P.y - R.y))

      // Calculate angles from left ancor point (L), right ancor point (R) and the required position point (P)
      theta_L = Math.atan2(Math.abs(P.y - L.y), Math.abs(P.x - L.x)) * 180 / Math.PI;
      theta_R = Math.atan2(Math.abs(P.y - R.y), Math.abs(P.x - R.x)) * 180 / Math.PI;

      lineAtAngle();
      draw();
      // Delay step
      await new Promise(res => setTimeout(res, delay));
      console.log('itterate')
    }
  }

  running = false;
}

function start() {
  if (running) {
    return;
  } else if (!running) {
    iteratePositions(stepTime);
    //draw();
    //myReq = requestAnimationFrame(draw);

    running = true;
  }
}

function stop() {
  location.reload();
}

function save() {
  if (running) {
    return;
  }
  // save values
  canvasWidth = document.getElementById("widthID").value;
  canvasHeight = document.getElementById("heightID").value;
  // Write cookies
  document.cookie = "canvasWidth=" + canvasWidth;
  document.cookie = "canvasHeight=" + canvasHeight;
  // set canvas size
  document.getElementById("myCanvas").width = canvasWidth;
  document.getElementById("myCanvas").height = canvasHeight;

  // update backround picture
  setBackround();

  //console.log(canvasHeight);

  // Update Right origin X value
  R.x = canvasWidth;
  location.reload();
}

// Get the input field
var widthInput = document.getElementById("widthID");
// Execute a function when the user presses a key on the keyboard
widthInput.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("btn_save").click();
  }
});

var widthInput = document.getElementById("heightID");
heightID.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("btn_save").click();
  }
});
