const { setTimeout: wait } = require("timers/promises");

async function heh() {
  await wait(4000);
  console.log("nnono");
}

heh();
console.log("eheheh");
