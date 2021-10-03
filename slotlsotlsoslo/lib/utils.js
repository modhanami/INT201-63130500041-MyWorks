export function random(min, max) {
  return window.crypto
    .getRandomValues(new Uint32Array(1))
    .map((x) => (x % (max - min + 1)) + min)[0];
};

export function randomArray(min, max, size) {
  return new Array(size)
    .fill(0)
    .map(() => random(min, max));
}

export const randomBiased = (min, max, target, bias) => {
  const prob = (1 - bias) * 100;
  const probEach = prob / (max - min);
  const dist = [];

  for (let i = min; i <= max; i++) {
    dist.push({
      value: i,
      weight: i === target ? bias * 100 : probEach,
    });
  }

  const weightSum = dist.reduce((a, b) => a + b.weight, 0);
  
  for (let i = 0, rnd = random(0, weightSum - 1); i < dist.length; i++) {
    if (rnd < dist[i].weight) {
      return dist[i].value;
    }
    rnd -= dist[i].weight;
  }
};

export const randomArrayStraightBiased = (min, max, size, bias) => {
  const biasForEach = Math.pow(bias, 1 / (size - 1));
  const rnd = random(min, max);
  return new Array(size)
    .fill(0)
    .map((_, i) => {
      if (i === 0) {
        return rnd;
      }
      return randomBiased(min, max, rnd, biasForEach);
    });
};

export const compose = (...fns) => (args) => fns.reduce((acc, fn) => fn(acc), args);
