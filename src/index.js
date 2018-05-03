/**
 * Differentia.js
 * Object Algorithm & Graph Theory Library
 * https://github.com/Floofies/Differentia.js
 */

var searchIterator = require('./searchIterator');
var utils = require('./utils');
var strategies = require('./strategies');
var structs = require('./structs');

var differentia = {
	dfs: searchIterator.dfs,
	bfs: searchIterator.bfs,
	getContainerLength: utils.getContainerLength,
	isContainer: utils.isContainer
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