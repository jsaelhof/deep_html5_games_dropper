const fs = require('fs');
const parseString = require('xml2js').parseString;

module.exports = {
    run: function (inputFile, licenseText) {
        if (licenseText == undefined) {
            var pom = fs.readFileSync("pom.xml", "utf8");
            parseString(pom, function (err, result) {
                licenseText = "\n/*\n" +
                    "* " + result.project.version[0] + "\n" +
                    "* Timestamp: " + Date.now() + "\n" +
                    "* Copyright (C) DeepMarkit, Inc - All Rights Reserved\n" +
                    "* Unauthorized copying of this file, via any medium is strictly prohibited\n" +
                    "* Proprietary and confidential\n" +
                    "*/\n";
            });
        }

        console.log("License: " + inputFile);

        var contents = fs.readFileSync(inputFile, "utf8");

        fs.writeFileSync(inputFile,licenseText + contents);
    }
};

