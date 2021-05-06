 #version 300 es

// Vertex Attributes
in vec3 aVertexPosition;

// Transforms
uniform mat4 modelT;
uniform mat4 viewT;
uniform mat4 projT;

void main() {
    gl_Position = projT * viewT * modelT * vec4(aVertexPosition, 1.0);
}