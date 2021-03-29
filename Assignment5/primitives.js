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