// class Vertex {
//   x;
//   y;
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//   }
// }

// class Triangle {

//   constructor(x0, y0,
//     x1, y1,
//     x2, y2) {
//     this.v1 = new Vertex(x0, y0);
//     this.v2 = new Vertex(x1, y1);
//     this.v3 = new Vertex(x2, y2);
//   }
// }

function myColorTriangle(
  x0, y0, r0, g0, b0,
  x1, y1, r1, g1, b1,
  x2, y2, r2, g2, b2) {
  // insert your code here to draw a triangle with vertices (x0, y0),
  // (x1, y1) and (x2, y2) with colors (r0, g0, b0), (r1, g1, b1) and
  // (r2, g2, b2) attached to each vertex respectively.
  //
  // Your implementation should interpolate the colors accross the triangle.
  //
  // Only use calls to the function drawColorPoint() which is below the do not edit line
  // This function has the following signature

  // your code should be an extension of the myTrangle function from Assignment 2.

  myTriangle(x0, y0, x1, y1, x2, y2,
    r0, g0, b0,
    r1, g1, b1,
    r2, g2, b2);
}


let theeta = Math.PI / 2;
let theeta2 = -Math.PI / 2;

var dTheeta =  Math.PI / 2 / 100;
var dTheeta2 = - Math.PI / 2/100;

function transformTheHouse() {
  // return a matrix that has all of the transformations of the highest level you reached in the
  // transformation game of last week's online assignment
  //
  // setup();
  // start with the identity matrix
  var retval = new Matrix2D();

  // Add your transformations here....remember you must preMultiply
  // Also recall, in Processing +y is down (in transformation game +y is up)
  // in processing: +rotation is clockwise (and in radians)....
  // in transformation game +rotation is counter-clockwise (and in degrees).
  //
  //         | ax  ay  tx |
  //         | bx  by  ty |
  //         | 0    0   1 |
  //
  // sample move x = 100
  // retval.translate(100, 0);
  // set the scale values
  // retval.ax = 2;
  // retval.by = 2;

  // return the result

  // the matrices of the lvl 15 are as follows:

  let m1 = [[1, 0, 0], [0, 1, 50], [0, 0, 1]];

  let cos45 = Math.cos(Math.PI / 4);
  let sin45 = Math.sin(Math.PI / 4);
  let m2 = [[cos45, -sin45, 0], [sin45, cos45, 0], [0, 0, 1]];

  theeta -= dTheeta;
  if (theeta <= 0 || theeta >= Math.PI/2) {
    dTheeta = -dTheeta;
  }
  let m3 = [[Math.cos(theeta), -1* Math.sin(theeta), 0], [Math.sin(theeta), Math.cos(theeta), 0], [0, 0, 1]];

  let m4 = [[1, 0, 110], [0, 1, 0], [0, 0, 1]];

  let cosm45 = Math.cos(-Math.PI / 4);
  let sinm45 = Math.sin(-Math.PI / 4);
  let m5 = [[cosm45, -sinm45, 0], [sinm45, cosm45, 0], [0, 0, 1]];

  theeta2 -= dTheeta2;
  if (theeta2 <= -Math.PI / 2 || theeta2 >= 0) {
    dTheeta2 = -dTheeta2;
  }
  let m6 = [[Math.cos(theeta2), -1*Math.sin(theeta2), 0], [Math.sin(theeta2), Math.cos(theeta2), 0], [0, 0, 1]];

  let finalMatrix = multiplyMatrices(m6, multiplyMatrices(m5, multiplyMatrices(m4, multiplyMatrices(m3, multiplyMatrices(m2, m1)))));
  retval.ax = finalMatrix[0][0];
  retval.ay = finalMatrix[0][1];
  retval.tx = finalMatrix[0][2];
  retval.bx = finalMatrix[1][0];
  retval.by = finalMatrix[1][1];
  retval.ty = finalMatrix[1][2];
  retval.cx = finalMatrix[2][0];
  retval.cy = finalMatrix[2][1];
  retval.cz = finalMatrix[2][2];
  return retval;
}


