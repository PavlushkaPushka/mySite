  var canvas = document.querySelector("#renderCanvas");
  var gl = canvas.getContext("webgl")
    if (!gl) {
    console.log(gl);
}
// Ещё нам понадобится функция, которая создаст шейдер, загрузит код GLSL и скомпилирует шейдер.
// Для неё я не писал комментариев, так как из названий функций должно быть понятно, 
// что происходит. (а я всё-таки напишу - прим.пер.)




function createShader(gl, type, source) {
  var shader = gl.createShader(type);   // создание шейдера
  gl.shaderSource(shader, source);      // устанавливаем шейдеру его программный код
  gl.compileShader(shader);             // компилируем шейдер
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {                        // если компиляция прошла успешно - возвращаем шейдер
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

// создадим два шейдера  с помощью этой функции 

var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
 
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);







// далее мы должны свяязать эти два шейдера программой 
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}



// и вызвать эту программу 
var program = createProgram(gl, vertexShader, fragmentShader);




// Теперь, когда мы создали программу на видеокарте, нам нужно снабдить её данными. 
// Большая часть WebGL API занимается установкой состояния для последующей передачи данных в нашу 
// программу GLSL. В нашем случае единственными входными данными программы является атрибут 
// a_position. Первое, что мы должны сделать - получить ссылку на атрибут для только что
//  созданной программы

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var colorUniformLocation = gl.getUniformLocation(program, "u_color");


// Получение ссылки на атрибут (и ссылки на uniform-переменную) следует выполнять во время 
// инициализации, но не во время цикла отрисовки.

// Атрибуты получают данные от буферов, поэтому нам нужно создать буфер

var positionBuffer = gl.createBuffer();

console.log(positionBuffer);



// WebGL позволяет управлять многими своими ресурсами через глобальные точки связи. 
// Точки связи - это что-то вроде внутренних глобальных переменных в WebGL. 
// Сначала вы привязываете ресурс к точке связи. А после все остальные функции обращаются 
// к этому ресурсу через его точку связи. Итак, привяжем буфер положений.

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// Теперь можно наполнить буфер данными, указав буфер через его точку связи
var positions = [
  10, 20,
  80, 20,
  10, 30,
  10, 30,
  80, 20,
  80, 30,
];
// var positions = [
//   0.1, 0.2,
//   0.8, 0.2,
//   0.1, 0.3,
//   0.1, 0.3,
//   0.8, 0.2,
//   0.8, 0.3
// ];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Нам нужно указать, как координаты из пространства отсечения, 
// которые мы задаём через gl_Position, преобразовать в пиксели, 
// часто называемыми экранными координатами. Для этого мы вызовем gl.viewport и передадим 
// текущий размер canvas.
gl.canvas.width = 700;
gl.canvas.height = 700;
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
// Теперь очищаем canvas. 0, 0, 0, 0 - красный, зелёный, синий и прозрачность, 
// то есть наш canvas полностью прозрачный.

// очищаем canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
// Указываем WebGL, какую шейдерную программу нужно выполнить

// говорим использовать нашу программу (пару шейдеров)
gl.useProgram(program);

gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

// Теперь нужно сказать WebGL, как извлечь данные из буфера, 
// который мы настроили ранее, и передать их в атрибут шейдера.
// Для начала необходимо включить атрибут

gl.enableVertexAttribArray(positionAttributeLocation);
// А затем требуется указать, как извлекать данные из буфера

// Привязываем буфер положений
//gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 
// Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 компоненты на итерацию
var type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
var normalize = false; // не нормализовать данные
var stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
var offset = 0;        // начинать с начала буфера
gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset)
    // И в итоге после всего этого мы говорим WebGL выполнить нашу программу GLSL
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 6;
gl.drawArrays(primitiveType, offset, count);




  // for (var ii = 0; ii < 50; ++ii) {
  //   // задаём произвольный прямоугольник
  //   // Запись будет происходить в positionBuffer,
  //   // так как он был привязан последник к
  //   // точке связи ARRAY_BUFFER

  //   setRectangle(
  //       gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));
 
  //   // задаём случайный цвет
  //   gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
 
  //   // отрисовка прямоугольника
  //   gl.drawArrays(gl.TRIANGLES, 0, 6);
  // }

 //
 //
 //
 //
 ///
// возврат случайного целого числа значением от 0 до range-1
function randomInt(range) {
  return Math.floor(Math.random() * range);
}
 
// заполнение буфера значениями, которые определяют прямоугольник
 
// function setRectangle(gl, x, y, width, height) {
//   var x1 = x;
//   var x2 = x + width;
//   var y1 = y;
//   var y2 = y + height;
 
//   // ПРИМ.: gl.bufferData(gl.ARRAY_BUFFER, ...) воздействует
//   // на буфер, который привязан к точке привязке `ARRAY_BUFFER`,
//   // но таким образом у нас будет один буфер. Если бы нам понадобилось
//   // несколько буферов, нам бы потребовалось привязать их сначала к `ARRAY_BUFFER`.
 
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
//      x1, y1,
//      x2, y1,
//      x1, y2,
//      x1, y2,
//      x2, y1,
//      x2, y2]), gl.STATIC_DRAW);
// }

// function setRectangle(gl, x, y, width, height) {
//   var x1 = x;
//   var x2 = x + width;
//   var y1 = y;
//   var y2 = y + height;}
//     var translation = [0, 0];
//   var width = 100;
//   var height = 30;
//   var color = [Math.random(), Math.random(), Math.random(), 1];


// function drawScene() {
//   // webglUtils.resizeCanvasToDisplaySize(gl.canvas);
 
//     // Говорим WebGL, как преобразовать координаты
//     // из пространства отсечения в пиксели
//     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
 
//     // Очищаем canvas
//     gl.clear(gl.COLOR_BUFFER_BIT);
 
//     // Говорим использовать нашу программу (пару шейдеров)
//     gl.useProgram(program);
 
//     // Активируем атрибут
//     gl.enableVertexAttribArray(positionAttributeLocation);
 
//     // Устанавливаем буфер положений
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 
//     // Задаём прямоугольник
//     setRectangle(gl, translation[0], translation[1], width, height);
 
//     // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
//     var size = 2;          // 2 компоненты на итерацию
//     var type = gl.FLOAT;   // данные - 32-битные числа с плавающей точкой
//     var normalize = false; // не нормализовать данные
//     var stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
//     var offset = 0;        // начинать с начала буфера
//     gl.vertexAttribPointer(
//         positionAttributeLocation, size, type, normalize, stride, offset)
 
//     // Установка разрешения
//     gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
 
//     // Установка цвета
//     gl.uniform4fv(colorUniformLocation, color);
 
//     // Отрисовка прямоугольника
//     var primitiveType = gl.TRIANGLES;
//     var offset = 0;
//     var count = 6;
//     gl.drawArrays(primitiveType, offset, count);
//   } 



