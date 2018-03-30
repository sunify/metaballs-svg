var circles_blob = [
  { color: [255, 255, 0], radius: 40, x: 171, y: 160, dir: 1 },
  { color: [255, 125, 255], radius: 70, x: 96,  y: 130, dir: 1 },
  { color: [255, 125, 255], radius: 50, x: 116, y: 70, dir: -1 },
  { color: [255, 255, 0], radius: 60, x: 126, y: 160, dir: 1 },
  { color: [255, 255, 0], radius: 30, x: 156, y: 120, dir: -1 },
];

var circles_mark = [
  { color: [255, 255, 0], radius: 17, x: 46,  y: 95,  dir: 1 },
  { color: [0, 255, 125], radius: 18, x: 101, y: 140, dir: 1 },
  { color: [0, 255, 125], radius: 17, x: 126, y: 120, dir: -1 },
  { color: [255, 255, 0], radius: 15, x: 161, y: 85,  dir: 1 },
  { color: [255, 255, 0], radius: 14, x: 191, y: 50,  dir: -1 },
];

var lines = [
  [1, 2],
  [2, 4],
  [4, 0],
  [0, 3],
  [1, 3],
  [3, 2],
  // [1, 0],
  [1, 4],
];

var mode = 'blob';

var initialCircles = mode === 'blob' ? circles_blob : circles_mark;
var circles = initialCircles.map((circle) => Object.assign({}, circle));

var svgCircles = Array.from(document.querySelectorAll('circle'));
var check = document.getElementById('check');
var svgRoot = document.getElementById('amoebe');
var canvas = document.getElementById('graph');
var context = canvas.getContext('2d');

onCirclesResize();
function onCirclesResize() {
  var newCircles = mode === 'blob' ? circles_blob : circles_mark;
  circles.forEach((circle, i) => {
    transition(circle, newCircles[i], ['x', 'y', 'radius', 'color'], 300);
  });

  check.style.opacity = mode === 'mark' ? 1 : 0;
}

function draw(t) {
  canvas.width = 230;
  canvas.height = 245;
  var circlesPositions = [];
  circles.forEach((circle, i) => {
    var svgCircle = svgCircles[i];
    var x = Math.cos(t / 30 / circle.radius) * circle.radius * circle.dir / 3;
    var y = Math.sin(t / 33  / circle.radius) * circle.radius * circle.dir / 3;
    svgCircle.setAttribute('cx', circle.x);
    svgCircle.setAttribute('cy', circle.y);
    svgCircle.setAttribute('r', circle.radius);
    svgCircle.setAttribute('transform', `translate(${x} ${y})`);
    svgCircle.setAttribute('fill', `rgb(${circle.color.map(Math.round).join(',')})`);

    context.fillStyle = '#FFF';
    context.beginPath();
    context.arc(
      circle.x + x,
      circle.y + y,
      3,
      0,
      2 * Math.PI,
    );
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
  mode = mode === 'mark' ? 'blob' : 'mark';
  onCirclesResize();
});


function interpolateNumber(start, to, percent) {
  return start + (to - start) * percent;
}

function interpolateArray(start, to, percent) {
  return start.map((start_i, i) => interpolateNumber(start_i, to[i], percent));
}

function interpolateValue(start, to, percent) {
  if (Array.isArray(start)) {
    return interpolateArray(start, to, percent);
  } else if (typeof start === 'number') {
    return interpolateNumber(start, to, percent);
  }

  return start;
}

function transition(from, to, props, duration) {
  transition.stoppers = transition.stoppers || new WeakMap();

  if (transition.stoppers.has(from)) {
    transition.stoppers.get(from)();
  }

  const startProps = props.reduce((scale, key) => Object.assign(scale, {
    [key]: from[key],
  }), {});

  Object.keys(to).forEach((key) => {
    if (props.indexOf(key) === -1) {
      from[key] = to[key];
    }
  });

  let done = false;
  transition.stoppers.set(from, () => {
    done = true;
  });

  const start = Date.now();
  const updater = (t) => {
    const spent = Date.now() - start;
    const percent = spent / duration;

    if (percent >= 1) {
      done = true;
      props.forEach((key) => {
        from[key] = to[key];
      });
    } else {
      props.forEach((key) => {
        from[key] = interpolateValue(startProps[key], to[key], percent);
      });
    }

    if (!done) {
      requestAnimationFrame(updater);
    }
  };

  requestAnimationFrame(updater);
};