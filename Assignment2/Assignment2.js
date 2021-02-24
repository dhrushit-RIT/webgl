
const canvasHeight = 500;
const canvasWeight = 500;

/**
 * 
 * @param {number} x1 x co-ordinate of one end point
 * @param {number} y1 y co-ordinate of one end point
 * @param {number} x2 x co-ordinate of second end point
 * @param {number} y2 y co-ordinate of second end point
 */
function myLine(x1, y1, x2, y2) {

    if (x2 < x1 || (x2 == x1 && y2 < y1)) {
        myLine(x2, y2, x1, y1);
    }

    let dx = x2 - x1;
    let dy = y2 - y1;
    let delE = 2 * dy;
    let delNE = 2 * (dy - dx);
    let d = delE - dx;

    let x = x1;
    let y = y1;

    let slopeIsPositive = dx * dy > 0;
    let slopeIsZero = dy == 0;
    let slopeIsInfinite = dx == 0;

    if (dx != 0) {
        for (; x <= x2; x++) {
            point(x, y);

            if (slopeIsZero) {
                d += delE;
            } else if (slopeIsPositive) {

                if ((d <= 0)) {
                    d += delE;
                } else {
                    y++;
                    d += delNE;
                }
            } else {
                if ((d <= 0)) {
                    y--;
                    d += delNE;
                } else {
                    d += delE;
                }
            }
        }
    } else {
        for (; y <= y2; y++) {
            point(x, y);
        }
    }
}

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
function myTriangle(x0, y0, x1, y1, x2, y2) {
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

    addEdgesToTable(edgeTable, x0, y0, x1, y1, x2, y2);
    fillTriangle(edgeTable);
}

function fillTriangle(edgeTable) {
    let activeList = new ActiveList(edgeTable);
    // let tempActiveList = new ActiveList(edgeTable);
    let currentScanHeight = activeList.getActiveIndex() - 1;

    while (currentScanHeight < canvasHeight - 1) {
        currentScanHeight++;
        activeList.addEdgeTableEntriesFromIndex(currentScanHeight);
        activeList.clearCompletedEdges(currentScanHeight);
        activeList.printList();
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

function addEdgesToTable(edgeTable, x0, y0, x1, y1, x2, y2) {
    edgeTable.addEdgeFromVertices(x0, y0, x1, y1);
    edgeTable.addEdgeFromVertices(x1, y1, x2, y2);
    edgeTable.addEdgeFromVertices(x2, y2, x0, y0);
}



/**
 * ------------------------------------------------------------------------------------------
 * ET.js
 * ------------------------------------------------------------------------------------------
 */

class ETEntry {
    constructor(Ymax, x, direction, dx, dy, sum, link) {
        this.Ymax = Ymax;
        this.x = x;
        this.direction = direction;
        this.dx = dx;
        this.dy = dy;
        this.sum = sum;
        this.link = link;
        this.isHorizontal = dy == 0;
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

    addEdgeTableEntriesFromIndex(currentScanHeight){
        // add new edges from edge table

        let listToAdd = this.edgeTable.getList(currentScanHeight);
        if (listToAdd != null) {
            let itter = listToAdd;
            while (itter != null){
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
        let endEdge = this.list.link;
        if (startEdge == null) {
            return; // if all the edges are taken care of, return
        }

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

            point(column, currentScanHeight);
            column++;
        }
    }

    printList() {
        let ittr = this.list;
        console.log("Active List:" + this.activeIndex);

        while (ittr != null) {
            ittr.printEntry();
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
    addEdgeFromVertices(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;

        let initialX = y1 < y2 ? x1 : x2;

        let sign = ((dx >= 0 && dy >= 0) || (dx < 0 && dy < 0) ? 1 : -1);
        let edge = new ETEntry(max(y1, y2), initialX, sign, abs(dx), abs(dy), 0, null);

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

// --------------------------------------------------------------------------
//
// Do not edit below this lne
//
// --------------------------------------------------------------------------

let doMine = true;
let scene = 1;

function setup() {
    createCanvas(canvasHeight, canvasWeight);
    backgroundColor = color(150, 150, 150);
    background(backgroundColor);
}

function draw() {
    fill(0, 0, 0);
    if (doMine) text("my solution", 20, 475);
    else text("reference", 20, 475);

    if (scene == 1) doLines();
    if (scene == 2) doHouse();
}

function doHouse() {
    if (!doMine) {
        fill(255, 0, 0);
        stroke(255, 0, 0);
        triangle(200, 300, 300, 200, 200, 200);
        triangle(300, 300, 300, 200, 200, 300);
        fill(0, 0, 255);
        stroke(0, 0, 255);
        triangle(200, 200, 300, 200, 250, 150);
        stroke(0, 255, 0);
        fill(0, 255, 0);
        triangle(250, 300, 275, 300, 250, 250);
        triangle(275, 300, 275, 250, 250, 250);
    }
    else {
        fill(128, 0, 0);
        stroke(128, 0, 0);
        // myTriangle(300, 400, 400, 100, 50, 50);
        myTriangle(200, 300, 300, 200, 200, 200);
        myTriangle(300, 300, 300, 200, 200, 300);
        fill(0, 0, 128);
        stroke(0, 0, 128);
        myTriangle(200, 200, 300, 200, 250, 150);
        stroke(0, 128, 0);
        fill(0, 128, 0);
        myTriangle(250, 300, 275, 300, 250, 250);
        myTriangle(275, 300, 275, 250, 250, 250);
    }
}

function doLines() {
    if (!doMine) {
        stroke(255, 255, 255);
        line(50, 250, 450, 250);
        line(250, 50, 250, 450);
        line(50, 450, 450, 50);
        line(50, 50, 450, 450);
    }
    else {
        stroke(0, 0, 0);
        myLine(50, 250, 450, 250);
        myLine(250, 50, 250, 450);
        myLine(50, 450, 450, 50);
        myLine(50, 50, 450, 450);
    }
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

    if (key == 'm') {
        background(backgroundColor);
        doMine = !doMine;
    }

}