var zip = require("./zip.js");
var manifest = require("./manifest.js");

// Manifest
manifest.run("target/webapp/","manifest.json");

// Zip
zip.run();