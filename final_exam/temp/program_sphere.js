var sphere_vertex_shader = `
    #version 300 es

    // Vertex Attributes
    in vec3 aVertexPosition;

    // Transforms
    uniform mat4 modelT;
    uniform mat4 viewT;
    uniform mat4 projT;

    void main()
    {
        gl_Position = projT * viewT * modelT * vec4 (aVertexPosition, 1.0);
    }
`;

var sphere_fragment_shader = `
    #version 300 es
    precision mediump float;

    // Color that is the result of this shader
    out vec4 fragColor;

    void main(void) {
        fragColor = vec4 (0.5, 0.5, 0.5, 1.0 );
    }
`;