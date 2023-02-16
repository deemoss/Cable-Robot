import { drawBackground } from './background.js';
import { drawTargets, checkMouseOnTarget, initialisePointer, setSelectionExp, targetArray } from './targets.js';



//var ctxBkg = document.getElementById('myBkg').getContext('2d');
var canvasSim = document.getElementById('mySim');
var ctxSim = canvasSim.getContext('2d');


var myReq;
drawTargets
var stepTime = 1000;
window.step = 0;

var moveToSCanRatio = 0.5;
var running = false;
var quit = false;
window.canvasWidth = window.innerWidth;
window.canvasHeight = window.innerHeight;

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

function setupCanvases() {
  //canvasWidth = getCookie('canvasWidth') == null ? 800 : getCookie('canvasWidth');
  step = getCookie("stepSize") == null ? 50 : getCookie("stepSize");
  document.getElementById("myBkg").width = canvasWidth;
  document.getElementById("myBkg").height = canvasHeight;
  document.getElementById("myTgt").width = canvasWidth;
  document.getElementById("myTgt").height = canvasHeight;
  document.getElementById("mySim").width = canvasWidth;
  document.getElementById("mySim").height = canvasHeight;
  document.getElementById("app").style.width = canvasWidth + 'px';
  document.getElementById("widthID").value = canvasWidth;
  document.getElementById("heightID").value = canvasHeight;
  document.getElementById("stepID").value = step;
}



window.onload = drawBackground();
setupCanvases();
drawTargets();

var L = { x: 0, y: 0 };           // Left origin top left
var R = { x: canvasWidth, y: 0 }; // Right origin top right
var P = { x: 0, y: 0 };           // Given position coordinates
var len_L = 0; // Left length
var len_R = 0; // Right length
var theta_L = 0; // Left angle
var theta_R = 0; // Right angle
var x = canvasWidth / 2;
var y = canvasHeight / 2;
var previous_x = x;
var previous_y = y;
var S = { x: 20, y: 20 }; // scanner dimentions
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

  ctxSim.clearRect(0, 0, canvasWidth, canvasHeight);

  ctxSim.beginPath();   // Draw L leg
  ctxSim.lineWidth = lineW;
  ctxSim.strokeStyle = 'yellow';
  ctxSim.moveTo(L.x, L.y);
  ctxSim.lineTo(previous_x, previous_y);
  ctxSim.stroke();
  ctxSim.closePath();

  ctxSim.beginPath();   // Draw R leg
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
  ctxSim.fillRect(previous_x - S.x / 2, previous_y - S.y / 2, S.x, S.y);
  ctxSim.strokeRect(previous_x - S.x / 2, previous_y - S.y / 2, S.x, S.y);
  ctxSim.stroke();
  ctxSim.closePath();

  myReq = requestAnimationFrame(drawSim);
}

async function iteratePositions(delay) {

  for (var i = 0; i < targetArray.length; i++) {
    var target = targetArray[i];
    for (var j = 0; j < target.length; j++) {
      if (!quit) { // Skip and exit if stopp button pressed
        if (P.x = target[j].a == 1) { // only do this if target point is active
          P.x = target[j].x;
          P.y = target[j].y;

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
      } else {
        //Quit
        return;
      }
    }
  }

  running = false;
}

function start() {
  if (running) {
    return;
  } else if (!running) {
    running = true;
    quit = false;
    iteratePositions(stepTime);
    //myReq = requestAnimationFrame(draw);
  }
}

function stop() {
  quit = true;
  running = false;
}

function save() {
  if (running) {
    return;
  }
  // save values
  step = document.getElementById("stepID").value;
  // Write cookies
  document.cookie = "stepSize=" + step;
  location.reload();
}

function resizeCursor(size) {
  setSelectionExp(size)
  initialisePointer();
}


//document.getElementById("curSize").addEventListener("input", resizeCursor);
document.getElementById("curSize").addEventListener("input", function () {
  resizeCursor(this.value);
});

document.getElementById("btn_start").addEventListener("click", start);
document.getElementById("btn_stop").addEventListener("click", stop);
document.getElementById("btn_save").addEventListener("click", save);


// Get the input field
var input = document.getElementById("stepID");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("btn_save").click();
  }
});


window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
  window.canvasWidth = window.innerWidth;
  window.canvasHeight = window.innerHeight;
  location.reload();
}







// Upload file (image) // https://www.youtube.com/watch?v=8K2ihr3NC40&ab_channel=dcode
document.getElementById("myFileInput").addEventListener("change", function () {

  const reader = new FileReader();
  reader.readAsDataURL(this.files[0]);

  reader.addEventListener("load", () => {
    try {
      // Attempt to store the file in localStorage
      localStorage.setItem("recent-image", reader.result);
      drawBackground();
      location.reload();
      //setupCanvases();
      //drawTargets(20);
    } catch (e) {
      if (e.code === DOMException.QUOTA_EXCEEDED_ERR) {
        // Handle the quota exceeded error
        window.alert("Unable to store file in localStorage. Quota exceeded.");
        console.log('Unable to store file in localStorage. Quota exceeded.');
      } else {
        // Handle other errors
        window.alert("UAn error occurred while trying to store the file in localStorage.");
        console.log('An error occurred while trying to store the file in localStorage.');
      }
    }
  });
});






// DE-SELECT TARGET POINTS
// ..by dragging
var mouseIsDown = false
canvasSim.addEventListener('mousedown', function () { mouseIsDown = true })
canvasSim.addEventListener('mouseup', function () { mouseIsDown = false })
canvasSim.addEventListener("mousemove", function (evt) {
  if (mouseIsDown) {
    var mousePos = getMousePos(canvasSim, evt);
  }
}, false);
// ..by clicking
canvasSim.addEventListener("click", function (evt) {
  var mousePos = getMousePos(canvasSim, evt);
  //console.log(mousePos.x + ',' + mousePos.y);
}, false);
function getMousePos(canvasSim, evt) {
  var rect = canvasSim.getBoundingClientRect();
  var click = {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
  checkMouseOnTarget(click);
};

