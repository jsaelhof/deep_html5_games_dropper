var fse = require('fs-extra');

module.exports = {
    run: function () {
        console.log("Copy Webapp");

        fse.copySync(
            "src/main/webapp",
            "target/webapp",
            {
                filter: function ( entry ) {
                    // Copy all files except the gamedescriptorvalues.json.
                    // If we need to filter more files, this will have to be refactored.
                    return entry.indexOf("gamedescriptorvalues.json") < 0;
                }
            }
        );

        console.log("Copy POM");

        fse.copySync(
            "pom.xml",
            "target/webapp/pom.xml"
        );

    }
}