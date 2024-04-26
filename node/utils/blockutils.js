Object.defineProperty(exports, "__esModule", { value: true });
const { Bot } = require("mineflayer");
/**
 *
 * @param {Bot} bot
 */
function useUtil(bot) {
  bot.blockAtCursor = (
    maxDistance = 256,
    matcher = null,
    useServerRotation = false
  ) => {
    const { position, height } = bot.entity;
    const pitch = useServerRotation ? bot.lastSentPitch : bot.entity.pitch;
    const yaw = useServerRotation ? bot.lastSentYaw : bot.entity.yaw;
    const eyePosition = position.offset(0, height, 0);
    const viewDirection = getViewDirection(pitch, yaw);

    return bot.world.raycast(eyePosition, viewDirection, maxDistance, matcher);
  };
}
exports.plugin = useUtil;
