var glob = require("glob"),
  path = require("path");
const { settings } = require("./settingstest");

let modules = {};

glob.sync("./modules/*.js").forEach(function (file) {
  modules[path.basename(file, path.extname(file))] = require(path.resolve(
    file
  ));
});

function asign(_bot, _c, _settings) {
  Object.entries(modules).forEach(([n, m]) => {
    m.asign(_bot, _c, _settings[n]);
  });
}

console.log(modules);

module.exports = {
  modules,
  asign,
};
