'use strict';

// Global variables that are set and used
// across the application
let gl;
let shapes = [];
let programs = [];

// GLSL programs
let sphere_program = null;
let plank_program = null;
let shadow_program = null;

// VAOs for the objects
let sphere = null;
let plank = null;

// textures
let basketballTexture = null;
let plankTexture = null;


let shadowMapCube = null;
let shadowMapFrameBuffer = null;
let shadowMapRenderBuffer = null;
let shadowMapViewMatrices = null;
let shadowClipNearFar = null;
let camConfigs = null;

// spotlight
let spotlightPosition = null;

// rotation

//
// create shapes and VAOs for objects.
// Note that you will need to bindVAO separately for each object / program based
// upon the vertex attributes found in each program
//
function createShapes() {
  plank = new Cube(2);
  plank.VAO = bindVAO(plank, plank_program);
  plank.scaleBy(30.0, 0.5, 10.0);
  plank.setPosition(0.0, -2.0, 0.0);

  sphere = new Sphere(20, 20);
  sphere.VAO = bindVAO(sphere, sphere_program);
  sphere.setPosition(0.0, -0.5, 0.0);

  shapes.push(sphere);
  shapes.push(plank);
}

function setUpCameraForEachProgram() {
  for (let program of programs) {
    setUpCamera(program);
  }
}

async function loadTextures() {

  await sphere.loadTexture("ball-texture");
  await plank.loadTexture("table-texture");

}

//
// Here you set up your camera position, orientation, and projection
// Remember that your projection and view matrices are sent to the vertex shader
// as uniforms, using whatever name you supply in the shaders
//
function setUpCamera(program) {

  gl.useProgram(program);

  // set up your projection
  let projMatrix = glMatrix.mat4.create();
  const aspectRatio = gl.canvas.width / gl.canvas.height;
  const fieldOfView = radians(90);
  const near = 0;
  const far = 1000.0;
  glMatrix.mat4.perspective(projMatrix, fieldOfView, aspectRatio, near, far);
  gl.uniformMatrix4fv(program.uProjT, false, projMatrix);

  // set up your view
  const sideView = [0.0, 0.0, 10.0];
  const closerSideView = [0.0, 0, 5.0];
  const topView = [0.0, 5.0, 1.0];
  const eye = [0.0, 0.5, 5.0];
  // const eye = [0.0, 2.5, 8.0];
  // const eye = topView;
  const center = [0, 0, 0];
  const up = [0, 1, 0];
  let viewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.lookAt(viewMatrix, eye, center, up);
  gl.uniformMatrix4fv(program.uViewT, false, viewMatrix);


  gl.uniform3fv(program.uCameraPos, eye);
}


//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//
function setUpTextures() {

  // flip Y for WebGL
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // get some texture space from the gpu

  // load the actual image
  var worldImage = document.getElementById('')
  worldImage.crossOrigin = "";

  // bind the texture so we can perform operations on it

  // load the texture data

  // set texturing parameters
}

function drawBall(program) {

  gl.useProgram(program);


  let modelMatrix = sphere.getModelMatrix();
  gl.uniformMatrix4fv(program.uModelT, false, modelMatrix);

  drawShape(sphere, program);
}

function drawPlank(program) {
  gl.useProgram(program);


  let modelMatrix = plank.getModelMatrix();
  // let modelMatrix = glMatrix.mat4.create();
  // glMatrix.mat4.scale(modelMatrix, modelMatrix, [20.0, 1.0, 7.0]);
  gl.uniformMatrix4fv(program.uModelT, false, modelMatrix);
  drawShape(plank, program);
}

//
//  This function draws all of the shapes required for your scene
//
function drawShapes(program = null) {
  if (program == null) {
    drawPlank(plank_program);
    drawBall(sphere_program);
  } else {
    drawPlank(program);
    drawBall(program);
  }
  // drawShape(cube, cube_program);
}

