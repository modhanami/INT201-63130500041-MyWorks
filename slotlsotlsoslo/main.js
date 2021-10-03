import { createMachine } from "./lib/index.js";
import { random } from "./lib/utils.js";

const SYMBOLS = [
  '👽',
  '🚀',
  '🌌',
  '✨',
  '🔥',
  '🎉',
  '😎',
  '🐢',
  '🐒',
  '🐸',
  '🌈',
  '🚗',
  '🚛',
  '🚚',
  '🚜',
  '🚓',
];

const root = document.getElementById('slot');
const btnSpin = root.querySelector('#btn-spin');
const btnSpinX = root.querySelector('#btn-spin-x');
const btnStopSpinX = root.querySelector('#btn-stop-spin-x');
const result = root.querySelector('#result');
const audioWin = new Audio('https://opengameart.org/sites/default/files/Win%20sound.wav');
const audioSpinButtonClick = new Audio('https://opengameart.org/sites/default/files/coin.wav');
const audioReelSpin = new Audio('https://opengameart.org/sites/default/files/button%20press%201.wav');
let isSpinning = false;

audioWin.volume = .4;
audioReelSpin.volume = .1;
audioSpinButtonClick.volume = 1;

const slotMachine = createMachine({
  symbols: SYMBOLS,
  reelCount: 5,
  playerEdge: .27,
  // playerEdge: 1,
});

result.innerHTML = renderReelsHTML(slotMachine.render());
btnSpin.addEventListener('click', handleSpinBtnClick);
btnSpinX.addEventListener('click', handleSpinXBtnClick);

async function handleSpinBtnClick() {
  if (isSpinning) {
    return;
  }

  spinAndRender(slotMachine);
}

async function handleSpinXBtnClick() {
  if (isSpinning) {
    return;
  }

  const cancel = partialHandleSpinXBtnClick();
  function handler() {
    btnStopSpinX.classList.add('d-none');
    cancel();
    btnStopSpinX.removeEventListener('click', handler);
  }

  btnStopSpinX.classList.remove('d-none');
  btnStopSpinX.addEventListener('click', handler);
}

function partialHandleSpinXBtnClick() {
  let cancelled = false;
  
  setTimeout(async () => {
    for (let i = 0; i < 100; i++) {
      if (cancelled) {
        break;
      }
      await spinAndRender(slotMachine, {
        spinMs: 10,
        durationMs: 50,
      });
    }
  });

  return () => {
    cancelled = true;
  }
}

async function spinAndRender(slotMachine, { spinMs = 10, durationMs = 100, winDelayMs = 400 } = {}) {
  isSpinning = true;

  setRandomAudioVolume(audioSpinButtonClick, .6, .8);
  playAudio(audioSpinButtonClick);
  const [prevSymbols, symbols] = slotMachine.spin();

  const tempSymbols = [...prevSymbols];
  for (let i = 0; i < symbols.length; i++) {
    await animateReelSpin(slotMachine.getSymbols(), {
      onUpdate: (symbol) => {
        tempSymbols[i] = symbol;
        result.innerHTML = renderReelsHTML(tempSymbols);
      },
      onComplete: () => {
        tempSymbols[i] = symbols[i];
        result.innerHTML = renderReelsHTML(tempSymbols);
        setRandomAudioVolume(audioReelSpin, .05, .1);
        playAudio(audioReelSpin);
      },
      spinMs,
      durationMs,
    });
  }

  if (slotMachine.didWin()) {
    playAudio(audioWin);
    return new Promise(resolve => {
      setTimeout(() => {
        isSpinning = false;
        resolve();
      }, winDelayMs);
    });
  } else {
    isSpinning = false;
  }
}

function renderReelsHTML(symbols) {
  return symbols.map(reelTemplate).join("\n");
}

function reelTemplate(symbol) {
  return `<div class="reel">${symbol}</div>`;
}

async function animateReelSpin(symbols, { onUpdate = () => { }, onComplete = () => { }, spinMs = 50, durationMs = 200 } = {}) {
  let startIndex = random(0, symbols.length - 1);

  const interval = setInterval(() => {
    onUpdate(symbols[startIndex]);
    startIndex++;
    if (startIndex > symbols.length - 1) {
      startIndex = 0;
    }
  }, spinMs);

  await new Promise(resolve => {
    setTimeout(() => {
      clearInterval(interval);
      onComplete();
      resolve();
    }, durationMs);
  })
}

function playAudio(audio) {
  audio.currentTime = 0;
  audio.play();
};

function setRandomAudioVolume(audio, min = .25, max = .3) {
  audio.volume = randomContinuous(min, max);
};

function randomContinuous(min, max, places = 2) {
  const placesMultiplier = Math.pow(10, places);
  const minFixed = Math.floor(min * placesMultiplier);
  const maxFixed = Math.floor(max * placesMultiplier);
  const random = Math.floor(Math.random() * (maxFixed - minFixed + 1)) + minFixed;

  return random / placesMultiplier;
}