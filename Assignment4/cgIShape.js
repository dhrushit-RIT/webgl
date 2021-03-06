class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getPoints() {
        return [this.x, this.y, this.z];
    }

    toString() {
        return `{${this.x},${this.y},${this.z}}`
    }
}

/* 
Convention:
    Always the point B is the one about which the halving of the triangle should happen
 */
class MyTriangle {
    constructor(vertices, subdivisions = 0) {
        this.A = vertices[0];
        this.B = vertices[1];
        this.C = vertices[2];
        this.subdivisions = subdivisions;
        this.triangles = [];
    }

    toString() {
        console.log(`A: ${this.A}\nB: ${this.B}\nC: ${this.C}`);
    }

    generateTriangles() {
        if (this.subdivisions == 0) {
            return;
        }

        let pointM = new Point(
            (this.A.x + this.C.x) / 2,
            (this.A.y + this.C.y) / 2,
            (this.A.z + this.C.z) / 2
        );

        this.triangles.push(
            new MyTriangle([
                this.B,
                pointM,
                this.A
            ],
                this.subdivisions - 1
            )
        );

        this.triangles.push(
            new MyTriangle([
                this.C,
                pointM,
                this.B,
            ],
                this.subdivisions - 1
            )
        );

        this.triangles[0].generateTriangles();
        this.triangles[1].generateTriangles();
    }

    getTriangles() {
        if (this.subdivisions <= 0) {
            return [this]
        } else {
            return this.triangles[0].getTriangles()
                .concat(this.triangles[1].getTriangles());
        }
    }

    drawTriangles() {
        if (this.triangles.length == 0) {
            this.generateTriangles();
        }

        let triangles = this.getTriangles();
        for (let triangle of triangles) {
            // console.log(triangle);
            addTriangle(triangle.A.x, triangle.A.y, triangle.A.z, triangle.B.x, triangle.B.y, triangle.B.z, triangle.C.x, triangle.C.y, triangle.C.z);
        }
    }

}

class MyQuad {
    constructor(vertices, subdivisions = 0) {
        this.vertices = vertices;
        this.triangles = [];
        this.subdivisions = subdivisions;
    }

    generateTriangles() {
        this.triangles = [];

        this.triangles.push(
            new MyTriangle([
                this.vertices[0],
                this.vertices[1],
                this.vertices[2]
            ],
                this.subdivisions
            )
        );

        this.triangles.push(
            new MyTriangle([
                this.vertices[2],
                this.vertices[3],
                this.vertices[0],
            ],
                this.subdivisions
            )
        );

        this.triangles[0].generateTriangles();
        this.triangles[1].generateTriangles();

    }

    getTriangles() {
        return this.triangles[0].getTriangles()
            .concat(this.triangles[1].getTriangles());
    }


    drawTriangles() {
        if (this.triangles.length == 0) {
            this.generateTriangles();
        }

        let triangles = this.getTriangles();
        for (let triangle of triangles) {
            // console.log(triangle);
            addTriangle(triangle.A.x, triangle.A.y, triangle.A.z, triangle.B.x, triangle.B.y, triangle.B.z, triangle.C.x, triangle.C.y, triangle.C.z);
        }
    }
}

//
// fill in code that creates the triangles for a cube with dimensions 1x1x1
// on each side (and the origin in the center of the cube). with an equal
// number of subdivisions along each cube face as given by the parameter
//subdivisions
//
function makeCube(subdivisions) {

    // fill in your code here.
    // delete the code below first.

    let initialPoints = {
        A: new Point(-0.5, 0.5, 0.5),
        B: new Point(0.5, 0.5, 0.5),
        C: new Point(0.5, -0.5, 0.5),
        D: new Point(-0.5, -0.5, 0.5),
        E: new Point(-0.5, -0.5, -0.5),
        F: new Point(-0.5, 0.5, -0.5),
        G: new Point(0.5, 0.5, -0.5),
        H: new Point(0.5, -0.5, -0.5),
    };

    let sideADCB = new MyQuad([initialPoints.A, initialPoints.D, initialPoints.C, initialPoints.B], subdivisions);
    let sideBCHG = new MyQuad([initialPoints.B, initialPoints.C, initialPoints.H, initialPoints.G], subdivisions);
    let sideFEDA = new MyQuad([initialPoints.F, initialPoints.E, initialPoints.D, initialPoints.A], subdivisions);
    let sideABGF = new MyQuad([initialPoints.A, initialPoints.B, initialPoints.G, initialPoints.F], subdivisions);
    let sideCDEH = new MyQuad([initialPoints.C, initialPoints.D, initialPoints.E, initialPoints.H], subdivisions);
    let sideEFGH = new MyQuad([initialPoints.G, initialPoints.H, initialPoints.E, initialPoints.F], subdivisions);

    let sides = [
        sideADCB,
        sideBCHG,
        sideEFGH,
        sideCDEH,
        sideABGF,
        sideFEDA,
    ];

    for (let side of sides) {
        side.generateTriangles();
    }

    for (let side of sides) {
        let triangles = side.getTriangles();
        for (let triangle of triangles) {
            addTriangle(triangle.A.x, triangle.A.y, triangle.A.z, triangle.B.x, triangle.B.y, triangle.B.z, triangle.C.x, triangle.C.y, triangle.C.z);
        }
    }
}