function drawShape(object, program) {
  gl.useProgram(program);

  // add texture
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, object.texture);
  gl.uniform1i(program.uTheTexture, 1);

  gl.bindVertexArray(object.VAO);
  gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT, 0);

}

function setUpSpotlightForEachProgram() {
  for (let program of programs) {
    setUpSpotlight(program);
  }
}

function setUpSpotlight(program) {
  gl.useProgram(program);
  gl.uniform3fv(program.uSpotlightDirection, glMatrix.vec3.fromValues(0.0, -2.0, 0.0));
  gl.uniform3fv(program.uSpotlightPosition, glMatrix.vec3.fromValues(0.0, 2.0, 0.0));
  gl.uniform3fv(program.uSpotlightColor, glMatrix.vec3.fromValues(0.5, 0.5, 0.5));
  gl.uniform3fv(program.uSpotAmbientLight, glMatrix.vec3.fromValues(0.5, 0.5, 0.5));
  gl.uniform3fv(program.uSpotDiffuseLight, glMatrix.vec3.fromValues(1.0, 1.0, 1.0));
  gl.uniform3fv(program.uSpotSpecLight, glMatrix.vec3.fromValues(1.0, 1.0, 1.0));

  gl.uniform1f(program.uLinear, 0.09);
  gl.uniform1f(program.uQuad, 0.032);
  gl.uniform1f(program.uConstant, 1.0);

  const cutOff = 0.9955;
  const outerCutOff = cutOff - 0.02;
  gl.uniform1f(program.uSpotlightCutoff, cutOff);
  gl.uniform1f(program.uSpotlightOuterCutoff, outerCutOff);


  gl.uniform3fv(program.uNewSpotlightPos, glMatrix.vec3.fromValues(0.0, 10.0, 0.0));
  gl.uniform3fv(program.uNewSpotlightDir, glMatrix.vec3.fromValues(0.0, -2.0, 0.0));

  // shadow program only
  gl.uniform3fv(program.pointLightPosition, glMatrix.vec3.fromValues(0.0, 10.0, 0.0));
}

function setUpPhongForEachProgram() {
  for (let program of programs) {
    setUpPhong(program);
  }
}

function setUpPhong(program) {


  // Recall that you must set the program to be current using
  // the gl useProgram function
  gl.useProgram(program);

  //
  // set up the co-efficients
  //
  gl.uniform1f(program.ka, 0.6);
  gl.uniform1f(program.kd, 0.6);
  gl.uniform1f(program.ks, 0.7);
  gl.uniform1f(program.ke, 25.0);

  //
  // set up the light characteristics
  //
  gl.uniform3fv(program.lightPosition, glMatrix.vec3.fromValues(2, 2, 2));

  gl.uniform3fv(program.ambientLight, glMatrix.vec3.fromValues(1.0, 1.0, 1.0));
  gl.uniform3fv(program.lightColor, glMatrix.vec3.fromValues(1.0, 1.0, 1.0));
  gl.uniform3fv(program.baseColor, glMatrix.vec3.fromValues(1.0, 1.0, 1.0));
  gl.uniform3fv(program.specHighlightColor, glMatrix.vec3.fromValues(1.0, 1.0, 1.0));

}


//
// Use this function to create all the programs that you need
// You can make use of the auxillary function initProgram
// which takes the name of a vertex shader and fragment shader
//
// Note that after successfully obtaining a program using the initProgram
// function, you will beed to assign locations of attribute and unifirm variable
// based on the in variables to the shaders.   This will vary from program
// to program.
//
async function initPrograms() {

  const vertexShaderText = await loadTextResource("./shaders/objects.vs.glsl");
  const fragmentShaderText = await loadTextResource("./shaders/objects.fs.glsl");

  sphere_program = initProgramWithShadersText(vertexShaderText, fragmentShaderText);
  plank_program = initProgramWithShadersText(vertexShaderText, fragmentShaderText);

  const shadowVertexShaderText = await loadTextResource("./shaders/shadowMap.vs.glsl");
  const shadowFragmentShaderText = await loadTextResource("./shaders/shadowMap.fs.glsl");

  shadow_program = initProgramForShadowGen(shadowVertexShaderText, shadowFragmentShaderText);

  programs.push(sphere_program);
  programs.push(plank_program);
  // programs.push();
}


