import * as mineflayer from "mineflayer";

export type ExtendedBot = mineflayer.Bot & {
	pathfinder: any;
	entityAtCursor: (maxDistance: number, useServerRotation: boolean) => any;
};
