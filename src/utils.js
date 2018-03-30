export function loop(n, min, max) {
  const d = max - min;
  if (n > max) {
    const dn = n - max - 1;
    return min + dn % d;
  }

  if (n < min) {
    const dn = n - min + 1;
    return max + dn % d;
  }

  return n;
}
