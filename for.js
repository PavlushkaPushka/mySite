"use strict";

function main () {
  var canvas = document.querySelector("#Canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) console.log('someproblem');

  // setup GLSL program
  var program = forUseGraph.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
  console.log(program)

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var translationLocation = gl.getUniformLocation(program, "u_translation");
  var rotationLocation = gl.getUniformLocation(program, "u_rotation");
  var scaleLocation = gl.getUniformLocation(program, "u_scale");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  

  var translation = [0, 0];
  var rotation = [0, 1];
   var scale = [1, 1];
  var width = 100;
  var height = 30;
  var color = [Math.random(), Math.random(), Math.random(), 1];
  setArrow(gl, 0, 0, width, height);
    drawScene()
  forUseGraph.setupSlider("#x", {slide: updatePosition(0), max: gl.canvas.width });
  forUseGraph.setupSlider("#y", {slide: updatePosition(1), max: gl.canvas.height});
  forUseGraph.setupSlider("#rotate", {slide: updateAngle, max:360});
  forUseGraph.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
  forUseGraph.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
  
 function updateAngle(event, ui) {
    var angleInDegrees = 360 - ui.value;
    var angleInRadians = angleInDegrees * Math.PI / 180;
    rotation[0] = Math.sin(angleInRadians);
    rotation[1] = Math.cos(angleInRadians);
    drawScene();
  }

   function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      drawScene();
    };
  }

  function updatePosition(index) {
    return function(event, ui) {
      console.log(event);
      translation[index] = ui.value;
      drawScene();
    };
  }

  // Draw a the scene.
  function drawScene() {
    //webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.canvas.width = 700;
    gl.canvas.height = 700;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Setup a rectangle
    //

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);
    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // Задаём вращение
    gl.uniform2fv(rotationLocation, rotation);
    gl.uniform2fv(translationLocation, translation);
    gl.uniform2fv(scaleLocation, scale);
    


    // set the color
    gl.uniform4fv(colorLocation, color);

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 9;
    gl.drawArrays(primitiveType, offset, count);
  }
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          x1, y1,
          x2, y1,
          x1, y2,
          x1, y2,
          x2, y1,
          x2, y2,
      ]),
      gl.STATIC_DRAW); 

}

  function setArrow(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  var x3 = x2 + height;
  var y3 = y + (height/2);
  var x4 = x2;
  var y4 = y-height;
  var x5 = x2;
  var y5 = y2 + height;
  // a cap
  // width 100 and 30
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          x1, y1,
          x2, y1,
          x1, y2,
          x1, y2,
          x2, y1,
          x2, y2,
          x3, y3,
          x4, y4,
          x5, y5,
      ]),
      gl.STATIC_DRAW);
      }


main();