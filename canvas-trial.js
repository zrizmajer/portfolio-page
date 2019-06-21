var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

/*c.fillStyle = 'blue';
c.fillRect(100, 100, 100, 100);

//line
c.beginPath();
c.moveTo(50, 300);
c.lineTo(300, 100);
c.lineTo(400, 300);
c.strokeStyle = 'red';
c.stroke();

//arc circle
c.beginPath();
c.arc(300, 300, 30, 0, Math.PI * 2, false);
c.strokeStyle = 'blue';
c.stroke();

for (var i = 0; i < 100; i++) {
  var x = Math.random() * window.innerWidth;
  var y = Math.random() * window.innerHeight;
  var colors = [];
  c.beginPath();
  c.arc(x, y, 30, 0, Math.PI * 2, false);
  for (j = 0; j < 3; j++) {
    var col = Math.floor(Math.random() * 256);
    colors.push(col);
  }
  var colorstring = colors.join(',');
  console.log(colorstring);
  c.strokeStyle = 'rgb(' + colorstring + ')';
  c.stroke();
}*/

/*var x = Math.random() * innerWidth;
var y = Math.random() * innerHeight;
var dx = (Math.random() - 0.5) * 9;
var dy = (Math.random() - 0.5) * 8;
var radius = 30;*/

function Circle(x, y, dx, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = color;
  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.strokeStyle = this.color;
    c.fillStyle = this.color;
    c.stroke();
    c.fill();
  };
  this.update = function() {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  };
}

var circleArray = [];
for (var i = 0; i < 100; i++) {
  var x = Math.random() * (innerWidth - radius * 2) + radius;
  var y = Math.random() * (innerHeight - radius * 2) + radius;
  var dx = (Math.random() - 0.5) * 4;
  var dy = (Math.random() - 0.5) * 4;
  var radius = 30;
  var colors = [];
  for (j = 0; j < 3; j++) {
    var col = Math.floor(Math.random() * 256);
    colors.push(col);
  }
  var colorstring = colors.join(",");
  var color = "rgb(" + colorstring + ")";
  circleArray.push(new Circle(x, y, dx, dy, radius, color));
}
var circle = new Circle(200, 200, 3, 3, 30);
circle.draw();

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  for (var i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }
}

animate();
