const args = process.argv.slice(1);
if (args.length === 0) throw new Error("Base directory not specified! Aborting...");

const browserify = require("browserify");
const uglify = require("uglify-es");
const minify = src => uglify.minify(src).code;
const fs = require("fs");
const write = fs.writeFileSync;
const execSync = require('child_process').execSync;

const touch = path => execSync("touch " + path);
function plotPath(path) {
	path = path.split("/");
	path.pop();
	var curPath = "."
	for (const node of path) {
		curPath = curPath + "/" + node;
		try {
			fs.statSync(curPath);
		} catch (error) {
			if (error.code !== "ENOENT") {
				console.error(error);
				process.exit(1);
			}
			fs.mkdirSync(curPath);
		}
	}
}
const base = args[1];
const index = process.env.npm_package_config_buildIndex;
const minPath = base + "/dist/differentia.min.js";
const mainPath = base + "/dist/differentia.js";
plotPath(minPath);
plotPath(mainPath);
touch(minPath);
touch(mainPath);
browserify(index, {
	standalone: "differentia",
}).bundle((error, srcBuf) => write(minPath, minify(srcBuf.toString())));
browserify(index, {
	standalone: "differentia",
}).bundle((error, srcBuf) => write(mainPath, srcBuf));