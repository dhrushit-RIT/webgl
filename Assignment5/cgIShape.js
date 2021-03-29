// import "./primitives";

class cgIShape {
    constructor() {
        this.points = [];
        this.bary = [];
        this.indices = [];
    }

    addTriangle(x0, y0, z0, x1, y1, z1, x2, y2, z2) {
        var nverts = this.points.length / 4;

        // push first vertex
        this.points.push(x0); this.bary.push(1.0);
        this.points.push(y0); this.bary.push(0.0);
        this.points.push(z0); this.bary.push(0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;

        // push second vertex
        this.points.push(x1); this.bary.push(0.0);
        this.points.push(y1); this.bary.push(1.0);
        this.points.push(z1); this.bary.push(0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++

        // push third vertex
        this.points.push(x2); this.bary.push(0.0);
        this.points.push(y2); this.bary.push(0.0);
        this.points.push(z2); this.bary.push(1.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
    }
}

class Cube extends cgIShape {

    constructor(subdivisions) {
        super();
        this.makeCube(subdivisions);
    }

    makeCube(subdivisions) {

        // fill in your cube code here.

        let normalCubePoints = {
            A: new Point(-0.5, 0.5, 0.5),
            B: new Point(0.5, 0.5, 0.5),
            C: new Point(0.5, -0.5, 0.5),
            D: new Point(-0.5, -0.5, 0.5),
            E: new Point(-0.5, -0.5, -0.5),
            F: new Point(-0.5, 0.5, -0.5),
            G: new Point(0.5, 0.5, -0.5),
            H: new Point(0.5, -0.5, -0.5),
        };

        let sideADCB = new MyQuad([normalCubePoints.A, normalCubePoints.D, normalCubePoints.C, normalCubePoints.B], subdivisions);
        let sideBCHG = new MyQuad([normalCubePoints.B, normalCubePoints.C, normalCubePoints.H, normalCubePoints.G], subdivisions);
        let sideFEDA = new MyQuad([normalCubePoints.F, normalCubePoints.E, normalCubePoints.D, normalCubePoints.A], subdivisions);
        let sideABGF = new MyQuad([normalCubePoints.A, normalCubePoints.B, normalCubePoints.G, normalCubePoints.F], subdivisions);
        let sideCDEH = new MyQuad([normalCubePoints.C, normalCubePoints.D, normalCubePoints.E, normalCubePoints.H], subdivisions);
        let sideEFGH = new MyQuad([normalCubePoints.G, normalCubePoints.H, normalCubePoints.E, normalCubePoints.F], subdivisions);

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
                this.addTriangle(triangle.A.x, triangle.A.y, triangle.A.z, triangle.B.x, triangle.B.y, triangle.B.z, triangle.C.x, triangle.C.y, triangle.C.z);
            }
        }
    }
}


class Cylinder extends cgIShape {

    constructor(radialdivision, heightdivision) {
        super();
        this.makeCylinder(radialdivision, heightdivision);
    }

    makeCylinder(radialdivision, heightdivision) {
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

            this.addTriangle(bottomTriangle.A.x, bottomTriangle.A.y, bottomTriangle.A.z, bottomTriangle.B.x, bottomTriangle.B.y, bottomTriangle.B.z, bottomTriangle.C.x, bottomTriangle.C.y, bottomTriangle.C.z);
            this.addTriangle(topTriangle.A.x, topTriangle.A.y, topTriangle.A.z, topTriangle.B.x, topTriangle.B.y, topTriangle.B.z, topTriangle.C.x, topTriangle.C.y, topTriangle.C.z);


            // set up the sides on the curve
            let A = topPoints[(division)];
            let D = bottomPoints[(division)];
            let C = bottomPoints[(division + 1) % radialdivision];
            let B = topPoints[(division + 1) % radialdivision];

            // let side = new MyQuad([
            //     topPoints[(division)],
            //     bottomPoints[(division)],
            //     bottomPoints[(division + 1) % radialdivision],
            //     topPoints[(division + 1) % radialdivision]
            // ], heightdivision);

            // console.log(side.toString());

            // this.addTriangle(topPoints[(division)].x, topPoints[(division)].y, topPoints[(division)].z, bottomPoints[(division)].x, bottomPoints[(division)].y, bottomPoints[(division)].z, bottomPoints[(division + 1) % radialdivision].x, bottomPoints[(division + 1) % radialdivision].y, bottomPoints[(division + 1) % radialdivision].z);
            this.addTriangle(
                A.x, A.y, A.z,
                B.x, B.y, B.z,
                C.x, C.y, C.z
            );
            this.addTriangle(
                C.x, C.y, C.z,
                D.x, D.y, D.z,
                A.x, A.y, A.z,
            );
            // side.generateTriangles();
            // side.drawTriangles();
            console.log();
        }
    }
}

