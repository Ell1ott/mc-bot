Object.defineProperty(exports, "__esModule", { value: true });
const { Bot } = require("mineflayer");
/**
 *
 * @param {Bot} bot
 */
function useUtil(bot) {
  bot.entityAtCursor = (maxDistance = 3.5, useServerRotation = false) => {
    const block = bot.blockAtCursor(maxDistance);
    maxDistance =
      block?.intersect.distanceTo(bot.entity.position) ?? maxDistance;

    const entities = Object.values(bot.entities).filter(
      (entity) =>
        entity.type !== "object" &&
        entity.username !== bot.username &&
        entity.position.distanceTo(bot.entity.position) <= maxDistance
    );
    const yaw = useServerRotation ? bot.lastSentYaw : bot.entity.yaw;
    const pitch = useServerRotation ? bot.lastSentPitch : bot.entity.pitch;
    const dir = new Vec3(
      -Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      -Math.cos(yaw) * Math.cos(pitch)
    );
    const iterator = new RaycastIterator(
      bot.entity.position.offset(0, bot.entity.height, 0),
      dir.normalize(),
      maxDistance
    );

    let targetEntity = null;
    let targetDist = maxDistance;

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const w = entity.width / 2;

      const shapes = [
        [
          -w,
          0,
          -w,
          w,
          entity.height + (entity.type === "player" ? 0.18 : 0),
          w,
        ],
      ];
      const intersect = iterator.intersect(shapes, entity.position);
      if (intersect) {
        const entityDir = entity.position.minus(bot.entity.position); // Can be combined into 1 line
        const sign = Math.sign(entityDir.dot(dir));
        if (sign !== -1) {
          const dist = bot.entity.position.distanceTo(intersect.pos);
          if (dist < targetDist) {
            targetEntity = entity;
            targetDist = dist;
          }
        }
      }
    }

    return targetEntity;
  };
}
exports.plugin = useUtil;
