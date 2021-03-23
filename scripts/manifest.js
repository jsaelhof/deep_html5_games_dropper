const fs = require('fs');
const parseString = require('xml2js').parseString;
const path = require('path');

module.exports = {
    run: function (inputDir,manifestFile) {
        console.log("Generate Manifest");

        var manifest = {};

        var pom = fs.readFileSync("pom.xml", "utf8");

        parseString(pom, function (err, result) {
            manifest["artifact"] = result.project.groupId[0] + "." + result.project.artifactId[0];
            manifest["version"] = result.project.version[0];
        });

        manifest["timestamp"] = Date.now();
        manifest["date"]= getDateTime();
        manifest.files = walkSync(inputDir);

        fs.writeFileSync(path.join(inputDir,manifestFile),JSON.stringify(manifest, null, 4));
    }
};

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "/" + month + "/" + day + " - " + hour + ":" + min + ":" + sec;

}

// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function(initialDir, dir, filelist = []) {
    if (!dir) dir = initialDir;
    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(initialDir, path.join(dir, file), filelist);
        }
        else {
            filelist.push(path.join(dir, file).replace(initialDir,""));
        }
    });
    return filelist;
};