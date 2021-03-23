var deepsdk = require("./deepsdk.js");
var tsc = require("./tsc.js");
var uglify = require("./uglify.js");
var license = require("./license.js");
var concat = require("./concat.js");
var copyResources = require("./copyresources.js");
var fse = require("fs-extra");

// Clean
fse.removeSync("target");
fse.mkdirpSync("target");

// Download the SDK
deepsdk.run( () => {
    // Compile TypeScript
    tsc.run();

    // Uglify
    uglify.run(process.env.npm_package_name,"target/webapp/js","target/"+process.env.npm_package_name+".js");

    // License
    license.run("target/webapp/js/"+process.env.npm_package_name+".min.js");

    // Concat
    concat.run();

    // Copy Resources
    copyResources.run();
} );