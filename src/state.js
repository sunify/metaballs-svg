import { transition } from './transition';
import { loop } from './utils';

window.loop = loop;

export class State {
  constructor(circlesData, onModeChange, mode = 'blob') {
    this.modes = Object.keys(circlesData);
    this.circlesData = circlesData;
    this.onModeChange = onModeChange;
    this.mode = mode;
  }

  set mode(mode) {
    if (this._mode === mode) {
      return;
    }
    this._mode = mode;

    const circlesData = this.circlesData[mode];
    if (!this.circles) {
      this.circles = circlesData.map(circle => Object.assign({}, circle));
    } else {
      this.circles.forEach((circle, i) => {
        transition(circle, circlesData[i], ['x', 'y', 'radius', 'color'], 300);
      });
    }
    if (typeof this.onModeChange === 'function') {
      this.onModeChange(mode);
    }
  }

  get mode() {
    return this._mode;
  }

  toggleMode() {
    const currentIndex = this.modes.indexOf(this.mode);
    const nextIndex = loop(currentIndex + 1, 0, this.modes.length - 1);
    console.log(currentIndex, nextIndex);
    this.mode = this.modes[nextIndex];
  }
}
