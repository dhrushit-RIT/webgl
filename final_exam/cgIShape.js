class cgIShape {

    scaleX = 1;
    scaleY = 1;
    scaleZ = 1;

    positionX = 0;
    positionY = 0;
    positionZ = 0;

    modelMatrix = null;

    textureImage = null;
    texture = null;

    constructor() {
        this.points = [];    // 3 floats per vertex
        this.bary = [];      // 3 floats per vertex
        this.indices = [];   // 3 ints per vertex
        this.normals = [];     // 3 floats per vertex
        this.uv = [];        // 2 floats per vertex
        this.modelMatrix = glMatrix.mat4.create();
    }

    addTriangle(x0, y0, z0, x1, y1, z1, x2, y2, z2) {
        var nverts = this.points.length / 3;

        // push first vertex
        this.points.push(x0); this.bary.push(1.0);
        this.points.push(y0); this.bary.push(0.0);
        this.points.push(z0); this.bary.push(0.0);
        this.indices.push(nverts);
        nverts++;

        // push second vertex
        this.points.push(x1); this.bary.push(0.0);
        this.points.push(y1); this.bary.push(1.0);
        this.points.push(z1); this.bary.push(0.0);
        this.indices.push(nverts);
        nverts++

        // push third vertex
        this.points.push(x2); this.bary.push(0.0);
        this.points.push(y2); this.bary.push(0.0);
        this.points.push(z2); this.bary.push(1.0);
        this.indices.push(nverts);
        nverts++;
    }

    translateBy(X = 0.0, Y = 0.0, Z = 0.0) {
        this.positionX += X;
        this.positionY += Y;
        this.positionZ += Z;
        glMatrix.mat4.translate(this.modelMatrix, this.modelMatrix, [X, Y, Z]);
    }

    setPosition(X = 0.0, Y = 0.0, Z = 0.0) {
        glMatrix.mat4.translate(this.modelMatrix, this.modelMatrix, [-this.positionX, -this.positionY, -this.positionZ]);

        this.positionX = X;
        this.positionY = Y;
        this.positionZ = Z;

        glMatrix.mat4.translate(this.modelMatrix, this.modelMatrix, [this.positionX, this.positionY, this.positionZ]);
    }

    scaleBy(scaleX = 1.0, scaleY = 1.0, scaleZ = 1.0) {
        glMatrix.mat4.translate(this.modelMatrix, this.modelMatrix, [-this.positionX, -this.positionY, -this.positionZ]);
        glMatrix.mat4.scale(this.modelMatrix, this.modelMatrix, [scaleX, scaleY, scaleZ]);
        glMatrix.mat4.translate(this.modelMatrix, this.modelMatrix, [this.positionX, this.positionY, this.positionZ]);
        this.scaleX *= scaleX;
        this.scaleY *= scaleY;
        this.scaleZ *= scaleZ;
    }

    getModelMatrix() {
        return this.modelMatrix;
        // glMatrix.mat4.translate(modelMatrix, modelMatrix, translateBy)
        // glMatrix.mat4.rotateY(modelMatrix, modelMatrix, radians(angleY + 180))
        // glMatrix.mat4.scale(modelMatrix, modelMatrix, scaleBy)
    }

    addNormal(x0, y0, z0, x1, y1, z1, x2, y2, z2) {

        // push first normal
        this.normals.push(x0);
        this.normals.push(y0);
        this.normals.push(z0);

        // push second normal
        this.normals.push(x1);
        this.normals.push(y1);
        this.normals.push(z1);

        // push third normal
        this.normals.push(x2);
        this.normals.push(y2);
        this.normals.push(z2);

    }

    adduv(u0, v0, u1, v1, u2, v2) {
        // push first uv
        this.uv.push(u0);
        this.uv.push(v0);

        // push second uv
        this.uv.push(u1);
        this.uv.push(v1);

        // push third uv
        this.uv.push(u2);
        this.uv.push(v2);

    }

    loadTexture(path) {
        return new Promise(resolve => {
            this.texture = gl.createTexture();
            // bind the texture so we can perform operations on it
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            // set texturing parameters
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            
            this.textureImage = document.getElementById(path);
            this.textureImage.crossOrigin = "";
            this.textureImage.onload = () => {
                // gl.bindTexture(gl.TEXTURE_2D, this.texture);

                // load the texture data
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.textureImage.width, this.textureImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.textureImage);
                gl.bindTexture(gl.TEXTURE_2D, null);
                resolve();
            }
        });
    }
}

function radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

