const fs = require("fs");

console.log("started save json file test");

// dict to save
dict = {
  name: "ole",
  age: 38,
};
const jsonData = JSON.stringify(dict);

fs.writeFile("settings.json", jsonData, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Settings saved!");
  }
});
