// Canvas on index.html
let canvas = document.querySelector('canvas');
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

// Resizing canvas to 3X the full window
canvas.width = winWidth * 3;
canvas.height = winHeight * 3;

// Variables used to position canvas
let currentLeft = -winWidth;
let currentTop = -winHeight;

// Adding a style sheet to the head tag of index.html with 
let style = document.createElement('style');
style.type = 'text/css';
style.id = 'moveCanvas';
let initializeCanvas = '\
canvas {\
  left: ' + currentLeft + 'px;\
  top: ' + currentTop + 'px;\
}';
style.innerHTML = initializeCanvas;
document.getElementsByTagName('head')[0].appendChild(style);

// Point object
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Context
let c = canvas.getContext('2d');

// Define 3 arrays, containing the x and y coordinates used to construct the lines.  These are given as a number between 0 and 3
let redCoordArray = [[0.95, 1.6], [1.25, 1.6], [1.5, 1.6], [1.75, 1.4], [2.05, 1.4]];

let blueCoordArray = [[1.4, 0.95], [1.4, 1.2], [1.4, 1.4], [1.5, 1.6], [1.5, 2.05]];

let yellowCoordArray = [[1.25, 1.75], [1.25, 1.6], [1.25, 1.2], [1.4, 1.2], [1.6, 1.2], [1.75, 1.4]];

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

function drawLinePart(context, line, color) {
  /* Input: an array of Point objects defining a line, and a color for the line
  Draws one line defined by the input points array in the given color.
  Applies a line width of 8, round type line joining, and a simple shadow.
  */
 context.beginPath();
 context.moveTo(line[0].x, line[0].y);
  for (let i = 1; i < line.length; i++) {
    context.lineTo(line[i].x, line[i].y);
  }
  context.strokeStyle = color;
  context.lineWidth = 8;
  context.lineJoin = 'round';
  context.shadowColor = 'rgb(172, 172, 236)';
  context.shadowBlur = 5;
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.stroke();
  console.log(context);
}

function drawNetwork(context, lines, colors) {
  /* Input: array of lines defined by Point objects
  Draws the network on the canvas
  */
  let coordinates = createPointsArray(lines);
  for (let i = 0; i < lines.length; i++) {
    drawLinePart(context, coordinates[i], colors[i]);
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
  Adds a new point to the nth array of the lineLeadingPoints array for each t value.
  */
  actualLeadingPoints[n].push(lineLeadingPoints[n][t - 1]);
}

function drawLine(context, actualLeadingPoints, n, colors) {
  /* Input: an array of the leading points already passed.
  Draws the nth line of the array in the color given
  */

  drawLinePart(context, actualLeadingPoints[n], colors[n]);
}

function animate() {
  /* Iterates through the values of t, drawing out all the lines in the same T time.
  Clears the canvas at each value of t, adds a new point to the ctual leading points array, then
  draws it.
  */ 
  
  if (t < T + 1) {
    t++;
    requestAnimationFrame(animate);
    c.clearRect(0, 0, winWidth * 3, winHeight * 3);
    for (let i = 0; i < colors.length; i++) {
      addLeadingPointToActual(lineLeadingPoints, i, t)
      drawLine(c, actualLeadingPoints, i, colors)
    }
  }/* else {
    var canva = document.getElementById('canvas');
    var dataURL = canva.toDataURL();
    let image;
    image = document.createElement('img');
    image.src = dataURL;
    image.id = 'canvas-image';
    canva.parentNode.replaceChild(image, canva);
  }*/
}

// Decide how many segments will each line be split up to
let T = 60;

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

function redraw() {
  winWidth = window.innerWidth;
  winHeight = window.innerHeight;
  switch (_status) {
    case 0:
      currentLeft = -winWidth;
      currentTop = -winHeight;
      break;
    case 1:
      currentLeft = -winWidth;
      currentTop = 0;
      break;
    case 2:
      currentLeft = -(2 * winWidth);
      currentTop = -winHeight;
      break;
    case 3:
      currentLeft = -winWidth;
      currentTop = -(2 * winHeight);
      break;
    case 4:
      currentLeft = 0;
      currentTop = -winHeight;
      break;
  }
}

function reDraw(context){
  console.log('reDraw works');
  drawNetwork(context, coordArrays, colors);
}
