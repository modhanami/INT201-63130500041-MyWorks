function pipe(...fns) {
  return (...args) => fns.reduce((acc, fn) => {
    let c = fn(acc);
    return c;
  }, ...args);
}

function pipeAsync(...fns) {
  return async (...args) => {
    return fns.reduce(async (acc, fn) => {
      return fn(await acc);
    }, ...args)
  }
}

const a = pipe(x => x + 2, x => x * 2);

const aa = pipeAsync(
  x => new Promise((res) => {
    setTimeout(() => {
      res(x + 2);
    }, 1000);
  }),
  x => new Promise((res) => {
    setTimeout(() => {
      res(x * 2);
    }
    , 1000);
  })
);  

const b = a(11.75)
const bb = aa(11.75);

console.log(b);
bb.then(console.log);

