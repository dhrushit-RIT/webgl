
const myString = "D"
const scalingFactor = 0.5;

const letterHeight = 500 * scalingFactor;
const letterWidth = 400 * scalingFactor; // make sure width is around half of height
const letterSpacing = 10;
const goldenRatio = 1.618

const canvasHeight = 500;
const canvasWidth = 500;

const drawStartX = 150//canvasWidth / 2 - (myString.length / 2) * letterWidth
const drawStartY = 150//canvasHeight / 2 - letterHeight / 2

const widthByFour = letterWidth * 0.25
const widthThreeFourth = letterWidth * 0.75



function draw_D_triangle() {

  // normalised points to draw D with triangles
  let triangles = [
    [0, 0, 0.25, 0.25, 0.75, 0],
    [0.25, 0.25, 0.75, 0.25, 0.75, 0],
    [0.75, 0, 0.75, 0.25, 1, 0.25],
    [1, 0.25, 0.75, 0.25, 0.75, 0.75],
    [1, 0.25, 1, 0.75, 0.75, 0.75],
    [1, 0.75, 0.75, 1, 0.75, 0.75],
    [0.75, 0.75, 0.75, 1, 0.25, 0.75],
    [0.75, 1, 0.25, 0.75, 0, 1],
    [0, 1, 0.25, 0.25, 0.25, 0.75],
    [0, 1, 0, 0, 0.25, 0.25]
  ];



  for (let t of triangles) {
    triangle(
      drawStartX + t[0] * letterWidth,
      drawStartY + t[1] * letterHeight,
      drawStartX + t[2] * letterWidth,
      drawStartY + t[3] * letterHeight,
      drawStartX + t[4] * letterWidth,
      drawStartY + t[5] * letterHeight
    );
  }
}

function draw_D_line(startX, startY) {

  // normalised points to draw D with lines

  let points = [
    [0, 0, 0.75, 0],
    [0.75, 0, 1, 0.25],
    [1, 0.25, 1, 0.75],
    [1, 0.75, 0.75, 1],
    [0.75, 1, 0, 1],
    [0, 1, 0, 0]
  ];

  for (let p of points) {
    line(drawStartX + p[0] * letterWidth, drawStartY + p[1] * letterHeight, drawStartX + p[2] * letterWidth, drawStartY + p[3] * letterHeight);
  
  }

}

function drawNameWithLines ()
{
// insert your code here to draw the letters of your name 
// using only lines()
  draw_D_line();
}

function drawNameWithTriangles ()
{
// insert your code here to draw the letters of your name 
// using only ltriangles()
  draw_D_triangle();
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
  cnv = createCanvas(500, 500);
  cnv.parent('cnv');
  background(backgroundColor);
  // strokeWeight(10);
}

function draw() {
  backgroundColor = color(150, 150, 150);
  lineColor = color(0, 0, 0);
  fillColor = color(255, 0, 0);

  
  if (doTri) {
    fill(fillColor);
    stroke(fillColor);
  } else {
    fill(backgroundColor);
    stroke(backgroundColor);
  }
  drawNameWithTriangles();
  if (doLine) stroke(lineColor);
  else stroke(backgroundColor);
  drawNameWithLines();

}

function keyPressed() {
  if (key == 'l') doLine = !doLine;
  if (key == 't') doTri = !doTri;
}