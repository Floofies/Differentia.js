/**
 * Differentia.js
 * Graph Theory & Data Structure Library
 * https://github.com/Floofies/Differentia.js
 * http://www.differentia.io
 */
const e = module.exports;
e.utils = require('./utils');
e.searchIterator = require('./searchIterator');
e.dfs = e.searchIterator.dfs;
e.bfs = e.searchIterator.bfs;
e.strategies = require('./strategies');
e.structs = require('./structs');
// Automatically Reveal Strategy Interfaces
for (const name in e.strategies) {
	e[name] = e.strategies[name].interface;
}
// Automatically Reveal Data Structures
for (const name in e.structs) {
	e[name] = e.structs[name];
}