// creates a VAO and returns its ID
function bindVAO(shape, program) {
  //create and bind VAO
  let theVAO = gl.createVertexArray();
  gl.bindVertexArray(theVAO);

  // create and bind vertex buffer
  let myVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aVertexPosition);
  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

  // normals
  let myNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.normals), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aNormal);
  gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 0, 0);

  // add code for any additional vertex attribute
  let uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uv), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aUV);
  gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);

  // Setting up the IBO
  let myIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

  // Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return theVAO;
}

function getShaderFromString(shaderText, type) {
  const shaderString = shaderText.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (type === 'vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (type === 'fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function loadTextResource(url) {
  return new Promise(resolve => {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, false);
    xmlhttp.onload = function (e) {
      if (xmlhttp.status < 200 || xmlhttp.status >= 300) {
        console.error('ERROR loading text resource', url, xmlhttp.status, xmlhttp.statusText);
      } else {
        resolve(xmlhttp.responseText);
        // cb(null, xmlhttp.responseText);
      }
    };
    xmlhttp.send();
  });
}

function generateShadowMap() {

  // set gl state status  
  gl.useProgram(shadow_program);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
  gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFrameBuffer);
  gl.bindRenderbuffer(gl.RENDERBUFFER, shadowMapRenderBuffer);

  gl.viewport(0, 0, 1024, 1024);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  camConfigs = [
    { lookAt: glMatrix.vec3.fromValues(1, 0, 0), up: glMatrix.vec3.fromValues(0, -1, 0) },
    { lookAt: glMatrix.vec3.fromValues(-1, 0, 0), up: glMatrix.vec3.fromValues(0, -1, 0) },
    { lookAt: glMatrix.vec3.fromValues(0, 1, 0), up: glMatrix.vec3.fromValues(0, 0, 1) },
    { lookAt: glMatrix.vec3.fromValues(0, -1, 0), up: glMatrix.vec3.fromValues(0, 0, -1) },
    { lookAt: glMatrix.vec3.fromValues(0, 0, 1), up: glMatrix.vec3.fromValues(0, -1, 0) },
    { lookAt: glMatrix.vec3.fromValues(0, 0, -1), up: glMatrix.vec3.fromValues(0, -1, 0) },
  ]; // generate 6 of them 
  shadowMapViewMatrices = [
    glMatrix.mat4.create(),
    glMatrix.mat4.create(),
    glMatrix.mat4.create(),
    glMatrix.mat4.create(),
    glMatrix.mat4.create(),
    glMatrix.mat4.create(),
  ];

  var shadowMapProj = glMatrix.mat4.create();
  shadowClipNearFar = glMatrix.vec2.fromValues(0.05, 15.0);
  glMatrix.mat4.perspective(shadowMapProj, radians(90), 1.0, shadowClipNearFar[0], shadowClipNearFar[1]);

  // set per frame uniforms
  gl.uniform2fv(shadow_program.shadowClipNearFar, shadowClipNearFar);
  gl.uniform3fv(shadow_program.pointLightPosition, glMatrix.vec3.fromValues(0.0, 10.0, 0.0));
  gl.uniformMatrix4fv(shadow_program.uProjT, false, shadowMapProj);

  const eye = [0.0, 0.5, 5.0];
  // const eye = [0.0, 2.5, 8.0];
  // const eye = topView;
  const center = [0, 0, 0];
  const up = [0, 1, 0];

  for (var i = 0; i < camConfigs.length; i++) {
    gl.uniformMatrix4fv(
      shadow_program.uViewT,
      gl.FALSE,
      glMatrix.mat4.lookAt(shadowMapViewMatrices[i], spotlightPosition, camConfigs[i].lookAt, camConfigs[i].up)
    )


    // set framebuffer destination
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
      shadowMapCube,
      0
    );

    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      shadowMapRenderBuffer
    );

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw all objects
    drawShadow();
  }


  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

}


