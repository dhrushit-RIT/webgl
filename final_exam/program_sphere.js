var sphere_vertex_shader = `
    #version 300 es
    in vec3 aVertexPosition;

    void main()
    {
        gl_Position = aVertexPosition;
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