class Cone extends cgIShape {

    constructor(radialdivision, heightdivision) {
        super();
        this.makeCone(radialdivision, heightdivision);
    }


    makeCone(radialdivision, heightdivision) {

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

            //
            // base
            //
            this.addTriangle(bottomTriangle.A.x, bottomTriangle.A.y, bottomTriangle.A.z, bottomTriangle.B.x, bottomTriangle.B.y, bottomTriangle.B.z, bottomTriangle.C.x, bottomTriangle.C.y, bottomTriangle.C.z);
        }
    }
}

class Sphere extends cgIShape {

    constructor(slices, stacks) {
        super();
        this.makeSphere(slices, stacks);
    }

    makeSphere(slices, stacks) {
        // x = r sinΘ cosΦ
        // y = r sinΘ sinΦ
        // z = r cosΘ

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

}


function radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}



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
        return `{${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}}`
    }
}

/* 
Convention:
    Always the point B is the one about which the halving of the triangle should happen
 */
class MyTriangle extends cgIShape {
    constructor(vertices, subdivisions = 0) {
        super();
        this.A = vertices[0];
        this.B = vertices[2];
        this.C = vertices[1];
        this.subdivisions = subdivisions;
        this.triangles = [];
    }

    toString() {
        return `A: ${this.A}\nB: ${this.B}\nC: ${this.C}`;
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
                this.A,
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

        // // cc
        // this.triangles.push(
        //     new MyTriangle([
        //         this.B,
        //         this.A,
        //         pointM,
        //     ],
        //         this.subdivisions - 1
        //     )
        // );

        // this.triangles.push(
        //     new MyTriangle([
        //         this.C,
        //         this.B,
        //         pointM,
        //     ],
        //         this.subdivisions - 1
        //     )
        // );

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
            this.addTriangle(triangle.A.x, triangle.A.y, triangle.A.z, triangle.B.x, triangle.B.y, triangle.B.z, triangle.C.x, triangle.C.y, triangle.C.z);
        }
    }

}

class MyQuad extends cgIShape {
    constructor(vertices, subdivisions = 0) {
        super();
        this.vertices = vertices;
        this.triangles = [];
        this.subdivisions = subdivisions;
    }

    toString() {
        let str = "{ \n";
        let pointSymbols = ['A', 'B', 'C', 'D'];
        for (let i = 0; i < 4; i++) {
            str += `${pointSymbols[i]} = ${this.vertices[i]}\n`
        }

        str += " \n}"
        return str;
    }

    generateTriangles() {
        this.triangles = [];

        this.triangles.push(
            new MyTriangle([
                this.vertices[0],
                this.vertices[2],
                this.vertices[1],
            ],
                this.subdivisions
            )
        );

        this.triangles.push(
            new MyTriangle([
                this.vertices[2],
                this.vertices[0],
                this.vertices[3],
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
            triangle.drawTriangles();
            // this.addTriangle(triangle.A.x, triangle.A.y, triangle.A.z, triangle.B.x, triangle.B.y, triangle.B.z, triangle.C.x, triangle.C.y, triangle.C.z);
        }
    }
}