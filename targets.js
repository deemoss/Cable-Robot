var ctxTgt = document.getElementById('myTgt').getContext('2d');

var targetArray = [];
var circDiam = 5;

var canvasWidth = 0;
var canvasHeight = 0;

var nga = { l: 50, r: 50, t: 100, b: 50 }; // No - go margins
var goa = { x: 0, y: 0, w: 0, h: 0 }; // Go - Area

function drawTargets(width, height, step) {
    canvasWidth = width;
    canvasHeight = height;

    goa.x = nga.l;
    goa.y = nga.t;
    goa.w = canvasWidth - nga.l - nga.r;
    goa.h = canvasHeight - nga.t - nga.b;

    ctxTgt.clearRect(0, 0, canvasWidth, canvasHeight);

    ctxTgt.globalAlpha = 0.5; // Show no-go areas fade
    ctxTgt.fillStyle = 'black';
    ctxTgt.fillRect(0, 0, canvasWidth, canvasHeight);
    ctxTgt.globalAlpha = 1;

    //ctxTgt.clearRect(nga.l, nga.t, canvasWidth - nga.l - nga.r, canvasHeight - nga.t - nga.b) // Clear go area
    ctxTgt.clearRect(goa.x, goa.y, goa.w, goa.h); // Clear go area

    makeTargets(step);

    for (var i = 0; i < targetArray.length; i++) {
        var target = targetArray[i];
        for (var j = 0; j < target.length; j++) {
            //console.log("terget[" + i + "][" + j + "] = " + target[j].y + " " + target[j].x);
            var d = goa.h / targetArray.length / 4 // Calculate adaptive diameter of target
            drawTarget(target[j].x, target[j].y, d);
        }
    }
}

function makeTargets(s) {
    var vTargets = Math.floor((goa.h - circDiam) / s) + 1;
    var hTargets = Math.floor((goa.w - circDiam) / s) + 1;

    for (let i = 0; i < vTargets; i++) {
        targetArray[i] = [];
        for (let j = 0; j < hTargets; j += 1) {
            targetArray[i][j] = { y: goa.y + circDiam + s * i, x: goa.x + circDiam + s * j };
        }
    }
}

function drawTarget(x, y, d) {
    ctxTgt.beginPath();
    ctxTgt.lineWidth = 1;
    ctxTgt.strokeStyle = 'white';
    ctxTgt.arc(x, y, d < circDiam ? 0 : circDiam, 0, 2 * Math.PI);
    ctxTgt.stroke();

    ctxTgt.beginPath();
    ctxTgt.globalAlpha = 1;
    ctxTgt.arc(x, y, 1, 0, 2 * Math.PI);
    ctxTgt.fillStyle = "white";
    ctxTgt.fill();

    console.log(d / 3 < 3 ? 3 : d / 3);

    //ctxTgt.stroke();
}

export { drawTargets, targetArray};


// UI to set no go areas
// UI to select step size
// UI to unselect makeTargets