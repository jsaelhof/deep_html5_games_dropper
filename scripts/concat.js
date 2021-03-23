var fse = require('fs-extra');

module.exports = {
    run: function () {
        console.log("Concat Libs");

        var destDir = "target/webapp/lib";
        var destFile = destDir + "/lib.js";
        fse.mkdirpSync(destDir);

        var writeStream = fse.createWriteStream(destFile);


        // Copy all the local libs
        var srcLibDir = "src/lib";
        if (fse.existsSync(srcLibDir)) {
            var srcLibFiles = fse.walkSync(srcLibDir);
            if (srcLibFiles.length > 0) console.log("> " + srcLibDir);
            srcLibFiles.forEach(function (value) {
                if (value.indexOf(value.substring(value.lastIndexOf(".")) == ".js")) {
                    console.log("    - " + value);
                    var contents = fse.readFileSync(value, "utf8");
                    writeStream.write(contents);
                }
            });
        }

        // Copy any libs downloaded to the temp/lib
        var depLibDir = "target/temp/lib";
        if (fse.existsSync(depLibDir)) {
            var depLibFiles = fse.walkSync(depLibDir);
            console.log("> " + depLibDir);
            depLibFiles.forEach(function (value) {
                if (value.indexOf(value.substring(value.lastIndexOf(".")) == ".js")) {
                    console.log("    - " + value);
                    var contents = fse.readFileSync(value, "utf8");
                    writeStream.write(contents);
                }
            });
        }

        // Copy the SDK
        console.log("> DeepSDK");
        console.log("    - target/temp/deepsdk/deepsdk.min.js");
        var contents = fse.readFileSync("target/temp/deepsdk/deepsdk.min.js", "utf8");
        writeStream.write(contents);

        writeStream.end();
    }
}