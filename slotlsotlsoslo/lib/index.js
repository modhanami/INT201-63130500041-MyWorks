import { random, randomArray, randomArrayStraightBiased } from './utils.js';

export const createMachine = ({ symbols, reelCount = 3, playerEdge = 0, jackpotChance = 0 }) => {
  const startIndices = randomArray(0, symbols.length - 1, reelCount);
  let stopIndices = startIndices;

  return {
    jackpotChance,
    spin() {
      const result = [];
      result.push(this.render());
      stopIndices = randomArrayStraightBiased(0, symbols.length - 1, reelCount, playerEdge);
      result.push(this.render());
      return result;
    },
    render() {
      return stopIndices.map(idx => symbols[idx]);
    },
    didWin() {
      return stopIndices.every((x, i, arr) => i === 0 || x === arr[i - 1]);
    },
    getSymbols() {
      return symbols;
    }
  }
}


// {
//   const result = {
//     l: 0,
//     w: 0,
//   }
//   for (let i = 0; i < 1000; i++) {
//     slotMachine.spin();
//     const FRAMERATE = 10;
    
//     // console.log(slotMachine.render(), `${slotMachine.didWin() ? 'WON' : 'LOSE'}`);

//     if (slotMachine.didWin()) {
//       result.w++;
//     } else {
//       result.l++;
//     }  
//   }
//   console.log(result);
// }