//
// fill in code that creates the triangles for a cylinder with diameter 1
// and height of 1 (centered at the origin) with the number of subdivisions
// around the base and top of the cylinder (given by radialdivision) and
// the number of subdivisions along the surface of the cylinder given by
//heightdivision.
//
function makeCylinder(radialdivision, heightdivision) {
    // fill in your code here.

    radialdivision = Math.max(radialdivision, 3);
    heightdivision = Math.max(heightdivision, 1);

    let bottomRadius = 0.5;
    let topRadius = 0.5;
    let bottomCenterPoint = new Point(0, -0.5, 0);
    let topCenterPoint = new Point(0, 0.5, 0);
    let bottomPoints = [new Point(bottomRadius, -0.5, 0)];
    let topPoints = [new Point(topRadius, 0.5, 0)];
    let bottomTriangles = [];
    let topTriangles = [];
    let dTheetaDeg = 360 / radialdivision
    let dTheeta = dTheetaDeg * (Math.PI / 180);
    let theeta = 0;

    for (let division = 0; division < radialdivision; division++) {
        theeta += dTheeta;

        let basePoint = new Point(bottomRadius * Math.cos(theeta), -0.5, bottomRadius * Math.sin(theeta));
        let topPoint = new Point(topRadius * Math.cos(theeta), 0.5, topRadius * Math.sin(theeta));

        bottomPoints.push(basePoint);
        topPoints.push(topPoint);
    }

    for (let division = 0; division < radialdivision; division++) {

        // set up base triangles
        let bottomTriangle = new MyTriangle([
            bottomCenterPoint,
            bottomPoints[(division + 1) % radialdivision],
            bottomPoints[(division)]
        ],
            0
        );
        bottomTriangles.push(bottomTriangle);

        // set up top triangles
        let topTriangle = new MyTriangle([
            topCenterPoint,
            topPoints[(division)],
            topPoints[(division + 1) % radialdivision]
        ],
            0
        );
        topTriangles.push(topTriangle);

        addTriangle(bottomTriangle.A.x, bottomTriangle.A.y, bottomTriangle.A.z, bottomTriangle.B.x, bottomTriangle.B.y, bottomTriangle.B.z, bottomTriangle.C.x, bottomTriangle.C.y, bottomTriangle.C.z);
        addTriangle(topTriangle.A.x, topTriangle.A.y, topTriangle.A.z, topTriangle.B.x, topTriangle.B.y, topTriangle.B.z, topTriangle.C.x, topTriangle.C.y, topTriangle.C.z);


        // set up the sides on the curve
        let side = new MyQuad([
            topPoints[(division)],
            bottomPoints[(division)],
            bottomPoints[(division + 1) % radialdivision],
            topPoints[(division + 1) % radialdivision]
        ], heightdivision);

        side.generateTriangles();
        side.drawTriangles();
    }

}


