import * as mineflayer from "mineflayer";

export type ExtendedBot = mineflayer.Bot & {
	pathfinder: any;
	entityAtCursor: (maxDistance: number, useServerRotation: boolean) => any;
	blockAtCursor: (
		maxDistance: number,
		matcher: any,
		useServerRotation: boolean
	) => any;
	collectBlock: any;
	autoEat: any;
};
