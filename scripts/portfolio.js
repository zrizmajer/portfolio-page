// Canvas on index.html
var canvas = document.querySelector('canvas');
// Resizing canvas to 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Context
var c = canvas.getContext('2d');
// Point object
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
// Line object
class Line {
    constructor(breakPoints, color, width) {
        this.breakPoints = breakPoints;
        this.color = color;
        this.width = width;
        this.x = 0;
        this.y = 0;
        this.dx = 1;
        this.dy = 1;
    }
    draw() {
        c.beginPath();
        c.moveTo(this.breakPoints[0].x, this.breakPoints[0].y)
        c.lineTo(this.x, this.y)
        c.strokeStyle = this.color;
        c.lineWidth = this.width;
        c.lineJoin = "round";
        c.stroke();
    }
    update() {
        for (let i = 0; i < this.breakPoints.length; i++) {
            if (this.x < this.breakPoints[i].x) {
                this.x += this.dx;
            }
            if (this.y < this.breakPoints[i].y) {
                this.y += this.dy;
            }
            this.draw();
        }
        
    }
}

// Curve object
class Curve {
    constructor() {

    }
}
// Intersection object
class Intersection {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.strokeStyle = this.color;
        c.fillStyle = this.color;
        c.stroke();
        c.fill();
    }
}

//var circle1 = new Intersection(200, 200, 40, 'red');
//circle1.draw();
let point1 = new Point(0, 0);
let point2 = new Point(100, 50);
let point3 = new Point(300, 170);
let point4 = new Point(400, 300);

let points = [point1, point2, point3, point4];

let line = new Line(points, 'red', '5');

line.draw();

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    line.update()
}

animate();