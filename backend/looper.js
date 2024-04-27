let minDelay = 1000;
let maxDelay = 5000;
// setInterval(() => {
//   console.log("hej");
//   setTimeout(() => {
//     console.log("done");
//   }, Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay);
// }, 0);
// const delay = (ms) => new Promise((res) => setTimeout(res, ms));
// async function runLoop() {
//   for (let i = 0; i < 10; i++) {
//     await delay(1000);
//     console.log(i);
//   }
// }
// async function loopWithRandomDelay(func, minDelay, maxDelay) {
//   let timeoutId;
//   function loop() {
//     func();
//     setTimeout(() => {
//       loop();
//     }, Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay);
//   }
//   loop();

//   function stopLoop() {
//     clearTimeout(timeoutId);
//   }

//   return { stopLoop };
// }

// flipflopWithRandomDelay(func1, func2, delayRange1, delayRange2);

function flipflopWithRandomDelay(func1, func2, delayRange1, delayRange2) {
  let timeoutId;
  function loop() {
    func();
    timeoutId = setTimeout(
      loop,
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
    );
  }
  loop();

  function stopLoop() {
    clearTimeout(timeoutId);
  }

  return { stopLoop };
}

function loopWithRandomDelay(func, minDelay, maxDelay) {
  let timeoutId;

  function loop() {
    func();
    timeoutId = setTimeout(
      loop,
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
    );
  }

  loop();

  function stopLoop() {
    clearTimeout(timeoutId);
  }

  return { stopLoop };
}
function toMili(n) {
  return n * 1000;
}
function flipflopWithRandomDelay(func1, func2, delayRange1, delayRange2) {
  let timeoutId;
  delayRange1 = delayRange1.map(toMili);
  delayRange2 = delayRange2.map(toMili);
  console.log("delay range1 ", delayRange1);
  console.log("delay range2 ", delayRange2);
  // console.log(delayRange2);
  function loop(func1, func2, delayRange1, delayRange2) {
    func1();
    delay =
      Math.floor(Math.random() * (delayRange1[1] - delayRange1[0] + 1)) +
      delayRange1[0];
    console.log(delay);
    timeoutId = setTimeout(() => {
      loop(func2, func1, delayRange2, delayRange1);
    }, delay);
  }

  loop(func1, func2, delayRange1, delayRange2);

  function stopLoop() {
    clearTimeout(timeoutId);
  }

  return stopLoop;
}

module.exports = {
  flipflopWithRandomDelay: flipflopWithRandomDelay,
  loopWithRandomDelay: loopWithRandomDelay,
};
// example:
// const stopLoop = flipflopWithRandomDelay(
//   () => {
//     console.log(0);
//   },
//   () => {
//     console.log(1);
//   },
//   [100, 200],
//   [100, 200]
// );

// setTimeout(() => {
//   console.log("stop");
//   stopLoop();
// }, 4000);
