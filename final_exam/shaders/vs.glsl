#version 300 es

// Vertex Attributes
in vec3 aVertexPosition;
in vec3 aNormal;    // in model coords
in vec2 aUV;

// outputs
out vec3 N;
out vec3 L;
out vec3 V;
out vec2 theUV;  // pass uv's onto the fragment shader

// Transforms
uniform mat4 modelT;
uniform mat4 viewT;
uniform mat4 projT;

// Light parameters
uniform vec3 ambientLight;
uniform vec3 lightPosition;   // in world coords
uniform vec3 lightColor;

// object color parameters
uniform vec3 baseColor;
uniform vec3 specHighlightColor;

// Phong parameters
uniform float ka;
uniform float kd;
uniform float ks;
uniform float ke;

// for spotlight
out vec3 aPos;
out vec3 aNorm;
out vec3 vPos;

uniform vec3 spotlightPos;
uniform vec3 spotlightDir;
out vec3 updatedSpotlightPos;
out vec3 updatedSpotlightDir;

void main() {

    // All calculations will be done in camera space
    mat4 modelView = viewT * modelT;
    mat4 normalmatrix = transpose(inverse(modelView));

    vec3 vcam = (modelView * vec4(aVertexPosition, 1.0)).xyz;
    vec3 lcam = (viewT * vec4(lightPosition, 1.0)).xyz;
    vec3 ncam = (normalmatrix * vec4(aNormal, 1.0)).xyz;
    ncam = faceforward(ncam, vcam, ncam);

    // vectors to pass on to Fragment Shader
    N = normalize(ncam);
    L = normalize(lcam - vcam);
    V = -normalize(vcam);

    theUV = aUV;

    aPos = (projT * viewT * modelT * vec4(aVertexPosition, 1.0)).xyz;
    aNorm = normalize((projT * viewT * modelT * vec4(aNormal, 1.0)).xyz);
    updatedSpotlightPos = (projT * viewT * vec4(spotlightPos, 1.0)).xyz;
    updatedSpotlightDir = (projT * viewT * vec4(spotlightDir, 1.0)).xyz;
    vPos = aVertexPosition;

    gl_Position = projT * viewT * modelT * vec4(aVertexPosition, 1.0);
}