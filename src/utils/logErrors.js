const chalk = require("chalk");

// Generalized function to log errors for tracking
exports.logError = (err, definedError = "") => {
    if (definedError) {
        console.error(chalk.red(definedError + " " + new Date().toISOString()));
    }
    console.error(err || "Some Error occurred", new Date().toISOString());
};