function drawShadow() {
  // Clear the scene
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // draw your shapes
  drawShapes(shadow_program);

  // Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function setUpShadowMapTexture() {
  shadowMapCube = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  for (var i = 0; i < 6; i++) {
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
      0, gl.RGBA,
      1024, 1024,
      0, gl.RGBA,
      gl.UNSIGNED_BYTE, null
    );
  }

  shadowMapFrameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFrameBuffer);

  shadowMapRenderBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, shadowMapRenderBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 1024, 1024);


  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

}

function setUpOtherUniforms(program) {
  for (program of programs) {
    // gl.uniform1f(program.uBias, 0.003);
    gl.uniform2fv(program.shadowClipNearFar, shadowClipNearFar);
    gl.uniform1i(program.lightShadowMap, 0);
    gl.activeTexture(gl.TEXTURE0);
    // gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
  }
}


/////////////////////////////////////////////////////////////////////////////
//
//  You shouldn't have to edit anything below this line...but you can
//  if you find the need
//
/////////////////////////////////////////////////////////////////////////////

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}


//
// compiles, loads, links and returns a program (vertex/fragment shader pair)
//
// takes in the id of the vertex and fragment shaders (as given in the HTML file)
// and returns a program object.
//
// will return null if something went wrong
//
function initProgram(vertex_id, fragment_id) {
  const vertexShader = getShader(vertex_id);
  const fragmentShader = getShader(fragment_id);

  // Create a program
  let program = gl.createProgram();

  // Attach the shaders to this program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
    return null;
  }

  // gl.useProgram(program);

  // program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  // program.aNormal = gl.getAttribLocation(program, 'aNormal');

  // // uniforms
  // program.uModelT = gl.getUniformLocation(program, 'modelT');
  // program.uViewT = gl.getUniformLocation(program, 'viewT');
  // program.uProjT = gl.getUniformLocation(program, 'projT');
  // program.ambientLight = gl.getUniformLocation(program, 'ambientLight');
  // program.lightPosition = gl.getUniformLocation(program, 'lightPosition');
  // program.lightColor = gl.getUniformLocation(program, 'lightColor');
  // program.baseColor = gl.getUniformLocation(program, 'baseColor');
  // program.specHighlightColor = gl.getUniformLocation(program, 'specHighlightColor');
  // program.ka = gl.getUniformLocation(program, 'ka');
  // program.kd = gl.getUniformLocation(program, 'kd');
  // program.ks = gl.getUniformLocation(program, 'ks');
  // program.ke = gl.getUniformLocation(program, 'ke');

  // //spotlight
  // program.uSpotlightDirection = gl.getUniformLocation(program, 'spotlight.direction');
  // program.uSpotlightPosition = gl.getUniformLocation(program, 'spotlight.position');
  // program.uSpotlightColor = gl.getUniformLocation(program, 'spotlight.color');
  // program.uSpotlightCutoff = gl.getUniformLocation(program, 'spotlight.cutoff');
  // program.uSpotlightOuterCutoff = gl.getUniformLocation(program, 'spotlight.outerCutoff');
  // program.uSpotAmbientLight = gl.getUniformLocation(program, 'spotlight.ambient');
  // program.uSpotDiffuseLight = gl.getUniformLocation(program, 'spotlight.diffuse');
  // program.uSpotSpecLight = gl.getUniformLocation(program, 'spotlight.spec');
  // program.uLinear = gl.getUniformLocation(program, "spotlight.linear");
  // program.uQuad = gl.getUniformLocation(program, "spotlight.quad");
  // program.uConstant = gl.getUniformLocation(program, "spotlight.constant");

  // program.uNewSpotlightPos = gl.getUniformLocation(program, 'spotlightPos');
  // program.uNewSpotlightDir = gl.getUniformLocation(program, 'spotlightDir');

  // // textures
  // program.uTheTexture = gl.getUniformLocation(program, 'theTexture');
  // program.aUV = gl.getAttribLocation(program, 'aUV');

  // program.uCameraPos = gl.getUniformLocation(program, 'cameraPos');

  return initProgramForObjects(program);
}

