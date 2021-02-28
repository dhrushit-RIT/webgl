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
                this.A,
                pointM,
                this.B
            ],
                this.subdivisions - 1
            )
        );

        this.triangles.push(
            new MyTriangle([
                this.B,
                pointM,
                this.C
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

    radialdivision = 4;
    let centerPoint = new Point(0, 0, 0);
    let basePoints = [new Point(0.5, 0, 0.5)];
    let baseTriangles = [];
    let dTheetaDeg = 360 / radialdivision
    let dTheeta = dTheetaDeg * (Math.PI / 180);
    let theeta = 0;

    for (let division = 0; division < radialdivision; division++) {
        theeta += dTheeta;
        let point = new Point(Math.cos(theeta), 0, Math.sin(theeta));
        basePoints.push(point);
        console.log(theeta, point);
    }

    for (let division = 0; division < radialdivision; division++) {
        let triangle = new MyTriangle([
            centerPoint,
            basePoints[(division)],
            basePoints[(division + 1) % radialdivision]
        ],
            0
        );
        baseTriangles.push(triangle);
        addTriangle(triangle.A.x, triangle.A.y, triangle.A.z, triangle.B.x, triangle.B.y, triangle.B.z, triangle.C.x, triangle.C.y, triangle.C.z);
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

