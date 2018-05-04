/**
 * Differentia.js
 * Object Algorithm & Graph Theory Library
 * https://github.com/Floofies/Differentia.js
 */
const searchIterator = require('./searchIterator');
const utils = require('./utils');
const strategies = require('./strategies');
const structs = require('./structs');
const differentia = {
	dfs: searchIterator.dfs,
	bfs: searchIterator.bfs,
	getContainerLength: utils.getContainerLength,
	isContainer: utils.isContainer
};
// Automatically Reveal Strategy Interfaces
for (const name in strategies) {
	differentia[name] = strategies[name].interface;
}
// Automatically Reveal Data Structures
for (const name in structs) {
	differentia[name] = structs[name];
}
module.exports = differentia;