function initProgramForObjects(program) {

  gl.useProgram(program);

  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  program.aNormal = gl.getAttribLocation(program, 'aNormal');

  // uniforms
  program.uModelT = gl.getUniformLocation(program, 'modelT');
  program.uViewT = gl.getUniformLocation(program, 'viewT');
  program.uProjT = gl.getUniformLocation(program, 'projT');
  program.ambientLight = gl.getUniformLocation(program, 'ambientLight');
  program.lightPosition = gl.getUniformLocation(program, 'lightPosition');
  program.lightColor = gl.getUniformLocation(program, 'lightColor');
  program.baseColor = gl.getUniformLocation(program, 'baseColor');
  program.specHighlightColor = gl.getUniformLocation(program, 'specHighlightColor');
  program.ka = gl.getUniformLocation(program, 'ka');
  program.kd = gl.getUniformLocation(program, 'kd');
  program.ks = gl.getUniformLocation(program, 'ks');
  program.ke = gl.getUniformLocation(program, 'ke');

  //spotlight
  program.uSpotlightDirection = gl.getUniformLocation(program, 'spotlight.direction');
  program.uSpotlightPosition = gl.getUniformLocation(program, 'spotlight.position');
  program.uSpotlightColor = gl.getUniformLocation(program, 'spotlight.color');
  program.uSpotlightCutoff = gl.getUniformLocation(program, 'spotlight.cutoff');
  program.uSpotlightOuterCutoff = gl.getUniformLocation(program, 'spotlight.outerCutoff');
  program.uSpotAmbientLight = gl.getUniformLocation(program, 'spotlight.ambient');
  program.uSpotDiffuseLight = gl.getUniformLocation(program, 'spotlight.diffuse');
  program.uSpotSpecLight = gl.getUniformLocation(program, 'spotlight.spec');
  program.uLinear = gl.getUniformLocation(program, "spotlight.linear");
  program.uQuad = gl.getUniformLocation(program, "spotlight.quad");
  program.uConstant = gl.getUniformLocation(program, "spotlight.constant");

  program.uNewSpotlightPos = gl.getUniformLocation(program, 'spotlightPos');
  program.uNewSpotlightDir = gl.getUniformLocation(program, 'spotlightDir');

  // textures
  program.uTheTexture = gl.getUniformLocation(program, 'theTexture');
  program.aUV = gl.getAttribLocation(program, 'aUV');

  program.uCameraPos = gl.getUniformLocation(program, 'cameraPos');

  program.uBias = gl.getUniformLocation(program, 'bias');
  return program;
}

function initProgramForShadowGen(vertexShaderText, fragmentShaderText) {
  const vertexShader = getShaderFromString(vertexShaderText, "vertex");
  const fragmentShader = getShaderFromString(fragmentShaderText, "fragment");

  // Create a program
  let program = gl.createProgram();

  // Attach the shaders to this program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
    return null;
  }

  gl.useProgram(program);
  program.shadowClipNearFar = gl.getUniformLocation(program, 'shadowClipNearFar');
  program.pointLightPosition = gl.getUniformLocation(program, 'pointLightPosition');
  program.uProjT = gl.getUniformLocation(program, 'projT');
  program.uViewT = gl.getUniformLocation(program, 'viewT');
  program.uModelT = gl.getUniformLocation(program, 'modelT');

  return program;
}