function multiplyMatrices(m1, m2) {
  return [
    [
      m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0] + m1[0][2] * m2[2][0],
      m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1] + m1[0][2] * m2[2][1],
      m1[0][0] * m2[0][2] + m1[0][1] * m2[1][2] + m1[0][2] * m2[2][2]
    ],
    [
      m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0] + m1[1][2] * m2[2][0],
      m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1] + m1[1][2] * m2[2][1],
      m1[1][0] * m2[0][2] + m1[1][1] * m2[1][2] + m1[1][2] * m2[2][2]
    ],
    [
      m1[2][0] * m2[0][0] + m1[2][1] * m2[1][0] + m1[2][2] * m2[2][0],
      m1[2][0] * m2[0][1] + m1[2][1] * m2[1][1] + m1[2][2] * m2[2][1],
      m1[2][0] * m2[0][2] + m1[2][1] * m2[1][2] + m1[2][2] * m2[2][2]
    ],
  ];
}

// --------------------------------------------------------------------------------------------
//
//  Do not edit below this lne
//
// --------------------------------------------------------------------------------------------

class Matrix2D {
  //
  //         | ax  ay  tx |
  //         | bx  by  ty |
  //         | cx  cy  cz |
  //

  // identity constructor
  constructor() {
    this.ax = 1;
    this.ay = 0;
    this.bx = 0;
    this.by = 1;
    this.tx = 0;
    this.ty = 0;
    this.cx = 0;
    this.cy = 0;
    this.cz = 1;
  }

  translate(x, y) {
    this.tx += x;
    this.ty += y;
  }

  apply(other) {
    this.ax = other.ax;
    this.ay = other.ay;
    this.bx = other.bx;
    this.by = other.by;
    this.tx += other.tx;
    this.ty += other.ty;
    this.cx = other.cx;
    this.cy = other.cy;
    this.cz = other.cz;
  }

  applyMatrix() {
    applyMatrix(this.ax, this.bx, this.ay, this.by, this.tx, this.ty);
  }

}

var doMine = true;
var scene = 1;
var backgroundColor;

function setup() {
  createCanvas(500, 500);
  backgroundColor = color(150, 150, 150);
  background(backgroundColor);
}

function draw() {
  if (scene == 1) doHouse();
  if (scene == 2) doTriangle();
}

//
// fills in the pixel (x, y) with the color (r,g,b)
//
function drawColorPoint(x, y, r, g, b) {
  stroke(r, g, b);
  point(x, y);
}

function doHouse() {
  var trn = new Matrix2D(1, 2, 3, 4);

  stroke(0, 0, 0);
  line(0, 250, 500, 250);
  line(250, 0, 250, 500);

  trn.translate(250, 250);
  trn.apply(transformTheHouse());
  trn.applyMatrix();

  fill(255, 0, 0);
  stroke(255, 0, 0);
  triangle(-25, 25, 25, -25, -25, -25);
  triangle(25, 25, 25, -25, -25, 25);

  fill(0, 255, 0);
  stroke(0, 255, 0);
  triangle(-25, -25, 25, -25, 0, -50);

  stroke(0, 0, 255);
  fill(0, 0, 255);
  triangle(10, 0, 10, 25, 20, 25);
  triangle(10, 0, 20, 25, 20, 0);
}

function doTriangle() {
  myColorTriangle(300, 400, 0, 0, 255,
    400, 100, 0, 255, 0,
    50, 50, 255, 0, 0);
}

function keyPressed() {
  if (key == '1') {
    background(backgroundColor);
    scene = 1;
  }

  if (key == '2') {
    background(backgroundColor);
    scene = 2;
  }
}



/*

Assignment 2
 */


const canvasHeight = 500;
const canvasWeight = 500;

/**
 * ------------------------------------------------------------------------------------------
 * myTriangle.js
 * ------------------------------------------------------------------------------------------
 */


/**
 * draws the triangle from the co-ordinates
 * @param {number} x0 x co-ordinate for first point of the triangle
 * @param {number} y0 y co-ordinate for first point of the triangle
 * @param {number} x1 x co-ordinate for second point of the triangle
 * @param {number} y1 y co-ordinate for second point of the triangle
 * @param {number} x2 x co-ordinate for third point of the triangle
 * @param {number} y2 y co-ordinate for third point of the triangle
 */
