/**
 * Differentia.js
 * Object Algorithm & Graph Theory Library
 * https://github.com/Floofies/Differentia.js
 */

var core = require('./core');
var strategies = require('./strategies');
var structs = require('./structs');

var differentia = {
	dfs: core.dfs,
	bfs: core.bfs,
	getContainerLength: core.getContainerLength,
	isContainer: core.isContainer
};

// Automatically Reveal Strategy Interfaces
for (var name in strategies) {
	differentia[name] = strategies[name].interface;
}
// Automatically Reveal Data Structures
for (var name in structs) {
	differentia[name] = structs[name];
}

module.exports = differentia;