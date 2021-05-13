precision mediump float;

uniform mat4 projT;
uniform mat4 viewT;
uniform mat4 modelT;

attribute vec3 aVertexPosition;
attribute vec3 aNormal;

varying vec3 fPos;
varying vec3 fNorm;

void main() {
    fPos = (modelT * vec4(aVertexPosition, 1.0)).xyz;
    fNorm = (modelT * vec4(aNormal, 0.0)).xyz;

    gl_Position = projT * viewT * vec4(fPos, 1.0);
}