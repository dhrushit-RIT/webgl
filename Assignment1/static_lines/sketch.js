// Constants
const myString = "DHRUSHIT" // string to be drawn
const scalingFactor = 0.5; // scales the the drawing to fit in the canvas

const letterHeight = 100 * scalingFactor; 
const letterWidth = 61 * scalingFactor; // make sure width is around half of height
const letterSpacing = 10;
const goldenRatio = 1.618

const canvasHeight = 500;
const canvasWidth = 500;

const drawStartX = canvasWidth / 2 - (myString.length / 2) * letterWidth
const drawStartY = canvasHeight / 2

const widthByFour = letterWidth * 0.25
const widthThreeFourth = letterWidth * 0.75




// drawing code

// draws T relative to startX and startY
function drawT(startX, startY) {
    line(startX, startY, startX + letterWidth, startY);
    line(startX + letterWidth * 0.5, startY, startX + letterWidth * 0.5, startY + letterHeight);
}
// draws T relative to startX and startY

function drawI(startX, startY) {
    line(startX + widthByFour, startY, startX + widthThreeFourth, startY);
    line(startX + widthByFour, startY + letterHeight, startX + widthThreeFourth, startY + letterHeight);
    line(startX + letterWidth * 0.5, startY, startX + letterWidth * 0.5, startY + letterHeight);
}
// draws T relative to startX and startY

function drawS(startX, startY) {
    line(startX, startY + widthByFour, startX, startY + letterHeight / goldenRatio - widthByFour);
    line(startX + letterWidth, startY + letterHeight / goldenRatio + widthByFour, startX + letterWidth, startY + letterHeight - widthByFour);

    line(startX + widthByFour, startY + letterHeight, startX + letterWidth - widthByFour, startY + letterHeight);
    line(startX + widthByFour, startY + letterHeight / goldenRatio, startX + letterWidth - widthByFour, startY + letterHeight / goldenRatio);
    line(startX + widthByFour, startY, startX + letterWidth - widthByFour, startY);

    line(startX, startY + widthByFour, startX + widthByFour, startY);
    line(startX, startY + letterHeight - widthByFour, startX + widthByFour, startY + letterHeight);
    line(startX + letterWidth - widthByFour, startY, startX + letterWidth, startY + widthByFour);
    line(startX + letterWidth - widthByFour, startY + letterHeight, startX + letterWidth, startY + letterHeight - widthByFour);
    line(startX, startY + letterHeight / goldenRatio - widthByFour, startX + widthByFour, startY + letterHeight / goldenRatio);
    line(startX + letterWidth - widthByFour, startY + letterHeight / goldenRatio, startX + letterWidth, startY + letterHeight / goldenRatio + widthByFour);
}
// draws T relative to startX and startY

function drawU(startX, startY) {
    line(startX, startY, startX, startY + letterHeight - widthByFour);
    line(startX + letterWidth, startY, startX + letterWidth, startY + letterHeight - widthByFour);

    line(startX + widthByFour, startY + letterHeight, startX + letterWidth - widthByFour, startY + letterHeight);

    line(startX, startY + letterHeight - widthByFour, startX + widthByFour, startY + letterHeight);
    line(startX + letterWidth, startY + letterHeight - widthByFour, startX + letterWidth - widthByFour, startY + letterHeight);
}
// draws T relative to startX and startY

function drawR(startX, startY) {
    line(startX, startY, startX, startY + letterHeight);
    line(startX, startY, startX + widthThreeFourth, startY);
    line(startX, startY + letterHeight / goldenRatio, startX + widthThreeFourth, startY + letterHeight / goldenRatio);
    line(startX + widthThreeFourth, startY + letterHeight / goldenRatio, startX + letterWidth, startY + letterHeight / goldenRatio - widthByFour);
    line(startX + widthThreeFourth, startY, startX + letterWidth, startY + widthByFour);
    line(startX + letterWidth, startY + widthByFour, startX + letterWidth, startY + letterHeight / goldenRatio - widthByFour);


    line(startX + letterWidth * 0.75, startY + letterHeight / goldenRatio, startX + letterWidth, startY + letterHeight);
}
// draws T relative to startX and startY

function drawH(startX, startY) {
    line(startX, startY, startX, startY + letterHeight);
    line(startX, startY + letterHeight / goldenRatio, startX + letterWidth, startY + letterHeight / goldenRatio);
    line(startX + letterWidth, startY, startX + letterWidth, startY + letterHeight);
}
// draws T relative to startX and startY

function drawD(startX, startY) {
    line(startX, startY, startX, startY + letterHeight);
    line(startX, startY + letterHeight, startX + widthThreeFourth, startY + letterHeight)
    line(startX + widthThreeFourth, startY + letterHeight, startX + letterWidth, (startY + letterHeight - widthByFour))
    line(startX + letterWidth, startY + letterHeight - widthByFour, startX + letterWidth, startY + widthByFour)
    line(startX + letterWidth, startY + widthByFour, startX + widthThreeFourth, startY)
    line(startX + widthThreeFourth, startY, startX, startY)


}

// call appropriate function to draw that character
function drawCharacter(startX, startY, charType) {
    if (charType == 'D' || charType == 'd') {
        drawD(startX, startY);
    } else
        if (charType == 'H' || charType == 'h') {
            drawH(startX, startY);
        } else
            if (charType == 'R' || charType == 'r') {
                drawR(startX, startY);
            } else
                if (charType == 'U' || charType == 'u') {
                    drawU(startX, startY);
                } else
                    if (charType == 'S' || charType == 's') {
                        drawS(startX, startY);
                    } else
                        if (charType == 'I' || charType == 'i') {
                            drawI(startX, startY);
                        } else
                            if (charType == 'T' || charType == 't') {
                                drawT(startX, startY);
                            }
}


function drawNameWithLines() {
    // insert your code here to draw the letters of your name 
    // using only lines()
    let startingX = 100;
    let startingY = 100;
    console.log("myString", myString);

    // push();
    // stroke(255);
    let numCharactersDrawn = 0;
    for (let character of myString) {
        startingX = drawStartX + numCharactersDrawn * (letterWidth + letterSpacing);
        startingY = drawStartY;
        console.log(startingX);
        drawCharacter(startingX, startingY, character);
        numCharactersDrawn++;
    }
    // pop();
}

function drawNameWithTriangles() {
    // insert your code here to draw the letters of your name 
    // using only ltriangles()
    triangle(34, 45, 100, 100, 12, 255);
}

// --------------------------------------------------------------------------------------------
//
// Do not edit below this line
//
// --------------------------------------------------------------------------------------------

doLine = false;
doTri = false;

function setup() {
    backgroundColor = color(150, 150, 150);
    createCanvas(500, 500);
    background(backgroundColor);
}

function draw() {
    backgroundColor = color(150, 150, 150);
    lineColor = color(0, 0, 0);
    fillColor = color(255, 0, 0);

    if (doLine) stroke(lineColor);
    else stroke(backgroundColor);
    drawNameWithLines();

    if (doTri) {
        fill(fillColor);
        stroke(fillColor);
    } else {
        fill(backgroundColor);
        stroke(backgroundColor);
    }
    drawNameWithTriangles();
}

function keyPressed() {
    if (key == 'l') doLine = !doLine;
    if (key == 't') doTri = !doTri;
}