function myTriangle(x0, y0, x1, y1, x2, y2, r0, g0, b0,
  r1, g1, b1,
  r2, g2, b2) {
  /*
      intersection at integer x value
          out -> in : include
      intersection at fractional value
          out -> in : ceil - round up
          in -> out : floor - round down
      intersection at vertex
          is Ymin
              is in to out ? include : exclude
      horizontal edges
          if Ymin then include
  */


  edgeTable = new EdgeTable(canvasHeight);

  addEdgesToTable(edgeTable, x0, y0, x1, y1, x2, y2,
    r0, g0, b0,
    r1, g1, b1,
    r2, g2, b2);
  fillTriangle(edgeTable);
}

function fillTriangle(edgeTable) {
  let activeList = new ActiveList(edgeTable);
  // let tempActiveList = new ActiveList(edgeTable);
  let currentScanHeight = activeList.getActiveIndex() - 1;

  while (currentScanHeight < canvasHeight - 1) {
    currentScanHeight++;
    activeList.clearCompletedEdges(currentScanHeight);
    activeList.addEdgeTableEntriesFromIndex(currentScanHeight);
    // activeList.printList();
    activeList.fillCurrentScanLine(currentScanHeight);
    activeList.updateList(currentScanHeight);

    tempActiveList = activeList.list;
    activeList.list = null;
    let ittr = tempActiveList;
    while (ittr != null) {
      let entry = ittr;
      ittr = ittr.link;
      entry.link = null;
      activeList.addEdge(entry);
    }
  }
}

function addEdgesToTable(edgeTable, x0, y0, x1, y1, x2, y2,
  r0, g0, b0,
  r1, g1, b1,
  r2, g2, b2) {
  edgeTable.addEdgeFromVertices(x0, y0, x1, y1, r0, g0, b0, r1, g1, b1);
  edgeTable.addEdgeFromVertices(x1, y1, x2, y2, r1, g1, b1, r2, g2, b2);
  edgeTable.addEdgeFromVertices(x2, y2, x0, y0, r2, g2, b2, r0, g0, b0);
}



/**
 * ------------------------------------------------------------------------------------------
 * ET.js
 * ------------------------------------------------------------------------------------------
 */

class ETEntry {
  constructor(Ymax, x, direction, dx, dy, sum, link,
    initialR, drx, dry, initialG, dgx, dgy, initialB, dbx, dby) {
    this.Ymax = Ymax;
    this.x = x;
    this.direction = direction;
    this.dx = dx;
    this.dy = dy;
    this.sum = sum;
    this.link = link;
    this.isHorizontal = dy == 0;
    this.initialR = initialR;
    this.drx = drx;
    this.dry = dry;
    this.initialG = initialG;
    this.dgx = dgx;
    this.dgy = dgy;
    this.initialB = initialB;
    this.dbx = dbx;
    this.dby = dby;
    this.red = initialR;
    this.green = initialG;
    this.blue = initialB;
  }

  /**
   * helper function to print the edge entry for debug
   */
  printEntry() {
    console.log(
      "Ymax:", this.Ymax, "|",
      "x:", this.x, "|",
      "direction:", this.direction, "|",
      "dx:", this.dx, "|",
      "dy:", this.dy, "|",
      "sum:", this.sum, "|",
      "isHorizontal:", this.isHorizontal);
  }

  /**
   * updates the edge entry in the edge table
   * updates the sum, dx, dy and x values
   */
  updateEntry() {
    if (this.dx != 0) {
      this.sum += this.dx;
      while (this.sum >= this.dy) {
        this.x += this.direction;
        this.sum -= this.dy;
      }
      this.red += this.dry;
      this.green += this.dgy;
      this.blue += this.dby;
    }
  }
}

/**
 * Class to handle active list
 */
class ActiveList {
  list = null;
  activeIndex = 0;
  edgeTable = null;

  constructor(edgeTable) {
    this.edgeTable = edgeTable;

    this.activeIndex = 0;
    while (this.activeIndex < canvasHeight) {
      if (this.edgeTable.getList(this.activeIndex) != undefined) {
        this.list = this.edgeTable.getList(this.activeIndex);
        this.edgeTable.edgeList[this.activeIndex] = null;
        break;
      }
      this.activeIndex++;
    }
  }

  /**
   * returns the active list index i.e. the Ymin that is being processed currently from the edge table
   */
  getActiveIndex() {
    return this.activeIndex;
  }

