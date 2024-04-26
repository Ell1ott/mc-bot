import { socket } from "./store";
import { get } from "svelte/store";
// if(!socket.connected) socket.set({on: () => console.log("hehes")})
// import { socket } from "./store";
let lsocket;

const unsubscribe = socket.subscribe((val) => {
  lsocket = val;
});
export function emit(...args) {
  lsocket?.emit(...args);
}

export function on(...args) {
  lsocket?.on(...args);
}

export function setControlState(control, state) {
  emit("setControlState", control, state);
}
