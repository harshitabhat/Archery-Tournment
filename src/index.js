const fs = require("fs");
const Tournament = require("./Tournament");

try {
    const input = fs.readFileSync("./input.json", "utf-8");
    const data = JSON.parse(input);

    const tournament = new Tournament(data);

    tournament.start();
} catch (error) {
    console.error(`\nError: ${error.message}`);
    process.exit(1);
}