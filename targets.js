import { init_pointer } from './pointer/pointer.js';

var canvasTgt = document.getElementById('myTgt');
var ctxTgt = canvasTgt.getContext('2d');


var targetArray = []; // x, y, a (a = active = 0/1)
var reDraw = false;
var circDiamMin = 5;
var circDiam;

window.sellectionExp = 3;


var nga = { l: 50, r: 50, t: 100, b: 50 }; // No - go margins
var goa = { x: 0, y: 0, w: 0, h: 0 }; // Go - Area





function drawTargets() {
    goa.x = nga.l;
    goa.y = nga.t;
    goa.w = canvasWidth - nga.l - nga.r;
    goa.h = canvasHeight - nga.t - nga.b;
    ctxTgt.clearRect(0, 0, canvasWidth, canvasHeight);
    ctxTgt.beginPath();
    ctxTgt.globalAlpha = 0.5; // Show no-go areas fade
    ctxTgt.fillStyle = 'black';
    ctxTgt.fillRect(0, 0, canvasWidth, canvasHeight);
    ctxTgt.globalAlpha = 1;

    ctxTgt.clearRect(goa.x, goa.y, goa.w, goa.h); // Clear go area

    (!reDraw) && makeTargetsArray(); // don't create array if redrawing

    for (var i = 0; i < targetArray.length; i++) {
        var target = targetArray[i];
        for (var j = 0; j < target.length; j++) {

            circDiam = (goa.h / targetArray.length / 4) < circDiamMin ? 1 : (goa.h / targetArray.length / 4) // Calculate adaptive diameter of target
            target[j].a && drawTarget(target[j].x, target[j].y);   //  only drwa if a = 1
        }
    }
    initialisePointer();
}


function setSelectionExp(size) {
    sellectionExp = size;
}
function initialisePointer() {
    init_pointer({ pointerColor: "#fff", ringSize: circDiam * sellectionExp, ringClickSize: circDiam * sellectionExp });
}


function makeTargetsArray() { // makes array of target coordinates
    var vTargets = Math.floor((goa.h - circDiamMin) / step) + 1;
    var hTargets = Math.floor((goa.w - circDiamMin) / step) + 1;
    for (let i = 0; i < vTargets; i++) {
        targetArray[i] = [];
        for (let j = 0; j < hTargets; j += 1) {
            targetArray[i][j] = { y: goa.y + circDiamMin + step * i, x: goa.x + circDiamMin + step * j, a: 1 };
        }
    }
}

function drawTarget(x, y) { // raws a terget
    const arc1 = new Path2D();
    const arc2 = new Path2D();
    arc1.arc(x, y, circDiam, 0, 2 * Math.PI);    // circle
    arc2.arc(x, y, 2, 0, 2 * Math.PI);                              // dot
    ctxTgt.beginPath();
    ctxTgt.lineWidth = 2;
    ctxTgt.strokeStyle = 'white';
    //ctxTgt.arc(x, y, d < circDiamMin ? 0 : circDiamMin, 0, 2 * Math.PI);
    ctxTgt.stroke(arc1);

    ctxTgt.beginPath();
    ctxTgt.globalAlpha = 1;
    //ctxTgt.arc(x, y, 1, 0, 2 * Math.PI);
    ctxTgt.fillStyle = 'red';
    ctxTgt.fill(arc2);
    //console.log(d / 3 < 3 ? 3 : d / 3);
}

function checkMouseOnTarget(click) { // x,y is the point to test. cx, cy is circle center, and radius is circle radius
    for (var i = 0; i < targetArray.length; i++) {
        var target = targetArray[i];
        for (var j = 0; j < target.length; j++) {
            var distance = Math.sqrt((click.x - target[j].x) * (click.x - target[j].x) + (click.y - target[j].y) * (click.y - target[j].y));
            if (distance < (circDiam + 1) * sellectionExp) {
                targetArray[i][j].a = 0;   // set a (active) to 0
                //console.log(targetArray[i][j]);
            }
        }
    }
    // now that the matrix of targets have been updated with inactive objects (a=0), redraw the targets (only active (a=1))
    updateTargets();
}


function updateTargets() {
    reDraw = true;
    drawTargets();
}

export { drawTargets, checkMouseOnTarget, initialisePointer, setSelectionExp, targetArray };

// UI to set no go areas
// UI to select step size
// UI to unselect makeTargetsArray