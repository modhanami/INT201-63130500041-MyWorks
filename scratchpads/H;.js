console.log('H');

setTimeout(() => {
  console.log('cosmetic macrotask');
}, 0);

function lidlMap(arr, mapper) {
  const newArr = [];

  for (let i = 0; i < arr.length; i++) {
    newArr[i] = mapper(arr[i]);
  }

  return newArr;
}

const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = lidlMap(ids, id => id * 2);

console.log(result);

console.log('HH');