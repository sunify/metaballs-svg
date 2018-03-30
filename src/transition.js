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

export function transition(from, to, props, duration) {
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