//
// fill in code that creates the triangles for a cone with diameter 1
// and height of 1 (centered at the origin) with the number of
// subdivisions around the base of the cone (given by radialdivision)
// and the number of subdivisions along the surface of the cone
//given by heightdivision.
//
function makeCone(radialdivision, heightdivision) {
    // fill in your code here.

    radialdivision = Math.max(radialdivision, 3);
    heightdivision = Math.max(heightdivision, 1);

    let topCenterPoint = new Point(0, 0.5, 0);

    let bottomRadius = 0.5;
    let bottomCenterPoint = new Point(0, -0.5, 0);
    let bottomPoints = [new Point(bottomRadius, -0.5, 0)];
    let bottomTriangles = [];
    let dTheetaDeg = 360 / radialdivision
    let dTheeta = dTheetaDeg * (Math.PI / 180);
    let theeta = 0;

    for (let division = 0; division < radialdivision; division++) {
        theeta += dTheeta;

        let basePoint = new Point(bottomRadius * Math.cos(theeta), -0.5, bottomRadius * Math.sin(theeta));

        bottomPoints.push(basePoint);
    }

    for (let division = 0; division < radialdivision; division++) {

        // set up base triangles
        let bottomTriangle = new MyTriangle([
            bottomCenterPoint,
            bottomPoints[(division + 1) % radialdivision],
            bottomPoints[(division)]
        ],
            0
        );
        bottomTriangles.push(bottomTriangle);

        let sideTriangle = new MyTriangle([
            topCenterPoint,
            bottomPoints[(division)],
            bottomPoints[(division + 1) % radialdivision],
        ],
            heightdivision - 1
        );

        sideTriangle.drawTriangles();

        addTriangle(bottomTriangle.A.x, bottomTriangle.A.y, bottomTriangle.A.z, bottomTriangle.B.x, bottomTriangle.B.y, bottomTriangle.B.z, bottomTriangle.C.x, bottomTriangle.C.y, bottomTriangle.C.z);
    }
}

//
// fill in code that creates the triangles for a sphere with diameter 1
// (centered at the origin) with number of slides (longitude) given by
// slices and the number of stacks (lattitude) given by stacks.
// For this function, you will implement the tessellation method based
// on spherical coordinates as described in the video (as opposed to the
//recursive subdivision method).
//
function makeSphere(slices, stacks) {
    // fill in your code here.

    // x = r sin?? cos??
    // y = r sin?? sin??
    // z = r cos??

    stacks = Math.max(3, stacks);
    slices = Math.max(4, slices);

    let r = 0.5;
    let dTheeta = Math.PI / stacks;
    let dPhi = 2 * Math.PI / slices;

    /* 
     *  Surface is counter-clock-wise with respect to the normal. In this case, the Y axis is that normal.
     *  With -ve Y axis, the direction of rotation will reverse.
    */

    for (let phi = 0; phi < Math.PI; phi += dPhi) { // stack level
        for (let theeta = 0; theeta < 2 * Math.PI; theeta += dTheeta) { // in each stack
            let C = new Point(r * Math.sin(phi) * Math.cos(theeta), r * Math.sin(theeta) * Math.sin(phi), r * Math.cos(phi));
            let D = new Point(r * Math.sin(phi) * Math.cos(theeta + dTheeta), r * Math.sin(phi) * Math.sin(theeta + dTheeta), r * Math.cos(phi));
            let A = new Point(r * Math.sin(phi + dPhi) * Math.cos(theeta + dTheeta), r * Math.sin(theeta + dTheeta) * Math.sin(phi + dPhi), r * Math.cos(phi + dPhi));
            let B = new Point(r * Math.sin(phi + dPhi) * Math.cos(theeta), r * Math.sin(theeta) * Math.sin(phi + dPhi), r * Math.cos(phi + dPhi));
            let side;

            side = new MyQuad([A, D, C, B]);

            side.generateTriangles();
            side.drawTriangles();
        }
    }
}


////////////////////////////////////////////////////////////////////
//
//  Do not edit below this line
//
///////////////////////////////////////////////////////////////////

function radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function addTriangle(x0, y0, z0, x1, y1, z1, x2, y2, z2) {


    var nverts = points.length / 4;

    // push first vertex
    points.push(x0); bary.push(1.0);
    points.push(y0); bary.push(0.0);
    points.push(z0); bary.push(0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;

    // push second vertex
    points.push(x1); bary.push(0.0);
    points.push(y1); bary.push(1.0);
    points.push(z1); bary.push(0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++

    // push third vertex
    points.push(x2); bary.push(0.0);
    points.push(y2); bary.push(0.0);
    points.push(z2); bary.push(1.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
}

