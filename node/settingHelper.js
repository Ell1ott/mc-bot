function getSetting(setting, random = false, toMili) {
  const value = "val" in setting ? setting.val : setting.enabled;
  if (value.length === 2) {
    if (random) {
      const randomNumber =
        Math.random() * (Number(value[1]) - Number(value[0])) +
        Number(value[0]);
      return toMili ? Math.round(randomNumber * 1000) : randomNumber;
    } else {
      return value;
    }
  } else {
    return Array.isArray(value) ? value[0] : value;
  }
}

module.exports = {
  getSetting,
};
