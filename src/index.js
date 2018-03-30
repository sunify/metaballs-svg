import { transition } from './transition';
import { circles_blob, circles_mark } from './circlesData';
import { State } from './state';

const lines = [];

var svgCircles = Array.from(document.querySelectorAll('circle'));
var check = document.getElementById('check');
var svgRoot = document.getElementById('amoebe');
var canvas = document.getElementById('graph');
var context = canvas.getContext('2d');

const state = new State(
  {
    blob: circles_blob,
    mark: circles_mark
  },
  mode => {
    check.style.opacity = mode === 'mark' ? 1 : 0;
  },
  'blob'
);

function draw(t) {
  canvas.width = 230;
  canvas.height = 245;
  const circlesPositions = [];
  state.circles.forEach((circle, i) => {
    var svgCircle = svgCircles[i];
    var x = Math.cos(t / 30 / circle.radius) * circle.radius * circle.dir / 3;
    var y = Math.sin(t / 33 / circle.radius) * circle.radius * circle.dir / 3;
    svgCircle.setAttribute('cx', circle.x);
    svgCircle.setAttribute('cy', circle.y);
    svgCircle.setAttribute('r', circle.radius);
    svgCircle.setAttribute('transform', `translate(${x} ${y})`);
    svgCircle.setAttribute(
      'fill',
      `rgb(${circle.color.map(Math.round).join(',')})`
    );

    context.fillStyle = '#FFF';
    context.beginPath();
    context.arc(circle.x + x, circle.y + y, 3, 0, 2 * Math.PI);
    circlesPositions.push({ x: circle.x + x, y: circle.y + y });
    context.fill();
    context.fillStyle = '#000';
    // context.fillText(i, circle.x + x, circle.y + y);
  });

  context.strokeStyle = 'rgba(255, 255, 255, 1)';
  lines.forEach(([a, b]) => {
    context.beginPath();
    context.moveTo(circlesPositions[a].x, circlesPositions[a].y);
    context.lineTo(circlesPositions[b].x, circlesPositions[b].y);
    context.stroke();
  });
}

setInterval(() => requestAnimationFrame(draw), 1000 / 30);
draw(Date.now());

canvas.addEventListener('click', () => {
  state.toggleMode();
});