  /**
   * updates the data stored in the edges in active list 
   * @param {number} currentScanHeight window height at which the scan line is being printed currently
   */
  updateList(currentScanHeight) {
    let temp = this.list;
    while (temp != null) {
      if (this.activeIndex <= currentScanHeight) {
        temp.updateEntry(currentScanHeight); // call to update the edge entry
        temp = temp.link;
      }
    }


  }

  addEdgeTableEntriesFromIndex(currentScanHeight) {
    // add new edges from edge table

    let listToAdd = this.edgeTable.getList(currentScanHeight);
    if (listToAdd != null) {
      let itter = listToAdd;
      while (itter != null) {
        let entry = itter;
        itter = itter.link;
        entry.link = null;
        this.addEdge(entry);
      }
      this.edgeTable.edgeList[currentScanHeight] = null;
    }
  }

  /**
   * removes the edge from the active list if the scan line process is completed at Ymax height 
   * this is done since there is no part of the edge to process beyond this point
   * @param {number} currentScanHeight window height at which the scan line is being printed currently
   */
  clearCompletedEdges(currentScanHeight) {
    // if first element needs to be removed
    while (this.list != null && this.list.Ymax == currentScanHeight) {
      let temp = this.list;
      this.list = this.list.link;
      temp.link = null;
    }

    let temp = this.list;
    while (temp != null && temp.link != null) {
      if (temp.link.Ymax == currentScanHeight) {
        let discardThis = temp.link;
        temp.link = discardThis.link;
        discardThis.link = null;
      }
      temp = temp.link;
    }
  }

  /**
   * if the point is at valid position, sets the point to the current color
   * @param {number} currentScanHeight window height at which the scan line is being printed currently
   */
  fillCurrentScanLine(currentScanHeight) {

    if (!this.list) {
      return;
    }
    let column = this.list.x;

    let startEdge = this.list;
    if (startEdge == null) {
      return; // if all the edges are taken care of, return
    }
    let endEdge = this.list.link;

    while (true) {
      if (floor(endEdge.x) <= column) {

        startEdge = endEdge.link;
        if (startEdge == null) {
          return;
        }

        column = startEdge.x;

        endEdge = startEdge.link;
        if (endEdge == null) {
          throw new Error("odd number of edges in a scan line");
        }
      }

      let mf = (column - startEdge.x) / (endEdge.x - startEdge.x);
      let r = startEdge.red + (endEdge.red - startEdge.red) * mf;
      let g = startEdge.green + (endEdge.green - startEdge.green) * mf;
      let b = startEdge.blue + (endEdge.blue - startEdge.blue) * mf;

      drawColorPoint(column, currentScanHeight, r, g, b);
      column++;

    }
  }


  printList() {
    let ittr = this.list;
    console.log("Active List:" + this.activeIndex);

    while (ittr != null) {
      ittr = ittr.link;
      console.log(" --> ");
    }
  }



  /**
   * adds edge to the active list in sorted order
   * @param {ETEntry} etEntry edge to be added to the active list
   */
  addEdge(etEntry) {

    if (this.list == null) {
      this.list = etEntry;
      return;
    }

    let temp = this.list;
    let prev = this.list;

    /**
     * following code makes sure that the edges are added in a sorted fashion
     * it sorts the edges based on the x co-ordinate value
     * for equal x co-ordinate value, sorts by 1/slope value
     */
    while (true) {
      if (temp == null) {
        if (!etEntry.isHorizontal) {
          prev.link = etEntry;
        }
        return;
      }

      if (etEntry.x > temp.x) {
        prev = temp;
        temp = temp.link;
        continue;
      } else if (etEntry.x == temp.x) {
        if (etEntry.dy != 0 && temp.dy != 0) {
          if (etEntry.dx / etEntry.dy > temp.dx / temp.dy) {
            prev = temp;
            temp = temp.link;
            continue;
          } else {
            if (prev == this.list) {
              etEntry.link = this.list;
              this.list = etEntry;
            } else {
              prev.link = etEntry;
              etEntry.link = temp;
            }
            return;
          }
        } else {
          return;
        }
      } else {
        if (prev == this.list) {
          etEntry.link = this.list;
          this.list = etEntry;
        } else {
          prev.link = etEntry;
          etEntry.link = temp;
        }
        return;
      }
    }
  }

}

