var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var img = new Image();
img.src = 'wall.webp';


window.onload = setBackround;

var running = false;

// Left origin top left
var L = {
  x: 0,
  y: 0
};

// Right origin top right
var R = {
  x: c.width,
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

var x = 0;
var y = 0;
var previous_x = x;
var previous_y = y;

// scanner dimentions
var S = {
  x: 20,
  y: 20
};

// Parameters
var lineW = 3

// Canvas
var canWidth = 600;
var canHeight = 300;

document.getElementById("myCanvas").width = canWidth;
document.getElementById("myCanvas").height = canHeight;

document.getElementById("widthID").value = canWidth;
document.getElementById("heightID").value = canHeight;



function setBackround() {
  ctx.drawImage(img, 0, 0, canWidth, canHeight);
}

// Linear Interpolation. Also known as "lerp" or "mix"
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

// Function to draw line of length at angle
function lineAtAngle() {

  // Calculate coords from lengths and angles
  var radians = theta_L * (Math.PI / 180);
  x = Math.cos(radians) * len_L;
  y = Math.sin(radians) * len_L;

  //console.log(x);
}


function draw() {
  // Clear
  ctx.clearRect(0, 0, c.width, c.height);
  setBackround();

  // Interpolate position od P
  previous_x = lerp(previous_x, x, 0.5);
  previous_y = lerp(previous_y, y, 0.5);

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

  // Draw square
  ctx.beginPath();
  ctx.lineWidth = lineW;
  ctx.strokeStyle = 'yellow';
  ctx.fillStyle = "black";
  ctx.fillRect(previous_x - S.x / 2, previous_y, S.x, S.y);
  ctx.strokeRect(previous_x - S.x / 2, previous_y, S.x, S.y);
  ctx.stroke();
  ctx.closePath();

  //console.log(aaa);
  requestAnimationFrame(draw);
}

async function iteratePositions(delay) {


  for (let i = 0; i < 10; i += 1) {
    P.x = 500 - 50 * i;
    P.y = 50;

    // Calculate lengthas from left ancor point (L), right ancor point (R) and the required position point (P)
    len_L = Math.hypot(Math.abs(P.x - L.x), Math.abs(P.y - L.y))
    len_R = Math.hypot(Math.abs(P.x - R.x), Math.abs(P.y - R.y))

    // Calculate angles from left ancor point (L), right ancor point (R) and the required position point (P)
    theta_L = Math.atan2(Math.abs(P.y - L.y), Math.abs(P.x - L.x)) * 180 / Math.PI;
    theta_R = Math.atan2(Math.abs(P.y - R.y), Math.abs(P.x - R.x)) * 180 / Math.PI;

    lineAtAngle();

    await new Promise(res => setTimeout(res, delay));
  }
  running = false;
}


function start() {

  if (running) {
    return;
  } else if (!running) {

    iteratePositions(1000);
    draw();
    running = true;
  }
}

function stop() {
  //location.reload();
}

function save() {

  if (running) {
    return;
  }
  // save values
  canWidth = document.getElementById("widthID").value;
  canHeight = document.getElementById("heightID").value;
  // set canvas size
  document.getElementById("myCanvas").width = canWidth;
  document.getElementById("myCanvas").height = canHeight;

  // update backround picture
  setBackround();

  // Update Right origin X value
  R.x = canWidth;
}