function initProgramWithShadersText(vertexShaderText, fragmentShaderText) {
  const vertexShader = getShaderFromString(vertexShaderText, "vertex");
  const fragmentShader = getShaderFromString(fragmentShaderText, "fragment");

  // Create a program
  let program = gl.createProgram();

  // Attach the shaders to this program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
    return null;
  }

  // gl.useProgram(program);

  // program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  // program.aNormal = gl.getAttribLocation(program, 'aNormal');

  // // uniforms
  // program.uModelT = gl.getUniformLocation(program, 'modelT');
  // program.uViewT = gl.getUniformLocation(program, 'viewT');
  // program.uProjT = gl.getUniformLocation(program, 'projT');
  // program.ambientLight = gl.getUniformLocation(program, 'ambientLight');
  // program.lightPosition = gl.getUniformLocation(program, 'lightPosition');
  // program.lightColor = gl.getUniformLocation(program, 'lightColor');
  // program.baseColor = gl.getUniformLocation(program, 'baseColor');
  // program.specHighlightColor = gl.getUniformLocation(program, 'specHighlightColor');
  // program.ka = gl.getUniformLocation(program, 'ka');
  // program.kd = gl.getUniformLocation(program, 'kd');
  // program.ks = gl.getUniformLocation(program, 'ks');
  // program.ke = gl.getUniformLocation(program, 'ke');

  // //spotlight
  // program.uSpotlightDirection = gl.getUniformLocation(program, 'spotlight.direction');
  // program.uSpotlightPosition = gl.getUniformLocation(program, 'spotlight.position');
  // program.uSpotlightColor = gl.getUniformLocation(program, 'spotlight.color');
  // program.uSpotlightCutoff = gl.getUniformLocation(program, 'spotlight.cutoff');
  // program.uSpotlightOuterCutoff = gl.getUniformLocation(program, 'spotlight.outerCutoff');
  // program.uSpotAmbientLight = gl.getUniformLocation(program, 'spotlight.ambient');
  // program.uSpotDiffuseLight = gl.getUniformLocation(program, 'spotlight.diffuse');
  // program.uSpotSpecLight = gl.getUniformLocation(program, 'spotlight.spec');
  // program.uLinear = gl.getUniformLocation(program, "spotlight.linear");
  // program.uQuad = gl.getUniformLocation(program, "spotlight.quad");
  // program.uConstant = gl.getUniformLocation(program, "spotlight.constant");

  // program.uNewSpotlightPos = gl.getUniformLocation(program, 'spotlightPos');
  // program.uNewSpotlightDir = gl.getUniformLocation(program, 'spotlightDir');

  // // textures
  // program.uTheTexture = gl.getUniformLocation(program, 'theTexture');
  // program.aUV = gl.getAttribLocation(program, 'aUV');

  // program.uCameraPos = gl.getUniformLocation(program, 'cameraPos');

  return initProgramForObjects(program);
}


//
// We call draw to render to our canvas
//
function draw() {
  // Clear the scene
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // draw your shapes
  drawShapes();

  // Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

// Entry point to our application
function init() {

  // Retrieve the canvas
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) {
    console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
    return null;
  }

  // deal with keypress
  window.addEventListener('keydown', gotKey, false);

  // Retrieve a WebGL context
  /** @type {WebGLRenderingContext} */
  gl = canvas.getContext('webgl2');
  if (!gl) {
    console.error(`There is no WebGL 2.0 context`);
    return null;
  }


  // deal with keypress
  window.addEventListener('keydown', gotKey, false);

  // Set the clear color to be black
  gl.clearColor(0, 0, 0, 1);

  // some GL initialization
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.depthFunc(gl.LEQUAL)
  gl.clearDepth(1.0)

  spotlightPosition = glMatrix.vec3.fromValues(0.0, 10.0, 0.0);

  // loadShaders();
  // Read, compile, and link your shaders
  initPrograms()
    .then(() => {


      // create and bind your current object
      createShapes();

      setUpShadowMapTexture();
      setUpCameraForEachProgram();
      setUpPhongForEachProgram();
      setUpSpotlightForEachProgram();
      generateShadowMap();
      setUpOtherUniforms();
      loadTextures()
        .then(() => {
          // do a draw

          gl.clearColor(0.0, 0.0, 0.0, 1.0)

          draw();
        });
    });
}


function radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}
