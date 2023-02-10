import { drawBackground } from './background.js';

//var ctxBkg = document.getElementById('myBkg').getContext('2d');
var ctxSim = document.getElementById('mySim').getContext('2d');

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
var canvasWidth = 0;
var canvasHeight = 0;

function setupCanvas() {
  canvasWidth = getCookie('canvasWidth')
  if (canvasWidth == null) {
    canvasWidth = 800;
  }
  canvasHeight = getCookie('canvasHeight')
  if (canvasHeight == null) {
    canvasHeight = 600;
  }

  document.getElementById("myBkg").width = canvasWidth;
  document.getElementById("myBkg").height = canvasHeight;
  document.getElementById("mySim").width = canvasWidth;
  document.getElementById("mySim").height = canvasHeight;
  document.getElementById("app").style.width = canvasWidth + 'px';
  document.getElementById("widthID").value = canvasWidth;
  document.getElementById("heightID").value = canvasHeight;
}

setupCanvas();
window.onload = drawBackground(canvasWidth, canvasHeight);

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

drawSim();

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



function drawSim() {
  previous_x = previous_x + 2;
  var framesToGo = x - previous_x - 1;
  if (framesToGo <= 0) {
    cancelAnimationFrame(myReq);
    framesToGo = 0;
    previous_x = x;
    previous_y = y;
    return;
  }
  //console.log(' framesToGo: ' + framesToGo + ' previous_x: ' + previous_x + ' x: ' + x);
  // Clear
  ctxSim.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw L leg
  ctxSim.beginPath();
  ctxSim.lineWidth = lineW;
  ctxSim.strokeStyle = 'yellow';
  ctxSim.moveTo(L.x, L.y);
  ctxSim.lineTo(previous_x, previous_y);
  ctxSim.stroke();
  ctxSim.closePath();

  // Draw R leg
  ctxSim.beginPath();
  ctxSim.lineWidth = lineW;
  ctxSim.strokeStyle = 'yellow';
  ctxSim.moveTo(R.x, R.y);
  ctxSim.lineTo(previous_x, previous_y);
  ctxSim.stroke();
  ctxSim.closePath();

  ctxSim.beginPath();
  ctxSim.lineWidth = lineW;
  ctxSim.strokeStyle = 'yellow';
  ctxSim.fillStyle = "white";
  ctxSim.fillRect(previous_x - S.x / 2, previous_y, S.x, S.y);
  ctxSim.strokeRect(previous_x - S.x / 2, previous_y, S.x, S.y);
  ctxSim.stroke();
  ctxSim.closePath();

  // Draw square
  var solidColor;
  if (Math.abs(previous_x - x) < 1) {
    solidColor = 'white'
  } else {
    solidColor = 'black'
  }

  ctxSim.beginPath();
  ctxSim.lineWidth = lineW;
  ctxSim.strokeStyle = 'yellow';
  ctxSim.fillStyle = solidColor;
  ctxSim.fillRect(previous_x - S.x / 2, previous_y, S.x, S.y);
  ctxSim.strokeRect(previous_x - S.x / 2, previous_y, S.x, S.y);
  ctxSim.stroke();
  ctxSim.closePath();

  myReq = requestAnimationFrame(drawSim);
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
      drawSim();
      // Delay step
      await new Promise(res => setTimeout(res, delay));
      //console.log('itterate')
    }
  }

  running = false;
}

function start() {
  if (running) {
    return;
  } else if (!running) {
    iteratePositions(stepTime);
    drawSim();
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
  document.getElementById("myBkg").width = canvasWidth;
  document.getElementById("myBkg").height = canvasHeight;
  document.getElementById("mySim").width = canvasWidth;
  document.getElementById("mySim").height = canvasHeight;

  // update backround picture
  drawBackground(canvasWidth, canvasHeight);

  //console.log(canvasHeight);

  // Update Right origin X value
  R.x = canvasWidth;
  location.reload();
}

// Get width
var widthInput = document.getElementById("widthID");
widthInput.addEventListener("keypress", function (event) {  // Execute a function when the user presses a key on the keyboard
  if (event.key === "Enter") {    // If the user presses the "Enter" key on the keyboard
    event.preventDefault();       // Cancel the default action, if needed
    document.getElementById("btn_save").click();  // Trigger the button element with a click
  }
});

// Get height
var hightInput = document.getElementById("heightID");
heightID.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("btn_save").click();
  }
});

document.getElementById("btn_start").addEventListener("click", start);
document.getElementById("btn_stop").addEventListener("click", stop);
document.getElementById("btn_save").addEventListener("click", save);
