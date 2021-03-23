const fs = require('fs');
const os = require("os");
var execSync = require('child_process').execSync;

module.exports = {
    run: function () {
        var executable = (os.platform() == "win32") ? "tsc.cmd" : "tsc";

        var output = execSync(executable + " --version");
        console.log("TypeScript (" + executable + "): " + output);

        // Run the compiler in a synchronous process. The stdio option pipes all the output from the child process to this process.
        // This is important so that we can see the output if there is an error when compiling the typescript.
        execSync(executable, { stdio:"inherit" });
    }
};