/**
 * Contains the edge table entries.
 * 
 * Handles operations related to edge table.
 * 
 */
class EdgeTable {
  edgeList = null;

  constructor(windowHeight) {
    this.edgeList = new Array(windowHeight);
  }

  getList(index) {
    return this.edgeList[index];
  }

  /**
   * helper function to create edge from the co-ordinates of two points
   * @param {number} x1 x co-ordinate of the first point
   * @param {number} y1 y co-ordinate of the first point
   * @param {number} x2 x co-ordinate of the second point
   * @param {number} y2 y co-ordinate of the second point
   */
  addEdgeFromVertices(x1, y1, x2, y2, r1, g1, b1, r2, g2, b2) {
    let dx = x2 - x1;
    let dy = y2 - y1;

    let initialX = y1 < y2 ? x1 : x2;

    // handling color changes
    let initialR = y1 < y2 ? r1 : r2;
    let finalR = y1 < y2 ? r2 : r1;
    let drx = dx == 0 ? 0 : (finalR - initialR) / abs(dx);
    let dry = dy == 0 ? 0 : (finalR - initialR) / abs(dy);

    let initialG = y1 < y2 ? g1 : g2;
    let finalG = y1 < y2 ? g2 : g1;
    let dgx = dx == 0 ? 0 : (finalG - initialG) / abs(dx);
    let dgy = dy == 0 ? 0 : (finalG - initialG) / abs(dy);

    let initialB = y1 < y2 ? b1 : b2;
    let finalB = y1 < y2 ? b2 : b1;
    let dbx = dx == 0 ? 0 : (finalB - initialB) / abs(dx);
    let dby = dy == 0 ? 0 : (finalB - initialB) / abs(dy);

    let sign = ((dx >= 0 && dy >= 0) || (dx < 0 && dy < 0) ? 1 : -1);
    let edge = new ETEntry(max(y1, y2), initialX, sign, abs(dx), abs(dy), 0, null,
      initialR, drx, dry, initialG, dgx, dgy, initialB, dbx, dby);

    this.addEdge(edge, min(y1, y2));
  }

  /**
   * helper function to add entry for an edge to the edge table
   * @param {ETEntry} etEntry edge table entry to be added to edge table
   * @param {nuber} Ymin index at which the edge entry should be made to the edge table
   */
  addEdge(etEntry, Ymin) {
    if (etEntry.dy == 0) {
      return;
    }
    let temp = this.edgeList[Ymin];

    if (temp == null) {
      this.edgeList[Ymin] = etEntry;
      return;
    }

    let prev = this.edgeList[Ymin];

    /**
     * following code makes sure that the edges are added in a sorted fashion
     * it sorts the edges based on the x co-ordinate value
     * for equal x co-ordinate value, sorts by 1/slope value
     */
    while (true) {
      if (temp == null) {
        if (!etEntry.isHorizontal) {
          prev.link = etEntry;
        }
        return;
      }

      if (etEntry.x > temp.x) {
        prev = temp;
        temp = temp.link;
        continue;
      } else if (etEntry.x == temp.x) {
        if (etEntry.dy != 0 && temp.dy != 0) {
          if (etEntry.dx / etEntry.dy > temp.dx / temp.dy) {
            prev = temp;
            temp = temp.link;
            continue;
          } else {
            if (prev == this.edgeList[Ymin]) {
              etEntry.link = this.edgeList[Ymin];
              this.edgeList[Ymin] = etEntry;
            } else {
              prev.link = etEntry;
              etEntry.link = temp;
            }
            return;
          }
        } else {
          return;
        }
      } else {
        if (prev == this.edgeList[Ymin]) {
          etEntry.link = this.edgeList[Ymin];
          this.edgeList[Ymin] = etEntry;
        } else {
          prev.link = etEntry;
          etEntry.link = temp;
        }
        return;
      }
    }


  }

  /**
   * helper function to print the edge table for debug
   */
  printTable() {
    let ittr = null;

    console.log(" Edge - Table ");
    for (let index = 0; index < canvasHeight; index++) {
      if (this.edgeList[index] != null) {
        console.log(index + ":")
        ittr = this.edgeList[index];
        while (ittr != null) {
          ittr.printEntry();
          ittr = ittr.link;
          console.log(" --> ");
        }
      }
    }
  }
}
