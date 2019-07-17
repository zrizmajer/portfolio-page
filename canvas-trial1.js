// Find canvas
var canvas = document.querySelector('canvas');

// Setting canvas to fit full screen
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;
canvas.width = winWidth;
canvas.height = winHeight;

// Point object
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Define 3 arrays, containing the x and y coordinates used to construct the lines.  These are given as a number between 0 and 1
let redCoordArray = [[0, 0.6], [0.25, 0.6], [0.5, 0.6], [0.75, 0.4], [1, 0.4]];

let blueCoordArray = [[0.4, 0], [0.4, 0.2], [0.4, 0.4], [0.5, 0.6], [0.5, 1]];

let yellowCoordArray = [[0.25, 0.75], [0.25, 0.6], [0.25, 0.2], [0.4, 0.2], [0.6, 0.2], [0.75, 0.4]];

// Pushing the three arrays into the coordArrays variable
let coordArrays = [];
coordArrays.push(redCoordArray);
coordArrays.push(blueCoordArray);
coordArrays.push(yellowCoordArray);

// Array of colors for the three lines
let colors = ['red', 'blue', 'yellow'];

function createPointsArray(coordArrays) {
  /* Input: an array of arrays defined by coordinates
  Converts the coordinates to pixels of the current screen
  Output: an array of lines defined by Point objects
  */
  let lines = [], linePoints = [];
  for (let i = 0; i < coordArrays.length; i++) {
    linePoints = [];
    for (let j = 0; j < coordArrays[i].length; j++) {
      linePoints.push(new Point(Math.round(winWidth * coordArrays[i][j][0]), Math.round(winHeight * coordArrays[i][j][1])));
    }
    lines.push(linePoints);
  }
  return lines;
}

// Canvas context
let c = canvas.getContext('2d');

function drawLinePart(line, color) {
  /* Input: an array of Point objects defining a line, and a color for the line
  Draws one line defined by the input points array in the given color.
  Applies a line width of 8, round type line joining, and a simple shadow.
  */
  c.beginPath();
  c.moveTo(line[0].x, line[0].y);
  for (let i = 1; i < line.length; i++) {
    c.lineTo(line[i].x, line[i].y);
  }
  c.strokeStyle = color;
  c.lineWidth = 8;
  c.lineJoin = 'round';
  // c.shadowColor = 'rgb(172, 172, 236)';
  // c.shadowBlur = 5;
  // c.shadowOffsetX = 1;
  // c.shadowOffsetY = 1;
  c.stroke();
}

function drawNetwork(lines, colors) {
  /* Input: array of lines defined by Point objects
  Draws the network on the canvas
  */
  let coordinates = createPoints(lines);
  for (let i = 0; i < lines.length; i++) {
    drawLinePart(coordinates[i], colors[i]);
  }
}

function createLeadingPointsArray(lines) {
  /* Input: an array of lines defined by Point objects
  Creating arrays of T + 1 points for each line of the array, splitting them into T segments
  Output: an array consisting of arrays of leading Point objects for each line.*/
  let leadingPoints = [], lineLeadingPoints = [];
  // Iterate through lines 
  for (let i = 0; i < lines.length; i++) {
    // Iterate through parts of each line.
    for (let j = 1; j < lines[i].length; j++) {
      let pt0 = lines[i][j - 1];
      let pt1 = lines[i][j];
      let dx = pt1.x - pt0.x;
      let dy = pt1.y - pt0.y;
      // Split line parts into T segments
      for (let k = 0; k < T / (lines[i].length - 1); k++) {
        leadingPoints.push(new Point(pt0.x + (dx * k) / (T / (lines[i].length - 1)), pt0.y + (dy * k) / (T / (lines[i].length - 1))));
        // Adding last point of the line to achieve T + 1 points
        if (j === lines[i].length - 1 && k === T / (lines[i].length - 1) - 1) {
          leadingPoints.push(new Point(lines[i].slice(-1)[0].x, lines[i].slice(-1)[0].y));
        }
      }
    }
    lineLeadingPoints.push(leadingPoints);
    leadingPoints = [];
  }
  return lineLeadingPoints;
}

function initialiseActualArray(lineLeadingPoints) {
  /* Input: an array of line leading points
  Initialises the actual leading points array with the first points from the line leading points
  */ 
  lineLeadingPoints.forEach(item => actualLeadingPoints.push([item[0]]));
}

function addLeadingPointToActual(lineLeadingPoints, n, t) {
  /* Input: an array of line leading points
  
  */
  actualLeadingPoints[n].push(lineLeadingPoints[n][t - 1]);
}

function drawLine(actualLeadingPoints, n, colors) {
  // 
  drawLinePart(actualLeadingPoints[n], colors[n]);
}

function animate() {
  if (t < T + 1) {
    t++;
    requestAnimationFrame(animate);
    c.clearRect(0, 0, winWidth, winHeight);
    for (let i = 0; i < colors.length; i++) {
      addLeadingPointToActual(lineLeadingPoints, i, t)
      drawLine(actualLeadingPoints, i, colors)
    }
  }
}

// Decide how many segments will each line be split up to
let T = 120;

// Initialise counter
let t = 1;

// Create array of lines defined by Point objects
let lines = createPointsArray(coordArrays);

// Create an array of line leading points for the animation
let lineLeadingPoints = createLeadingPointsArray(lines);

// Initialise new empty array that will contain the actual leading points at each t value
let actualLeadingPoints = [];

// Initialise actualLeadingPoints
initialiseActualArray(lineLeadingPoints);

// Animate the network
animate();





// Array containing how many parts the lines have
//let lineParts = [];

/*function calcLineParts(arrays) {}
coordArrays.forEach(function(item) {
  if (!lineParts.includes(item.length - 1)) {
    lineParts.push(item.length - 1);
  }
});
let T;
if (lineParts.length === 1) {
  T = 100;
} else if (lineParts.length === 2) {
  T = lcm_two_numbers(lineParts[0], lineParts[1]);
} else {
  T = lcm_more_than_two_numbers(lineParts);
}


function lcm_two_numbers(x, y) {
  // Source: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-10.php
  if (typeof x !== 'number' || typeof y !== 'number') return false;
  return !x || !y ? 0 : Math.abs((x * y) / gcd_two_numbers(x, y));
}

function gcd_two_numbers(x, y) {
  // Source: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-10.php
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function lcm_more_than_two_numbers(input_array) {
  // Source: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-11.php
  if (toString.call(input_array) !== '[object Array]') return false;
  var r1 = 0,
    r2 = 0;
  var l = input_array.length;
  for (i = 0; i < l; i++) {
    r1 = input_array[i] % input_array[i + 1];
    if (r1 === 0) {
      input_array[i + 1] = (input_array[i] * input_array[i + 1]) / input_array[i + 1];
    } else {
      r2 = input_array[i + 1] % r1;
      if (r2 === 0) {
        input_array[i + 1] = (input_array[i] * input_array[i + 1]) / r1;
      } else {
        input_array[i + 1] = (input_array[i] * input_array[i + 1]) / r2;
      }
    }
  }
  return input_array[l - 1];
}*/
